import { observable, decorate, autorun, computed } from 'mobx';
import MusicTrack from './MusicTrack';
const CROSSFADE_TIME = 1;

interface Sound {
  source: MediaElementAudioSourceNode;
  gain: GainNode;
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
      fadeOutTimeout: NodeJS.Timeout;
    }
  | { type: 'PAUSED'; sound: Sound }
  | { type: 'PAUSING'; sound: Sound; fadeOutTimeout: NodeJS.Timeout };

// TODO: state transitions probably need to be more automated to be less error-prone
class Player {
  audioContext: AudioContext;
  disposalFns: (() => void)[];
  unsubAudio: (() => void) | undefined = undefined;
  loading = false;
  state: PlayerState = { type: 'NOT_PLAYING' };

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
  get currentSound() {
    if (
      this.state.type === 'PLAYING' ||
      this.state.type === 'STOPPING' ||
      this.state.type === 'PAUSED' ||
      this.state.type === 'PAUSING'
    ) {
      return this.state.sound;
    } else {
      return null;
    }
  }
  get currentSoundDuration() {
    const sound = this.currentSound;
    const element = sound && sound.element;

    if (element) {
      return element.duration;
    } else {
      return null;
    }
  }

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.disposalFns = [];

    // keep track of current time of audio
    this.disposalFns.push(
      autorun(() => {
        if (this.unsubAudio) {
          this.unsubAudio();
        }

        const element = this.currentSound && this.currentSound.element;
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

  async play(musicTrack: MusicTrack) {
    this.loading = true;
    const { element, node: newSource } = await musicTrack.createNode();
    this.loading = false;

    if (this.state.type === 'NOT_PLAYING' || this.state.type === 'PAUSED') {
      if (this.state.type === 'PAUSED') {
        this.stop();
      }
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
    } else if (this.state.type === 'PLAYING' || this.state.type === 'PAUSING') {
      this.fadeOutAndStop({ nextTrack: musicTrack });
    } else if (this.state.type === 'STOPPING') {
      this.state = { ...this.state, nextTrack: musicTrack };
    }
  }

  stop() {
    if (
      this.state.type === 'PLAYING' ||
      this.state.type === 'PAUSED' ||
      this.state.type === 'PAUSING'
    ) {
      const sound = this.state.sound;
      if (this.state.type === 'PAUSING') {
        clearTimeout(this.state.fadeOutTimeout);
      }
      sound.element.pause();
      sound.element.src = '';
      sound.gain.disconnect();
      sound.source.disconnect();
      this.state = { type: 'NOT_PLAYING' };
    }
  }

  pause() {
    if (this.state.type === 'PLAYING') {
      const sound = this.state.sound;
      sound.gain.gain.setValueAtTime(
        sound.gain.gain.value,
        this.audioContext.currentTime
      );
      sound.gain.gain.linearRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
      const fadeOutTimeout = setTimeout(
        this.handleFadeOutTimeout,
        CROSSFADE_TIME * 1000
      );
      this.state = { type: 'PAUSING', sound, fadeOutTimeout };
    }
  }

  async resume() {
    if (this.state.type === 'PAUSING' || this.state.type === 'PAUSED') {
      if (this.state.type === 'PAUSING') {
        clearTimeout(this.state.fadeOutTimeout);
      }

      const sound = this.state.sound;
      sound.element.play();
      sound.gain.gain.setValueAtTime(
        sound.gain.gain.value,
        this.audioContext.currentTime
      );
      sound.gain.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
      this.state = { type: 'PLAYING', sound };
    }
  }

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
      const fadeOutTimeout = setTimeout(
        this.handleFadeOutTimeout,
        CROSSFADE_TIME * 1000
      );
      this.state = {
        type: 'STOPPING',
        sound: this.state.sound,
        nextTrack,
        fadeOutTimeout,
      };
    } else if (this.state.type === 'STOPPING') {
      this.state = { ...this.state, nextTrack };
    } else if (this.state.type === 'PAUSED') {
      return this.stop();
    } else if (this.state.type === 'PAUSING') {
      this.state = {
        type: 'STOPPING',
        sound: this.state.sound,
        fadeOutTimeout: this.state.fadeOutTimeout,
        nextTrack,
      };
    } else if (this.state.type === 'NOT_PLAYING') {
      // no-op, nothing to stop
    }
  }

  handleFadeOutTimeout = () => {
    if (this.state.type === 'STOPPING') {
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
    } else if (this.state.type === 'PAUSING') {
      const sound = this.state.sound;
      sound.element.pause();
      this.state = { type: 'PAUSED', sound };
    } else {
      throw new Error(
        `Catastrophic state desync; expected state to be "STOPPING" or "PAUSING" after fadeout timeout but it was "${
          this.state.type
        }". Did you forget to clear the timeout before changing state?`
      );
    }
  };
}
decorate(Player, {
  state: observable,
  _currentSoundProgress: observable,
  currentSoundProgress: computed,
  currentSound: computed,
  currentSoundDuration: computed,
});

export default Player;
