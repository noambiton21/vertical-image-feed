import { useEffect, type RefObject } from 'react';

export function useArrowKeyScroll(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const el = containerRef.current;
      if (!el) return;

      let direction = 0;
      if (event.key === 'ArrowDown' || event.key === 'PageDown') direction = 1;
      else if (event.key === 'ArrowUp' || event.key === 'PageUp') direction = -1;
      else return;

      event.preventDefault();
      el.scrollBy({ top: direction * el.clientHeight, behavior: 'smooth' });
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [containerRef]);
}
