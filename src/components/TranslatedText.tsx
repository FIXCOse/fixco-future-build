import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  namespace?: string;
  k: string; // translation key
  defaultValue: string;
  values?: Record<string, any>;
  children?: never;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * TranslatedText component for consistent translation usage
 * Enforces the defaultValue pattern and provides fallback
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
  namespace = 'common',
  k,
  defaultValue,
  values,
  className,
  as = 'span'
}) => {
  const { t, ready } = useTranslation(namespace);

  // Show default value while loading or if translation fails
  const text = ready ? t(k, { defaultValue, ...values }) : defaultValue;

  const Element = as as any;
  return <Element className={className}>{text}</Element>;
};

/**
 * Utility function to create typed translation components
 */
export const createT = (namespace: string) => {
  return (props: Omit<TranslatedTextProps, 'namespace'>) => (
    <TranslatedText {...props} namespace={namespace} />
  );
};

// Pre-built components for common namespaces
export const CommonT = createT('common');
export const HeaderT = createT('header');
export const HomeT = createT('home');
export const ServicesT = createT('services');
export const FormsT = createT('forms');