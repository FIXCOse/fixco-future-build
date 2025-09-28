import React, { ReactNode } from 'react';
// import { Draggable, Droppable } from 'react-beautiful-dnd';
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

// Temporarily disable drag and drop functionality
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

  return <div className={className}>{children}</div>;
};