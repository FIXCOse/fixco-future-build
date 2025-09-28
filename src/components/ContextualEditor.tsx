import React, { useState, useRef, useEffect } from 'react';
import { Settings, Type, Palette, Save, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentStore } from '@/stores/contentStore';
import { toast } from 'sonner';

interface ContextualEditorProps {
  contentId: string;
  children: React.ReactNode;
  className?: string;
  type?: 'text' | 'heading' | 'button';
}

export const ContextualEditor: React.FC<ContextualEditorProps> = ({
  contentId,
  children,
  className = '',
  type = 'text'
}) => {
  const { isEditMode } = useEditMode();
  const { updateContent, getContent } = useContentStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const elementRef = useRef<HTMLDivElement>(null);

  const savedContent = getContent(contentId);
  const currentStyles = savedContent?.styles || {};
  const currentValue = savedContent?.value as string || '';

  const handleQuickEdit = () => {
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateContent(contentId, {
      id: contentId,
      type,
      value: editValue,
      styles: currentStyles
    });
    setIsEditing(false);
    toast.success('Text uppdaterad!');
  };

  const updateStyle = (property: string, value: string | number) => {
    const newStyles = { 
      ...currentStyles, 
      [property]: typeof value === 'number' ? `${value}px` : value 
    };
    
    updateContent(contentId, {
      id: contentId,
      type,
      value: currentValue,
      styles: newStyles
    });
    
    toast.success('Stil uppdaterad!');
  };

  if (!isEditMode) {
    return (
      <div 
        className={className} 
        style={{
          fontSize: currentStyles.fontSize,
          fontWeight: currentStyles.fontWeight as any,
          color: currentStyles.color,
          fontFamily: currentStyles.fontFamily,
          textAlign: currentStyles.textAlign as any,
          lineHeight: currentStyles.lineHeight,
          letterSpacing: currentStyles.letterSpacing,
          textDecoration: currentStyles.textDecoration as any,
          textTransform: currentStyles.textTransform as any,
          fontStyle: currentStyles.fontStyle as any
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{
      fontSize: currentStyles.fontSize,
      fontWeight: currentStyles.fontWeight as any,
      color: currentStyles.color,
      fontFamily: currentStyles.fontFamily,
      textAlign: currentStyles.textAlign as any,
      lineHeight: currentStyles.lineHeight,
      letterSpacing: currentStyles.letterSpacing,
      textDecoration: currentStyles.textDecoration as any,
      textTransform: currentStyles.textTransform as any,
      fontStyle: currentStyles.fontStyle as any
    }}
    >
      {/* Content or Edit Input */}
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
              } else if (e.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            autoFocus
            className="w-full"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-1" />
              Spara
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-1" />
              Avbryt
            </Button>
          </div>
        </div>
      ) : (
        <>
          {children}
          
          {/* Hover Controls */}
          {isHovered && (
            <div className="absolute -top-12 left-0 flex gap-1 bg-background border rounded-lg shadow-lg p-1 z-50">
              <Button size="sm" variant="ghost" onClick={handleQuickEdit}>
                <Edit3 className="h-4 w-4" />
              </Button>
              
              {/* Font Size */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Type className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <div>
                      <Label>Storlek</Label>
                      <Slider
                        value={[parseInt(currentStyles.fontSize?.replace('px', '') || '16')]}
                        onValueChange={([value]) => updateStyle('fontSize', value)}
                        min={8}
                        max={72}
                        step={1}
                      />
                    </div>
                    
                    <div>
                      <Label>Typsnitt</Label>
                      <Select
                        value={currentStyles.fontFamily || 'inherit'}
                        onValueChange={(value) => updateStyle('fontFamily', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inherit">Standard</SelectItem>
                          <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                          <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                          <SelectItem value="Georgia, serif">Georgia</SelectItem>
                          <SelectItem value="Times New Roman, serif">Times</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Color */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="space-y-2">
                    <Label>Textfärg</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={currentStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </>
      )}
      
      {/* Edit Mode Indicator */}
      {isHovered && !isEditing && (
        <div className="absolute inset-0 border-2 border-primary/30 rounded pointer-events-none" />
      )}
    </div>
  );
};