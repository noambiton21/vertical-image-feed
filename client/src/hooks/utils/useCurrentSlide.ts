import { useRef, useState, type RefObject } from 'react';

export function useCurrentSlide(containerRef: RefObject<HTMLElement | null>, slideCount: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const raf = useRef<number | null>(null);

  function onScroll() {
    if (raf.current !== null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const el = containerRef.current;
      if (!el) return;
      const slide = Math.round(el.scrollTop / el.clientHeight);
      setCurrentIndex(Math.min(slide, slideCount - 1));
    });
  }

  return { currentIndex, onScroll };
}
