import React, { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { ContentEditor } from './ContentEditor';
import { AdvancedTextEditor } from './AdvancedTextEditor';
import { useContentStore } from '@/stores/contentStore';

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
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const { updateContent, getContent } = useContentStore();

  // Load saved content and styles
  const savedContent = getContent(id);
  const displayContent = savedContent?.value as string || content;
  const textStyles = savedContent?.styles || {};

  const handleSave = async (newContent: any) => {
    const newText = typeof newContent === 'string' ? newContent : newContent.value;
    setContent(newText);
    
    try {
      // Save to store and database
      await updateContent(id, {
        id,
        type,
        value: newText,
        styles: textStyles
      });
      
      console.log('Content saved successfully to database:', id);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
    
    if (onSave) {
      onSave(newText);
    }
  };

  const handleAdvancedSave = async (text: string, styles: any) => {
    setContent(text);
    
    try {
      // Save to store and database with styles
      await updateContent(id, {
        id,
        type,
        value: text,
        styles
      });
      
      console.log('Advanced content saved successfully to database:', id);
    } catch (error) {
      console.error('Failed to save advanced content:', error);
    }
    
    if (onSave) {
      onSave(text);
    }
  };

  const handleDoubleClick = () => {
    console.log('Double click detected on:', id);
    if (isEditMode) {
      console.log('Opening advanced editor for:', id);
      setShowAdvancedEditor(true);
    } else {
      console.log('Edit mode is not active');
    }
  };

  const contentConfig = {
    id,
    type,
    value: displayContent,
    placeholder
  };

  // Apply saved styles
  const inlineStyles: React.CSSProperties = {
    fontSize: textStyles.fontSize,
    fontWeight: textStyles.fontWeight as any,
    color: textStyles.color,
    fontFamily: textStyles.fontFamily,
    textAlign: textStyles.textAlign as any,
    lineHeight: textStyles.lineHeight,
    letterSpacing: textStyles.letterSpacing,
    textDecoration: textStyles.textDecoration as any,
    textTransform: textStyles.textTransform as any,
    fontStyle: textStyles.fontStyle as any,
    cursor: isEditMode ? 'pointer' : 'default',
    outline: isEditMode ? '2px dashed rgba(59, 130, 246, 0.3)' : 'none',
    padding: isEditMode ? '4px' : '0'
  };

  if (children) {
    return (
      <>
        <ContentEditor
          content={contentConfig}
          onSave={handleSave}
          className={className}
        >
          <div 
            style={inlineStyles}
            onDoubleClick={handleDoubleClick}
            title={isEditMode ? "Dubbelklicka för avancerad redigering" : undefined}
          >
            {children}
          </div>
        </ContentEditor>
        
        <AdvancedTextEditor
          isOpen={showAdvancedEditor}
          onClose={() => setShowAdvancedEditor(false)}
          contentId={id}
          initialText={displayContent}
          initialStyles={textStyles}
          onSave={handleAdvancedSave}
        />
      </>
    );
  }

  // Create element with proper typing and styles
  const element = React.createElement(
    Component,
    { 
      className,
      style: inlineStyles,
      onDoubleClick: handleDoubleClick,
      title: isEditMode ? "Dubbelklicka för avancerad redigering" : undefined
    },
    displayContent || placeholder
  );

  return (
    <>
      <ContentEditor
        content={contentConfig}
        onSave={handleSave}
        className={className}
      >
        {element}
      </ContentEditor>
      
      <AdvancedTextEditor
        isOpen={showAdvancedEditor}
        onClose={() => setShowAdvancedEditor(false)}
        contentId={id}
        initialText={displayContent}
        initialStyles={textStyles}
        onSave={handleAdvancedSave}
      />
    </>
  );
};