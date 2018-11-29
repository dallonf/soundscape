import { decorate, observable } from 'mobx';
import MusicTrack from './MusicTrack';
import Player from './Player';

export default class AppState {
  player: Player;

  constructor(audioContext: AudioContext) {
    this.player = new Player(audioContext);
  }
}
decorate(AppState, {
  player: observable,
});
