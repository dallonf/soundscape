import * as pathModule from 'path';
import * as electronModule from 'electron';

const path = window.require('path') as typeof pathModule;
const { dialog } = (window.require('electron') as typeof electronModule).remote;

class MusicTrack {
  loaded = false;
  filePath: string;
  context: AudioContext;

  constructor(filePath: string, context: AudioContext) {
    this.filePath = filePath;
    this.context = context;
  }

  get name() {
    const ext = path.extname(this.filePath);
    return path.basename(this.filePath, ext);
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

export async function selectMusicTrackDialog(audioContext: AudioContext) {
  const resultPromise = new Promise<string[] | undefined>(resolve =>
    dialog.showOpenDialog(
      {
        filters: [{ name: 'Music', extensions: ['mp3', 'wav', 'ogg'] }],
        properties: ['openFile', 'treatPackageAsDirectory', 'noResolveAliases'],
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

export async function selectMultipleMusicTracksDialog(
  audioContext: AudioContext
) {
  const resultPromise = new Promise<string[] | undefined>(resolve =>
    dialog.showOpenDialog(
      {
        filters: [{ name: 'Music', extensions: ['mp3', 'wav', 'ogg'] }],
        properties: [
          'openFile',
          'treatPackageAsDirectory',
          'noResolveAliases',
          'multiSelections',
        ],
      },
      resolve
    )
  );
  const result = await resultPromise;
  if (result && result.length) {
    return result.map(x => new MusicTrack(x, audioContext));
  }
}

export default MusicTrack;
