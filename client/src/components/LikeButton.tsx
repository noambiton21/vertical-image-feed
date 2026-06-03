import { useState } from 'react';
import { HEART_ICON_SIZE } from '../constants.js';
import { HeartIcon } from './HeartIcon.js';

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  dark?: boolean;
}

export function LikeButton({ liked, onToggle, dark = false }: LikeButtonProps) {
  const [popKey, setPopKey] = useState(0);

  function handleClick() {
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
      aria-label={liked ? 'Unlike photo' : 'Like photo'}
      aria-pressed={liked}
      className={`flex cursor-pointer items-center justify-center rounded-full border-none transition-transform active:scale-90 ${surface} ${liked ? 'text-accent' : 'text-white'}`}
    >
      <span key={popKey} className={popKey ? 'block animate-heartPop' : 'block'}>
        <HeartIcon size={HEART_ICON_SIZE} filled={liked} />
      </span>
    </button>
  );
}
