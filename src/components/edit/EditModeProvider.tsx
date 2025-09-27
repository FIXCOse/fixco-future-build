import React, { useEffect } from 'react';
import { useRoleGate } from '@/hooks/useRoleGate';
import { useEditMode } from '@/stores/useEditMode';
import { EditToolbar } from './EditToolbar';
import { SaveBar } from './SaveBar';

interface EditModeProviderProps {
  children: React.ReactNode;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ children }) => {
  const { canAccessAdmin, isOwner, isAdmin } = useRoleGate();
  const { setCanEdit, releaseAllLocks } = useEditMode();

  useEffect(() => {
    console.log('EditModeProvider: Setting canEdit based on role', { canAccessAdmin, isOwner, isAdmin });
    setCanEdit(canAccessAdmin);
  }, [canAccessAdmin, setCanEdit, isOwner, isAdmin]);

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