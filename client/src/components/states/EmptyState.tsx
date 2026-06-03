import { CenteredState } from './CenteredState.js';

export function EmptyState() {
  return (
    <CenteredState>
      <div className="mb-[26px] flex h-[88px] w-[88px] animate-fadeUp items-center justify-center rounded-[26px] border-[1.5px] border-white/12 bg-white/5">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="8.5" cy="8.5" r="1.8" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <div className="mb-[9px] animate-fadeUp text-[21px] font-bold [animation-delay:50ms]">
        No photos to show
      </div>
      <div className="max-w-[280px] animate-fadeUp text-[15px] leading-normal text-white/60 [animation-delay:100ms]">
        There’s nothing in the feed right now. Check back in a little while.
      </div>
    </CenteredState>
  );
}
