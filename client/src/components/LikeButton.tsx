import { useState } from 'react';
import { HEART_ICON_SIZE } from '../constants.js';
import { HeartIcon } from './HeartIcon.js';

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
}

export function LikeButton({ liked, onToggle }: LikeButtonProps) {
  const [popKey, setPopKey] = useState(0);

  function handleClick() {
    if (!liked) setPopKey((key) => key + 1);
    onToggle();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex cursor-pointer items-center justify-center border-none bg-transparent p-0 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition-transform active:scale-90 ${liked ? 'text-accent' : 'text-white'}`}
    >
      <span key={popKey} className={popKey ? 'block animate-heartPop' : 'block'}>
        <HeartIcon size={HEART_ICON_SIZE} filled={liked} />
      </span>
    </button>
  );
}
