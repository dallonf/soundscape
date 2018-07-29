const CROSSFADE_TIME = 1;

class Player {
  currentState = 'silent';
  loading = false;
  currentSound = null;

  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  async play(musicTrack) {
    this.loading = true;
    const newSource = await musicTrack.createNode();
    this.loading = false;

    this.fadeOutAndStop();

    const newGainNode = this.audioContext.createGain();

    this.currentState = 'playing';
    this.currentSound = {
      source: newSource,
      gain: newGainNode,
      track: musicTrack,
    };
    newSource.connect(newGainNode);
    newGainNode.connect(this.audioContext.destination);
    newSource.start(0);
    newGainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
    newGainNode.gain.linearRampToValueAtTime(
      1,
      this.audioContext.currentTime + CROSSFADE_TIME
    );
  }

  async stop() {
    if (this.currentSound) {
      this.currentSound.source.stop();
      this.currentSound = null;
    }
  }

  async fadeOutAndStop() {
    if (this.currentSound) {
      // this.currentSound.source.stop();
      const fadeOutSound = this.currentSound;
      fadeOutSound.gain.gain.setValueAtTime(
        fadeOutSound.gain.gain.value,
        this.audioContext.currentTime
      );
      fadeOutSound.gain.gain.linearRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + CROSSFADE_TIME
      );
      await new Promise(resolve =>
        setTimeout(() => resolve, CROSSFADE_TIME * 1000)
      );
      fadeOutSound.source.stop();
      if (this.currentSound === fadeOutSound) {
        // Don't set currentSound to null if we've already started a new sound
        this.currentSound = null;
      }
    }
  }
}

export default Player;
