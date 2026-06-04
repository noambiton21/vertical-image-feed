import { useEffect, useState } from 'react';
import { Breakpoint } from '../../constants';

export enum Layout {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

export interface BreakpointState {
  layout: Layout;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

function layoutForWidth(width: number): Layout {
  if (width >= Breakpoint.desktop) return Layout.Desktop;
  if (width >= Breakpoint.tablet) return Layout.Tablet;
  return Layout.Mobile;
}

export function useBreakpoint(): BreakpointState {
  const [layout, setLayout] = useState<Layout>(() =>
    typeof window === 'undefined' ? Layout.Mobile : layoutForWidth(window.innerWidth),
  );

  useEffect(() => {
    function onResize() {
      setLayout(layoutForWidth(window.innerWidth));
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    layout,
    isMobile: layout === Layout.Mobile,
    isTablet: layout === Layout.Tablet,
    isDesktop: layout === Layout.Desktop,
  };
}
