import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import './index.css';
import Layout from './ui/Layout';
import AppState from './logic/AppState';
import AppStateContext from './structure/AppStateContext';

const theme = createMuiTheme();

const audioContext = new AudioContext();
const appState = new AppState(audioContext);

ReactDOM.render(
  <AppStateContext.Provider value={appState}>
    <MuiThemeProvider theme={theme}>
      <Layout />
    </MuiThemeProvider>
  </AppStateContext.Provider>,
  document.getElementById('root')
);
