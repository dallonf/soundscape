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
    const newSource = await musicTrack.createNode();
    this.loading = false;

    await this.fadeOutAndStop();

    const newGainNode = this.audioContext.createGain();

    this.currentSound = {
      source: newSource,
      gain: newGainNode,
      track: musicTrack,
    };
    newSource.connect(newGainNode);
    newGainNode.connect(this.audioContext.destination);
    newSource.start(0);
  }

  async stop() {
    if (this.currentSound) {
      this.currentSound.source.stop();
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
      fadeOutSound.source.stop();
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
