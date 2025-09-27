import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Edit3, 
  Eye, 
  EyeOff, 
  Save, 
  Undo, 
  Redo, 
  Settings,
  Globe
} from 'lucide-react';
import { useEditMode } from '@/stores/useEditMode';
import { useRoleGate } from '@/hooks/useRoleGate';
import { useCopy } from '@/copy/CopyProvider';

interface EditToolbarProps {
  showPublished?: boolean;
  onTogglePreview?: (showPublished: boolean) => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({ 
  showPublished = false, 
  onTogglePreview 
}) => {
  const { canAccessAdmin } = useRoleGate();
  const { 
    isEditMode, 
    canEdit, 
    changes, 
    isPublishing, 
    toggleEditMode, 
    publishAll,
    discard 
  } = useEditMode();
  const { locale } = useCopy();

  // Show toolbar if user has admin access
  if (!canAccessAdmin) {
    return null;
  }

  const changeCount = Object.keys(changes).length;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[9999] bg-red-500 text-white p-4 shadow-lg"
      style={{ zIndex: 9999 }}
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">🎯 EDIT TOOLBAR - DU SER MIG NU!</h2>
        <p>canAccessAdmin: {canAccessAdmin ? 'JA' : 'NEJ'} | canEdit: {canEdit ? 'JA' : 'NEJ'}</p>
        <button 
          className="bg-white text-red-500 px-4 py-2 rounded mt-2"
          onClick={toggleEditMode}
        >
          {isEditMode ? 'Exit Edit' : 'Enter Edit'} Mode
        </button>
      </div>
    </div>
  );
};