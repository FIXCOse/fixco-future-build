import { useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { useScrollSmootherStore } from '@/stores/scrollSmootherStore';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const { smoother } = useScrollSmootherStore();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Use useLayoutEffect for immediate scroll before paint
  useLayoutEffect(() => {
    if (hash) {
      // Handle anchor links
      const element = document.querySelector(hash);
      if (element) {
        if (smoother) {
          smoother.scrollTo(element, true, 'top top');
        } else {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }
    } else {
      // Scroll to top - use ScrollSmoother if available
      if (smoother) {
        smoother.scrollTo(0, true); // true = immediate (no animation)
      }
      
      // Always also do native scroll as fallback/supplement
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also scroll the smooth-content container
      const smoothContent = document.getElementById('smooth-content');
      if (smoothContent) {
        smoothContent.scrollTop = 0;
      }
      
      // Focus main element for accessibility
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).focus?.();
      }
    }
  }, [pathname, hash, smoother]);

  return null;
};

export default ScrollToTop;