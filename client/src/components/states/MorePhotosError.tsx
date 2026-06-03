import type { ApiErrorCode } from '../../lib/api.js';

interface MorePhotosErrorProps {
  code?: ApiErrorCode;
  retrying: boolean;
  onRetry: () => void;
}

function messageForCode(code: ApiErrorCode | undefined): string {
  if (code === 'RATE_LIMITED') return 'The photo service is busy. Give it a moment.';
  return 'Couldn’t load more photos.';
}

export function MorePhotosError({ code, retrying, onRetry }: MorePhotosErrorProps) {
  return (
    <div
      role="alert"
      className="flex h-[100dvh] snap-start flex-col items-center justify-center gap-[14px] bg-bg px-10 text-center"
    >
      <p className="max-w-[280px] text-[15px] leading-normal text-white/60">
        {messageForCode(code)}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="cursor-pointer rounded-full border-[1.5px] border-white/25 bg-white/6 px-[26px] py-[11px] text-[14px] font-bold text-white disabled:cursor-default disabled:opacity-50"
      >
        {retrying ? 'Loading…' : 'Try again'}
      </button>
    </div>
  );
}
