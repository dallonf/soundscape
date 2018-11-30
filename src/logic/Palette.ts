import { decorate, observable, autorun, IReactionDisposer } from 'mobx';
import MusicTrack from './MusicTrack';

const LOCALSTORAGE_PALETTE_KEY = 'soundscape_palette';

export default class Palette {
  audioContext: AudioContext;
  tracks: MusicTrack[] = [];
  disposer: IReactionDisposer;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;

    // load palette from localstorage
    {
      let existingPalette: string[] | undefined;
      const existingPaletteString = window.localStorage.getItem(
        LOCALSTORAGE_PALETTE_KEY
      );
      if (existingPaletteString) {
        try {
          const parsed = JSON.parse(existingPaletteString);
          if (
            Array.isArray(parsed) &&
            parsed.every(a => typeof a === 'string')
          ) {
            existingPalette = parsed;
          }
        } catch (e) {
          // ignore JSON parsing error
        }
      }
      if (existingPalette) {
        this.tracks = [
          ...existingPalette.map(t => new MusicTrack(t, audioContext)),
          ...this.tracks,
        ];
      }
    }

    // sync palette with localstorage
    this.disposer = autorun(
      () => {
        const serializedPalette = JSON.stringify(
          this.tracks.map(t => t.filePath)
        );
        window.localStorage.setItem(
          LOCALSTORAGE_PALETTE_KEY,
          serializedPalette
        );
      },
      { delay: 100 }
    );
  }

  dispose() {
    this.disposer();
  }
}
decorate(Palette, {
  tracks: observable,
});
