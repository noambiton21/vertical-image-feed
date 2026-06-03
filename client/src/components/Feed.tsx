import { useRef } from 'react';
import { usePhotosFeed } from '../hooks/usePhotosFeed.js';
import { useArrowKeyScroll } from '../hooks/useArrowKeyScroll.js';
import { PhotoSlide } from './PhotoSlide.js';
import { FeedMessage } from './FeedMessage.js';

export function Feed() {
  const { photos, isLoading, isError } = usePhotosFeed();
  const containerRef = useRef<HTMLDivElement>(null);
  useArrowKeyScroll(containerRef);

  if (isLoading) return <FeedMessage>Loading…</FeedMessage>;
  if (isError) return <FeedMessage>Couldn’t load the feed.</FeedMessage>;
  if (photos.length === 0) return <FeedMessage>No photos to show.</FeedMessage>;

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-[100dvh] snap-y snap-mandatory overflow-y-scroll"
    >
      {photos.map((photo) => (
        <PhotoSlide key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
