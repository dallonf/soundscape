import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MusicTrack from './logic/MusicTrack.js';
import PlayerContext from './structure/PlayerContext';

const App = observer(
  class App extends Component {
    constructor(...args) {
      super(...args);
      this.musicTrack1 = new MusicTrack(
        process.env.REACT_APP_DEFAULT_MUSIC_FILE,
        this.props.player.audioContext
      );
      this.musicTrack2 = new MusicTrack(
        process.env.REACT_APP_FADE_TO_MUSIC_FILE,
        this.props.player.audioContext
      );
    }

    componentDidMount() {
      this.musicTrack1.preload();
      this.musicTrack2.preload();
    }

    render() {
      return (
        <div>
          <button onClick={() => this.props.player.play(this.musicTrack1)}>
            Play {this.musicTrack1.name}
          </button>
          <button onClick={() => this.props.player.play(this.musicTrack2)}>
            Play {this.musicTrack2.name}
          </button>
          <button onClick={() => this.props.player.fadeOutAndStop()}>
            Stop
          </button>
          <div>
            {this.props.player.currentSound && (
              <div>
                Now playing: {this.props.player.currentSound.track.name}
              </div>
            )}
          </div>
        </div>
      );
    }
  }
);

const AppController = () => (
  <PlayerContext>{player => <App player={player} />}</PlayerContext>
);

export default AppController;
