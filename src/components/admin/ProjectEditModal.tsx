import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, Upload, Trash2, Star, Calendar, Loader2 } from 'lucide-react';
import { ReferenceProject } from '@/hooks/useReferenceProjects';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectEditModalProps {
  project: ReferenceProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<ReferenceProject>) => void;
  isCreating?: boolean;
}

const categories = [
  'Kök & Badrum',
  'Badrum',
  'Vardagsrum',
  'Sovrum',
  'Barnrum',
  'Kontor & Arbetsrum',
  'Trädgård & Utomhus',
  'Balkong & Altan',
  'Entré & Hall',
  'Förråd & Garage'
];

export default function ProjectEditModal({ 
  project, 
  isOpen, 
  onClose, 
  onSave, 
  isCreating = false 
}: ProjectEditModalProps) {
  const [formData, setFormData] = useState<Partial<ReferenceProject>>({
    title: '',
    description: '',
    location: '',
    category: categories[0],
    duration: '',
    completed_date: new Date().toISOString().split('T')[0],
    price_amount: 0,
    rot_saving_amount: 0,
    rut_saving_amount: 0,
    rating: 5,
    client_initials: '',
    features: [],
    images: [],
    is_featured: false,
    sort_order: 0,
    is_active: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        location: project.location,
        category: project.category,
        duration: project.duration,
        completed_date: project.completed_date,
        price_amount: project.price_amount,
        rot_saving_amount: project.rot_saving_amount,
        rut_saving_amount: project.rut_saving_amount,
        rating: project.rating,
        client_initials: project.client_initials,
        features: project.features || [],
        images: project.images || [],
        is_featured: project.is_featured,
        sort_order: project.sort_order,
        is_active: project.is_active,
      });
    } else if (isCreating) {
      setFormData({
        title: '',
        description: '',
        location: '',
        category: categories[0],
        duration: '',
        completed_date: new Date().toISOString().split('T')[0],
        price_amount: 0,
        rot_saving_amount: 0,
        rut_saving_amount: 0,
        rating: 5,
        client_initials: '',
        features: [],
        images: [],
        is_featured: false,
        sort_order: 0,
        is_active: true,
      });
    }
  }, [project, isCreating]);

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== featureToRemove) || []
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !formData.images?.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== imageToRemove) || []
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${Date.now()}-${i}`;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ogiltigt filformat",
          description: "Endast bildfiler är tillåtna.",
          variant: "destructive",
        });
        continue;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Maximal filstorlek är 5MB.",
          variant: "destructive",
        });
        continue;
      }

      setUploadingImages(prev => new Set(prev).add(fileId));

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reference-projects')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('reference-projects')
          .getPublicUrl(filePath);

        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), publicUrl]
        }));

        toast({
          title: "Bild uppladdad",
          description: "Bilden har laddats upp framgångsrikt.",
        });

      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Uppladdning misslyckades",
          description: "Kunde inte ladda upp bilden. Försök igen.",
          variant: "destructive",
        });
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            {isCreating ? 'Skapa nytt referensprojekt' : 'Redigera referensprojekt'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Projekttitel *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="t.ex. Moderna köksrenovering"
              />
            </div>

            <div>
              <Label htmlFor="description">Beskrivning *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detaljerad beskrivning av projektet"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Plats *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="t.ex. Östermalm, Stockholm"
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Projektlängd *</Label>
                <Input
                  id="duration"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="t.ex. 3 veckor"
                />
              </div>

              <div>
                <Label htmlFor="completed_date">Färdigställt datum *</Label>
                <Input
                  id="completed_date"
                  type="date"
                  value={formData.completed_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, completed_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_initials">Klientinitialer *</Label>
                <Input
                  id="client_initials"
                  value={formData.client_initials || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_initials: e.target.value }))}
                  placeholder="t.ex. M.L"
                  maxLength={5}
                />
              </div>

              <div>
                <Label htmlFor="rating">Betyg</Label>
                <Select 
                  value={formData.rating?.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} stjärn{rating !== 1 ? 'or' : 'a'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial & Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_amount">Totalpris (kr) *</Label>
                <Input
                  id="price_amount"
                  type="number"
                  value={formData.price_amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_amount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="rot_saving_amount">ROT-besparing (kr)</Label>
                <Input
                  id="rot_saving_amount"
                  type="number"
                  value={formData.rot_saving_amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, rot_saving_amount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rut_saving_amount">RUT-besparing (kr)</Label>
                <Input
                  id="rut_saving_amount"
                  type="number"
                  value={formData.rut_saving_amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, rut_saving_amount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="sort_order">Sorteringsordning</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                Utvalda projekt
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                Aktivt
              </label>
            </div>

            {/* Features Management */}
            <div>
              <Label>Projektfunktioner</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Lägg till ny funktion..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                />
                <Button onClick={handleAddFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Images Management */}
            <div>
              <Label>Projektbilder</Label>
              
              {/* File Upload */}
              <div className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <Button 
                  onClick={triggerFileUpload} 
                  variant="outline" 
                  className="w-full"
                  disabled={uploadingImages.size > 0}
                >
                  {uploadingImages.size > 0 ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Laddar upp bilder...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Ladda upp bilder från enhet
                    </>
                  )}
                </Button>
              </div>

              {/* URL Input */}
              <div className="flex gap-2 mb-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Eller ange bildlänk (URL)..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                />
                <Button onClick={handleAddImage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {formData.images?.map((image, index) => (
                  <Card key={index} className="relative group">
                    <CardContent className="p-2">
                      <img 
                        src={image} 
                        alt={`Project ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.title || !formData.description || !formData.location}
          >
            {isCreating ? 'Skapa projekt' : 'Spara ändringar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}