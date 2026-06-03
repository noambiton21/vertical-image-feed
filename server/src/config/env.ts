import { DEFAULT_PORT, DEFAULT_UNSPLASH_BASE_URL } from '../constants.js';

const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
if (!unsplashAccessKey) {
  throw new Error('Missing UNSPLASH_ACCESS_KEY. Copy .env.example to .env and fill it in.');
}

export const env = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
  unsplashAccessKey,
  unsplashBaseUrl: process.env.UNSPLASH_BASE_URL?.trim() || DEFAULT_UNSPLASH_BASE_URL,
};
