import React, { ReactNode } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useEditMode } from '@/contexts/EditModeContext';
import { GripVertical, Edit } from 'lucide-react';

interface EditableSectionProps {
  id: string;
  index: number;
  children: ReactNode;
  onEdit?: () => void;
  className?: string;
  droppableId?: string;
  isDropDisabled?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  id,
  index,
  children,
  onEdit,
  className = '',
  droppableId,
  isDropDisabled = false
}) => {
  const { isEditMode } = useEditMode();

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            ${className}
            ${snapshot.isDragging ? 'shadow-2xl rotate-1 scale-105' : ''}
            ${isEditMode ? 'border-2 border-dashed border-primary/50 rounded-lg relative group' : ''}
            transition-all duration-200
          `}
        >
          {isEditMode && (
            <div className="absolute -top-3 -right-3 z-10 bg-primary text-primary-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-1">
                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-primary-foreground/20 rounded">
                  <GripVertical className="h-4 w-4" />
                </div>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-1 hover:bg-primary-foreground/20 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {droppableId && !isDropDisabled ? (
            <Droppable droppableId={droppableId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                    ${snapshot.isDraggingOver ? 'bg-primary/10 border-primary' : ''}
                    transition-colors duration-200
                  `}
                >
                  {children}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ) : (
            children
          )}
        </div>
      )}
    </Draggable>
  );
};