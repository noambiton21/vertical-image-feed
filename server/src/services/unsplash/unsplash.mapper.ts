import type { PhotoBase, UnsplashPhoto } from '../../types/photo.js';
import { toFeedImageUrl } from './unsplash.utils.js';

export function toPhoto(raw: UnsplashPhoto): PhotoBase | null {
  if (!raw.id || !raw.urls?.raw) return null;

  const url = toFeedImageUrl(raw.urls.raw);
  if (url === null) return null;

  return {
    id: raw.id,
    url,
    width: raw.width,
    height: raw.height,
    blurHash: raw.blur_hash,
    description: raw.alt_description,
  };
}
