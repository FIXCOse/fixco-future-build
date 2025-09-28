import React, { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { ContentEditor } from './ContentEditor';

interface EditableListProps {
  id: string;
  items: string[];
  className?: string;
  itemClassName?: string;
  onSave?: (items: string[]) => void;
  renderItem?: (item: string, index: number) => React.ReactNode;
}

export const EditableList: React.FC<EditableListProps> = ({
  id,
  items,
  className = '',
  itemClassName = '',
  onSave,
  renderItem
}) => {
  const { isEditMode } = useEditMode();
  const [listItems, setListItems] = useState(items);

  const handleSave = (newContent: any) => {
    const newItems = Array.isArray(newContent.value) ? newContent.value : [newContent.value];
    setListItems(newItems);
    if (onSave) {
      onSave(newItems);
    }
  };

  const contentConfig = {
    id,
    type: 'list' as const,
    value: listItems,
    placeholder: 'Listpunkt...'
  };

  return (
    <ContentEditor
      content={contentConfig}
      onSave={handleSave}
      className={className}
    >
      <div className={className}>
        {listItems.map((item, index) => (
          <div key={index} className={itemClassName}>
            {renderItem ? renderItem(item, index) : item}
          </div>
        ))}
      </div>
    </ContentEditor>
  );
};