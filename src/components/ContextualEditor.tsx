import React, { useState, useRef, memo, useMemo } from 'react';
import { Settings, Type, Palette, Save, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentStore } from '@/stores/contentStore';
import { useCopy } from '@/copy/CopyProvider';
import { toast } from 'sonner';

interface ContextualEditorProps {
  contentId: string;
  children: React.ReactNode;
  className?: string;
  type?: 'text' | 'heading' | 'button';
}

const ContextualEditorComponent: React.FC<ContextualEditorProps> = ({
  contentId,
  children,
  className = '',
  type = 'text'
}) => {
  const { isEditMode } = useEditMode();
  const { locale } = useCopy();
  const getContent = useContentStore((state) => state.getContent);
  const updateContent = useContentStore((state) => state.updateContent);
  const savedContent = getContent(contentId, locale);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const elementRef = useRef<HTMLDivElement>(null);

  const currentStyles = useMemo(() => savedContent?.styles || {}, [savedContent?.styles]);
  const currentValue = useMemo(() => (savedContent?.value as string) || '', [savedContent?.value]);

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
    }, locale);
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
    }, locale);
    
    toast.success('Stil uppdaterad!');
  };

  if (!isEditMode) {
    return (
      <div 
        className={className} 
        style={{
          fontSize: (currentStyles as any).fontSize,
          fontWeight: (currentStyles as any).fontWeight,
          color: (currentStyles as any).color,
          fontFamily: (currentStyles as any).fontFamily,
          textAlign: (currentStyles as any).textAlign,
          lineHeight: (currentStyles as any).lineHeight,
          letterSpacing: (currentStyles as any).letterSpacing,
          textDecoration: (currentStyles as any).textDecoration,
          textTransform: (currentStyles as any).textTransform,
          fontStyle: (currentStyles as any).fontStyle
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
        fontSize: (currentStyles as any).fontSize,
        fontWeight: (currentStyles as any).fontWeight,
        color: (currentStyles as any).color,
        fontFamily: (currentStyles as any).fontFamily,
        textAlign: (currentStyles as any).textAlign,
        lineHeight: (currentStyles as any).lineHeight,
        letterSpacing: (currentStyles as any).letterSpacing,
        textDecoration: (currentStyles as any).textDecoration,
        textTransform: (currentStyles as any).textTransform,
        fontStyle: (currentStyles as any).fontStyle
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
                        value={[parseInt((currentStyles as any).fontSize?.replace('px', '') || '16')]}
                        onValueChange={([value]) => updateStyle('fontSize', value)}
                        min={8}
                        max={72}
                        step={1}
                      />
                    </div>
                    
                    <div>
                      <Label>Typsnitt</Label>
                      <Select
                        value={(currentStyles as any).fontFamily || 'inherit'}
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
                        value={(currentStyles as any).color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={(currentStyles as any).color || '#000000'}
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

export const ContextualEditor = memo(ContextualEditorComponent);
