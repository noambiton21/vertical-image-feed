import { like, unlike } from '../db/likes.repo.js';

export function setLiked(photoId: string): void {
  like(photoId);
}

export function setUnliked(photoId: string): void {
  unlike(photoId);
}
