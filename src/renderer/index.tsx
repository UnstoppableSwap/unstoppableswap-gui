import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { store } from '../store/store';
import { ExtendedProviderStatus } from '../models/apiModel';
import logger from '../utils/logger';
import { setRegistryProviders } from '../store/features/providersSlice';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// Fetching via HTTP is often faster than socket.io
async function fetchProvidersViaHttp() {
  const response = await fetch(
    process.env.OVERWRITE_API_ADDRESS
      ? `${process.env.OVERWRITE_API_ADDRESS}/api/list`
      : 'https://api.unstoppableswap.net/api/list'
  );
  const providerList = (await response.json()) as ExtendedProviderStatus[];
  store.dispatch(setRegistryProviders(providerList));

  logger.info(
    { providerList },
    'Fetched providers via UnstoppableSwap HTTP API'
  );
}

fetchProvidersViaHttp().catch((err) => {
  logger.error(err, 'Failed to fetch providers via UnstoppableSwap HTTP API');
});
