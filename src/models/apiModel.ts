export interface ExtendedProviderStatus extends ProviderQuote, Provider {
  uptime: number;
  age: number;
  relevancy: number;
}

export interface ProviderQuote {
  price: number;
  minSwapAmount: number;
  maxSwapAmount: number;
}

export interface Provider {
  multiAddr: string;
  testnet: boolean;
  peerId: string;
}
