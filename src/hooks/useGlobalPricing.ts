import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type PricingMode = 'ordinarie' | 'rot' | 'rut';

interface PricingState {
  mode: PricingMode;
  loading: boolean;
  error?: string;
}

const PRICING_STORAGE_KEY = 'fixco-pricing-mode';
const PRICING_URL_PARAM = 'price';

const useGlobalPricing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pricingState, setPricingState] = useState<PricingState>({
    mode: 'rot',
    loading: true
  });

  // Initialize pricing state from URL or localStorage
  useEffect(() => {
    try {
      // Priority: URL param > localStorage > default (ROT)
      const urlParam = searchParams.get(PRICING_URL_PARAM) as PricingMode;
      const storedValue = localStorage.getItem(PRICING_STORAGE_KEY) as PricingMode;
      
      let initialValue: PricingMode = 'rot'; // Default to ROT
      
      if (urlParam && ['ordinarie', 'rot', 'rut'].includes(urlParam)) {
        initialValue = urlParam;
      } else if (storedValue && ['ordinarie', 'rot', 'rut'].includes(storedValue)) {
        initialValue = storedValue;
      }
      
      setPricingState({
        mode: initialValue,
        loading: false
      });
      
      // Don't sync URL automatically on page load - keeps clean URLs
      // URL parameter will only be added when user actively changes mode via toggle
      
    } catch (error) {
      console.warn('Error initializing pricing state:', error);
      setPricingState({
        mode: 'rot',
        loading: false,
        error: 'Failed to load pricing preference'
      });
    }
  }, []);

  // Set pricing mode
  const setPricingMode = useCallback((mode: PricingMode) => {
    try {
      // Update local state
      setPricingState(prev => ({
        ...prev,
        mode,
        error: undefined
      }));
      
      // Persist to localStorage
      localStorage.setItem(PRICING_STORAGE_KEY, mode);
      
      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PRICING_URL_PARAM, mode);
      setSearchParams(newParams, { replace: true });
      
      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pricing_mode_change', {
          pricing_mode: mode,
          source: 'global_toggle'
        });
      }
      
    } catch (error) {
      console.error('Error setting pricing mode:', error);
      setPricingState(prev => ({
        ...prev,
        error: 'Failed to update pricing preference'
      }));
    }
  }, [searchParams, setSearchParams]);

  // Format pricing with current mode
  const formatPrice = useCallback((basePrice: number, rotPrice?: number, rutPrice?: number) => {
    const mode = pricingState.mode;
    
    if (mode === 'ordinarie') {
      return {
        display: `${basePrice.toLocaleString('sv-SE')} kr/h`,
        amount: basePrice,
        mode: 'ordinarie' as const,
        badge: null
      };
    }
    
    if (mode === 'rot' && rotPrice) {
      return {
        display: `${rotPrice.toLocaleString('sv-SE')} kr/h`,
        originalDisplay: `${basePrice.toLocaleString('sv-SE')} kr/h`,
        amount: rotPrice,
        originalAmount: basePrice,
        savings: basePrice - rotPrice,
        savingsPercent: Math.round(((basePrice - rotPrice) / basePrice) * 100),
        mode: 'rot' as const,
        badge: 'ROT'
      };
    }
    
    if (mode === 'rut' && rutPrice) {
      return {
        display: `${rutPrice.toLocaleString('sv-SE')} kr/h`,
        originalDisplay: `${basePrice.toLocaleString('sv-SE')} kr/h`,
        amount: rutPrice,
        originalAmount: basePrice,
        savings: basePrice - rutPrice,
        savingsPercent: Math.round(((basePrice - rutPrice) / basePrice) * 100),
        mode: 'rut' as const,
        badge: 'RUT'
      };
    }
    
    // Fallback to base price if no special pricing available
    return {
      display: `${basePrice.toLocaleString('sv-SE')} kr/h`,
      amount: basePrice,
      mode: 'ordinarie' as const,
      badge: null
    };
  }, [pricingState.mode]);

  // Get pricing object for display components
  const getPricing = useCallback((basePrice: number, rotPrice?: number, rutPrice?: number) => {
    const formatted = formatPrice(basePrice, rotPrice, rutPrice);
    
    return {
      ...formatted,
      className: formatted.badge ? 'text-green-400' : 'text-foreground'
    };
  }, [formatPrice]);

  // Check if current service supports current pricing mode
  const isEligibleForCurrentMode = useCallback((rotEligible: boolean = false, rutEligible: boolean = false) => {
    const mode = pricingState.mode;
    if (mode === 'ordinarie') return true;
    if (mode === 'rot') return rotEligible;
    if (mode === 'rut') return rutEligible;
    return false;
  }, [pricingState.mode]);

  return {
    // Current state
    pricingMode: pricingState.mode,
    pricingLoading: pricingState.loading,
    pricingError: pricingState.error,
    
    // Mode checkers
    isOrdinarie: pricingState.mode === 'ordinarie',
    isROT: pricingState.mode === 'rot',
    isRUT: pricingState.mode === 'rut',
    
    // Legacy compatibility
    rotEnabled: pricingState.mode === 'rot',
    
    // Actions
    setPricingMode,
    setOrdinarie: () => setPricingMode('ordinarie'),
    setROT: () => setPricingMode('rot'),
    setRUT: () => setPricingMode('rut'),
    
    // Utilities
    formatPrice,
    getPricing,
    isEligibleForCurrentMode,
    
    // For components that need to react to pricing changes
    pricingState: pricingState.mode
  };
};

export default useGlobalPricing;
export type { PricingState };