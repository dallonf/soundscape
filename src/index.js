import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Player from './logic/Player';
import { Provider as PlayerContextProvider } from './structure/PlayerContext';

const audioContext = new AudioContext();
const player = new Player(audioContext);

ReactDOM.render(
  <PlayerContextProvider value={player}>
    <App />
  </PlayerContextProvider>,
  document.getElementById('root')
);
