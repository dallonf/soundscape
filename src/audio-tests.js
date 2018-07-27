import { fromCallback } from 'promise-fns';
const fs = window.require('fs');
const FILE_PATH = process.env.REACT_APP_DEFAULT_MUSIC_FILE;

export async function start() {
  const context = new AudioContext();

  const musicBufferPromise = fromCallback(cb =>
    fs.readFile(FILE_PATH, cb)
  ).then(buffer => console.log('loaded', buffer.buffer) || context.decodeAudioData(buffer.buffer));

  const src = context.createBufferSource();
  src.buffer = await musicBufferPromise;
  src.connect(context.destination);
  src.start(0);
}
