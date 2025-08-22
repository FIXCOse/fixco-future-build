import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ROTState {
  enabled: boolean;
  loading: boolean;
  error?: string;
}

const ROT_STORAGE_KEY = 'fixco-rot-enabled';
const ROT_URL_PARAM = 'rot';

const useGlobalROT = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rotState, setROTState] = useState<ROTState>({
    enabled: false,
    loading: true
  });

  // Initialize ROT state from URL or localStorage
  useEffect(() => {
    try {
      // Priority: URL param > localStorage > default (true)
      const urlParam = searchParams.get(ROT_URL_PARAM);
      const storedValue = localStorage.getItem(ROT_STORAGE_KEY);
      
      let initialValue = true; // Default to ROT enabled
      
      if (urlParam !== null) {
        initialValue = urlParam === 'true';
      } else if (storedValue !== null) {
        initialValue = storedValue === 'true';
      }
      
      setROTState({
        enabled: initialValue,
        loading: false
      });
      
      // Sync URL if not already set
      if (urlParam === null) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(ROT_URL_PARAM, initialValue.toString());
        setSearchParams(newParams, { replace: true });
      }
      
    } catch (error) {
      console.warn('Error initializing ROT state:', error);
      setROTState({
        enabled: true,
        loading: false,
        error: 'Failed to load ROT preference'
      });
    }
  }, []);

  // Toggle ROT state
  const toggleROT = useCallback((newValue?: boolean) => {
    const targetValue = newValue !== undefined ? newValue : !rotState.enabled;
    
    try {
      // Update local state
      setROTState(prev => ({
        ...prev,
        enabled: targetValue,
        error: undefined
      }));
      
      // Persist to localStorage
      localStorage.setItem(ROT_STORAGE_KEY, targetValue.toString());
      
      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.set(ROT_URL_PARAM, targetValue.toString());
      setSearchParams(newParams, { replace: true });
      
      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'toggle_rot', {
          rot_enabled: targetValue,
          source: 'global_toggle'
        });
      }
      
    } catch (error) {
      console.error('Error toggling ROT state:', error);
      setROTState(prev => ({
        ...prev,
        error: 'Failed to update ROT preference'
      }));
    }
  }, [rotState.enabled, searchParams, setSearchParams]);

  // Format pricing with ROT
  const formatPrice = useCallback((basePrice: number, rotPrice?: number) => {
    if (!rotState.enabled || !rotPrice) {
      return {
        display: `${basePrice.toLocaleString('sv-SE')} kr/h`,
        amount: basePrice,
        isROT: false
      };
    }
    
    return {
      display: `${rotPrice.toLocaleString('sv-SE')} kr/h`,
      originalDisplay: `${basePrice.toLocaleString('sv-SE')} kr/h`,
      amount: rotPrice,
      originalAmount: basePrice,
      savings: basePrice - rotPrice,
      savingsPercent: Math.round(((basePrice - rotPrice) / basePrice) * 100),
      isROT: true
    };
  }, [rotState.enabled]);

  // Get pricing object for display components
  const getPricing = useCallback((basePrice: number, rotPrice?: number) => {
    const formatted = formatPrice(basePrice, rotPrice);
    
    return {
      ...formatted,
      badge: rotState.enabled && rotPrice ? 'ROT' : null,
      className: rotState.enabled && rotPrice ? 'text-green-400' : 'text-foreground'
    };
  }, [formatPrice, rotState.enabled]);

  return {
    rotEnabled: rotState.enabled,
    rotLoading: rotState.loading,
    rotError: rotState.error,
    toggleROT,
    formatPrice,
    getPricing,
    
    // Utility functions
    enableROT: () => toggleROT(true),
    disableROT: () => toggleROT(false),
    
    // For components that need to react to ROT changes
    rotState: rotState.enabled
  };
};

export default useGlobalROT;
export type { ROTState };