import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface UseFadeInOptions {
  duration?: number;
  delay?: number;
  from?: 'left' | 'right' | 'top' | 'bottom' | 'none';
  distance?: number;
}

export const useFadeIn = (options: UseFadeInOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const {
    duration = 0.8,
    delay = 0,
    from = 'bottom',
    distance = 30
  } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    const fromProps: any = {
      opacity: 0,
      duration,
      delay,
      ease: 'power2.out'
    };

    if (from === 'left') fromProps.x = -distance;
    else if (from === 'right') fromProps.x = distance;
    else if (from === 'top') fromProps.y = -distance;
    else if (from === 'bottom') fromProps.y = distance;

    gsap.from(elementRef.current, fromProps);
  }, [duration, delay, from, distance]);

  return elementRef;
};
