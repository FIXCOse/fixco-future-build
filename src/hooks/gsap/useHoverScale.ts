import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface UseHoverScaleOptions {
  scale?: number;
  duration?: number;
}

export const useHoverScale = (options: UseHoverScaleOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const { scale = 1.05, duration = 0.3 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const onMouseEnter = () => {
      gsap.to(element, {
        scale,
        duration,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [scale, duration]);

  return elementRef;
};
