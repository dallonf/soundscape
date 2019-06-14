import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  selectMusicTrackDialog,
  selectMultipleMusicTracksDialog,
} from './logic/MusicTrack';
import AppState from './logic/AppState';
import AppStateContext from './structure/AppStateContext';

interface IProps {
  appState: AppState;
}

const App = observer(
  class App extends Component<IProps> {
    handleChooseNext = async () => {
      const result = await selectMusicTrackDialog(
        this.props.appState.audioContext
      );
      if (result) {
        this.props.appState.nextTrack = result;
      }
    };

    handleAddToPalette = async () => {
      const result = await selectMultipleMusicTracksDialog(
        this.props.appState.audioContext
      );
      if (result && result.length) {
        this.props.appState.palette.tracks.push(...result);
      }
    };

    render() {
      const { appState } = this.props;
      const { nextTrack, player, palette } = appState;
      return (
        <div>
          <h2>Palette</h2>
          {palette.tracks.length ? (
            <ul>
              {palette.tracks.map((paletteTrack, i) => (
                <li key={i}>
                  {paletteTrack.name}
                  <br />
                  <button onClick={() => player.play(paletteTrack)}>
                    Play
                  </button>
                  <button onClick={() => (appState.nextTrack = paletteTrack)}>
                    Set Next
                  </button>
                  <button onClick={() => palette.tracks.splice(i, 1)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button onClick={this.handleAddToPalette}>Add</button>
          <h2>Player</h2>
          <button onClick={this.handleChooseNext}>Pick track</button>
          {nextTrack && (
            <button onClick={() => player.play(nextTrack)}>
              Play {nextTrack.name}
            </button>
          )}
        </div>
      );
    }
  }
);

const AppController = () => (
  <AppStateContext.Consumer>
    {appState => {
      if (!appState) throw new Error('AppStateContext is required');
      return <App appState={appState} />;
    }}
  </AppStateContext.Consumer>
);

export default AppController;
