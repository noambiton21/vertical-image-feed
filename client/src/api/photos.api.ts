import { DEFAULT_PER_PAGE } from '../constants.js';
import { apiGet } from '../lib/api.js';
import type { PhotoPage } from '../types/photo.js';

export function fetchPhotos(page: number, perPage: number = DEFAULT_PER_PAGE): Promise<PhotoPage> {
  return apiGet<PhotoPage>(`/api/photos?page=${page}&per_page=${perPage}`);
}
