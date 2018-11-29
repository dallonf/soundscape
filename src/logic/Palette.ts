import { decorate, observable } from 'mobx';
import MusicTrack from './MusicTrack';

export default class Palette {
  tracks: MusicTrack[] = [];
}
decorate(Palette, {
  tracks: observable,
});
