import { getLikedSet } from '../db/likes.repo.js';
import type { PhotoBase, PhotoResponse } from '../types/photo.js';
import { fetchUnsplashPhotos } from './unsplash/unsplash.client.js';
import { toPhoto } from './unsplash/unsplash.mapper.js';

export async function getPhotoFeed(page: number, perPage: number): Promise<PhotoResponse[]> {
  const raw = await fetchUnsplashPhotos(page, perPage);
  const items = raw
    .map(toPhoto)
    .filter((photo): photo is PhotoBase => photo !== null);

  const likedSet = getLikedSet(items.map((item) => item.id));

  return items.map((item) => ({ ...item, liked: likedSet.has(item.id) }));
}
