import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useEditMode } from '@/contexts/EditModeContext';
import { useContentStore } from '@/stores/contentStore';

interface InlineTextEditorProps {
  contentId: string;
  children: React.ReactNode;
  className?: string;
}

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  contentId,
  children,
  className = ''
}) => {
  const { isEditMode } = useEditMode();
  const { updateContent, getContent } = useContentStore();
  const [isSelected, setIsSelected] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const savedContent = getContent(contentId);
  const currentStyles = savedContent?.styles || {};

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && isEditMode) {
        const range = sel.getRangeAt(0);
        const container = elementRef.current;
        
        if (container && container.contains(range.commonAncestorContainer)) {
          setSelection(sel);
          setIsSelected(sel.toString().length > 0);
          setShowToolbar(sel.toString().length > 0);
        } else {
          setIsSelected(false);
          setShowToolbar(false);
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [isEditMode]);

  const applyStyleToSelection = (property: string, value: string) => {
    if (!selection || selection.toString().length === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.setProperty(property, value);
    
    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      
      // Save the updated content
      if (elementRef.current) {
        const newContent = elementRef.current.innerHTML;
        updateContent(contentId, {
          id: contentId,
          type: 'text',
          value: newContent,
          styles: currentStyles
        });
      }
    } catch (e) {
      console.warn('Could not apply style to selection:', e);
    }
  };

  const updateGlobalStyle = (property: string, value: string) => {
    const newStyles = { ...currentStyles, [property]: value };
    updateContent(contentId, {
      id: contentId,
      type: 'text',
      value: savedContent?.value || '',
      styles: newStyles
    });
  };

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="relative">
      <div
        ref={elementRef}
        className={`${className} ${isEditMode ? 'cursor-text' : ''}`}
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onMouseUp={() => {
          const sel = window.getSelection();
          if (sel && sel.toString().length > 0) {
            setSelection(sel);
            setShowToolbar(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowToolbar(false), 200);
        }}
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
          fontStyle: currentStyles.fontStyle as any,
          outline: isEditMode ? '1px dashed rgba(59, 130, 246, 0.3)' : 'none',
          minHeight: isEditMode ? '1em' : 'auto'
        }}
      >
        {children}
      </div>

      {/* Floating Toolbar */}
      {showToolbar && isSelected && (
        <div className="fixed z-50 bg-background border rounded-lg shadow-lg p-2 flex items-center gap-1"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyStyleToSelection('font-weight', 'bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyStyleToSelection('font-style', 'italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyStyleToSelection('text-decoration', 'underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-8 p-1"
                    onChange={(e) => applyStyleToSelection('color', e.target.value)}
                  />
                  <span className="text-sm">Textfärg</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyStyleToSelection('text-align', 'left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyStyleToSelection('text-align', 'center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyStyleToSelection('text-align', 'right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};