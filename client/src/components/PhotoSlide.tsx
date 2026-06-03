import type { Photo } from '../types/photo.js';
import { BlurHashImage } from './BlurHashImage.js';
import { LikeButton } from './LikeButton.js';

interface PhotoSlideProps {
  photo: Photo;
  liked: boolean;
  onToggle: () => void;
  showControls?: boolean;
}

export function PhotoSlide({ photo, liked, onToggle, showControls = true }: PhotoSlideProps) {
  return (
    <section className="relative h-full w-full flex-shrink-0 snap-start snap-always overflow-hidden bg-slide-bg">
      <BlurHashImage
        src={photo.url}
        blurHash={photo.blurHash}
        alt={photo.description ?? 'Photo from the feed'}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-slide-overlay" />

      {showControls && (
        <div className="absolute bottom-[26px] right-[18px]">
          <LikeButton liked={liked} onToggle={onToggle} />
        </div>
      )}
    </section>
  );
}
