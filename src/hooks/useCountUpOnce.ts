import { useState, useEffect, useRef, useCallback } from 'react';

interface CountUpConfig {
  key: string;
  from?: number;
  to: number;
  duration?: number;
  formatter?: (value: number) => string;
}

interface CountUpResult {
  value: string | number;
  isAnimating: boolean;
  hasAnimated: boolean;
  observe: (element: HTMLElement | null) => void;
}

const STORAGE_PREFIX = 'ac3_metric_';

const useCountUpOnce = (config: CountUpConfig): CountUpResult => {
  const { key, from = 0, to, duration = 900, formatter } = config;
  const [value, setValue] = useState<number>(from);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Refs for StrictMode protection
  const startedRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  
  const storageKey = `${STORAGE_PREFIX}${key}`;
  
  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.done) {
          setValue(to);
          setHasAnimated(true);
          hasAnimatedRef.current = true;
          return;
        }
      }
    } catch (error) {
      console.warn(`Error loading counter state for ${key}:`, error);
    }
  }, [storageKey, to, key]);

  // Animation function
  const animate = useCallback((startTime: number, startValue: number) => {
    if (hasAnimatedRef.current) return;

    const animateFrame = (currentTime: number) => {
      if (hasAnimatedRef.current) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Time-based easing (easeOut)
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = ease(progress);
      
      const currentValue = startValue + (to - startValue) * easedProgress;
      setValue(currentValue);
      
      if (progress >= 1) {
        // Animation complete
        setValue(to);
        setIsAnimating(false);
        setHasAnimated(true);
        hasAnimatedRef.current = true;
        
        // Persist to sessionStorage
        try {
          sessionStorage.setItem(storageKey, JSON.stringify({ value: to, done: true }));
        } catch (error) {
          console.warn(`Error saving counter state for ${key}:`, error);
        }
        
        // Cleanup
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
      } else {
        // Continue animation
        animationIdRef.current = requestAnimationFrame(animateFrame);
      }
    };

    animationIdRef.current = requestAnimationFrame(animateFrame);
  }, [duration, to, storageKey, key]);

  // Start animation
  const startAnimation = useCallback(() => {
    if (startedRef.current || hasAnimatedRef.current || prefersReducedMotion) {
      if (prefersReducedMotion) {
        setValue(to);
        setHasAnimated(true);
        hasAnimatedRef.current = true;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify({ value: to, done: true }));
        } catch (error) {
          console.warn(`Error saving counter state for ${key}:`, error);
        }
      }
      return;
    }

    startedRef.current = true;
    setIsAnimating(true);
    animate(performance.now(), value);
  }, [animate, prefersReducedMotion, to, storageKey, key, value]);

  // Setup IntersectionObserver
  useEffect(() => {
    if (hasAnimatedRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          startAnimation();
          // Unobserve immediately after triggering
          if (observerRef.current && entry.target) {
            observerRef.current.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.25,
        rootMargin: '120px 0px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [startAnimation]);

  // Expose element ref for manual observation
  const observe = useCallback((element: HTMLElement | null) => {
    if (!element || hasAnimatedRef.current) return;
    
    elementRef.current = element;
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Format the display value
  const displayValue = formatter ? formatter(Math.round(value)) : Math.round(value);

  return {
    value: displayValue,
    isAnimating,
    hasAnimated,
    observe
  };
};

export default useCountUpOnce;