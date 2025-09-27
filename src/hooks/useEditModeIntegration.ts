import { useEffect } from 'react';
import { useEditMode } from '@/stores/useEditMode';
import { useRoleGate } from '@/hooks/useRoleGate';
import { useLocation } from 'react-router-dom';

/**
 * Hook to integrate edit mode with page changes and permissions
 */
export function useEditModeIntegration() {
  const { canAccessAdmin } = useRoleGate();
  const { 
    setCanEdit, 
    isEditMode, 
    changes, 
    toggleEditMode,
    acquireLock,
    releaseAllLocks 
  } = useEditMode();
  const location = useLocation();

  // Update edit permissions when role changes
  useEffect(() => {
    setCanEdit(canAccessAdmin);
  }, [canAccessAdmin, setCanEdit]);

  // Handle page changes - ask about unsaved changes
  useEffect(() => {
    const changeCount = Object.keys(changes).length;
    
    if (changeCount > 0 && isEditMode) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = `Du har ${changeCount} osparade ändringar. Vill du verkligen lämna sidan?`;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [changes, isEditMode]);

  // Acquire page lock when entering edit mode
  useEffect(() => {
    if (isEditMode && canAccessAdmin) {
      const pageScope = `page:${location.pathname}`;
      acquireLock(pageScope);
    }
  }, [isEditMode, location.pathname, canAccessAdmin, acquireLock]);

  // Release all locks on unmount
  useEffect(() => {
    return () => {
      releaseAllLocks();
    };
  }, [releaseAllLocks]);

  return {
    canEdit: canAccessAdmin,
    isEditMode,
    changeCount: Object.keys(changes).length
  };
}