export type ErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL';

const STATUS_FOR_CODE: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  UPSTREAM_ERROR: 502,
  INTERNAL: 500,
};

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = STATUS_FOR_CODE[code];
  }

  static badRequest(message: string): AppError {
    return new AppError('BAD_REQUEST', message);
  }

  static notFound(message: string): AppError {
    return new AppError('NOT_FOUND', message);
  }

  static rateLimited(message: string): AppError {
    return new AppError('RATE_LIMITED', message);
  }

  static upstream(message: string): AppError {
    return new AppError('UPSTREAM_ERROR', message);
  }

  static internal(message: string): AppError {
    return new AppError('INTERNAL', message);
  }
}
