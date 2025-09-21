import React, { createContext, useContext, ReactNode } from 'react';
import sv from './sv';
import en from './en';

const dictionaries = { sv, en };

interface CopyContextType {
  t: (path: string) => string;
  locale: 'sv' | 'en';
}

const CopyContext = createContext<CopyContextType | undefined>(undefined);

interface CopyProviderProps {
  locale: 'sv' | 'en';
  children: ReactNode;
}

export const CopyProvider: React.FC<CopyProviderProps> = ({ locale, children }) => {
  const dict = dictionaries[locale];
  
  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = dict;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || path;
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