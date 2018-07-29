import { fromCallback } from 'promise-fns';
const fs = window.require('fs');

class MusicTrack {
  loaded = false;

  constructor(path, context) {
    this.path = path;
    this.context = context;
  }

  preload() {
    return this.bufferPromise;
  }

  get bufferPromise() {
    if (this._bufferPromise) return this._bufferPromise;
    return (this._bufferPromise = fromCallback(cb => fs.readFile(this.path, cb))
      .then(buffer => this.context.decodeAudioData(buffer.buffer))
      .then(buffer => {
        this.loaded = true;
        return buffer;
      }));
  }

  async createNode() {
    const node = this.context.createBufferSource();
    node.buffer = await this.bufferPromise;
    return node;
  }
}

export default MusicTrack;
