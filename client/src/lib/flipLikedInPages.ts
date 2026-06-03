import type { InfiniteData } from '@tanstack/react-query';
import type { PhotoPage } from '../types/photo.js';

export function flipLikedInPages(
  data: InfiniteData<PhotoPage> | undefined,
  id: string,
  liked: boolean,
): InfiniteData<PhotoPage> | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((photo) => (photo.id === id ? { ...photo, liked } : photo)),
    })),
  };
}
