import type { Request, Response, NextFunction } from 'express';
import { DEFAULT_PER_PAGE, FIRST_PAGE, MAX_PER_PAGE, MIN_PER_PAGE } from '../constants.js';
import { AppError } from '../errors/AppError.js';
import { getPhotoFeed } from '../services/photos.service.js';

function parsePositiveInt(value: unknown, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new AppError(400, 'page and per_page must be integers.');
  }
  return parsed;
}

export async function getPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parsePositiveInt(req.query.page, FIRST_PAGE);
    const perPage = parsePositiveInt(req.query.per_page, DEFAULT_PER_PAGE);

    if (page < FIRST_PAGE || perPage < MIN_PER_PAGE || perPage > MAX_PER_PAGE) {
      throw new AppError(
        400,
        `page must be >= ${FIRST_PAGE} and per_page between ${MIN_PER_PAGE} and ${MAX_PER_PAGE}.`,
      );
    }

    const items = await getPhotoFeed(page, perPage);
    res.json({ page, perPage, items });
  } catch (err) {
    next(err);
  }
}
