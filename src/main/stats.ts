import { DbStateType } from '../models/databaseModel';
import { store } from '../store/store';
import { transmitReceivedQuoteFromProvider, transmitSwapDetailsUpdated } from './socket';
import { sha256 } from '../utils/cryptoUtils';
import { isCliLogReceivedQuote } from '../models/cliModel';
import { extractAmountFromUnitString } from '../utils/parseUtils';

export default function initStats() {
  const transmittedSwapDetails = new Map<string, DbStateType>();
  const timestampsOfTransmittedReceivedQuotes: string[] = []

  store.subscribe(() => {
    const state = store.getState();

    state.history.forEach((h) => {
      if (!transmittedSwapDetails.has(h.swapId) || transmittedSwapDetails.get(h.swapId) !== h.type) {
        transmittedSwapDetails.set(h.swapId, h.type);
        const swapIdHash = sha256(h.swapId);
        transmitSwapDetailsUpdated(h.provider, swapIdHash, h.state.Bob.ExecutionSetupDone.state2.xmr, h.type, h.firstEnteredDate)
      }
    });

    const receivedQuoteLog = state.swap.logs.find(isCliLogReceivedQuote);
    const receivedQuoteProvider = state.swap.provider;
    if (receivedQuoteLog && receivedQuoteProvider && !timestampsOfTransmittedReceivedQuotes.includes(receivedQuoteLog.timestamp)) {
      const priceBtc = extractAmountFromUnitString(receivedQuoteLog.fields.price);
      const minimumAmountBtc = extractAmountFromUnitString(receivedQuoteLog.fields.minimum_amount);
      const maximumAmountBtc = extractAmountFromUnitString(receivedQuoteLog.fields.maximum_amount);

      if(priceBtc && minimumAmountBtc && maximumAmountBtc) {
        timestampsOfTransmittedReceivedQuotes.push(receivedQuoteLog.timestamp);
        transmitReceivedQuoteFromProvider({
          multiAddr: receivedQuoteProvider.multiAddr,
          peerId: receivedQuoteProvider.peerId,
          testnet: receivedQuoteProvider.testnet,
        }, priceBtc, minimumAmountBtc, maximumAmountBtc);
      }
    }
  });
}
