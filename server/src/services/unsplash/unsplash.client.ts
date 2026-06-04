import { env } from '../../config/env.js';
import { UNSPLASH_TIMEOUT_MS } from '../../constants.js';
import { AppError } from '../../errors/AppError.js';
import type { UnsplashPhoto } from '../../types/photo.js';
import { buildPhotosRequestUrl } from './unsplash.utils.js';

function isRateLimited(response: Response): boolean {
  if (response.status === 429) return true;
  return response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';
}

async function readUpstreamErrors(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { errors?: string[] };
    return body.errors?.join('; ') ?? '(no error detail)';
  } catch {
    return '(unparseable error body)';
  }
}

export async function fetchUnsplashPhotos(page: number, perPage: number): Promise<UnsplashPhoto[]> {
  const url = buildPhotosRequestUrl(page, perPage);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${env.unsplashAccessKey}` },
      signal: AbortSignal.timeout(UNSPLASH_TIMEOUT_MS),
    });

    if (!response.ok) {
      if (isRateLimited(response)) {
        throw AppError.rateLimited(
          'The image service is rate-limited right now. Please try again shortly.',
        );
      }
      const detail = await readUpstreamErrors(response);
      const hint = response.status === 401 ? ' (check UNSPLASH_ACCESS_KEY)' : '';
      console.error(`Unsplash responded ${response.status}${hint}: ${detail}`);
      throw AppError.upstream('Could not load photos from the image service.');
    }

    return (await response.json()) as UnsplashPhoto[];
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error(`Unsplash request failed (page=${page}, perPage=${perPage}):`, err);
    throw AppError.upstream('Could not load photos from the image service.');
  }
}
