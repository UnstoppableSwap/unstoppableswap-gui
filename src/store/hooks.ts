import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import {
  isSwapStateBtcLockInMempool,
  TimelockStatus,
  TimelockStatusType,
} from '../models/storeModel';
import { getTimelockStatus } from '../utils/parseUtils';
import { MergedDbState } from '../models/databaseModel';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useResumeableSwapsCount() {
  return useAppSelector(
    (state) =>
      Object.values(state.rpc.state.swapInfos).filter(
        (swapInfo) => !swapInfo.completed
      ).length
  );
}

export function useIsSwapRunning() {
  return useAppSelector((state) => state.swap.state !== null);
}

export function useSwapInfo(swapId: string | null) {
  return useAppSelector((state) =>
    swapId ? state.rpc.state.swapInfos[swapId] : null
  );
}

export function useDbState(swapId: string | null): MergedDbState | undefined {
  return useSwapInfo(swapId)?.state;
}

export function useActiveSwapId() {
  return useAppSelector((s) => s.swap.swapId);
}

export function useActiveSwapInfo() {
  const swapId = useActiveSwapId();
  return useSwapInfo(swapId);
}

export function useActiveDbState() {
  const swapId = useActiveSwapId();
  return useDbState(swapId);
}

export function useTxLock(swapId: string) {
  // TODO: Implement this using RPC
  return null;
}

export function useTxLockConfirmations(swapId: string): number | null {
  const txLock = useTxLock(swapId);

  if (txLock == null) {
    return null;
  }

  // If confirmations is null but we still have a status for the tx, we can assume that the tx is still in the mempool
  return txLock.status.confirmations ?? 0;
}

export function useTimelockStatus(swapId: string): TimelockStatus {
  const dbState = useDbState(swapId);
  const confirmations = useTxLockConfirmations(swapId);

  if (dbState == null || confirmations == null) {
    return {
      type: TimelockStatusType.UNKNOWN,
    };
  }

  const { cancel_timelock: refundTimelock, punish_timelock: punishTimelock } =
    dbState.state.Bob.ExecutionSetupDone.state2;

  return getTimelockStatus(refundTimelock, punishTimelock, confirmations);
}

export function useMaxTxLockConfirmationsActiveSwap() {
  const swapId = useActiveSwapId();

  const electrumConfirmations = useTxLockConfirmations(swapId ?? '') ?? 0;

  const logConfirmations = useAppSelector((s) =>
    isSwapStateBtcLockInMempool(s.swap.state)
      ? s.swap.state.bobBtcLockTxConfirmations
      : 0
  );

  if (swapId == null) return null;

  return Math.max(electrumConfirmations, logConfirmations);
}

export function useIsRpcEndpointBusy(method: string) {
  return useAppSelector((state) => state.rpc.busyEndpoints.includes(method));
}
