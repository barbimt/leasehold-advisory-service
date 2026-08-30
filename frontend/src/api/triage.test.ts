import { TRIAGE_PATH, submitTriage, toTriageRequest } from './triage.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const topic = {
  slug: 'repairs',
  label: 'Repairs',
  summary: 'A summary',
  nextStep: 'A next step',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const fetchMock = () => vi.mocked(fetch);

describe('toTriageRequest', () => {
  it('includes only a selected scenario', () => {
    expect(toTriageRequest('major_works', '   ')).toEqual({
      scenario: 'major_works',
    });
  });

  it('includes only a trimmed description', () => {
    expect(toTriageRequest(null, '  The roof needs work  ')).toEqual({
      description: 'The roof needs work',
    });
  });

  it('includes both fields when both are provided', () => {
    expect(toTriageRequest('repairs', 'The roof needs work')).toEqual({
      scenario: 'repairs',
      description: 'The roof needs work',
    });
  });
});

describe('submitTriage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(jsonResponse({ topic }))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts JSON to the triage path', async () => {
    await submitTriage('repairs', 'The roof needs work');

    expect(fetchMock()).toHaveBeenCalledWith(
      TRIAGE_PATH,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: 'repairs',
          description: 'The roof needs work',
        }),
      }),
    );
  });

  it('returns the parsed topic', async () => {
    await expect(submitTriage('repairs', '')).resolves.toEqual(topic);
  });

  it('maps a failed fetch to a network error', async () => {
    fetchMock().mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(submitTriage('repairs', '')).rejects.toEqual(
      expect.objectContaining({
        name: 'ApiError',
        kind: 'network',
      }),
    );
  });

  it('maps a non-success status to an http error', async () => {
    fetchMock().mockResolvedValueOnce(jsonResponse({ detail: 'Invalid' }, 400));

    await expect(submitTriage('repairs', '')).rejects.toMatchObject({
      kind: 'http',
    });
  });

  it('maps a malformed body to an invalid-response error', async () => {
    fetchMock().mockResolvedValueOnce(jsonResponse({ topic: { slug: 1 } }));

    await expect(submitTriage('repairs', '')).rejects.toMatchObject({
      kind: 'invalid-response',
    });
  });
});
