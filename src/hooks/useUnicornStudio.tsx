import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void;
      isInitialized: boolean;
    };
  }
}

export const useUnicornStudio = (projectId: string, enabled: boolean = true) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // Check if script already loaded
    if (scriptLoadedRef.current || window.UnicornStudio?.isInitialized) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js';
    script.async = true;
    
    script.onload = () => {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
      scriptLoadedRef.current = true;
    };

    document.body.appendChild(script);

    return () => {
      // Script stays loaded for performance
    };
  }, [projectId, enabled]);

  return containerRef;
};
