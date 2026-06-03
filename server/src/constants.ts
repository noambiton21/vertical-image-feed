export const DEFAULT_PORT = 3001;

export const DEFAULT_PER_PAGE = 8;
export const MIN_PER_PAGE = 1;
export const MAX_PER_PAGE = 30;
export const FIRST_PAGE = 1;

export const FEED_IMAGE_WIDTH = 1080;
export const FEED_IMAGE_QUALITY = 80;

export const UNSPLASH_TIMEOUT_MS = 8000;
export const DEFAULT_UNSPLASH_BASE_URL = 'https://api.unsplash.com';

export const DB_PATH = process.env.DB_PATH?.trim() || 'data/likes.db';
