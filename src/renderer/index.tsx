import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { store } from './store/storeRenderer';
import logger from '../utils/logger';
import { fetchAlertsViaHttp, fetchProvidersViaHttp } from './api';
import { setRegistryProviders } from '../store/features/providersSlice';
import { setAlerts } from '../store/features/alertsSlice';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

async function fetchInitialData() {
  try {
    const providerList = await fetchProvidersViaHttp();
    store.dispatch(setRegistryProviders(providerList));

    logger.info(
      { providerList },
      'Fetched providers via UnstoppableSwap HTTP API'
    );
  } catch (e) {
    logger.error(e, 'Failed to fetch providers via UnstoppableSwap HTTP API');
  }

  try {
    const alerts = await fetchAlertsViaHttp();
    store.dispatch(setAlerts(alerts));
    logger.info({ alerts }, 'Fetched alerts via UnstoppableSwap HTTP API');
  } catch (e) {
    logger.error(e, 'Failed to fetch alerts via UnstoppableSwap HTTP API');
  }
}

fetchInitialData();
