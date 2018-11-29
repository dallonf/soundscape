import { decorate, observable } from 'mobx';
import MusicTrack from './MusicTrack';
import Player from './Player';
import Palette from './Palette';

export default class AppState {
  audioContext: AudioContext;
  player: Player;
  nextTrack: MusicTrack | null = null;
  palette: Palette;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.player = new Player(audioContext);
    this.palette = new Palette();
  }
}
decorate(AppState, {
  player: observable,
  nextTrack: observable,
});
