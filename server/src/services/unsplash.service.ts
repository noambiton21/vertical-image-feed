import { env } from '../config/env.js';
import { FEED_IMAGE_QUALITY, FEED_IMAGE_WIDTH, UNSPLASH_TIMEOUT_MS } from '../constants.js';
import { AppError } from '../errors/AppError.js';
import type { PhotoBase, UnsplashPhoto } from '../types/photo.js';

// Unsplash signals a depleted quota with a plain 429, or with a 403 whose
// `X-Ratelimit-Remaining` header is 0 (distinct from a 403 for a bad key).
function isRateLimited(response: Response): boolean {
  if (response.status === 429) return true;
  return response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';
}

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
    description: raw.alt_description,
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
      if (isRateLimited(response)) {
        throw new AppError(
          429,
          'The image service is rate-limited right now. Please try again shortly.',
        );
      }
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
