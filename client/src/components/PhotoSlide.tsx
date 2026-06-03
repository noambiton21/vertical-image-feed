import { useState } from 'react';
import type { Photo } from '../types/photo.js';
import { useDoubleTap } from '../hooks/useDoubleTap.js';
import { BlurHashImage } from './BlurHashImage.js';
import { HeartBurst } from './HeartBurst.js';
import { LikeButton } from './LikeButton.js';

interface PhotoSlideProps {
  photo: Photo;
  liked: boolean;
  onToggle: () => void;
  onLike: () => void;
  showControls?: boolean;
}

export function PhotoSlide({
  photo,
  liked,
  onToggle,
  onLike,
  showControls = true,
}: PhotoSlideProps) {
  const [burstKey, setBurstKey] = useState(0);

  const handleDoubleTap = useDoubleTap(() => {
    if (!liked) onLike();
    setBurstKey((key) => key + 1);
  });

  return (
    <section
      onClick={handleDoubleTap}
      className="relative h-full w-full flex-shrink-0 snap-start snap-always overflow-hidden bg-slide-bg"
    >
      <BlurHashImage
        src={photo.url}
        blurHash={photo.blurHash}
        alt={photo.description ?? 'Photo from the feed'}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-slide-overlay" />

      {/* each double tap remounts and replays the burst animation*/}
      {burstKey > 0 && <HeartBurst key={burstKey} />}

      {showControls && (
        <div className="absolute bottom-[26px] right-[18px]">
          <LikeButton liked={liked} onToggle={onToggle} />
        </div>
      )}
    </section>
  );
}
