import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * Enhanced useTranslation hook with better TypeScript support
 * and consistent defaultValue pattern
 */
export const useTranslations = (namespace: string = 'common') => {
  const { t: originalT, i18n, ready } = useI18nTranslation(namespace);

  const t = useMemo(() => {
    return (key: string, defaultValue?: string, options?: any) => {
      if (defaultValue) {
        return originalT(key, { defaultValue, ...options });
      }
      return originalT(key, options);
    };
  }, [originalT]);

  return {
    t,
    i18n,
    ready,
    language: i18n.language,
    isLoading: !ready,
  };
};

/**
 * Specific hooks for different namespaces
 */
export const useCommonTranslations = () => useTranslations('common');
export const useHeaderTranslations = () => useTranslations('header');
export const useHomeTranslations = () => useTranslations('home');
export const useServicesTranslations = () => useTranslations('services');
export const useFormsTranslations = () => useTranslations('forms');
export const useSeoTranslations = () => useTranslations('seo');