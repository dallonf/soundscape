import { fromCallback } from 'promise-fns';
const fs = window.require('fs');

class MusicTrack {
  loaded = false;
  currentNode = null;

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

  async play() {
    const node = this.context.createBufferSource();
    this.currentNode = node;
    node.buffer = await this.bufferPromise;
    node.connect(this.context.destination);
    node.start();
  }
}

export default MusicTrack;
