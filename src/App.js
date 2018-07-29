import React, { Component } from 'react';
import MusicTrack from './logic/MusicTrack.js';
import AudioContext from './structure/AudioContext';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.musicTrack = new MusicTrack(
      process.env.REACT_APP_DEFAULT_MUSIC_FILE,
      this.props.audioContext
    );
  }

  componentDidMount() {
    this.musicTrack.preload();
  }

  render() {
    return (
      <div>
        <button onClick={() => this.musicTrack.play()}>Play</button>
      </div>
    );
  }
}

const AppController = () => (
  <AudioContext>
    {audioContext => <App audioContext={audioContext} />}
  </AudioContext>
);

export default AppController;
