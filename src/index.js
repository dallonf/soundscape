import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as audioTests from './audio-tests';

ReactDOM.render(<App />, document.getElementById('root'));

audioTests.start();
