import { useEffect } from 'react';
import { useContentStore } from '@/stores/contentStore';

export const useContentLoader = () => {
  const { loadContent, isLoading } = useContentStore();

  useEffect(() => {
    // Load content from database on app start
    loadContent();
  }, [loadContent]);

  return { isLoading };
};