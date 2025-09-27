import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditMode } from '@/stores/useEditMode';
import { useCopy } from '@/copy/CopyProvider';
import { cn } from '@/lib/utils';

interface InlineTextProps {
  children: React.ReactNode;
  field: string;
  scope: string;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const InlineText: React.FC<InlineTextProps> = ({
  children,
  field,
  scope,
  multiline = false,
  className,
  placeholder,
  value = '',
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const { isEditMode, stage } = useEditMode();
  const { locale } = useCopy();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const fieldWithLocale = `${field}_${locale}`;

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const newValue = editValue.trim();
    
    if (newValue !== value) {
      // Stage the change
      stage(scope, { [fieldWithLocale]: newValue }, 'content');
      
      // Call onChange if provided
      onChange?.(newValue);
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (!isEditMode || !isEditing) {
    return (
      <div
        className={cn(
          className,
          isEditMode && "cursor-pointer hover:bg-accent/10 hover:outline hover:outline-2 hover:outline-primary/20 transition-all duration-200 rounded-sm px-1 -mx-1"
        )}
        onDoubleClick={handleDoubleClick}
        title={isEditMode ? "Dubbelklicka för att redigera" : undefined}
      >
        {children}
      </div>
    );
  }

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={className}>
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          "min-h-0 border-primary shadow-lg",
          multiline && "resize-none"
        )}
        rows={multiline ? 3 : undefined}
      />
      <div className="text-xs text-muted-foreground mt-1">
        {multiline ? 'Ctrl+Enter' : 'Enter'} för att spara • Escape för att avbryta
      </div>
    </div>
  );
};