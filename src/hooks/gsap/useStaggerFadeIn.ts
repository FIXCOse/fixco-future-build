import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface UseStaggerFadeInOptions {
  duration?: number;
  stagger?: number;
  delay?: number;
  from?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
}

export const useStaggerFadeIn = (options: UseStaggerFadeInOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const {
    duration = 0.6,
    stagger = 0.1,
    delay = 0,
    from = 'bottom',
    distance = 30
  } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.children;
    if (!children.length) return;

    const fromProps: any = {
      opacity: 0,
      duration,
      stagger,
      delay,
      ease: 'power2.out'
    };

    if (from === 'left') fromProps.x = -distance;
    else if (from === 'right') fromProps.x = distance;
    else if (from === 'top') fromProps.y = -distance;
    else if (from === 'bottom') fromProps.y = distance;

    gsap.from(children, fromProps);
  }, [duration, stagger, delay, from, distance]);

  return containerRef;
};
