import { useMemo } from 'react';
import { blurHashToDataUrl } from '../lib/blurhash.js';

interface FeedBackdropProps {
  blurHash: string | null;
}

export function FeedBackdrop({ blurHash }: FeedBackdropProps) {
  const placeholder = useMemo(() => blurHashToDataUrl(blurHash), [blurHash]);

  return (
    <div aria-hidden className="absolute inset-0">
      {placeholder && (
        <div
          className="absolute inset-0 scale-125 bg-cover bg-center [filter:blur(38px)_brightness(.55)_saturate(1.2)]"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
      <div className="absolute inset-0 bg-backdrop-veil" />
    </div>
  );
}
