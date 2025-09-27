import React, { useEffect } from 'react';
import { useRoleGate } from '@/hooks/useRoleGate';
import { useEditMode } from '@/stores/useEditMode';
import { EditToolbar } from './EditToolbar';
import { SaveBar } from './SaveBar';

interface EditModeProviderProps {
  children: React.ReactNode;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ children }) => {
  const { canAccessAdmin } = useRoleGate();
  const { setCanEdit, releaseAllLocks } = useEditMode();

  useEffect(() => {
    setCanEdit(canAccessAdmin);
  }, [canAccessAdmin, setCanEdit]);

  // Release locks on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      releaseAllLocks();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      releaseAllLocks();
    };
  }, [releaseAllLocks]);

  return (
    <>
      <EditToolbar />
      {children}
      <SaveBar />
    </>
  );
};