import { useTranslation } from 'react-i18next';

export function EndOfFeed() {
  const { t } = useTranslation();
  return (
    <div className="grid h-[100dvh] snap-start place-items-center bg-bg text-sm text-white/40">
      {t('endOfFeed.message')}
    </div>
  );
}
