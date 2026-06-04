import { useRef } from 'react';
import { DOUBLE_TAP_WINDOW_MS } from '../constants';

export function useDoubleTap(onDoubleTap: () => void) {
  const lastTap = useRef(0);

  return () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_WINDOW_MS) {
      lastTap.current = 0;
      onDoubleTap();
    } else {
      lastTap.current = now;
    }
  };
}
