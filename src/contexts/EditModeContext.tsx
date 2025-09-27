import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

interface EditModeProviderProps {
  children: ReactNode;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled);
  };

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, setEditMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = (): EditModeContextType => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
};