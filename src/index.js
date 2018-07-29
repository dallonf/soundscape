import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider as AudioContextProvider } from './structure/AudioContext';

const audioContext = new AudioContext();

ReactDOM.render(
  <AudioContextProvider value={audioContext}>
    <App />
  </AudioContextProvider>,
  document.getElementById('root')
);
