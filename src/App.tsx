import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  selectMusicTrackDialog,
  selectMultipleMusicTracksDialog,
} from './logic/MusicTrack';
import Player from './logic/Player';
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
      const paused =
        player.state.type === 'PAUSED' || player.state.type === 'PAUSING';
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
                  <button
                    onClick={() => (appState.nextTrack = paletteTrack)}
                  >
                    Set Next
                  </button>
                  <button
                    onClick={() => palette.tracks.splice(i, 1)}
                  >
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
          <button onClick={() => player.fadeOutAndStop()}>Stop</button>
          <div>
            {player.currentSound && (
              <div>
                Now playing: {player.currentSound.track.name}
                <br />
                <input
                  type="range"
                  max={
                    player.currentSoundDuration == null
                      ? undefined
                      : player.currentSoundDuration
                  }
                  value={
                    player.currentSoundProgress == null
                      ? undefined
                      : player.currentSoundProgress
                  }
                  onChange={e => {
                    player.currentSoundProgress = e.target.valueAsNumber;
                  }}
                />
                <br />
                {player._currentSoundProgress}/
                {player.currentSound.element.duration}
                <br />
                {paused ? (
                  <button onClick={() => player.resume()}>Resume</button>
                ) : (
                  <button onClick={() => player.pause()}>Pause</button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  }
);

const AppController = () => (
  <AppStateContext>
    {appState => {
      if (!appState) throw new Error('AppStateContext is required');
      return <App appState={appState} />;
    }}
  </AppStateContext>
);

export default AppController;
