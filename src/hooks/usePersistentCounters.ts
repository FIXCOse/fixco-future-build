import { useState, useEffect, useCallback, useRef } from 'react';

interface CounterConfig {
  key: string;
  target: number;
  duration?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut';
  onComplete?: () => void;
}

interface CounterState {
  [key: string]: {
    value: number;
    isAnimating: boolean;
    hasAnimated: boolean;
  };
}

const STORAGE_PREFIX = 'fixco-counters-';

const usePersistentCounters = (sectionId: string) => {
  const [counters, setCounters] = useState<CounterState>({});
  const animationRefs = useRef<{ [key: string]: number }>({});
  const storageKey = `${STORAGE_PREFIX}${sectionId}`;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load persisted state on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsedState = JSON.parse(stored);
        setCounters(parsedState);
      }
    } catch (error) {
      console.warn('Error loading counter state:', error);
    }
  }, [storageKey]);

  // Save state to sessionStorage whenever counters change
  useEffect(() => {
    if (Object.keys(counters).length > 0) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(counters));
      } catch (error) {
        console.warn('Error saving counter state:', error);
      }
    }
  }, [counters, storageKey]);

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };

  // Animate a single counter
  const animateCounter = useCallback((config: CounterConfig) => {
    const { key, target, duration = 1200, easing = 'easeOut', onComplete } = config;
    
    // Check if already animated
    const currentState = counters[key];
    if (currentState?.hasAnimated) {
      return;
    }

    // If reduced motion, set target immediately
    if (prefersReducedMotion) {
      setCounters(prev => ({
        ...prev,
        [key]: {
          value: target,
          isAnimating: false,
          hasAnimated: true
        }
      }));
      onComplete?.();
      return;
    }

    // Cancel any existing animation for this key
    if (animationRefs.current[key]) {
      cancelAnimationFrame(animationRefs.current[key]);
    }

    // Set initial animation state
    setCounters(prev => ({
      ...prev,
      [key]: {
        value: currentState?.value || 0,
        isAnimating: true,
        hasAnimated: false
      }
    }));

    const startTime = performance.now();
    const startValue = currentState?.value || 0;
    const easingFunction = easingFunctions[easing];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunction(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      setCounters(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: currentValue
        }
      }));

      if (progress < 1) {
        animationRefs.current[key] = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setCounters(prev => ({
          ...prev,
          [key]: {
            value: target,
            isAnimating: false,
            hasAnimated: true
          }
        }));
        delete animationRefs.current[key];
        onComplete?.();
        
        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'counter_animation_complete', {
            section_id: sectionId,
            counter_key: key,
            target_value: target,
            duration: duration
          });
        }
      }
    };

    animationRefs.current[key] = requestAnimationFrame(animate);
  }, [counters, prefersReducedMotion, sectionId]);

  // Animate multiple counters with staggered start
  const animateCounters = useCallback((configs: CounterConfig[], staggerDelay = 150) => {
    configs.forEach((config, index) => {
      setTimeout(() => {
        animateCounter(config);
      }, index * staggerDelay);
    });
  }, [animateCounter]);

  // Get current counter value
  const getCounterValue = useCallback((key: string) => {
    return counters[key]?.value || 0;
  }, [counters]);

  // Check if counter has animated
  const hasCounterAnimated = useCallback((key: string) => {
    return counters[key]?.hasAnimated || false;
  }, [counters]);

  // Check if any counter is animating
  const isAnyCounterAnimating = useCallback(() => {
    return Object.values(counters).some(counter => counter.isAnimating);
  }, [counters]);

  // Reset all counters (useful for testing)
  const resetCounters = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
      setCounters({});
      Object.values(animationRefs.current).forEach(ref => {
        cancelAnimationFrame(ref);
      });
      animationRefs.current = {};
    } catch (error) {
      console.warn('Error resetting counters:', error);
    }
  }, [storageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(animationRefs.current).forEach(ref => {
        cancelAnimationFrame(ref);
      });
    };
  }, []);

  return {
    counters,
    animateCounter,
    animateCounters,
    getCounterValue,
    hasCounterAnimated,
    isAnyCounterAnimating,
    resetCounters,
    prefersReducedMotion
  };
};

export default usePersistentCounters;
export type { CounterConfig, CounterState };