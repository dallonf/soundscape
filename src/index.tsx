import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppState from './logic/AppState';
import { Provider as AppStateContextProvider } from './structure/AppStateContext';

const audioContext = new AudioContext();
const appState = new AppState(audioContext);

ReactDOM.render(
  <AppStateContextProvider value={appState}>
    <App />
  </AppStateContextProvider>,
  document.getElementById('root')
);
