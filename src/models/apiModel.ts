export interface ExtendedProviderStatus extends ProviderStatus {
  uptime?: number;
  age?: number;
  relevancy?: number;
}

export interface ProviderStatus extends ProviderQuote, Provider {}

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
