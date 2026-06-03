import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

function isJsonParseError(err: unknown): boolean {
  return (
    err instanceof SyntaxError &&
    (err as { status?: unknown }).status === 400 &&
    (err as { type?: unknown }).type === 'entity.parse.failed'
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (isJsonParseError(err)) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Invalid request body.' } });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Something went wrong.' } });
};
