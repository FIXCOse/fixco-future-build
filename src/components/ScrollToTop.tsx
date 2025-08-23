import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (hash) {
      // Handle anchor links - let browser handle scrolling to element
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    } else {
      // Scroll to top for normal navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Focus main element for accessibility and to prevent iOS "stuck" behavior
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).focus?.();
      }
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;