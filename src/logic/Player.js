import { observable, decorate } from 'mobx';
const CROSSFADE_TIME = 1;

class Player {
  loading = false;
  currentSound = null;
  fadingOutSound = null;

  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  async play(musicTrack) {
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
});

export default Player;
