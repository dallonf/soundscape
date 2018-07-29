class Player {
  currentState = 'silent';
  loading = false;
  currentNode = null;
  currentTrack = null;

  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  async play(musicTrack) {
    if (this.currentNode) {
      this.currentNode.stop();
    }
    
    this.loading = true;
    const newNode = await musicTrack.createNode();
    this.loading = false;
    this.currentState = 'playing';
    this.currentNode = newNode;
    this.currentTrack = musicTrack;
    newNode.connect(this.audioContext.destination);
    newNode.start(0);
  }

  async stop() {
    if (this.currentNode) {
      this.currentNode.stop();
    }
  }
}

export default Player;