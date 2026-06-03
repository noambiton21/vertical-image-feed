import { HEART_BURST_SIZE } from '../constants.js';
import { HeartIcon } from './HeartIcon.js';

export function HeartBurst() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
    >
      <div className="animate-burstHeart text-accent">
        <HeartIcon size={HEART_BURST_SIZE} filled />
      </div>
    </div>
  );
}
