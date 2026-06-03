import { DEFAULT_PER_PAGE } from '../constants.js';
import { apiGet, apiSend } from '../lib/api.js';
import type { LikeResult, PhotoPage } from '../types/photo.js';

export function fetchPhotos(page: number, perPage: number = DEFAULT_PER_PAGE): Promise<PhotoPage> {
  return apiGet<PhotoPage>(`/api/photos?page=${page}&per_page=${perPage}`);
}

export function likePhoto(id: string): Promise<LikeResult> {
  return apiSend<LikeResult>(`/api/photos/${id}/like`, 'PUT');
}

export function unlikePhoto(id: string): Promise<LikeResult> {
  return apiSend<LikeResult>(`/api/photos/${id}/like`, 'DELETE');
}
