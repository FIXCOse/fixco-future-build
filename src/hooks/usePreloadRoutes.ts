import { useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/integrations/supabase/client';

// High-priority routes (most visited pages)
const HIGH_PRIORITY = [
  () => import("../pages/Home"),
  () => import("../pages/Services"),
  () => import("../pages/Contact"),
  () => import("../pages/FAQ"),
  () => import("../pages/BookVisit"),
  () => import("../pages/AboutUs"),
];

// Prefetch services data for faster Services page load
const prefetchServicesData = () => {
  queryClient.prefetchQuery({
    queryKey: ['services', 'sv'],
    queryFn: async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

// Medium-priority routes (important but less frequent)
const MEDIUM_PRIORITY = [
  () => import("../pages/ROTInfo"),
  () => import("../pages/Referenser"),
  () => import("../pages/ServiceDetail"),
  () => import("../pages/RUT"),
  () => import("../pages/Careers"),
  () => import("../pages/SmartHome"),
];

// Low-priority routes (legal, misc)
const LOW_PRIORITY = [
  () => import("../pages/Terms"),
  () => import("../pages/Privacy"),
  () => import("../pages/Cookies"),
  () => import("../pages/Insurance"),
  () => import("../pages/AI"),
  () => import("../pages/HomeV2"),
];

export const usePreloadRoutes = () => {
  useEffect(() => {
    // Check connection quality - skip on slow connections
    const connection = (navigator as any).connection;
    const isSlowConnection = connection?.effectiveType === '2g' || 
                            connection?.effectiveType === 'slow-2g';
    
    if (isSlowConnection) {
      console.log('🐌 Slow connection detected - skipping route preloading');
      return;
    }
    
    console.log('🚀 Starting route preloading strategy');
    
    // High priority - preload after 500ms when browser is idle
    const highTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          console.log('⚡ Preloading HIGH priority routes');
          HIGH_PRIORITY.forEach(loader => loader());
          // Also prefetch services data
          prefetchServicesData();
        });
      } else {
        HIGH_PRIORITY.forEach(loader => loader());
        prefetchServicesData();
      }
    }, 500);
    
    // Medium priority - preload after 2s
    const mediumTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          console.log('📦 Preloading MEDIUM priority routes');
          MEDIUM_PRIORITY.forEach(loader => loader());
        });
      } else {
        MEDIUM_PRIORITY.forEach(loader => loader());
      }
    }, 2000);
    
    // Low priority - preload after 5s (with 10s timeout)
    const lowTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          console.log('📚 Preloading LOW priority routes');
          LOW_PRIORITY.forEach(loader => loader());
        }, { timeout: 10000 });
      } else {
        LOW_PRIORITY.forEach(loader => loader());
      }
    }, 5000);
    
    return () => {
      clearTimeout(highTimer);
      clearTimeout(mediumTimer);
      clearTimeout(lowTimer);
    };
  }, []);
};
