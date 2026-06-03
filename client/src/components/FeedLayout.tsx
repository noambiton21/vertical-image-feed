import { FEED_COLUMN_WIDTH } from '../constants.js';
import type { Layout } from '../hooks/useBreakpoint.js';
import type { Photo } from '../types/photo.js';
import { FeedBackdrop } from './FeedBackdrop.js';
import { LikeButton } from './LikeButton.js';

interface FeedLayoutProps {
  layout: Layout;
  current: Photo;
  currentLiked: boolean;
  onToggleCurrent: () => void;
  children: React.ReactNode;
}

export function FeedLayout({
  layout,
  current,
  currentLiked,
  onToggleCurrent,
  children,
}: FeedLayoutProps) {
  if (layout === 'mobile') {
    return <div className="h-[100dvh] w-full bg-bg">{children}</div>;
  }

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-bg">
      <FeedBackdrop url={current.url} />

      <div
        className="relative h-[calc(100%-44px)] overflow-hidden rounded-[30px] bg-bg shadow-[0_30px_90px_rgba(0,0,0,.6),0_0_0_1px_rgba(255,255,255,.06)]"
        style={{ width: FEED_COLUMN_WIDTH }}
      >
        {children}
      </div>

      {layout === 'desktop' && (
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `calc(50% + ${FEED_COLUMN_WIDTH / 2}px + 30px)` }}
        >
          <LikeButton liked={currentLiked} onToggle={onToggleCurrent} dark />
        </div>
      )}
    </div>
  );
}
