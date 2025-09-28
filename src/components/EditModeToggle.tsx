import React from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from '@/contexts/EditModeContext';
import { useRoleGate } from '@/hooks/useRoleGate';
import { toast } from 'sonner';

export const EditModeToggle: React.FC = () => {
  const { isAdmin, isOwner } = useRoleGate();
  const { isEditMode, toggleEditMode } = useEditMode();

  // Only show for admin/owner
  if (!isAdmin && !isOwner) {
    return null;
  }

  const handleToggle = () => {
    console.log('Edit mode toggled:', !isEditMode);
    toggleEditMode();
    if (!isEditMode) {
      toast.info('Redigeringsläge aktiverat - dubbelklicka på text för att redigera', {
        description: 'Textelement som kan redigeras visas med en prickad blå ram',
        duration: 4000,
      });
    } else {
      toast.success('Redigeringsläge avslutat', {
        description: 'Alla ändringar har sparats automatiskt',
        duration: 2000,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Only show the edit button when NOT in edit mode */}
      {!isEditMode && (
        <Button
          onClick={handleToggle}
          size="lg"
          variant="default"
          className="shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full p-4 bg-primary hover:bg-primary/90"
        >
          <Edit3 className="h-5 w-5 mr-2" />
          Redigera
        </Button>
      )}
    </div>
  );
};