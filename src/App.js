import React, { Component } from 'react';
import MusicTrack from './logic/MusicTrack.js';
import PlayerContext from './structure/PlayerContext';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.musicTrack = new MusicTrack(
      process.env.REACT_APP_DEFAULT_MUSIC_FILE,
      this.props.player.audioContext
    );
  }

  componentDidMount() {
    this.musicTrack.preload();
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.player.play(this.musicTrack)}>
          Play
        </button>
        <button onClick={() => this.props.player.stop()}>
          Stop
        </button>
      </div>
    );
  }
}

const AppController = () => (
  <PlayerContext>{player => <App player={player} />}</PlayerContext>
);

export default AppController;
