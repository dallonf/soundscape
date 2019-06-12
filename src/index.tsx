import 'typeface-roboto';

import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { createMuiTheme } from '@material-ui/core/styles';
import { useTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import './index.css';
import Layout from './ui/Layout';
import AppState from './logic/AppState';
import { Provider as AppStateContextProvider } from './structure/AppStateContext';

const theme = createMuiTheme();

const audioContext = new AudioContext();
const appState = new AppState(audioContext);

// TODO: this might be more trouble than it's worth, consider just using Material's style system throughout the app
const MuiToStyledComponentsThemeProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const theme = useTheme();
  console.log(theme);
  return (
    <StyledComponentsThemeProvider theme={theme}>
      {children}
    </StyledComponentsThemeProvider>
  );
};

ReactDOM.render(
  <AppStateContextProvider value={appState}>
    <MuiThemeProvider theme={theme}>
      <MuiToStyledComponentsThemeProvider>
        <Layout />
      </MuiToStyledComponentsThemeProvider>
    </MuiThemeProvider>
  </AppStateContextProvider>,
  document.getElementById('root')
);
