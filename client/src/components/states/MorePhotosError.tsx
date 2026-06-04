import { useTranslation } from 'react-i18next';
import type { ApiErrorCode } from '../../lib/api';

interface MorePhotosErrorProps {
  code?: ApiErrorCode;
  retrying: boolean;
  onRetry: () => void;
}

function messageKeyForCode(code: ApiErrorCode | undefined): string {
  if (code === 'RATE_LIMITED') return 'morePhotosError.rateLimited';
  return 'morePhotosError.generic';
}

export function MorePhotosError({ code, retrying, onRetry }: MorePhotosErrorProps) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="flex h-[100dvh] snap-start flex-col items-center justify-center gap-[14px] bg-bg px-10 text-center"
    >
      <p className="max-w-[280px] text-[15px] leading-normal text-white/60">
        {t(messageKeyForCode(code))}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="cursor-pointer rounded-full border-[1.5px] border-white/25 bg-white/6 px-[26px] py-[11px] text-[14px] font-bold text-white disabled:cursor-default disabled:opacity-50"
      >
        {retrying ? t('morePhotosError.loading') : t('morePhotosError.retry')}
      </button>
    </div>
  );
}
