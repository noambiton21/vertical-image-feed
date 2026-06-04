import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhotosFeed } from '../hooks/api/usePhotosFeed';
import { useArrowKeyScroll } from '../hooks/utils/useArrowKeyScroll';
import { useIntersection } from '../hooks/utils/useIntersection';
import { useBreakpoint } from '../hooks/utils/useBreakpoint';
import { useCurrentSlide } from '../hooks/utils/useCurrentSlide';
import { usePreloadNext } from '../hooks/utils/usePreloadNext';
import { useToggleLike } from '../hooks/api/useToggleLike';
import { useToast } from '../hooks/utils/useToast';
import { SENTINEL_LOOKAHEAD_SLIDES } from '../constants';
import { PhotoSlide } from './PhotoSlide';
import { FeedLayout } from './FeedLayout';
import { Toast } from './Toast';
import { FeedSkeleton } from './states/FeedSkeleton';
import { EmptyState } from './states/EmptyState';
import { ErrorState } from './states/ErrorState';
import { EndOfFeed } from './states/EndOfFeed';
import { MorePhotosError } from './states/MorePhotosError';

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
  const { layout, isDesktop } = useBreakpoint();
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
