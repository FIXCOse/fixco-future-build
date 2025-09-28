import React, { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { ContentEditor } from './ContentEditor';

interface EditableTextProps {
  id: string;
  initialContent: string;
  type?: 'text' | 'heading';
  placeholder?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  onSave?: (content: string) => void;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  initialContent,
  type = 'text',
  placeholder,
  className = '',
  as: Component = 'div',
  onSave,
  children
}) => {
  const { isEditMode } = useEditMode();
  const [content, setContent] = useState(initialContent);

  const handleSave = (newContent: any) => {
    setContent(newContent.value);
    if (onSave) {
      onSave(newContent.value);
    }
  };

  const contentConfig = {
    id,
    type,
    value: content,
    placeholder
  };

  if (children) {
    return (
      <ContentEditor
        content={contentConfig}
        onSave={handleSave}
        className={className}
      >
        {children}
      </ContentEditor>
    );
  }

  // Create element with proper typing
  const element = React.createElement(
    Component,
    { className },
    content || placeholder
  );

  return (
    <ContentEditor
      content={contentConfig}
      onSave={handleSave}
      className={className}
    >
      {element}
    </ContentEditor>
  );
};