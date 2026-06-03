import { DEFAULT_PORT } from '../constants.js';

interface Env {
  port: number;
}

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') return DEFAULT_PORT;
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT: "${value}" — expected a positive integer.`);
  }
  return port;
}

export const env: Env = {
  port: parsePort(process.env.PORT),
};
