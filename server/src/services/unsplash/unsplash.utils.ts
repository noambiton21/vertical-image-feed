import { env } from '../../config/env.js';
import { FEED_IMAGE_QUALITY, FEED_IMAGE_WIDTH } from '../../constants.js';

export function buildPhotosRequestUrl(page: number, perPage: number): URL {
  const url = new URL('/photos', env.unsplashBaseUrl);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  return url;
}

export function toFeedImageUrl(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  url.searchParams.set('w', String(FEED_IMAGE_WIDTH));
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('q', String(FEED_IMAGE_QUALITY));
  return url.toString();
}
