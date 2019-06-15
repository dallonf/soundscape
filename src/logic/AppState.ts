import { decorate, observable } from 'mobx';
import Player from './Player';
import Palette from './Palette';

export default class AppState {
  audioContext: AudioContext;
  player: Player;
  palette: Palette;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.player = new Player(audioContext);
    this.palette = new Palette(audioContext);
  }

  dispose() {
    this.player.dispose();
    this.palette.dispose();
  }
}
decorate(AppState, {
  player: observable,
});
