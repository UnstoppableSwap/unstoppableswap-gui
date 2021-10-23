import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import connectWebsocket from './socket';
import { store } from '../store/store';
import watchDatabase from '../swap/database';
import spawnBalanceCheck from '../swap/commands/balanceCommand';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

(async () => {
  await connectWebsocket();
  await watchDatabase();
  await spawnBalanceCheck();
})();
