const path = window.require('path');

class MusicTrack {
  loaded = false;

  constructor(filePath, context) {
    this.filePath = filePath;
    this.context = context;
  }

  get name() {
    const ext = path.extname(this.filePath);
    return path.basename(this.filePath, ext);
  }

  preload() {
    return this.bufferPromise;
  }

  async createNode() {
    const element = new Audio(this.filePath);
    const loadedPromise = new Promise(resolve => element.addEventListener('loadedmetadata', resolve));
    element.loop = true;
    const node = this.context.createMediaElementSource(element);
    await loadedPromise;
    return { element, node };
  }
}

export default MusicTrack;
