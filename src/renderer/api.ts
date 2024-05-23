import { Alert, ExtendedProviderStatus } from '../models/apiModel';

const API_BASE_URL =
  process.env.OVERWRITE_API_ADDRESS || 'https://api.unstoppableswap.net';

export async function fetchProvidersViaHttp(): Promise<
  ExtendedProviderStatus[]
> {
  const response = await fetch(`${API_BASE_URL}/api/list`);
  const providerList = (await response.json()) as ExtendedProviderStatus[];
  return providerList;
}

export async function fetchAlertsViaHttp(): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/api/alerts`);
  const alerts = (await response.json()) as Alert[];
  return alerts;
}
