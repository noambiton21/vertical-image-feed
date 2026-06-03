import { useEffect, useState } from 'react';
import { Breakpoint } from '../constants.js';

export type Layout = 'mobile' | 'tablet' | 'desktop';

function layoutForWidth(width: number): Layout {
  if (width >= Breakpoint.desktop) return 'desktop';
  if (width >= Breakpoint.tablet) return 'tablet';
  return 'mobile';
}

export function useBreakpoint(): Layout {
  const [layout, setLayout] = useState<Layout>(() =>
    typeof window === 'undefined' ? 'mobile' : layoutForWidth(window.innerWidth),
  );

  useEffect(() => {
    function onResize() {
      setLayout(layoutForWidth(window.innerWidth));
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return layout;
}
