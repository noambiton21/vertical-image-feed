import { like, unlike } from '../db/likes.repo.js';
import { AppError } from '../errors/AppError.js';

function assertValidId(photoId: string): void {
  if (!photoId.trim()) {
    throw new AppError(400, 'A photo id is required.');
  }
}

export function setLiked(photoId: string): void {
  assertValidId(photoId);
  like(photoId);
}

export function setUnliked(photoId: string): void {
  assertValidId(photoId);
  unlike(photoId);
}
