import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PriceMode = 'all' | 'rot' | 'rut';
export type EligibilityFilter = 'all' | 'rot' | 'rut';

interface PriceState {
  mode: PriceMode;
  eligibilityFilter: EligibilityFilter;
  setMode: (mode: PriceMode) => void;
  initFromUrlOrStorage: () => void;
  // Helper to check if a service should be shown based on current filter
  shouldShowService: (eligible: { rot: boolean; rut: boolean }) => boolean;
}

export const usePriceStore = create<PriceState>()(
  persist(
    (set, get) => ({
      mode: 'rot', // Default to show ROT services with discounted prices
      eligibilityFilter: 'rot', // Derived from mode

      setMode: (mode: PriceMode) => {
        // Set both mode and eligibility filter
        const eligibilityFilter: EligibilityFilter = 
          mode === 'all' ? 'all' : mode;
        
        set({ mode, eligibilityFilter });
        
        // Update URL parameter without reload
        const url = new URL(window.location.href);
        if (mode === 'all') {
          url.searchParams.delete('price');
        } else {
          url.searchParams.set('price', mode);
        }
        window.history.replaceState({}, '', url.toString());
        
        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'pricing_mode_change', {
            pricing_mode: mode,
            source: 'global_toggle'
          });
        }
      },

      shouldShowService: (eligible: { rot: boolean; rut: boolean }) => {
        const { eligibilityFilter } = get();
        
        if (eligibilityFilter === 'all') return true;
        if (eligibilityFilter === 'rot') return eligible.rot;
        if (eligibilityFilter === 'rut') return eligible.rut;
        return true;
      },

      initFromUrlOrStorage: () => {
        // Priority: URL param > localStorage > default (rot)
        const urlParams = new URLSearchParams(window.location.search);
        const urlMode = urlParams.get('price') as PriceMode;
        
        if (urlMode && ['all', 'rot', 'rut'].includes(urlMode)) {
          const eligibilityFilter: EligibilityFilter = 
            urlMode === 'all' ? 'all' : urlMode;
          set({ mode: urlMode, eligibilityFilter });
        } else {
          // If no URL param, keep whatever is in localStorage (handled by persist middleware)
          // But ensure eligibility filter is set correctly
          const currentMode = get().mode;
          const eligibilityFilter: EligibilityFilter = 
            currentMode === 'all' ? 'all' : currentMode;
          set({ eligibilityFilter });
          
          // Don't sync URL automatically on page load - keeps clean URLs
          // URL parameter will only be added when user actively changes mode via toggle
        }
      }
    }),
    {
      name: 'priceMode', // localStorage key
      partialize: (state) => ({ mode: state.mode, eligibilityFilter: state.eligibilityFilter })
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
