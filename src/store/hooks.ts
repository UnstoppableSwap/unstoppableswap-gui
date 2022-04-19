import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { isSwapResumable } from '../models/databaseModel';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useResumeableSwapsCount() {
  return useAppSelector(
    (state) => state.history.filter(isSwapResumable).length
  );
}

export function useDbState(swapId?: string | null) {
  const dbState =
    useAppSelector((s) =>
      s.history.find((h) => h.swapId === swapId && swapId)
    ) || null;

  return dbState;
}

export function useActiveDbState() {
  const swapId = useAppSelector((s) => s.swap.swapId);
  const dbState = useDbState(swapId);

  return dbState;
}
