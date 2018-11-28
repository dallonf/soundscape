import { observable, decorate, autorun, computed } from 'mobx';
import MusicTrack from './MusicTrack';
const CROSSFADE_TIME = 1;

interface Sound {
  source: any;
  gain: any;
  element: HTMLAudioElement;
  track: MusicTrack;
}

type PlayerState =
  | { type: 'NOT_PLAYING' }
  | { type: 'PLAYING'; sound: Sound }
  | {
      type: 'STOPPING';
      sound: Sound;
      nextTrack?: MusicTrack;
      timeout: NodeJS.Timeout;
    };

// TODO: there's lots of bugs and edge cases around pausing / resuming / stopping / starting
// need to refactor to have a more sane state machine
class Player {
  audioContext: any;
  disposalFns: (() => void)[];
  unsubAudio: (() => void) | undefined = undefined;
  loading = false;
  // currentSound: Sound | null = null;
  // fadingOutSound: Sound | null = null;
  state: PlayerState = { type: 'NOT_PLAYING' };
  // paused = false;

  palette: MusicTrack[] = [];
  nextTrack: MusicTrack | null = null;

  _currentSoundProgress: number | null = null;
  get currentSoundProgress() {
    return this._currentSoundProgress;
  }
  set currentSoundProgress(value) {
    if (this.state.type === 'PLAYING' && value) {
      const element = this.state.sound.element;
      element.currentTime = value;
    }
  }
  get currentSound_renameLater() {
    if (this.state.type === 'PLAYING') {
      return this.state.sound;
    } else if (this.state.type === 'STOPPING') {
      return this.state.sound;
    } else {
      return null;
    }
  }
  get currentSoundDuration() {
    const sound = this.currentSound_renameLater;
    const element = sound && sound.element;

    if (element) {
      return element.duration;
    } else {
      return null;
    }
  }

  constructor(audioContext: any) {
    this.audioContext = audioContext;
    this.disposalFns = [];

    // keep track of current time of audio
    this.disposalFns.push(
      autorun(() => {
        if (this.unsubAudio) {
          this.unsubAudio();
        }

        const element =
          this.currentSound_renameLater &&
          this.currentSound_renameLater.element;
        if (element) {
          this._currentSoundProgress = element.currentTime;
          const onTimeUpdate = () => {
            this._currentSoundProgress = element.currentTime;
          };
          element.addEventListener('timeupdate', onTimeUpdate);
          this.unsubAudio = () =>
            element.removeEventListener('timeupdate', onTimeUpdate);
        } else {
          this._currentSoundProgress = null;
        }
      })
    );
  }

  dispose() {
    for (const fn of this.disposalFns) {
      fn();
    }
    if (this.unsubAudio) {
      this.unsubAudio();
    }
  }

  async play(musicTrack = this.nextTrack) {
    if (!musicTrack) return this.stop();

    this.loading = true;
    const { element, node: newSource } = await musicTrack.createNode();
    this.loading = false;

    if (this.state.type === 'NOT_PLAYING') {
      const newGainNode = this.audioContext.createGain();
      const sound: Sound = {
        source: newSource,
        gain: newGainNode,
        element,
        track: musicTrack,
      };

      newSource.connect(newGainNode);
      newGainNode.connect(this.audioContext.destination);
      element.play();
      this.state = {
        type: 'PLAYING',
        sound,
      };
    } else if (this.state.type === 'PLAYING') {
      this.fadeOutAndStop({ nextTrack: musicTrack });
    } else if (this.state.type === 'STOPPING') {
      this.state = { ...this.state, nextTrack: musicTrack };
    }
  }

  stop() {
    if (this.state.type === 'PLAYING') {
      const sound = this.state.sound;
      sound.element.pause();
      sound.element.src = '';
      sound.gain.disconnect();
      sound.source.disconnect();
      this.state = { type: 'NOT_PLAYING' };
    }
  }

  // async pause() {
  //   if (this.currentSound) {
  //     this.paused = true;
  //     this.currentSound.gain.gain.setValueAtTime(
  //       this.currentSound.gain.gain.value,
  //       this.audioContext.currentTime
  //     );
  //     this.currentSound.gain.gain.linearRampToValueAtTime(
  //       0.001,
  //       this.audioContext.currentTime + CROSSFADE_TIME
  //     );
  //     await new Promise(resolve => setTimeout(resolve, CROSSFADE_TIME * 1000));
  //     if (this.paused) {
  //       // possible race condition: the user may have resumed before the fadeout finished.
  //       // In that case, don't actually pause the track.
  //       this.currentSound.element.pause();
  //     }
  //   }
  // }

  // async resume() {
  //   if (this.currentSound && this.paused) {
  //     this.currentSound.element.play();
  //     this.paused = false;
  //     this.currentSound.gain.gain.setValueAtTime(
  //       this.currentSound.gain.gain.value,
  //       this.audioContext.currentTime
  //     );
  //     this.currentSound.gain.gain.linearRampToValueAtTime(
  //       1,
  //       this.audioContext.currentTime + CROSSFADE_TIME
  //     );
  //   }
  // }

  fadeOutAndStop({ nextTrack }: { nextTrack?: MusicTrack } = {}) {
    if (this.state.type === 'PLAYING') {
      const fadeOutSound = this.state.sound;
      fadeOutSound.gain.gain.setValueAtTime(
        fadeOutSound.gain.gain.value,
        this.audioContext.currentTime
      );
      fadeOutSound.gain.gain.linearRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
      const timeout = setTimeout(
        this.handleStoppingTimeout,
        CROSSFADE_TIME * 1000
      );
      this.state = {
        type: 'STOPPING',
        sound: this.state.sound,
        nextTrack,
        timeout,
      };
    } else if (this.state.type === 'STOPPING') {
      this.state = { ...this.state, nextTrack };
    } else if (this.state.type === 'NOT_PLAYING') {
      // no-op, nothing to stop
    }
  }

  handleStoppingTimeout = () => {
    if (this.state.type !== 'STOPPING') {
      throw new Error(
        `Catastrophic state desync; expected state to be "STOPPING" after stopping timeout but it was "${
          (this.state as any).type
        }". Did you forget to clear the timeout before changing state?`
      );
    }
    const nextTrack = this.state.nextTrack;
    const fadeOutSound = this.state.sound;
    fadeOutSound.element.pause();
    fadeOutSound.element.src = '';
    fadeOutSound.gain.disconnect();
    fadeOutSound.source.disconnect();
    this.state = { type: 'NOT_PLAYING' };

    if (nextTrack) {
      this.play(nextTrack);
    }
  };
}
decorate(Player, {
  state: observable,
  palette: observable,
  nextTrack: observable,
  _currentSoundProgress: observable,
  currentSoundProgress: computed,
  currentSound_renameLater: computed,
  currentSoundDuration: computed,
});

export default Player;
