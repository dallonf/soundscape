import React from 'react';
import AppState from '../logic/AppState';

const { Consumer, Provider } = React.createContext<AppState | null>(null);

export { Provider };
export default Consumer;
