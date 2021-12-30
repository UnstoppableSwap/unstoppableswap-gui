import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useDbState(swapId?: string | null) {
  const dbState = useAppSelector((s) =>
    s.history.find((h) => h.swapId === swapId && swapId)
  );

  return dbState;
}

export function useActiveDbState() {
  const swapId = useAppSelector((s) => s.swap.swapId);
  const dbState = useDbState(swapId);

  return dbState;
}
