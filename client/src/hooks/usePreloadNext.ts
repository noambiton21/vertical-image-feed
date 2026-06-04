import { useEffect, useRef } from 'react';
import { PRELOAD_AHEAD } from '../constants';
import type { Photo } from '../types/photo';

export function usePreloadNext(photos: Photo[], currentIndex: number) {
  const preloaded = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (let offset = 1; offset <= PRELOAD_AHEAD; offset++) {
      const photo = photos[currentIndex + offset];
      if (!photo || preloaded.current.has(photo.url)) continue;
      preloaded.current.add(photo.url);
      const img = new Image();
      img.src = photo.url;
    }
  }, [photos, currentIndex]);
}
