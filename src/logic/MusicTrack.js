const path = window.require('path');
const { dialog } = window.require('electron').remote;
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
    const loadedPromise = new Promise(resolve =>
      element.addEventListener('loadedmetadata', resolve)
    );
    element.loop = true;
    const node = this.context.createMediaElementSource(element);
    await loadedPromise;
    return { element, node };
  }
}

export async function selectMusicTrackDialog(audioContext) {
  const resultPromise = new Promise(resolve =>
    dialog.showOpenDialog(
      null,
      {
        filters: [{ name: 'Music', extensions: ['mp3', 'wav', 'ogg'] }],
        properties: ['openFile'],
      },
      resolve
    )
  );
  const result = await resultPromise;
  if (result && result.length) {
    const track = new MusicTrack(result[0], audioContext);
    return track;
  }
}

export default MusicTrack;
