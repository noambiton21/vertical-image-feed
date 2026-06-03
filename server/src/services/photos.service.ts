import { getLikedSet } from '../db/likes.repo.js';
import type { PhotoResponse } from '../types/photo.js';
import { fetchPhotos } from './unsplash.service.js';

export async function getPhotoFeed(page: number, perPage: number): Promise<PhotoResponse[]> {
  const items = await fetchPhotos(page, perPage);
  const likedSet = getLikedSet(items.map((item) => item.id));

  return items.map((item) => ({ ...item, liked: likedSet.has(item.id) }));
}
