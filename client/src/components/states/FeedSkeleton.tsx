import { SHIMMER_GRADIENT, SHIMMER_DURATION } from '../../constants.js';

export function FeedSkeleton() {
  return (
    <div
      aria-hidden
      className="h-full min-h-[100dvh] w-full"
      style={{
        backgroundImage: SHIMMER_GRADIENT,
        backgroundSize: '200% 100%',
        animation: `shimmer ${SHIMMER_DURATION} linear infinite`,
      }}
    />
  );
}
