import { resolveApiUrl } from './http.ts';
import { TRIAGE_PATH } from './triage.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('resolveApiUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the relative path when the base URL is unset', () => {
    expect(resolveApiUrl(TRIAGE_PATH)).toBe('/api/triage/');
  });

  it('returns the relative path when the base URL is empty or whitespace', () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    expect(resolveApiUrl(TRIAGE_PATH)).toBe('/api/triage/');

    vi.stubEnv('VITE_API_BASE_URL', '   ');
    expect(resolveApiUrl(TRIAGE_PATH)).toBe('/api/triage/');
  });

  it('prefixes a configured origin onto the relative path', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://example-api.com');

    expect(resolveApiUrl(TRIAGE_PATH)).toBe(
      'https://example-api.com/api/triage/',
    );
  });

  it('does not duplicate slashes at the base and path boundary', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://example-api.com/');

    expect(resolveApiUrl(TRIAGE_PATH)).toBe(
      'https://example-api.com/api/triage/',
    );
  });
});
