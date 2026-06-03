import type { Response } from 'express';
import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

function isJsonParseError(err: unknown): boolean {
  return (
    err instanceof SyntaxError &&
    (err as { status?: unknown }).status === 400 &&
    (err as { type?: unknown }).type === 'entity.parse.failed'
  );
}

function sendAppError(res: Response, err: AppError): void {
  res.status(err.status).json({ error: { code: err.code, message: err.message } });
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    sendAppError(res, err);
    return;
  }

  if (isJsonParseError(err)) {
    sendAppError(res, AppError.badRequest('Invalid request body.'));
    return;
  }

  console.error(err);
  sendAppError(res, AppError.internal('Something went wrong.'));
};
