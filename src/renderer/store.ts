import create from 'zustand';

export interface Provider {
  multiAddr: string;
  peerId: string;
  testnet: boolean;
  price: number;
  minSwapAmount: number;
  maxSwapAmount: number;
  uptimeSeconds: number;
  downtimeSeconds: number;
  age: number;
  relevancy: number;
}

export interface Dialog {
  amount: number;
  open: boolean;
  page: number;
  payoutAddress: string | null;
  refundAddress: string | null;
}

interface State {
  providerList: Provider[];
  setProviderList: (list: Provider[]) => void;
  currentProvider: Provider | null;
  setCurrentProvider: (provider: Provider) => void;
  dialog: Dialog;
  setDialog: (dialog: Dialog) => void;
}

const useStore = create<State>((set) => ({
  providerList: [],
  setProviderList: (list: Provider[]) => {
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
  setCurrentProvider: (provider: Provider) => {
    set({ currentProvider: provider });
  },
  dialog: {
    amount: 0,
    open: false,
    page: 0,
    payoutAddress: null,
    refundAddress: null,
  },
  setDialog: (dialog) => {
    set({ dialog });
  },
}));

export default useStore;
