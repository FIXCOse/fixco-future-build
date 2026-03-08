import React, { createContext, useContext, ReactNode } from 'react';
import { sv } from './sv';
import { en } from './en';
import type { CopyKey } from './keys';

const dictionaries = { sv, en } as const;

interface CopyContextType {
  t: (key: CopyKey) => string;
  locale: 'sv' | 'en';
}

const CopyContext = createContext<CopyContextType | undefined>(undefined);

interface CopyProviderProps {
  locale: 'sv' | 'en';
  children: ReactNode;
}

export const CopyProvider: React.FC<CopyProviderProps> = ({ locale, children }) => {
  const dict = dictionaries[locale];
  
  const t = (key: CopyKey): string => {
    return dict[key] || key;
  };

  return (
    <CopyContext.Provider value={{ t, locale }}>
      {children}
    </CopyContext.Provider>
  );
};

export const useCopy = (): CopyContextType => {
  const context = useContext(CopyContext);
  if (context === undefined) {
    // Fallback to Swedish during HMR or transient renders outside provider
    const dict = dictionaries['sv'];
    return {
      t: (key: CopyKey) => dict[key] || key,
      locale: 'sv',
    };
  }
  return context;
};