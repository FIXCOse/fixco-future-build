import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PriceMode = 'ordinary' | 'rot' | 'rut';

interface PriceState {
  mode: PriceMode;
  setMode: (mode: PriceMode) => void;
  initFromUrlOrStorage: () => void;
}

export const usePriceStore = create<PriceState>()(
  persist(
    (set, get) => ({
      mode: 'rot', // Default to ROT

      setMode: (mode: PriceMode) => {
        set({ mode });
        
        // Update URL parameter
        const url = new URL(window.location.href);
        url.searchParams.set('price', mode);
        window.history.replaceState({}, '', url.toString());
        
        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'pricing_mode_change', {
            pricing_mode: mode,
            source: 'global_toggle'
          });
        }
      },

      initFromUrlOrStorage: () => {
        // Priority: URL param > localStorage > default (ROT)
        const urlParams = new URLSearchParams(window.location.search);
        const urlMode = urlParams.get('price') as PriceMode;
        
        if (urlMode && ['ordinary', 'rot', 'rut'].includes(urlMode)) {
          set({ mode: urlMode });
        } else {
          // If no URL param, keep whatever is in localStorage (handled by persist middleware)
          // But ensure URL is synced
          const currentMode = get().mode;
          const url = new URL(window.location.href);
          url.searchParams.set('price', currentMode);
          window.history.replaceState({}, '', url.toString());
        }
      }
    }),
    {
      name: 'priceMode', // localStorage key
      partialize: (state) => ({ mode: state.mode })
    }
  )
);

// Initialize on app load
if (typeof window !== 'undefined') {
  // Wait for next tick to ensure URL is available
  setTimeout(() => {
    usePriceStore.getState().initFromUrlOrStorage();
  }, 0);
}
