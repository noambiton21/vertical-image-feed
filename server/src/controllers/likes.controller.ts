import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { setLiked, setUnliked } from '../services/likes.service.js';

function requirePhotoId(value: string): string {
  const id = value.trim();
  if (!id) {
    throw AppError.badRequest('A photo id is required.');
  }
  return id;
}

export function likePhoto(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = requirePhotoId(req.params.id);
    setLiked(id);
    res.json({ id, liked: true });
  } catch (err) {
    next(err);
  }
}

export function unlikePhoto(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = requirePhotoId(req.params.id);
    setUnliked(id);
    res.json({ id, liked: false });
  } catch (err) {
    next(err);
  }
}
