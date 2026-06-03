import { useEffect, useMemo, useRef, useState } from 'react';
import { blurHashToDataUrl } from '../lib/blurhash.js';

export function useBlurHashImage(src: string, blurHash: string | null) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholder = useMemo(() => blurHashToDataUrl(blurHash), [blurHash]);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);

  return { placeholder, loaded, imgRef, onLoad: () => setLoaded(true) };
}
