export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, init);
  } catch {
    throw new ApiError(0, 'INTERNAL', 'Could not reach the server.');
  }

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}.`;
    let code: ApiErrorCode = 'INTERNAL';
    let message = fallback;
    try {
      const body = (await response.json()) as { error?: { code?: ApiErrorCode; message?: string } };
      if (body.error) {
        code = body.error.code ?? code;
        message = body.error.message ?? fallback;
      }
    } catch (err) {
      console.error('Failed to parse error response as JSON:', err);
    }
    throw new ApiError(response.status, code, message);
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiSend<T>(path: string, method: 'PUT' | 'DELETE'): Promise<T> {
  return request<T>(path, { method });
}
