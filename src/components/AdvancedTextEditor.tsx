import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Type, Palette, AlignLeft, AlignCenter, 
  AlignRight, Plus, Minus, RotateCcw, Save, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useContentStore } from '@/stores/contentStore';

interface TextStyles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  fontFamily?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: string;
  fontStyle?: string;
}

interface AdvancedTextEditorProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  initialText: string;
  initialStyles?: TextStyles;
  onSave: (text: string, styles: TextStyles) => void;
}

const fontFamilies = [
  { name: 'System Font', value: 'system-ui, sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
];

export const AdvancedTextEditor: React.FC<AdvancedTextEditorProps> = ({
  isOpen,
  onClose,
  contentId,
  initialText,
  initialStyles = {},
  onSave
}) => {
  const [text, setText] = useState(initialText);
  const [styles, setStyles] = useState<TextStyles>(initialStyles);
  const [fontSize, setFontSize] = useState(
    initialStyles.fontSize ? parseInt(initialStyles.fontSize) : 16
  );
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateStyle = (key: keyof TextStyles, value: string) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (key: keyof TextStyles, activeValue: string, inactiveValue: string = '') => {
    const currentValue = styles[key];
    updateStyle(key, currentValue === activeValue ? inactiveValue : activeValue);
  };

  const handleFontSizeChange = (value: number[]) => {
    const size = value[0];
    setFontSize(size);
    updateStyle('fontSize', `${size}px`);
  };

  const handleSave = () => {
    onSave(text, styles);
    toast.success('Text uppdaterad!');
    onClose();
  };

  const handleReset = () => {
    setText(initialText);
    setStyles(initialStyles);
    setFontSize(initialStyles.fontSize ? parseInt(initialStyles.fontSize) : 16);
  };

  const previewStyles: React.CSSProperties = {
    fontSize: styles.fontSize || '16px',
    fontWeight: styles.fontWeight || 'normal',
    color: styles.color || 'inherit',
    fontFamily: styles.fontFamily || 'inherit',
    textAlign: (styles.textAlign as any) || 'left',
    lineHeight: styles.lineHeight || '1.5',
    letterSpacing: styles.letterSpacing || 'normal',
    textDecoration: styles.textDecoration || 'none',
    textTransform: (styles.textTransform as any) || 'none',
    fontStyle: styles.fontStyle || 'normal',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Avancerad Textredigerare
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/20">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={styles.fontWeight === 'bold' ? 'default' : 'ghost'}
                onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={styles.fontStyle === 'italic' ? 'default' : 'ghost'}
                onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={styles.textDecoration === 'underline' ? 'default' : 'ghost'}
                onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Text Alignment */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={styles.textAlign === 'left' ? 'default' : 'ghost'}
                onClick={() => updateStyle('textAlign', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={styles.textAlign === 'center' ? 'default' : 'ghost'}
                onClick={() => updateStyle('textAlign', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={styles.textAlign === 'right' ? 'default' : 'ghost'}
                onClick={() => updateStyle('textAlign', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Preview Toggle */}
            <Button
              size="sm"
              variant={previewMode ? 'default' : 'ghost'}
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Type className="h-4 w-4 mr-1" />
              Förhandsvisning
            </Button>

            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Återställ
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Spara
              </Button>
            </div>
          </div>

          <Tabs defaultValue="edit" className="space-y-4">
            <TabsList>
              <TabsTrigger value="edit">Redigera</TabsTrigger>
              <TabsTrigger value="style">Stil</TabsTrigger>
              <TabsTrigger value="advanced">Avancerat</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-4">
              {previewMode ? (
                <div 
                  className="min-h-[200px] p-4 border rounded-lg bg-background"
                  style={previewStyles}
                >
                  {text.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Skriv din text här..."
                  className="w-full h-48 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  style={previewStyles}
                />
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Font Family */}
                <div className="space-y-2">
                  <Label>Typsnitt</Label>
                  <Select
                    value={styles.fontFamily || 'system-ui, sans-serif'}
                    onValueChange={(value) => updateStyle('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <Label>Storlek: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={handleFontSizeChange}
                    min={8}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                  <Label>Textfärg</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={styles.color || '#000000'}
                      onChange={(e) => updateStyle('color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={styles.color || '#000000'}
                      onChange={(e) => updateStyle('color', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <Label>Radavstånd</Label>
                  <Select
                    value={styles.lineHeight || '1.5'}
                    onValueChange={(value) => updateStyle('lineHeight', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tight (1.0)</SelectItem>
                      <SelectItem value="1.25">Snug (1.25)</SelectItem>
                      <SelectItem value="1.5">Normal (1.5)</SelectItem>
                      <SelectItem value="1.75">Relaxed (1.75)</SelectItem>
                      <SelectItem value="2">Loose (2.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Letter Spacing */}
                <div className="space-y-2">
                  <Label>Teckenavstånd</Label>
                  <Select
                    value={styles.letterSpacing || 'normal'}
                    onValueChange={(value) => updateStyle('letterSpacing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-0.05em">Tighter</SelectItem>
                      <SelectItem value="-0.025em">Tight</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="0.025em">Wide</SelectItem>
                      <SelectItem value="0.05em">Wider</SelectItem>
                      <SelectItem value="0.1em">Widest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Transform */}
                <div className="space-y-2">
                  <Label>Textformat</Label>
                  <Select
                    value={styles.textTransform || 'none'}
                    onValueChange={(value) => updateStyle('textTransform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Normal</SelectItem>
                      <SelectItem value="uppercase">VERSALER</SelectItem>
                      <SelectItem value="lowercase">gemener</SelectItem>
                      <SelectItem value="capitalize">Första Bokstaven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Avbryt
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Spara ändringar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};