import React, { useState } from 'react';
import { Settings, Palette, Layout, Type, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useContentStore } from '@/stores/contentStore';

interface SectionEditorProps {
  sectionId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    title?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    visibility?: boolean;
    customCss?: string;
  };
  onSave: (data: any) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  sectionId,
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const { updateSection, getSection } = useContentStore();
  
  // Load saved section data
  const savedSection = getSection(sectionId);
  const mergedData = { ...initialData, ...savedSection };
  
  const [formData, setFormData] = useState({
    title: mergedData.title || '',
    backgroundColor: mergedData.backgroundColor || '',
    textColor: mergedData.textColor || '',
    padding: mergedData.padding || 'default',
    margin: mergedData.margin || 'default',
    visibility: mergedData.visibility !== false,
    customCss: mergedData.customCss || '',
  });

  const handleSave = () => {
    // Save to store
    updateSection(sectionId, formData);
    
    // Call parent callback
    onSave(formData);
    
    toast.success('Sektion uppdaterad och sparad!');
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Redigera sektion: {sectionId}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Allmänt</TabsTrigger>
            <TabsTrigger value="style">Stil</TabsTrigger>
            <TabsTrigger value="advanced">Avancerat</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Sektionsnamn..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="visibility"
                checked={formData.visibility}
                onCheckedChange={(checked) => updateField('visibility', checked)}
              />
              <Label htmlFor="visibility">Synlig</Label>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bakgrundsfärg</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => updateField('backgroundColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.backgroundColor}
                    onChange={(e) => updateField('backgroundColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Textfärg</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => updateField('textColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.textColor}
                    onChange={(e) => updateField('textColor', e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Padding</Label>
                <Select value={formData.padding} onValueChange={(value) => updateField('padding', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj padding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Standard</SelectItem>
                    <SelectItem value="p-2">Liten (p-2)</SelectItem>
                    <SelectItem value="p-4">Medium (p-4)</SelectItem>
                    <SelectItem value="p-6">Stor (p-6)</SelectItem>
                    <SelectItem value="p-8">Extra stor (p-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Margin</Label>
                <Select value={formData.margin} onValueChange={(value) => updateField('margin', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj margin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Standard</SelectItem>
                    <SelectItem value="m-2">Liten (m-2)</SelectItem>
                    <SelectItem value="m-4">Medium (m-4)</SelectItem>
                    <SelectItem value="m-6">Stor (m-6)</SelectItem>
                    <SelectItem value="m-8">Extra stor (m-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label>Anpassad CSS</Label>
              <Textarea
                value={formData.customCss}
                onChange={(e) => updateField('customCss', e.target.value)}
                placeholder="Lägg till anpassad CSS..."
                className="font-mono text-sm"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Använd Tailwind CSS-klasser eller anpassad CSS
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>
            Spara ändringar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};