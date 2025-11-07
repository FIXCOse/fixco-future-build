import React, { createContext, useContext, ReactNode } from 'react';
import { sv } from './sv';
import { en } from './en';
import type { CopyKey } from './keys';

const dictionaries = { sv, en } as const;

interface CopyContextType {
  t: (key: CopyKey, variables?: Record<string, string | number>) => string;
  locale: 'sv' | 'en';
}

const CopyContext = createContext<CopyContextType | undefined>(undefined);

interface CopyProviderProps {
  locale: 'sv' | 'en';
  children: ReactNode;
}

export const CopyProvider: React.FC<CopyProviderProps> = ({ locale, children }) => {
  const dict = dictionaries[locale];
  
  const t = (key: CopyKey, variables?: Record<string, string | number>): string => {
    let text = dict[key] || key;
    
    // Replace variables like {city}, {category}, {count}, etc.
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  return (
    <CopyContext.Provider value={{ t, locale }}>
      {children}
    </CopyContext.Provider>
  );
};

export const useCopy = () => {
  const context = useContext(CopyContext);
  if (context === undefined) {
    throw new Error('useCopy must be used within a CopyProvider');
  }
  return context;
};