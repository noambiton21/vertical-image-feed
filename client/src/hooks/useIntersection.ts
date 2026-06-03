import { useEffect, type RefObject } from 'react';

interface UseIntersectionOptions {
  root: RefObject<HTMLElement | null>;
  rootMargin?: string;
  enabled?: boolean;
  onIntersect: () => void;
}

export function useIntersection(
  target: RefObject<HTMLElement | null>,
  { root, rootMargin, enabled = true, onIntersect }: UseIntersectionOptions,
) {
  useEffect(() => {
    const targetEl = target.current;
    const rootEl = root.current;
    if (!targetEl || !rootEl || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { root: rootEl, rootMargin },
    );
    observer.observe(targetEl);

    return () => observer.disconnect();
  }, [target, root, rootMargin, enabled, onIntersect]);
}
