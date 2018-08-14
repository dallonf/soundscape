import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MusicTrack from './logic/MusicTrack.js';
import PlayerContext from './structure/PlayerContext';
const { dialog } = window.require('electron').remote;

const App = observer(
  class App extends Component {
    constructor(...args) {
      super(...args);
      this.state = { next: null };
    }

    handleChooseNext = async () => {
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
        const track = new MusicTrack(result[0], this.props.player.audioContext);
        this.setState({ next: track });
      }
    };

    render() {
      const { next } = this.state;
      return (
        <div>
          <button onClick={this.handleChooseNext}>Pick track</button>
          {next && (
            <button onClick={() => this.props.player.play(next)}>
              Play {next.name}
            </button>
          )}
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
