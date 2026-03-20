import { useCallback, useEffect } from 'react';
import { useContentStore } from '@/stores/contentStore';

export const useContentLoader = () => {
  const store = useContentStore();
  const { isLoading, isHydrated } = store;
  const loadContent = useCallback(() => store.loadContent(), [store.loadContent]);

  useEffect(() => {
    // Load content from database on app start
    loadContent();
    
    // Set hydrated to true immediately after loadContent
    const timer = setTimeout(() => {
      useContentStore.setState({ isHydrated: true });
    }, 0);
    
    return () => clearTimeout(timer);
  }, [loadContent]);

  return { isLoading, isHydrated };
};