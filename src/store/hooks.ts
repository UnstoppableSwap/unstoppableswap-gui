import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { isSwapResumable } from '../models/databaseModel';
import {
  isSwapStateBtcLockInMempool,
  TimelockStatus,
  TimelockStatusType,
} from '../models/storeModel';
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

export function useActiveSwapId() {
  return useAppSelector((s) => s.swap.swapId);
}

export function useActiveDbState() {
  const swapId = useActiveSwapId();
  return useDbState(swapId);
}

export function useTxLock(swapId: string) {
  return useAppSelector((state) =>
    state.electrum.txs.find(
      (tx) => tx.transaction.swapId === swapId && tx.transaction.kind === 'lock'
    )
  );
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

export function useAllProviders() {
  return useAppSelector((state) => {
    const registryProviders = state.providers.registry.providers || [];
    const listSellersProviders = state.providers.rendezvous.providers || [];
    return [...registryProviders, ...listSellersProviders];
  });
}
