import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

export const primaryResource = {
  title: 'Primary guide',
  summary: 'A blurb',
  url: 'https://www.lease-advice.org/example-primary/',
  linkText: 'Read the primary guide',
};

export const relatedResource = {
  title: 'Related guide',
  summary: 'Another blurb',
  url: 'https://www.lease-advice.org/example-related/',
  linkText: 'Read the related guide',
};

export const topic = {
  slug: 'repairs',
  label: 'Repairs',
  summary: 'A summary',
  nextStep: 'A next step',
  primaryResource,
  relatedResources: [relatedResource],
};

export const unknownTopic = {
  slug: 'unknown',
  label: 'Unknown / not sure',
  summary: 'A summary',
  nextStep: 'A next step',
  primaryResource: null,
  relatedResources: [],
};

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const fetchMock = () => vi.mocked(fetch);

export const postedBody = () => {
  const init = fetchMock().mock.calls[0]?.[1];
  const body =
    init && typeof init === 'object' && 'body' in init ? init.body : undefined;
  if (typeof body !== 'string') {
    throw new Error('Expected JSON request body');
  }
  return JSON.parse(body) as Record<string, unknown>;
};

export const stubTriageFetch = (impl?: () => Promise<Response>) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(impl ?? (() => Promise.resolve(jsonResponse({ topic })))),
  );
};

export const submitForm = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /find guidance/i }));
  return user;
};
