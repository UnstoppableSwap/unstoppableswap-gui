import jayson from 'jayson/promise';
import { Multiaddr } from 'multiaddr';
import { RpcMethod, RpcSellerStatus } from '../../models/rpcModel';
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
import { DbState } from '../../models/databaseModel';

const rpcClient = jayson.Client.http({
  port: 1234,
});

export async function makeRpcRequest(
  method: RpcMethod,
  params: jayson.RequestParamsLike
) {
  return new Promise<any>(async (resolve, reject) => {
    store.dispatch(rpcSetEndpointBusy(method));

    try {
      const response = await rpcClient.request(method, params);
      logger.debug({ method, params, response }, 'Received RPC response');
      resolve(response);
    } catch (e) {
      reject(e);
    } finally {
      store.dispatch(rpcSetEndpointFree(method));
    }
  });
}

export async function getRawHistory() {
  const response = (await makeRpcRequest(RpcMethod.RAW_HISTORY, {})) as {
    result: {
      swaps: ;
    };
  };
}

export async function checkBitcoinBalance() {
  const response = await makeRpcRequest(RpcMethod.GET_BTC_BALANCE, []);
  store.dispatch(rpcSetBalance(response.result.balance));
}

export async function withdrawBitcoin(address: string, amount: number) {
  store.dispatch(rpcResetWithdrawTxId());
  const response = await makeRpcRequest(RpcMethod.WITHDRAW_BTC, {
    address,
    amount: amount.toString(),
  });
  store.dispatch(rpcSetWithdrawTxId(response.result.txid));
}

export async function withdrawAllBitcoin(address: string) {
  store.dispatch(rpcResetWithdrawTxId());
  const response = await makeRpcRequest(RpcMethod.WITHDRAW_BTC, {
    address,
  });
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
  const response = await makeRpcRequest(RpcMethod.LIST_SELLERS, {
    rendezvous_point: rendezvousPointAddress,
  });
  const sellers = response.result.sellers as RpcSellerStatus[];
  const reachableSellers: ProviderStatus[] = sellers
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
