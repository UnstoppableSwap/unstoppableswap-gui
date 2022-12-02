import jayson from 'jayson/promise';
import { Multiaddr } from 'multiaddr';
import { merge } from 'lodash';
import {
  BalanceBitcoinResponse,
  GetSellerResponse,
  GetSwapStartDateResponse,
  RawSwapHistoryResponse,
  RpcMethod,
  RpcSellerStatus,
  WithdrawBitcoinResponse,
} from '../../models/rpcModel';
import { store } from '../../store/store';
import {
  rpcResetWithdrawTxId,
  rpcSetBalance,
  rpcSetEndpointBusy,
  rpcSetEndpointFree,
  rpcSetRendezvousDiscoveredProviders,
  rpcSetWithdrawTxId,
} from '../../store/features/rpcSlice';
import logger from '../../utils/logger';
import { Provider, ProviderStatus } from '../../models/apiModel';
import { isTestnet } from '../../store/config';
import { providerToConcatenatedMultiAddr } from '../../utils/multiAddrUtils';
import {
  DbState,
  getTypeOfDbState,
  MergedDbState,
} from '../../models/databaseModel';
import { databaseStateChanged } from '../../store/features/historySlice';

const rpcClient = jayson.Client.http({
  port: 1234,
});

export async function makeRpcRequest<T>(
  method: RpcMethod,
  params: jayson.RequestParamsLike
) {
  return new Promise<{ result: T }>(async (resolve, reject) => {
    store.dispatch(rpcSetEndpointBusy(method));

    try {
      const response = await rpcClient.request(method, params);

      logger.debug(
        { method, params, response },
        'Received RPC response (success)'
      );

      if (response.error) {
        reject(
          new Error(`${response.error.message} (Code: ${response.error.code})`)
        );
      }

      resolve(response);
    } catch (e) {
      reject(e);
    } finally {
      store.dispatch(rpcSetEndpointFree(method));
    }
  });
}

export async function getRawHistory() {
  console.time('raw_history');
  const response = await makeRpcRequest<RawSwapHistoryResponse>(
    RpcMethod.RAW_HISTORY,
    {}
  );
  const mergedSwaps: MergedDbState[] = await Promise.all(
    Object.entries(response.result).map(async ([swapId, states]) => {
      const providerAddress = await makeRpcRequest<GetSellerResponse>(
        RpcMethod.GET_SELLER,
        {
          swap_id: swapId,
        }
      );
      const multiAddr = new Multiaddr(providerAddress.result.addresses[0])
        .decapsulate('p2p')
        .toString();

      const startedDate = await makeRpcRequest<GetSwapStartDateResponse>(
        RpcMethod.GET_SWAP_START_DATE,
        {
          swap_id: swapId,
        }
      );

      return {
        state: merge({}, ...states),
        swapId,
        type: getTypeOfDbState(states.at(-1) as DbState),
        provider: {
          testnet: false,
          peerId: providerAddress.result.peerId,
          multiAddr,
        },
        firstEnteredDate: startedDate.result.start_date,
      };
    })
  );
  console.timeLog('raw_history');
  console.timeEnd('raw_history');
  store.dispatch(databaseStateChanged(mergedSwaps));
}

export async function checkBitcoinBalance() {
  await getRawHistory();
  const response = await makeRpcRequest<BalanceBitcoinResponse>(
    RpcMethod.GET_BTC_BALANCE,
    []
  );
  store.dispatch(rpcSetBalance(response.result.balance));
}

export async function withdrawAllBitcoin(address: string) {
  store.dispatch(rpcResetWithdrawTxId());
  const response = await makeRpcRequest<WithdrawBitcoinResponse>(
    RpcMethod.WITHDRAW_BTC,
    {
      address,
    }
  );
  store.dispatch(rpcSetWithdrawTxId(response.result.txid));
}

export async function buyXmr(
  redeemAddress: string,
  refundAddress: string,
  provider: Provider
) {
  const response = await makeRpcRequest(RpcMethod.BUY_XMR, {
    bitcoin_change_address: refundAddress,
    monero_receive_address: redeemAddress,
    seller: providerToConcatenatedMultiAddr(provider),
  });
}

export async function listSellers(rendezvousPointAddress: string) {
  const response = await makeRpcRequest<{ sellers: RpcSellerStatus[] }>(
    RpcMethod.LIST_SELLERS,
    {
      rendezvous_point: rendezvousPointAddress,
    }
  );
  const reachableSellers: ProviderStatus[] = response.result.sellers
    .map((s) => {
      if (s.status !== 'Unreachable') {
        const multiAddrCombined = new Multiaddr(s.multiaddr);
        const multiAddr = multiAddrCombined.decapsulate('p2p').toString();
        const peerId = multiAddrCombined.getPeerId();

        return {
          multiAddr,
          peerId,
          price: s.status.Online.price,
          minSwapAmount: s.status.Online.min_quantity,
          maxSwapAmount: s.status.Online.min_quantity,
          testnet: isTestnet(),
        };
      }
      return null;
    })
    .filter((s): s is ProviderStatus => s !== null);
  store.dispatch(rpcSetRendezvousDiscoveredProviders(reachableSellers));
}
