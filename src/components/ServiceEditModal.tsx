import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    basePrice: number;
    priceType: string;
  } | null;
  onSave: (updatedService: any) => void;
}

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    category: service?.category || '',
    basePrice: service?.basePrice || 0,
    priceType: service?.priceType || 'hourly'
  });

  React.useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        basePrice: service.basePrice,
        priceType: service.priceType
      });
    }
  }, [service]);

  const handleSave = () => {
    if (!service) return;
    
    const updatedService = {
      ...service,
      ...formData
    };
    
    onSave(updatedService);
    toast.success('Tjänst uppdaterad');
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Redigera tjänst</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="el">El</SelectItem>
                <SelectItem value="vvs">VVS</SelectItem>
                <SelectItem value="snickeri">Snickeri</SelectItem>
                <SelectItem value="montering">Montering</SelectItem>
                <SelectItem value="tradgard">Trädgård</SelectItem>
                <SelectItem value="stadning">Städning</SelectItem>
                <SelectItem value="markarbeten">Markarbeten</SelectItem>
                <SelectItem value="tekniska-installationer">Tekniska installationer</SelectItem>
                <SelectItem value="flytt">Flytt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priceType">Pristyp</Label>
            <Select value={formData.priceType} onValueChange={(value) => setFormData(prev => ({ ...prev, priceType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Timpris</SelectItem>
                <SelectItem value="fixed">Fast pris</SelectItem>
                <SelectItem value="quote">Offert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="basePrice">Grundpris (kr)</Label>
            <Input
              id="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
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