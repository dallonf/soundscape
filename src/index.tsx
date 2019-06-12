import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './ui/Layout';
import AppState from './logic/AppState';
import { Provider as AppStateContextProvider } from './structure/AppStateContext';

const audioContext = new AudioContext();
const appState = new AppState(audioContext);

ReactDOM.render(
  <AppStateContextProvider value={appState}>
    <Layout />
  </AppStateContextProvider>,
  document.getElementById('root')
);
