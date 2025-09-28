import React, { useState } from 'react';
import { Edit, Save, X, Type, Image, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditMode } from '@/contexts/EditModeContext';
import { toast } from 'sonner';

interface ContentEditorProps {
  content: {
    id: string;
    type: 'text' | 'heading' | 'image' | 'list' | 'button';
    value: string | string[];
    className?: string;
    placeholder?: string;
  };
  onSave: (newContent: any) => void;
  className?: string;
  children: React.ReactNode;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onSave,
  className = '',
  children
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(content);

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  const handleEdit = () => {
    setEditData(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
    toast.success('Innehåll uppdaterat');
  };

  const handleCancel = () => {
    setEditData(content);
    setIsEditing(false);
  };

  const updateValue = (newValue: string | string[]) => {
    setEditData(prev => ({ ...prev, value: newValue }));
  };

  const renderEditor = () => {
    switch (editData.type) {
      case 'text':
        return (
          <Textarea
            value={editData.value as string}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={editData.placeholder || 'Skriv text...'}
            className="min-h-[100px]"
          />
        );
      case 'heading':
        return (
          <Input
            value={editData.value as string}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={editData.placeholder || 'Rubrik...'}
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={editData.value as string}
              onChange={(e) => updateValue(e.target.value)}
              placeholder="Bild URL..."
            />
            {editData.value && (
              <img 
                src={editData.value as string} 
                alt="Preview" 
                className="w-full max-w-xs h-auto rounded"
              />
            )}
          </div>
        );
      case 'list':
        const listItems = Array.isArray(editData.value) ? editData.value : [editData.value as string];
        return (
          <div className="space-y-2">
            {listItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...listItems];
                    newItems[index] = e.target.value;
                    updateValue(newItems);
                  }}
                  placeholder={`Punkt ${index + 1}...`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newItems = listItems.filter((_, i) => i !== index);
                    updateValue(newItems);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateValue([...listItems, ''])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Lägg till punkt
            </Button>
          </div>
        );
      case 'button':
        return (
          <Input
            value={editData.value as string}
            onChange={(e) => updateValue(e.target.value)}
            placeholder="Knapptext..."
          />
        );
      default:
        return (
          <Textarea
            value={editData.value as string}
            onChange={(e) => updateValue(e.target.value)}
            placeholder="Innehåll..."
          />
        );
    }
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        {children}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleEdit}
            className="shadow-lg"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {content.type === 'text' && <Type className="h-5 w-5" />}
              {content.type === 'heading' && <Type className="h-5 w-5" />}
              {content.type === 'image' && <Image className="h-5 w-5" />}
              {content.type === 'list' && <List className="h-5 w-5" />}
              Redigera innehåll
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Typ</label>
              <Select
                value={editData.type}
                onValueChange={(value: any) => setEditData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="heading">Rubrik</SelectItem>
                  <SelectItem value="image">Bild</SelectItem>
                  <SelectItem value="list">Lista</SelectItem>
                  <SelectItem value="button">Knapp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Innehåll</label>
              {renderEditor()}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Avbryt
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Spara
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};