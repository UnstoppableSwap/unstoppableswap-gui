import jayson from 'jayson/promise';
import { Multiaddr } from 'multiaddr';
import { isObject } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  BalanceBitcoinResponse,
  BuyXmrResponse,
  GetHistoryResponse,
  GetSwapInfoResponse,
  isErrorResponse,
  RawRpcResponse,
  RawRpcResponseSuccess,
  RpcMethod,
  RpcSellerStatus,
  SwapSellerInfo,
  WithdrawBitcoinResponse,
} from '../../models/rpcModel';
import { store } from '../../store/store';
import {
  rpcResetWithdrawTxId,
  rpcSetBalance,
  rpcSetEndpointBusy,
  rpcSetEndpointFree,
  rpcSetSwapInfo,
  rpcSetWithdrawTxId,
} from '../../store/features/rpcSlice';
import logger from '../../utils/logger';
import { Provider, ProviderStatus } from '../../models/apiModel';
import { isTestnet } from '../../store/config';
import { providerToConcatenatedMultiAddr } from '../../utils/multiAddrUtils';
import { swapAddLog, swapInitiate } from '../../store/features/swapSlice';
import {
  CliLog,
  CliLogSpanType,
  getCliLogSpanLogReferenceId,
  hasCliLogOneOfMultipleSpans,
  SwapSpawnType,
} from '../../models/cliModel';
import { RPC_BIND_HOST, RPC_BIND_PORT, RPC_LOG_EVENT_EMITTER } from './cli';
import getSavedLogsOfSwapId from './dirs';
import { discoveredProvidersByRendezvous } from '../../store/features/providersSlice';

const rpcClient = jayson.Client.http({
  port: RPC_BIND_PORT,
  hostname: RPC_BIND_HOST,
  timeout: 60 * 1000,
});

const GLOBALLY_RELEVANT_SPANS: CliLogSpanType[] = ['BitcoinWalletSubscription'];

export async function makeRpcRequest<T>(
  method: RpcMethod,
  params: jayson.RequestParamsLike,
  logCallback?: (log: CliLog[]) => void,
  includeGloballyRelevantLogs?: boolean
) {
  return new Promise<T>(async (resolve, reject) => {
    console.time(`makeRpcRequest ${method}`);
    store.dispatch(rpcSetEndpointBusy(method));

    try {
      if (isObject(params) && logCallback) {
        const logReferenceId = uuidv4();

        Object.assign(params, { log_reference_id: logReferenceId });

        RPC_LOG_EVENT_EMITTER.on((logs) => {
          const relevantLogs = logs.filter(
            (log) =>
              getCliLogSpanLogReferenceId(log) === logReferenceId ||
              (includeGloballyRelevantLogs &&
                hasCliLogOneOfMultipleSpans(log, GLOBALLY_RELEVANT_SPANS))
          );
          logCallback(relevantLogs);
        });
      }

      const response = (await rpcClient.request(
        method,
        params
      )) as RawRpcResponse<T>;

      if (isErrorResponse(response)) {
        reject(
          new Error(
            `RPC request failed Error: ${response.error.message} (Code: ${response.error.code})`
          )
        );
      } else {
        logger.debug({ method, params }, 'Received RPC response (success)');

        resolve(response.result);
      }
    } catch (e) {
      reject(e);
    } finally {
      store.dispatch(rpcSetEndpointFree(method));
      console.timeEnd(`makeRpcRequest ${method}`);
    }
  });
}

export async function makeBatchRpcRequest<T>(
  method: RpcMethod,
  params: jayson.RequestParamsLike[],
  logCallback?: (log: CliLog[]) => void
): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    console.time(`makeRpcRequest ${method} (batch)`);
    store.dispatch(rpcSetEndpointBusy(method));

    if (logCallback) {
      const logReferenceId = uuidv4();

      params.forEach((param) => {
        if (isObject(param)) {
          Object.assign(param, { log_reference_id: logReferenceId });
        }
      });

      RPC_LOG_EVENT_EMITTER.on((logs) => {
        const relevantLogs = logs.filter(
          (log) => getCliLogSpanLogReferenceId(log) === logReferenceId
        );
        logCallback(relevantLogs);
      });
    }

    const batch = params.map((param) =>
      rpcClient.request(method, param, undefined, false)
    );

    try {
      const responses = (await rpcClient.request(batch)) as RawRpcResponse<T>[];

      // Check if any of the responses have an error
      const errorResponses = responses.filter(isErrorResponse);
      if (errorResponses.length > 0) {
        throw new Error(
          `One or more RPC requests failed Errors: ${errorResponses
            .map((r) => `${r.error.message} (${r.error.code})`)
            .join(', ')}`
        );
      }

      logger.debug(
        { method, length: responses.length },
        'Received batched RPC response (success)'
      );

      // Because we know that all responses are successful, we can cast them to RawRpcResponseSuccess
      const results = (responses as RawRpcResponseSuccess<T>[]).map(
        (r) => r.result
      );
      resolve(results);
    } catch (e) {
      reject(e);
    } finally {
      store.dispatch(rpcSetEndpointFree(method));
      console.timeEnd(`makeRpcRequest ${method} (batch)`);
    }
  });
}

function providerFromGetSellerResponse(
  providerResponse: SwapSellerInfo
): Provider {
  const multiAddr = new Multiaddr(providerResponse.addresses[0])
    .decapsulate('p2p')
    .toString();

  return {
    peerId: providerResponse.peerId,
    multiAddr,
    testnet: isTestnet(),
  };
}

export async function checkBitcoinBalance() {
  const response = await makeRpcRequest<BalanceBitcoinResponse>(
    RpcMethod.GET_BTC_BALANCE,
    {}
  );
  store.dispatch(rpcSetBalance(response.balance));
}

export async function withdrawAllBitcoin(address: string) {
  store.dispatch(rpcResetWithdrawTxId());
  const response = await makeRpcRequest<WithdrawBitcoinResponse>(
    RpcMethod.WITHDRAW_BTC,
    {
      address,
    }
  );
  store.dispatch(rpcSetWithdrawTxId(response.txid));
}

export async function getSwapInfo(swapId: string) {
  return makeRpcRequest<GetSwapInfoResponse>(RpcMethod.GET_SWAP_INFO, {
    swap_id: swapId,
  });
}

export async function getSwapInfoBatch(
  swapIds: string[]
): Promise<GetSwapInfoResponse[]> {
  return makeBatchRpcRequest<GetSwapInfoResponse>(
    RpcMethod.GET_SWAP_INFO,
    swapIds.map((swapId) => ({
      swap_id: swapId,
    }))
  );
}

export async function buyXmr(
  redeemAddress: string,
  refundAddress: string,
  provider: Provider
) {
  const { swapId } = await makeRpcRequest<BuyXmrResponse>(
    RpcMethod.BUY_XMR,
    {
      bitcoin_change_address: refundAddress,
      monero_receive_address: redeemAddress,
      seller: providerToConcatenatedMultiAddr(provider),
    },
    (logs) => {
      store.dispatch(
        swapAddLog({
          logs,
          isFromRestore: false,
        })
      );
    },
    true
  );

  store.dispatch(
    swapInitiate({
      provider,
      spawnType: SwapSpawnType.INIT,
      swapId,
    })
  );
}

export async function cancelRefundSwap(swapId: string) {
  const swapInfo = await getSwapInfo(swapId);
  const previousLogs = await getSavedLogsOfSwapId(swapId);

  store.dispatch(
    swapInitiate({
      provider: providerFromGetSellerResponse(swapInfo.seller),
      spawnType: SwapSpawnType.CANCEL_REFUND,
      swapId,
    })
  );

  store.dispatch(
    swapAddLog({
      logs: previousLogs,
      isFromRestore: true,
    })
  );

  await makeRpcRequest(
    RpcMethod.CANCEL_REFUND_SWAP,
    {
      swap_id: swapId,
    },
    (logs) => {
      store.dispatch(
        swapAddLog({
          logs,
          isFromRestore: false,
        })
      );
    },
    true
  );
}

export async function resumeSwap(swapId: string) {
  const swapInfo = await getSwapInfo(swapId);
  const previousLogs = await getSavedLogsOfSwapId(swapId);

  store.dispatch(
    swapInitiate({
      provider: providerFromGetSellerResponse(swapInfo.seller),
      spawnType: SwapSpawnType.RESUME,
      swapId,
    })
  );

  store.dispatch(
    swapAddLog({
      logs: previousLogs,
      isFromRestore: true,
    })
  );

  await makeRpcRequest(
    RpcMethod.RESUME_SWAP,
    {
      swap_id: swapId,
    },
    (logs) => {
      store.dispatch(
        swapAddLog({
          logs,
          isFromRestore: false,
        })
      );
    },
    true
  );
}

export async function listSellers(rendezvousPointAddress: string) {
  const response = await makeRpcRequest<{ sellers: RpcSellerStatus[] }>(
    RpcMethod.LIST_SELLERS,
    {
      rendezvous_point: rendezvousPointAddress,
    }
  );
  const reachableSellers: ProviderStatus[] = response.sellers
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
  store.dispatch(discoveredProvidersByRendezvous(reachableSellers));
}

export async function suspendCurrentSwap() {
  await makeRpcRequest(RpcMethod.SUSPEND_CURRENT_SWAP, {}, (logs) => {
    store.dispatch(
      swapAddLog({
        logs,
        isFromRestore: false,
      })
    );
  });
}

export async function getAllSwapIds(): Promise<string[]> {
  const result = await makeRpcRequest<GetHistoryResponse>(
    RpcMethod.GET_HISTORY,
    {}
  );
  return result.swaps.map((swap) => swap[0]);
}

export async function getRawSwapInfos() {
  const swapIds = await getAllSwapIds();
  const getSwapInfoBatchResults = await getSwapInfoBatch(swapIds);

  getSwapInfoBatchResults.forEach((info) => {
    store.dispatch(rpcSetSwapInfo(info));
  });
}
