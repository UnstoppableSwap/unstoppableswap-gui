import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from 'renderer/store/storeRenderer';
import { setRegistryProviders } from 'store/features/providersSlice';
import { setAlerts } from 'store/features/alertsSlice';
import { setXmrPrice, setBtcPrice } from 'store/features/ratesSlice';
import {
  fetchAlertsViaHttp,
  fetchBtcPrice,
  fetchProvidersViaHttp,
  fetchXmrPrice,
} from './api';
import logger from '../utils/logger';
import App from './components/App';
import { webFrame } from 'electron';

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

  try {
    const xmrPrice = await fetchXmrPrice();
    store.dispatch(setXmrPrice(xmrPrice));
    logger.info({ xmrPrice }, 'Fetched XMR price');

    const btcPrice = await fetchBtcPrice();
    store.dispatch(setBtcPrice(btcPrice));
    logger.info({ btcPrice }, 'Fetched BTC price');
  } catch (e) {
    logger.error(e, 'Error retrieving fiat prices');
  }
}

fetchInitialData();
webFrame.setZoomFactor(1.2)