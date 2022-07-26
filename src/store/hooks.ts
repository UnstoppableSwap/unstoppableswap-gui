import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { isSwapResumable } from '../models/databaseModel';
import { TimelockStatus, TimelockStatusType } from '../models/storeModel';
import { getTimelockStatus } from '../utils/parseUtils';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useResumeableSwapsCount() {
  return useAppSelector(
    (state) => state.history.filter(isSwapResumable).length
  );
}

export function useIsSwapRunning() {
  return useAppSelector((state) => state.swap.state !== null);
}

export function useDbState(swapId?: string | null) {
  return (
    useAppSelector((s) =>
      s.history.find((h) => h.swapId === swapId && swapId)
    ) || null
  );
}

export function useActiveDbState() {
  const swapId = useAppSelector((s) => s.swap.swapId);
  return useDbState(swapId);
}

export function useTxLock(swapId: string) {
  return useAppSelector((state) =>
    state.electrum.find(
      (tx) => tx.transaction.swapId === swapId && tx.transaction.kind === 'lock'
    )
  );
}

export function useTimelockStatus(swapId: string): TimelockStatus {
  const dbState = useDbState(swapId);
  const txLock = useTxLock(swapId);

  if (dbState == null || txLock == null) {
    return {
      type: TimelockStatusType.UNKNOWN,
    };
  }

  // If confirmations is null but we still have a status for the tx, we can assume that the tx is still in the mempool
  const confirmations = txLock.status.confirmations ?? 0;

  const { cancel_timelock: refundTimelock, punish_timelock: punishTimelock } =
    dbState.state.Bob.ExecutionSetupDone.state2;

  return getTimelockStatus(refundTimelock, punishTimelock, confirmations);
}
