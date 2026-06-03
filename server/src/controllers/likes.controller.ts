import type { Request, Response, NextFunction } from 'express';
import { setLiked, setUnliked } from '../services/likes.service.js';

export function likePhoto(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id } = req.params;
    setLiked(id);
    res.json({ id, liked: true });
  } catch (err) {
    next(err);
  }
}

export function unlikePhoto(req: Request, res: Response, next: NextFunction): void {
  try {
    const { id } = req.params;
    setUnliked(id);
    res.json({ id, liked: false });
  } catch (err) {
    next(err);
  }
}
