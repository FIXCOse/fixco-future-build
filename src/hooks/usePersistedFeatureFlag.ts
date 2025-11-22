import { useEffect } from 'react';
import { useFeatureFlag } from './useFeatureFlag';

export function usePersistedFeatureFlag(flagKey: string, defaultValue: boolean = false) {
  const storageKey = `feature-flag-${flagKey}`;
  const { data, isLoading } = useFeatureFlag(flagKey);
  
  // Läs från localStorage för omedelbar rendering
  const getCachedValue = () => {
    const cached = localStorage.getItem(storageKey);
    return cached !== null ? JSON.parse(cached) : defaultValue;
  };
  
  // Spara till localStorage när värdet ändras
  useEffect(() => {
    if (data !== undefined && !isLoading) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, isLoading, storageKey]);
  
  // Returnera cachat värde om vi laddar, annars DB-värdet
  const value = isLoading ? getCachedValue() : (data ?? defaultValue);
  
  return { data: value, isLoading: false };
}
