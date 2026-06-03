import { useRef } from 'react';
import { usePhotosFeed } from '../hooks/usePhotosFeed.js';
import { useArrowKeyScroll } from '../hooks/useArrowKeyScroll.js';
import { useIntersection } from '../hooks/useIntersection.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useCurrentSlide } from '../hooks/useCurrentSlide.js';
import { useLikeOverrides } from '../hooks/useLikeOverrides.js';
import { SENTINEL_LOOKAHEAD_SLIDES } from '../constants.js';
import { PhotoSlide } from './PhotoSlide.js';
import { FeedLayout } from './FeedLayout.js';
import { FeedSkeleton } from './states/FeedSkeleton.js';
import { EmptyState } from './states/EmptyState.js';
import { ErrorState } from './states/ErrorState.js';
import { EndOfFeed } from './states/EndOfFeed.js';

export function Feed() {
  const {
    photos,
    isLoading,
    isError,
    errorCode,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePhotosFeed();
  const layout = useBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { currentIndex, onScroll } = useCurrentSlide(containerRef, photos.length);
  const { isLiked, toggleLike } = useLikeOverrides();

  useArrowKeyScroll(containerRef);
  useIntersection(sentinelRef, {
    root: containerRef,
    rootMargin: `${SENTINEL_LOOKAHEAD_SLIDES * 100}% 0px`,
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  if (isLoading) return <FeedSkeleton />;
  if (isError) return <ErrorState code={errorCode} onRetry={() => refetch()} />;
  if (photos.length === 0) return <EmptyState />;

  const isColumn = layout === 'tablet' || layout === 'desktop';
  const isDesktop = layout === 'desktop';

  const scroller = (
    <div
      ref={containerRef}
      onScroll={isColumn ? onScroll : undefined}
      className="hide-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll"
    >
      {photos.map((photo) => (
        <PhotoSlide
          key={photo.id}
          photo={photo}
          liked={isLiked(photo.id, photo.liked)}
          onToggle={() => toggleLike(photo.id, photo.liked)}
          showControls={!isDesktop}
        />
      ))}
      {hasNextPage ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : <EndOfFeed />}
    </div>
  );

  const current = photos[currentIndex] ?? photos[0];
  return (
    <FeedLayout
      layout={layout}
      current={current}
      currentLiked={isLiked(current.id, current.liked)}
      onToggleCurrent={() => toggleLike(current.id, current.liked)}
    >
      {scroller}
    </FeedLayout>
  );
}
