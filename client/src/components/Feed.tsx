import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhotosFeed } from '../hooks/usePhotosFeed.js';
import { useArrowKeyScroll } from '../hooks/useArrowKeyScroll.js';
import { useIntersection } from '../hooks/useIntersection.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useCurrentSlide } from '../hooks/useCurrentSlide.js';
import { usePreloadNext } from '../hooks/usePreloadNext.js';
import { useToggleLike } from '../hooks/useToggleLike.js';
import { useToast } from '../hooks/useToast.js';
import { SENTINEL_LOOKAHEAD_SLIDES } from '../constants.js';
import { PhotoSlide } from './PhotoSlide.js';
import { FeedLayout } from './FeedLayout.js';
import { Toast } from './Toast.js';
import { FeedSkeleton } from './states/FeedSkeleton.js';
import { EmptyState } from './states/EmptyState.js';
import { ErrorState } from './states/ErrorState.js';
import { EndOfFeed } from './states/EndOfFeed.js';
import { MorePhotosError } from './states/MorePhotosError.js';

export function Feed() {
  const { t } = useTranslation();
  const {
    photos,
    isLoading,
    isError,
    errorCode,
    nextPageError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePhotosFeed();
  const layout = useBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { currentIndex, onScroll } = useCurrentSlide(containerRef, photos.length);
  const toast = useToast();
  const toggleLike = useToggleLike(() => toast.show(t('feed.likeError')));

  usePreloadNext(photos, currentIndex);

  const handleToggle = (id: string, liked: boolean) => toggleLike.mutate({ id, liked: !liked });
  const handleLike = (id: string) => toggleLike.mutate({ id, liked: true });

  useArrowKeyScroll(containerRef);
  useIntersection(sentinelRef, {
    root: containerRef,
    rootMargin: `${SENTINEL_LOOKAHEAD_SLIDES * 100}% 0px`,
    enabled: hasNextPage && !isFetchingNextPage && !nextPageError,
    onIntersect: fetchNextPage,
  });

  if (isLoading) return <FeedSkeleton />;
  if (isError) return <ErrorState code={errorCode} onRetry={() => refetch()} />;
  if (photos.length === 0) return <EmptyState />;

  const isDesktop = layout === 'desktop';

  const scroller = (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="hide-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll"
    >
      {photos.map((photo) => (
        <PhotoSlide
          key={photo.id}
          photo={photo}
          liked={photo.liked}
          onToggle={() => handleToggle(photo.id, photo.liked)}
          onLike={() => handleLike(photo.id)}
          showControls={!isDesktop}
        />
      ))}
      {nextPageError ? (
        <MorePhotosError
          code={nextPageError}
          retrying={isFetchingNextPage}
          onRetry={() => fetchNextPage()}
        />
      ) : hasNextPage ? (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      ) : (
        <EndOfFeed />
      )}
    </div>
  );

  const current = photos[currentIndex] ?? photos[0];
  return (
    <FeedLayout
      layout={layout}
      current={current}
      currentLiked={current.liked}
      onToggleCurrent={() => handleToggle(current.id, current.liked)}
      overlay={toast.message ? <Toast message={toast.message} /> : null}
    >
      {scroller}
    </FeedLayout>
  );
}
