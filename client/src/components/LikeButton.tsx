import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HEART_ICON_SIZE } from '../constants';
import { HeartIcon } from './HeartIcon';

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  dark?: boolean;
}

export function LikeButton({ liked, onToggle, dark = false }: LikeButtonProps) {
  const { t } = useTranslation();
  const [popKey, setPopKey] = useState(0);

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();
    if (!liked) setPopKey((key) => key + 1);
    onToggle();
  }

  const surface = dark
    ? 'bg-white/6 p-[14px]'
    : 'bg-transparent p-0 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? t('likeButton.unlike') : t('likeButton.like')}
      aria-pressed={liked}
      className={`flex cursor-pointer items-center justify-center rounded-full border-none transition-transform active:scale-90 ${surface} ${liked ? 'text-accent' : 'text-white'}`}
    >
      <span key={popKey} className={popKey ? 'block animate-heartPop' : 'block'}>
        <HeartIcon size={HEART_ICON_SIZE} filled={liked} />
      </span>
    </button>
  );
}
