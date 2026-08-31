export type ApiErrorKind = 'network' | 'http' | 'invalid-response';

export const REQUEST_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  readonly kind: ApiErrorKind;

  constructor(kind: ApiErrorKind) {
    super(kind);
    this.name = 'ApiError';
    this.kind = kind;
  }
}

export const postJson = async (
  path: string,
  body: unknown,
): Promise<unknown> => {
  let response: Response;

  try {
    response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError('network');
  }

  if (!response.ok) {
    throw new ApiError('http');
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError('invalid-response');
  }
};
