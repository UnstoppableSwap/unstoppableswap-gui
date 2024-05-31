import { Alert, ExtendedProviderStatus } from '../models/apiModel';

const API_BASE_URL =
  process.env.OVERWRITE_API_ADDRESS || 'https://api.unstoppableswap.net';

export async function fetchProvidersViaHttp(): Promise<
  ExtendedProviderStatus[]
> {
  const response = await fetch(`${API_BASE_URL}/api/list`);
  return (await response.json()) as ExtendedProviderStatus[];
}

export async function fetchAlertsViaHttp(): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/api/alerts`);
  return (await response.json()) as Alert[];
}

export async function submitFeedbackViaHttp(
  body: string,
  attachedData: string
): Promise<string> {
  type Response = {
    feedbackId: string;
  };

  const response = await fetch(`${API_BASE_URL}/api/submit-feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body, attachedData }),
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  const responseBody = (await response.json()) as Response;

  return responseBody.feedbackId;
}
