import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useScrollSmootherStore } from '@/stores/scrollSmootherStore';

export const useScrollLock = (isLocked: boolean) => {
  const { pause, resume } = useScrollSmootherStore();

  useEffect(() => {
    if (!isLocked) return;

    // Spara nuvarande scroll position och stilar
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // KRITISKT: Inaktivera normalizeScroll helt för att frigöra touch events
    ScrollTrigger.normalizeScroll(false);

    // Pausa ScrollSmoother
    pause();

    // Lås body scroll med iOS-säker metod
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // Återaktivera normalizeScroll
      ScrollTrigger.normalizeScroll(true);

      // Återställ ScrollSmoother
      resume();

      // Återställ body stilar
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // Återställ scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isLocked, pause, resume]);
};
