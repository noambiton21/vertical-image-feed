import { Layout } from '../hooks/useBreakpoint';
import type { Photo } from '../types/photo';
import { FeedBackdrop } from './FeedBackdrop';
import { LikeButton } from './LikeButton';

interface FeedLayoutProps {
  layout: Layout;
  current: Photo;
  currentLiked: boolean;
  onToggleCurrent: () => void;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

export function FeedLayout({
  layout,
  current,
  currentLiked,
  onToggleCurrent,
  overlay,
  children,
}: FeedLayoutProps) {
  if (layout === Layout.Mobile) {
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-bg">
        {children}
        {overlay}
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-bg">
      <FeedBackdrop blurHash={current.blurHash} />

      <div className="relative h-[calc(100%-44px)] w-[462px] overflow-hidden rounded-[30px] bg-bg shadow-[0_30px_90px_rgba(0,0,0,.6),0_0_0_1px_rgba(255,255,255,.06)]">
        {children}
      </div>

      {layout === Layout.Desktop && (
        <div className="absolute top-1/2 left-[calc(50%+261px)] -translate-y-1/2">
          <LikeButton liked={currentLiked} onToggle={onToggleCurrent} dark />
        </div>
      )}

      {overlay}
    </div>
  );
}
