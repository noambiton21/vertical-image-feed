import { useRef } from 'react';
import { usePhotosFeed } from '../hooks/usePhotosFeed.js';
import { useArrowKeyScroll } from '../hooks/useArrowKeyScroll.js';
import { useIntersection } from '../hooks/useIntersection.js';
import { SENTINEL_LOOKAHEAD_SLIDES } from '../constants.js';
import { PhotoSlide } from './PhotoSlide.js';
import { FeedMessage } from './FeedMessage.js';
import { EndOfFeed } from './states/EndOfFeed.js';

export function Feed() {
  const { photos, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePhotosFeed();
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useArrowKeyScroll(containerRef);

  useIntersection(sentinelRef, {
    root: containerRef,
    rootMargin: `${SENTINEL_LOOKAHEAD_SLIDES * 100}% 0px`,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

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
      {hasNextPage ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : <EndOfFeed />}
    </div>
  );
}
