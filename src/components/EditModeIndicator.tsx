import React from 'react';
import { Edit, Settings, Palette, Type } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useRoleGate } from '@/hooks/useRoleGate';

export const EditModeIndicator: React.FC = () => {
  const { isEditMode } = useEditMode();
  const { isAdmin, isOwner } = useRoleGate();

  if (!isEditMode || (!isAdmin && !isOwner)) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-40 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
      <Edit className="h-4 w-4" />
      <span>Redigeringsläge aktivt</span>
      <div className="flex gap-1 ml-2">
        <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-primary-foreground/70 rounded-full animate-pulse delay-75" />
        <div className="w-2 h-2 bg-primary-foreground/50 rounded-full animate-pulse delay-150" />
      </div>
    </div>
  );
};

export default EditModeIndicator;