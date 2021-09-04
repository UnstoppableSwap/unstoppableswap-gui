import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import connectWebsocket from './socket-connector';

render(<App />, document.getElementById('root'));

(async () => {
  await connectWebsocket();
})();
