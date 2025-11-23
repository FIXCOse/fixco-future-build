import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface UseScaleInOptions {
  duration?: number;
  delay?: number;
  from?: number;
  ease?: string;
}

export const useScaleIn = (options: UseScaleInOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const {
    duration = 0.6,
    delay = 0,
    from = 0.8,
    ease = 'back.out(1.7)'
  } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.from(elementRef.current, {
      scale: from,
      opacity: 0,
      duration,
      delay,
      ease
    });
  }, [duration, delay, from, ease]);

  return elementRef;
};
