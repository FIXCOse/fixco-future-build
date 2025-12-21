import { useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { ScrollSmoother } from '@/lib/gsap';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // Get ScrollSmoother instance directly via GSAP's static method
    const smoother = ScrollSmoother.get();

    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        if (smoother) {
          smoother.scrollTo(element, false, 'top top');
        } else {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }
    } else {
      // Use scrollTop(0) for IMMEDIATE scroll without animation
      if (smoother) {
        smoother.scrollTop(0);
      }
      
      // Fallback
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;