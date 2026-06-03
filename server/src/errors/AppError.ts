export type ErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL';

const DEFAULT_CODE_FOR_STATUS: Record<number, ErrorCode> = {
  400: 'BAD_REQUEST',
  404: 'NOT_FOUND',
  429: 'RATE_LIMITED',
  502: 'UPSTREAM_ERROR',
  500: 'INTERNAL',
};

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, message: string, code?: ErrorCode) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code ?? DEFAULT_CODE_FOR_STATUS[status] ?? 'INTERNAL';
  }
}
