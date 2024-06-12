import { SwapStateName } from 'models/rpcModel';
import { sha256 } from 'utils/cryptoUtils';
import { Provider } from 'models/apiModel';
import { isTestnet } from 'store/config';
import { store } from 'main/store/mainStore';
import { isCliLogReceivedQuote } from 'models/cliModel';
import {
  transmitReceivedQuoteFromProvider,
  transmitSwapDetailsUpdated,
} from './socket';
import {
  extractAmountFromUnitString,
  parseDateString,
} from '../utils/parseUtils';

export default function initStats() {
  const timestampsOfTransmittedReceivedQuotes: string[] = [];
  const transmittedSwapDetails = new Map<string, SwapStateName>();

  setInterval(() => {
    const state = store.getState();

    const receivedQuoteLog = state.swap.logs.find(isCliLogReceivedQuote);
    const receivedQuoteProvider = state.swap.provider;
    if (
      receivedQuoteLog &&
      receivedQuoteProvider &&
      !timestampsOfTransmittedReceivedQuotes.includes(
        receivedQuoteLog.timestamp,
      )
    ) {
      const priceBtc = extractAmountFromUnitString(
        receivedQuoteLog.fields.price,
      );
      const minimumAmountBtc = extractAmountFromUnitString(
        receivedQuoteLog.fields.minimum_amount,
      );
      const maximumAmountBtc = extractAmountFromUnitString(
        receivedQuoteLog.fields.maximum_amount,
      );

      if (priceBtc && minimumAmountBtc && maximumAmountBtc) {
        if (
          transmitReceivedQuoteFromProvider(
            {
              multiAddr: receivedQuoteProvider.multiAddr,
              peerId: receivedQuoteProvider.peerId,
              testnet: receivedQuoteProvider.testnet,
            },
            priceBtc,
            minimumAmountBtc,
            maximumAmountBtc,
          )
        ) {
          timestampsOfTransmittedReceivedQuotes.push(
            receivedQuoteLog.timestamp,
          );
        }
      }
    }

    Object.values(state.rpc.state.swapInfos).forEach((swap) => {
      const swapIdHash = sha256(swap.swapId);
      const { stateName } = swap;
      const provider: Provider = {
        multiAddr: swap.seller.addresses[0],
        peerId: swap.seller.peerId,
        testnet: isTestnet(),
      };
      const firstEnteredDate = parseDateString(swap.startDate);

      if (transmittedSwapDetails.get(swapIdHash) !== stateName) {
        if (
          transmitSwapDetailsUpdated(
            provider,
            swapIdHash,
            swap.xmrAmount,
            stateName,
            firstEnteredDate,
          )
        ) {
          transmittedSwapDetails.set(swapIdHash, stateName);
        }
      }
    });
  }, 1000 * 60);
}
