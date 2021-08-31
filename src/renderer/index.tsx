import React from 'react';
import { render } from 'react-dom';
import App from './App';
import connectWebsocket from './socket-connector';

render(<App />, document.getElementById('root'));

connectWebsocket();
