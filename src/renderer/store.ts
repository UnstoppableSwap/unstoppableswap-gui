import create from 'zustand';
// eslint-disable-next-line import/no-cycle
import { ExtendedProvider, SwapState } from '../models/store';

interface State {
  providerList: ExtendedProvider[];
  setProviderList: (list: ExtendedProvider[]) => void;
  currentProvider: ExtendedProvider | null;
  setCurrentProvider: (provider: ExtendedProvider) => void;
  swapState: SwapState | null;
  setSwapState: (newState: SwapState | null) => void;
}

const useStore = create<State>((set) => ({
  providerList: [],
  setProviderList: (list: ExtendedProvider[]) => {
    set((state: State) => {
      if (state.currentProvider !== null) {
        return {
          providerList: list,
          currentProvider:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            list.find((p) => p.peerId === state.currentProvider.peerId) ||
            list[0] ||
            null,
        };
      }
      return {
        providerList: list,
        currentProvider: list[0] || null,
      };
    });
  },
  currentProvider: null,
  setCurrentProvider: (provider: ExtendedProvider) => {
    set({ currentProvider: provider });
  },
  swapState: null,
  setSwapState: (newState) => {
    set({ swapState: newState });
  },
}));

export default useStore;
