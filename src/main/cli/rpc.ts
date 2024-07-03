import jayson from 'jayson/promise';
import { Multiaddr } from 'multiaddr';
import { isObject } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { store } from 'main/store/mainStore';
import { Provider, ProviderStatus } from 'models/apiModel';
import { isTestnet } from 'store/config';
import { providerToConcatenatedMultiAddr } from 'utils/multiAddrUtils';
import { discoveredProvidersByRendezvous } from 'store/features/providersSlice';
import { SingleTypeEventEmitter } from 'utils/event';
import {
  BalanceBitcoinResponse,
  BuyXmrResponse,
  GetHistoryResponse,
  GetSwapInfoResponse,
  isErrorResponse,
  MoneroRecoveryResponse,
  RawRpcResponse,
  RawRpcResponseSuccess,
  RpcMethod,
  RpcSellerStatus,
  SwapSellerInfo,
  WithdrawBitcoinResponse,
} from '../../models/rpcModel';
import {
  rpcResetWithdrawTxId,
  rpcSetBalance,
  rpcSetEndpointBusy,
  rpcSetEndpointFree,
  rpcSetMoneroRecoveryKeys,
  rpcSetSwapInfo,
  rpcSetWithdrawTxId,
} from '../../store/features/rpcSlice';
import logger from '../../utils/logger';
import {
  swapAddLog,
  swapInitiate,
  swapProcessExited,
} from '../../store/features/swapSlice';
import {
  CliLog,
  CliLogSpanType,
  getCliLogSpanLogReferenceId,
  hasCliLogOneOfMultipleSpans,
  SwapSpawnType,
} from '../../models/cliModel';
import getSavedLogsOfSwapId from './dirs';

export const RPC_BIND_HOST = '0.0.0.0';
export const RPC_BIND_PORT = 1234;

export const RPC_LOG_EVENT_EMITTER: SingleTypeEventEmitter<CliLog[]> =
  new SingleTypeEventEmitter();

const rpcClient = jayson.Client.http({
  port: RPC_BIND_PORT,
  hostname: RPC_BIND_HOST,
  timeout: 5 * 60 * 1000,
});

const GLOBALLY_RELEVANT_SPANS: CliLogSpanType[] = ['BitcoinWalletSubscription'];

export async function makeRpcRequest<T>(
  method: RpcMethod,
  params: jayson.RequestParamsLike,
  logCallback?: (log: CliLog[]) => void,
  includeGloballyRelevantLogs?: boolean,
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
                hasCliLogOneOfMultipleSpans(log, GLOBALLY_RELEVANT_SPANS)),
          );
          if (relevantLogs.length > 0) {
            logCallback(relevantLogs);
          }
        });
      }

      const response = (await rpcClient.request(
        method,
        params,
      )) as RawRpcResponse<T>;

      if (isErrorResponse(response)) {
        reject(
          new Error(
            `Method: ${method} Params: ${JSON.stringify(params)} RPC request failed Error: ${response.error.message} (Code: ${response.error.code})`,
          ),
        );
      } else {
        logger.debug(
          { method, params, response },
          'Received RPC response (success)',
        );

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
  logCallback?: (log: CliLog[]) => void,
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
          (log) => getCliLogSpanLogReferenceId(log) === logReferenceId,
        );
        if (relevantLogs.length > 0) {
          logCallback(relevantLogs);
        }
      });
    }

    const batch = params.map((param) =>
      rpcClient.request(method, param, undefined, false),
    );

    try {
      const responses = (await rpcClient.request(batch)) as RawRpcResponse<T>[];

      // Check if any of the responses have an error
      const errorResponses = responses.filter(isErrorResponse);
      if (errorResponses.length > 0) {
        throw new Error(
          `One or more RPC requests failed Errors: ${errorResponses
            .map((r) => `${r.error.message} (${r.error.code})`)
            .join(', ')}`,
        );
      }

      logger.debug(
        { method, length: responses.length },
        'Received batched RPC response (success)',
      );

      // Because we know that all responses are successful, we can cast them to RawRpcResponseSuccess
      const results = (responses as RawRpcResponseSuccess<T>[]).map(
        (r) => r.result,
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
  providerResponse: SwapSellerInfo,
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

export async function checkBitcoinBalance(forceRefresh: boolean) {
  const response = await makeRpcRequest<BalanceBitcoinResponse>(
    RpcMethod.GET_BTC_BALANCE,
    {
      force_refresh: forceRefresh,
    },
  );
  store.dispatch(rpcSetBalance(response.balance));
}

export async function getMoneroRecoveryKeys(swapId: string) {
  const response = await makeRpcRequest<MoneroRecoveryResponse>(
    RpcMethod.GET_MONERO_RECOVERY_KEYS,
    {
      swap_id: swapId,
    },
  );
  store.dispatch(rpcSetMoneroRecoveryKeys([swapId, response]));
}

export async function withdrawAllBitcoin(address: string) {
  store.dispatch(rpcResetWithdrawTxId());
  const response = await makeRpcRequest<WithdrawBitcoinResponse>(
    RpcMethod.WITHDRAW_BTC,
    {
      address,
    },
  );
  await checkBitcoinBalance(true);
  store.dispatch(rpcSetWithdrawTxId(response.txid));
}

export async function getSwapInfo(swapId: string) {
  return makeRpcRequest<GetSwapInfoResponse>(RpcMethod.GET_SWAP_INFO, {
    swap_id: swapId,
  });
}

export async function getSwapInfoBatch(
  swapIds: string[],
): Promise<GetSwapInfoResponse[]> {
  if (swapIds.length === 0) {
    logger.debug('No swaps present in history, skipping swap info retrieval');
    return [];
  }

  try {
    return await makeBatchRpcRequest<GetSwapInfoResponse>(
      RpcMethod.GET_SWAP_INFO,
      swapIds.map((swapId) => ({ swap_id: swapId })),
    );
  } catch (error) {
    logger.error(
      'Batch request failed, falling back to individual requests',
      error,
    );
    const swapInfoPromises = swapIds.map(async (swapId) => {
      try {
        return await makeRpcRequest<GetSwapInfoResponse>(
          RpcMethod.GET_SWAP_INFO,
          { swap_id: swapId },
        );
      } catch (individualError) {
        logger.error(
          `Failed to retrieve swap info for swap ID: ${swapId}`,
          individualError,
        );
        return null;
      }
    });

    // Ignore errors, only await settled promises
    return (await Promise.allSettled(swapInfoPromises))
      .filter(
        (r): r is PromiseFulfilledResult<GetSwapInfoResponse> =>
          r.status === 'fulfilled',
      )
      .map((r) => r.value);
  }
}

export async function buyXmr(
  redeemAddress: string,
  refundAddress: string,
  provider: Provider,
) {
  store.dispatch(
    swapInitiate({
      provider,
      spawnType: SwapSpawnType.INIT,
      swapId: null,
    }),
  );

  try {
    await makeRpcRequest<BuyXmrResponse>(
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
          }),
        );
      },
      true,
    );
  } catch (e) {
    store.dispatch(swapProcessExited((e as Error).toString()));
    throw e;
  }
}

export async function cancelRefundSwap(swapId: string) {
  const swapInfo = await getSwapInfo(swapId);
  const previousLogs = await getSavedLogsOfSwapId(swapId);

  store.dispatch(
    swapAddLog({
      logs: previousLogs,
      isFromRestore: true,
    }),
  );

  store.dispatch(
    swapInitiate({
      provider: providerFromGetSellerResponse(swapInfo.seller),
      spawnType: SwapSpawnType.CANCEL_REFUND,
      swapId,
    }),
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
        }),
      );
    },
    true,
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
    }),
  );

  store.dispatch(
    swapAddLog({
      logs: previousLogs,
      isFromRestore: true,
    }),
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
        }),
      );
    },
    true,
  );
}

export async function listSellers(
  rendezvousPointAddress: string,
): Promise<number> {
  const response = await makeRpcRequest<{ sellers: RpcSellerStatus[] }>(
    RpcMethod.LIST_SELLERS,
    {
      rendezvous_point: rendezvousPointAddress,
    },
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
  return reachableSellers.length;
}

export async function suspendCurrentSwap() {
  await makeRpcRequest(RpcMethod.SUSPEND_CURRENT_SWAP, {}, (logs) => {
    store.dispatch(
      swapAddLog({
        logs,
        isFromRestore: false,
      }),
    );
  });
}

export async function getAllSwapIds(): Promise<string[]> {
  const result = await makeRpcRequest<GetHistoryResponse>(
    RpcMethod.GET_HISTORY,
    {},
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

export async function getRawSwapInfo(swapId: string) {
  const info = await getSwapInfo(swapId);
  store.dispatch(rpcSetSwapInfo(info));
}
