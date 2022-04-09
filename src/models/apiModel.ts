export interface ExtendedProvider extends Provider {
  price: number;
  minSwapAmount: number;
  maxSwapAmount: number;
  uptime: number;
  age: number;
  relevancy: number;
}

export interface Provider {
  multiAddr: string;
  testnet: boolean;
  peerId: string;
}
