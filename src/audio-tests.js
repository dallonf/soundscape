import testmusicUrl from './testmusic.mp3';

export async function start() {
  const context = new AudioContext();

  const musicBufferPromise = new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', testmusicUrl, true);
    req.responseType = 'arraybuffer';

    req.onload = () => {
      context.decodeAudioData(
        req.response,
        buffer => {
          resolve(buffer);
        },
        reject
      );
    };
    req.send();
  });

  const src = context.createBufferSource();
  src.buffer = await musicBufferPromise;
  src.connect(context.destination);
  src.start(0);
}
