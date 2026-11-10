import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getHealth } from './api';

describe('getHealth', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the validated health response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(getHealth()).resolves.toEqual({ status: 'ok' });
  });

  it('rejects malformed API data', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ status: 'unexpected' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(getHealth()).rejects.toThrow('Health request failed');
  });
});
