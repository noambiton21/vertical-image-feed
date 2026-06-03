import { env } from '../config/env.js';
import { FEED_IMAGE_QUALITY, FEED_IMAGE_WIDTH, UNSPLASH_TIMEOUT_MS } from '../constants.js';
import { AppError } from '../errors/AppError.js';
import type { PhotoBase, UnsplashPhoto } from '../types/photo.js';

function toPhoto(raw: UnsplashPhoto): PhotoBase {
  const url = new URL(raw.urls.raw);
  url.searchParams.set('w', String(FEED_IMAGE_WIDTH));
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('q', String(FEED_IMAGE_QUALITY));

  return {
    id: raw.id,
    url: url.toString(),
    width: raw.width,
    height: raw.height,
    blurHash: raw.blur_hash,
  };
}

export async function fetchPhotos(page: number, perPage: number): Promise<PhotoBase[]> {
  const url = new URL('/photos', env.unsplashBaseUrl);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${env.unsplashAccessKey}` },
      signal: AbortSignal.timeout(UNSPLASH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new AppError(502, 'Could not load photos from the image service.');
    }

    const data = (await response.json()) as UnsplashPhoto[];
    return data.map(toPhoto);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error(`Unsplash request failed (page=${page}, perPage=${perPage}):`, err);
    throw new AppError(502, 'Could not load photos from the image service.');
  }
}
