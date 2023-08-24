import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
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

export function useDbState(swapId: string | null): MergedDbState | null {
  return useSwapInfo(swapId)?.state || null;
}

export function useActiveSwapId() {
  return useAppSelector((s) => s.swap.swapId);
}

export function useActiveSwapInfo() {
  const swapId = useActiveSwapId();
  return useSwapInfo(swapId);
}

export function useActiveDbState(): MergedDbState | null {
  const swapId = useActiveSwapId();
  return useDbState(swapId);
}

export function useIsRpcEndpointBusy(method: string) {
  return useAppSelector((state) => state.rpc.busyEndpoints.includes(method));
}
