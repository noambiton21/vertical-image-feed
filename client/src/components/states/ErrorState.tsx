import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApiErrorCode } from '../../lib/api';
import { CenteredState } from './CenteredState';

interface ErrorStateProps {
  code?: ApiErrorCode;
  onRetry: () => void;
}

function messageKeyForCode(code: ApiErrorCode | undefined): string {
  if (code === 'RATE_LIMITED') return 'errorState.rateLimited';
  return 'errorState.generic';
}

export function ErrorState({ code, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  const [spins, setSpins] = useState(0);

  function handleRetry() {
    setSpins((s) => s + 1);
    onRetry();
  }

  return (
    <CenteredState>
      <div className="mb-[26px] flex h-[88px] w-[88px] animate-fadeUp items-center justify-center rounded-full border-[1.5px] border-accent/30 bg-accent/10">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent"
        >
          <path d="M22 12a10 10 0 1 1-3.3-7.4" />
          <path d="M22 4v5h-5" />
        </svg>
      </div>
      <div className="mb-[9px] animate-fadeUp text-[21px] font-bold [animation-delay:50ms]">
        {t('errorState.title')}
      </div>
      <div className="max-w-[290px] animate-fadeUp text-[15px] leading-normal text-white/60 [animation-delay:100ms]">
        {t(messageKeyForCode(code))}
      </div>
      <button
        type="button"
        onClick={handleRetry}
        className="mt-[26px] flex animate-fadeUp cursor-pointer items-center gap-[9px] rounded-full border-[1.5px] border-white/25 bg-white/6 px-[30px] py-[13px] text-[15px] font-bold text-white [animation-delay:150ms]"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-500"
          style={{ transform: `rotate(${spins * 360}deg)` }}
        >
          <path d="M21 12a9 9 0 1 1-2.6-6.4" />
          <path d="M21 3v5h-5" />
        </svg>
        {t('errorState.retry')}
      </button>
    </CenteredState>
  );
}
