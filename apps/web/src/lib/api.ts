import createClient from 'openapi-fetch';
import type { HealthResponse, paths } from '@projectforecast/contracts';

const client = createClient<paths>({
  baseUrl: window.location.origin,
  fetch: (request) => globalThis.fetch(request),
});

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const { data, error } = await client.GET('/api/health', { signal });
  const payload: unknown = data;

  if (error || !isHealthResponse(payload)) {
    throw new Error('Health request failed');
  }

  return payload;
}

function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    value.status === 'ok'
  );
}
