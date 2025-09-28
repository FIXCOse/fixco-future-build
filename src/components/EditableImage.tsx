import React, { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { ContentEditor } from './ContentEditor';

interface EditableImageProps {
  id: string;
  src: string;
  alt: string;
  className?: string;
  onSave?: (src: string) => void;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  src,
  alt,
  className = '',
  onSave
}) => {
  const { isEditMode } = useEditMode();
  const [imageSrc, setImageSrc] = useState(src);

  const handleSave = (newContent: any) => {
    setImageSrc(newContent.value);
    if (onSave) {
      onSave(newContent.value);
    }
  };

  const contentConfig = {
    id,
    type: 'image' as const,
    value: imageSrc,
    placeholder: 'Bild URL...'
  };

  return (
    <ContentEditor
      content={contentConfig}
      onSave={handleSave}
      className={className}
    >
      <img 
        src={imageSrc} 
        alt={alt} 
        className={className}
      />
    </ContentEditor>
  );
};