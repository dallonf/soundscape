import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  selectMusicTrackDialog,
  selectMultipleMusicTracksDialog,
} from './logic/MusicTrack';
import AppStateContext from './structure/AppStateContext';
import Player from './logic/Player';

interface IProps {
  player: Player;
}

const App = observer(
  class App extends Component<IProps> {
    handleChooseNext = async () => {
      const result = await selectMusicTrackDialog(
        this.props.player.audioContext
      );
      if (result) {
        this.props.player.nextTrack = result;
      }
    };

    handleAddToPalette = async () => {
      const result = await selectMultipleMusicTracksDialog(
        this.props.player.audioContext
      );
      if (result && result.length) {
        this.props.player.palette.push(...result);
      }
    };

    render() {
      const { nextTrack, palette, state } = this.props.player;
      const paused = state.type === 'PAUSED' || state.type === 'PAUSING';
      return (
        <div>
          <h2>Palette</h2>
          {palette.length ? (
            <ul>
              {palette.map((paletteTrack, i) => (
                <li key={i}>
                  {paletteTrack.name}
                  <br />
                  <button onClick={() => this.props.player.play(paletteTrack)}>
                    Play
                  </button>
                  <button
                    onClick={() => (this.props.player.nextTrack = paletteTrack)}
                  >
                    Set Next
                  </button>
                  <button
                    onClick={() => this.props.player.palette.splice(i, 1)}
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
            <button onClick={() => this.props.player.play(nextTrack)}>
              Play {nextTrack.name}
            </button>
          )}
          <button onClick={() => this.props.player.fadeOutAndStop()}>
            Stop
          </button>
          <div>
            {this.props.player.currentSound && (
              <div>
                Now playing: {this.props.player.currentSound.track.name}
                <br />
                <input
                  type="range"
                  max={
                    this.props.player.currentSoundDuration == null
                      ? undefined
                      : this.props.player.currentSoundDuration
                  }
                  value={
                    this.props.player.currentSoundProgress == null
                      ? undefined
                      : this.props.player.currentSoundProgress
                  }
                  onChange={e => {
                    this.props.player.currentSoundProgress =
                      e.target.valueAsNumber;
                  }}
                />
                <br />
                {this.props.player._currentSoundProgress}/
                {this.props.player.currentSound.element.duration}
                <br />
                {paused ? (
                  <button onClick={() => this.props.player.resume()}>
                    Resume
                  </button>
                ) : (
                  <button onClick={() => this.props.player.pause()}>
                    Pause
                  </button>
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
      return <App player={appState.player} />;
    }}
  </AppStateContext>
);

export default AppController;
