import { fromCallback } from 'promise-fns';
const path = window.require('path');
const fs = window.require('fs');

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

  get bufferPromise() {
    if (this._bufferPromise) return this._bufferPromise;
    return (this._bufferPromise = fromCallback(cb =>
      fs.readFile(this.filePath, cb)
    )
      .then(buffer => this.context.decodeAudioData(buffer.buffer))
      .then(buffer => {
        this.loaded = true;
        return buffer;
      }));
  }

  async createNode() {
    const element = new Audio(this.filePath);
    const node = this.context.createMediaElementSource(element);
    return { element, node };
  }
}

export default MusicTrack;
