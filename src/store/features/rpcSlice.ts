import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GetSwapInfoResponse,
  MoneroRecoveryResponse,
  RpcProcessStateType,
} from '../../models/rpcModel';
import { CliLog, isCliLogStartedRpcServer } from '../../models/cliModel';
import { ExtendedProviderStatus, ProviderStatus } from '../../models/apiModel';

type Process =
  | {
      type: RpcProcessStateType.STARTED;
      stdOut: string;
    }
  | {
      type: RpcProcessStateType.LISTENING_FOR_CONNECTIONS;
      stdOut: string;
      address: string;
    }
  | {
      type: RpcProcessStateType.EXITED;
      stdOut: string;
      exitCode: number | null;
    }
  | {
      type: RpcProcessStateType.NOT_STARTED;
    };

interface State {
  balance: number | null;
  withdrawTxId: string | null;
  rendezvous_discovered_sellers: (ExtendedProviderStatus | ProviderStatus)[];
  swapInfos: {
    [swapId: string]: GetSwapInfoResponse;
  };
  moneroRecovery: {
    swapId: string;
    keys: MoneroRecoveryResponse;
  } | null;
}

export interface RPCSlice {
  process: Process;
  state: State;
  busyEndpoints: string[];
}

const initialState: RPCSlice = {
  process: {
    type: RpcProcessStateType.NOT_STARTED,
  },
  state: {
    balance: null,
    withdrawTxId: null,
    rendezvous_discovered_sellers: [],
    swapInfos: {},
    moneroRecovery: null,
  },
  busyEndpoints: [],
};

export const rpcSlice = createSlice({
  name: 'rpc',
  initialState,
  reducers: {
    rpcAppendStdOut(slice, action: PayloadAction<string>) {
      if (
        slice.process.type === RpcProcessStateType.STARTED ||
        slice.process.type === RpcProcessStateType.LISTENING_FOR_CONNECTIONS
      ) {
        slice.process.stdOut += action.payload;
      }
    },
    rpcAddLogs(slice, action: PayloadAction<CliLog[]>) {
      action.payload.forEach((log) => {
        if (
          isCliLogStartedRpcServer(log) &&
          slice.process.type === RpcProcessStateType.STARTED
        ) {
          slice.process = {
            type: RpcProcessStateType.LISTENING_FOR_CONNECTIONS,
            stdOut: slice.process.stdOut,
            address: log.fields.addr,
          };
        }
      });
    },
    rpcInitiate(slice) {
      slice.process = {
        type: RpcProcessStateType.STARTED,
        stdOut: '',
      };
    },
    rpcProcessExited(
      slice,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) {
      if (
        slice.process.type === RpcProcessStateType.STARTED ||
        slice.process.type === RpcProcessStateType.LISTENING_FOR_CONNECTIONS
      ) {
        slice.process = {
          type: RpcProcessStateType.EXITED,
          stdOut: slice.process.stdOut,
          exitCode: action.payload.exitCode,
        };
      }
    },
    rpcSetBalance(slice, action: PayloadAction<number>) {
      slice.state.balance = action.payload;
    },
    rpcSetWithdrawTxId(slice, action: PayloadAction<string>) {
      slice.state.withdrawTxId = action.payload;
    },
    rpcSetRendezvousDiscoveredProviders(
      slice,
      action: PayloadAction<(ExtendedProviderStatus | ProviderStatus)[]>
    ) {
      slice.state.rendezvous_discovered_sellers = action.payload;
    },
    rpcResetWithdrawTxId(slice) {
      slice.state.withdrawTxId = null;
    },
    rpcSetSwapInfo(slice, action: PayloadAction<GetSwapInfoResponse>) {
      slice.state.swapInfos[action.payload.swapId] = action.payload;
    },
    rpcSetEndpointBusy(slice, action: PayloadAction<string>) {
      if (!slice.busyEndpoints.includes(action.payload)) {
        slice.busyEndpoints.push(action.payload);
      }
    },
    rpcSetEndpointFree(slice, action: PayloadAction<string>) {
      const index = slice.busyEndpoints.indexOf(action.payload);
      if (index >= 0) {
        slice.busyEndpoints.splice(index);
      }
    },
    rpcSetMoneroRecoveryKeys(
      slice,
      action: PayloadAction<[string, MoneroRecoveryResponse]>
    ) {
      const swapId = action.payload[0];
      const keys = action.payload[1];

      slice.state.moneroRecovery = {
        swapId,
        keys,
      };
    },
    rpcResetMoneroRecoveryKeys(slice) {
      slice.state.moneroRecovery = null;
    },
  },
});

export const {
  rpcProcessExited,
  rpcAppendStdOut,
  rpcAddLogs,
  rpcInitiate,
  rpcSetBalance,
  rpcSetWithdrawTxId,
  rpcResetWithdrawTxId,
  rpcSetEndpointBusy,
  rpcSetEndpointFree,
  rpcSetRendezvousDiscoveredProviders,
  rpcSetSwapInfo,
  rpcSetMoneroRecoveryKeys,
  rpcResetMoneroRecoveryKeys,
} = rpcSlice.actions;

export default rpcSlice.reducer;