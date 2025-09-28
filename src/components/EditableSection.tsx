import React, { ReactNode, useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { GripVertical, Edit, Move, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionEditor } from './SectionEditor';

interface EditableSectionProps {
  id: string;
  index?: number;
  children: ReactNode;
  onEdit?: () => void;
  className?: string;
  title?: string;
  allowMove?: boolean;
  allowEdit?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  id,
  index,
  children,
  onEdit,
  className = '',
  title,
  allowMove = true,
  allowEdit = true
}) => {
  const { isEditMode } = useEditMode();
  const [isHovered, setIsHovered] = useState(false);
  const [showSectionEditor, setShowSectionEditor] = useState(false);

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  const handleSettingsClick = () => {
    setShowSectionEditor(true);
  };

  const handleSectionSave = (data: any) => {
    console.log('Section data saved:', data);
    // Here you would typically save to a database or state management
  };

  return (
    <>
      <div 
        className={`relative group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Edit overlay */}
        {isHovered && (
          <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none z-10">
            <div className="absolute -top-8 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              {title || `Sektion ${id}`}
            </div>
          </div>
        )}

        {/* Edit controls */}
        {isHovered && (
          <div className="absolute top-2 right-2 flex gap-1 z-20">
            {allowMove && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 shadow-lg"
              >
                <Move className="h-4 w-4" />
              </Button>
            )}
            {allowEdit && onEdit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onEdit}
                className="h-8 w-8 p-0 shadow-lg"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSettingsClick}
              className="h-8 w-8 p-0 shadow-lg"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className={isEditMode ? 'min-h-[50px]' : ''}>
          {children}
        </div>
      </div>

      <SectionEditor
        sectionId={id}
        isOpen={showSectionEditor}
        onClose={() => setShowSectionEditor(false)}
        onSave={handleSectionSave}
      />
    </>
  );
};