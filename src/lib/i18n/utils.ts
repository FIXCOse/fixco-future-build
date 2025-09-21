import { Locale } from './types';

/**
 * Utility functions for i18n
 */

/**
 * Format numbers according to locale
 */
export const formatNumber = (
  value: number, 
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  const localeCode = locale === 'sv' ? 'sv-SE' : 'en-US';
  return new Intl.NumberFormat(localeCode, options).format(value);
};

/**
 * Format currency according to locale
 */
export const formatCurrency = (
  value: number,
  locale: Locale,
  currency: string = 'SEK'
): string => {
  const localeCode = locale === 'sv' ? 'sv-SE' : 'en-US';
  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Format dates according to locale
 */
export const formatDate = (
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeCode = locale === 'sv' ? 'sv-SE' : 'en-US';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(localeCode, { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Format relative time according to locale
 */
export const formatRelativeTime = (
  date: Date | string,
  locale: Locale
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const localeCode = locale === 'sv' ? 'sv-SE' : 'en-US';
  const rtf = new Intl.RelativeTimeFormat(localeCode, { numeric: 'auto' });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
};

/**
 * Get localized route path
 */
export const getLocalizedPath = (path: string, locale: Locale): string => {
  if (locale === 'sv') {
    return path;
  }
  
  // Remove leading slash and add locale prefix
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}/${cleanPath}`.replace(/\/+/g, '/').replace(/\/$/, '') || `/${locale}`;
};

/**
 * Extract locale from path
 */
export const extractLocaleFromPath = (path: string): { locale: Locale; cleanPath: string } => {
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length > 0 && (segments[0] === 'sv' || segments[0] === 'en')) {
    return {
      locale: segments[0] as Locale,
      cleanPath: '/' + segments.slice(1).join('/')
    };
  }
  
  return {
    locale: 'sv',
    cleanPath: path
  };
};

/**
 * Validate translation key format
 */
export const isValidTranslationKey = (key: string): boolean => {
  // Should be in format: namespace.key or namespace.nested.key
  return /^[a-zA-Z][a-zA-Z0-9_]*\.[a-zA-Z][a-zA-Z0-9_.]*$/.test(key);
};