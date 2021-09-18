import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import connectWebsocket from './socket-connector';
import { store } from '../store/store';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

(async () => {
  await connectWebsocket();
})();
