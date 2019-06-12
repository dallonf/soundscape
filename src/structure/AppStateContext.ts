import React from 'react';
import AppState from '../logic/AppState';

const AppStateContext = React.createContext<AppState | null>(null);

export default AppStateContext;

export const useAppStateContext = () => {
  const appState = React.useContext(AppStateContext);
  if (!appState) {
    throw new Error("No app state found in context");
  }
  return appState;
}