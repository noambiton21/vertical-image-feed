import { useEffect, useMemo, useRef, useState } from 'react';
import { blurHashToDataUrl } from '../lib/blurhash.js';

export function useBlurHashImage(src: string, blurHash: string | null) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholder = useMemo(() => blurHashToDataUrl(blurHash), [blurHash]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else setErrored(true);
  }, [src]);

  return {
    placeholder,
    loaded,
    errored,
    imgRef,
    onLoad: () => setLoaded(true),
    onError: () => setErrored(true),
  };
}
