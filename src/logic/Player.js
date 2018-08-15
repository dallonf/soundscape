import { observable, decorate, autorun, computed } from 'mobx';
const CROSSFADE_TIME = 1;

// TODO: there's lots of bugs and edge cases around pausing / resuming / stopping / starting
// need to refactor to have a more sane state machine
class Player {
  loading = false;
  currentSound = null;
  fadingOutSound = null;
  paused = false;

  palette = [];
  nextTrack = null;

  _currentSoundProgress = null;
  get currentSoundProgress() {
    return this._currentSoundProgress;
  }
  set currentSoundProgress(value) {
    const element = this.currentSound && this.currentSound.element;
    if (element) {
      element.currentTime = value;
    }
  }
  get currentSoundDuration() {
    const element = this.currentSound && this.currentSound.element;
    if (element) {
      return element.duration;
    } else {
      return null;
    }
  }

  constructor(audioContext) {
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
    for (const fn of this.diposalFns) {
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

    await this.fadeOutAndStop();

    const newGainNode = this.audioContext.createGain();

    this.currentSound = {
      source: newSource,
      gain: newGainNode,
      element,
      track: musicTrack,
    };
    newSource.connect(newGainNode);
    newGainNode.connect(this.audioContext.destination);
    element.play();
  }

  async stop() {
    if (this.currentSound) {
      this.currentSound.element.pause();
      this.currentSound.element.src = '';
      this.currentSound.gain.disconnect();
      this.currentSound.source.disconnect();
      this.currentSound = null;
    }
  }

  async pause() {
    if (this.currentSound) {
      this.paused = true;
      this.currentSound.gain.gain.setValueAtTime(
        this.currentSound.gain.gain.value,
        this.audioContext.currentTime
      );
      this.currentSound.gain.gain.linearRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
      await new Promise(resolve => setTimeout(resolve, CROSSFADE_TIME * 1000));
      if (this.paused) {
        // possible race condition: the user may have resumed before the fadeout finished.
        // In that case, don't actually pause the track.
        this.currentSound.element.pause();
      }
    }
  }

  async resume() {
    if (this.currentSound && this.paused) {
      this.currentSound.element.play();
      this.paused = false;
      this.currentSound.gain.gain.setValueAtTime(
        this.currentSound.gain.gain.value,
        this.audioContext.currentTime
      );
      this.currentSound.gain.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
    }
  }

  async fadeOutAndStop() {
    if (this.currentSound) {
      const fadeOutSound = this.currentSound;
      this.fadingOutSound = fadeOutSound;
      fadeOutSound.gain.gain.setValueAtTime(
        fadeOutSound.gain.gain.value,
        this.audioContext.currentTime
      );
      fadeOutSound.gain.gain.linearRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
      await new Promise(resolve => setTimeout(resolve, CROSSFADE_TIME * 1000));
      fadeOutSound.element.pause();
      fadeOutSound.element.src = '';
      fadeOutSound.gain.disconnect();
      fadeOutSound.source.disconnect();

      if (this.currentSound === fadeOutSound) {
        // Don't set currentSound to null if we've already started a new sound
        this.currentSound = null;
      }
      if (this.fadingOutSound === fadeOutSound) {
        this.fadingOutSound = null;
      }
    }
  }
}
decorate(Player, {
  loading: observable,
  currentSound: observable,
  fadingOutSound: observable,
  palette: observable,
  nextTrack: observable,
  _currentSoundProgress: observable,
  currentSoundProgress: computed,
  currentSoundDuration: computed,
});

export default Player;
