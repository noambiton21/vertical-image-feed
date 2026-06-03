import { useState } from 'react';
import type { Photo } from '../types/photo.js';
import { LikeButton } from './LikeButton.js';

interface PhotoSlideProps {
  photo: Photo;
}

export function PhotoSlide({ photo }: PhotoSlideProps) {
  const [liked, setLiked] = useState(photo.liked);

  return (
    <section className="relative h-[100dvh] w-full flex-shrink-0 snap-start snap-always overflow-hidden bg-slide-bg">
      <img
        src={photo.url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-0 bg-slide-overlay" />

      <div className="absolute bottom-[26px] right-[18px]">
        <LikeButton liked={liked} onToggle={() => setLiked((prev) => !prev)} />
      </div>
    </section>
  );
}
