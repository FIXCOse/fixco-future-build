import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Upload, Trash2, Star, Calendar, Loader2, Languages, ArrowUp, ArrowDown } from 'lucide-react';
import { ReferenceProject } from '@/hooks/useReferenceProjects';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProjectEditModalProps {
  project: ReferenceProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<ReferenceProject>) => void;
  isCreating?: boolean;
}

const categories = [
  'Totalrenovering',
  'Köksrenovering',
  'Kök & Badrum',
  'Badrum',
  'Badrumstotalrenovering',
  'Vardagsrum',
  'Sovrum',
  'Barnrum',
  'Kontor & Arbetsrum',
  'Trädgård & Utomhus',
  'Balkong & Altan',
  'Entré & Hall',
  'Förråd & Garage',
  'Fasad & Exteriör',
  'Golvläggning',
  'Målning & Tapetsering',
  'El & Belysning',
  'VVS & Rör',
  'Fönster & Dörrar',
  'Plattläggning'
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
    features: [],
    title_sv: '',
    title_en: '',
    description_sv: '',
    description_en: '',
    location_sv: '',
    location_en: '',
    category_sv: categories[0],
    category_en: '',
    features_sv: [],
    features_en: [],
    duration: '',
    completed_date: new Date().toISOString().split('T')[0],
    price_amount: 0,
    rot_saving_amount: 0,
    rut_saving_amount: 0,
    rating: 5,
    client_initials: '',
    images: [],
    thumbnail_image: null,
    is_featured: false,
    sort_order: 0,
    is_active: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check user permissions on modal open
  useEffect(() => {
    const checkPermissions = async () => {
      if (!isOpen || !user) return;
      
      console.log('🔐 Checking permissions for user:', user.id);
      console.log('🔐 User email:', user.email);
      
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('🔐 Error fetching roles:', error);
      } else {
        console.log('🔐 User roles:', roles);
      }
    };
    
    checkPermissions();
  }, [isOpen, user]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        location: project.location,
        category: project.category,
        features: project.features || [],
        title_sv: project.title_sv,
        title_en: project.title_en || '',
        description_sv: project.description_sv,
        thumbnail_image: project.thumbnail_image || null,
        description_en: project.description_en || '',
        location_sv: project.location_sv,
        location_en: project.location_en || '',
        category_sv: project.category_sv,
        category_en: project.category_en || '',
        features_sv: project.features_sv || [],
        features_en: project.features_en || [],
        duration: project.duration,
        completed_date: project.completed_date,
        price_amount: project.price_amount,
        rot_saving_amount: project.rot_saving_amount,
        rut_saving_amount: project.rut_saving_amount,
        rating: project.rating,
        client_initials: project.client_initials,
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
        features: [],
        title_sv: '',
        title_en: '',
        description_sv: '',
        description_en: '',
        location_sv: '',
        location_en: '',
        category_sv: categories[0],
        category_en: '',
        features_sv: [],
        features_en: [],
        duration: '',
        completed_date: new Date().toISOString().split('T')[0],
        price_amount: 0,
        rot_saving_amount: 0,
        rut_saving_amount: 0,
        rating: 5,
        client_initials: '',
        images: [],
        thumbnail_image: null,
        is_featured: false,
        sort_order: 0,
        is_active: true,
      });
    }
  }, [project, isCreating]);

  const handleAddFeature = (lang: 'sv' | 'en') => {
    const field = lang === 'sv' ? 'features_sv' : 'features_en';
    if (newFeature.trim() && !formData[field]?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string, lang: 'sv' | 'en') => {
    const field = lang === 'sv' ? 'features_sv' : 'features_en';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter(f => f !== featureToRemove) || []
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

  const handleMoveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...(formData.images || [])];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setFormData(prev => ({ ...prev, images: newImages }));
    toast({
      title: "Ordning uppdaterad",
      description: `Bild flyttad uppåt till position ${index}.`,
    });
  };

  const handleMoveImageDown = (index: number) => {
    if (!formData.images || index === formData.images.length - 1) return;
    const newImages = [...formData.images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setFormData(prev => ({ ...prev, images: newImages }));
    toast({
      title: "Ordning uppdaterad",
      description: `Bild flyttad nedåt till position ${index + 2}.`,
    });
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
    console.log('💾 handleSave called with formData:', formData);
    
    // Validera obligatoriska fält
    const requiredFields = {
      title_sv: formData.title_sv,
      description_sv: formData.description_sv,
      location_sv: formData.location_sv,
      category_sv: formData.category_sv,
      duration: formData.duration,
      completed_date: formData.completed_date,
      price_amount: formData.price_amount,
      rating: formData.rating,
      client_initials: formData.client_initials,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      toast({
        title: "Obligatoriska fält saknas",
        description: `Vänligen fyll i: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validera rating
    if (formData.rating < 1 || formData.rating > 5) {
      console.error('❌ Invalid rating:', formData.rating);
      toast({
        title: "Ogiltigt betyg",
        description: "Betyget måste vara mellan 1 och 5",
        variant: "destructive",
      });
      return;
    }

    // Validera att features_sv är en array
    if (!Array.isArray(formData.features_sv)) {
      console.error('❌ features_sv is not an array:', formData.features_sv);
      toast({
        title: "Ogiltigt format",
        description: "Egenskaper måste vara en lista",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ All validations passed, saving project...');
    onSave(formData);
    onClose();
  };

  const handleAutoTranslate = async () => {
    if (!project?.id) {
      toast({
        title: "Error",
        description: "Project ID required for translation",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-reference-project', {
        body: { project_id: project.id }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project translated successfully!",
      });
      
      // Reload form data
      const { data: updatedProject } = await supabase
        .from('reference_projects')
        .select('*')
        .eq('id', project.id)
        .single();

      if (updatedProject) {
        setFormData(updatedProject);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Error",
        description: "Failed to translate project",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            {isCreating ? 'Skapa nytt referensprojekt' : 'Redigera referensprojekt'}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Wrapper */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Tabs defaultValue="sv" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sv">🇸🇪 Svenska</TabsTrigger>
            <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
          </TabsList>

          <TabsContent value="sv" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title_sv">Projekttitel (Svenska) *</Label>
              <Input
                id="title_sv"
                value={formData.title_sv || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title_sv: e.target.value }))}
                placeholder="t.ex. Moderna köksrenovering"
              />
            </div>

            <div>
              <Label htmlFor="description_sv">Beskrivning (Svenska) *</Label>
              <Textarea
                id="description_sv"
                value={formData.description_sv || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description_sv: e.target.value }))}
                placeholder="Detaljerad beskrivning av projektet"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_sv">Plats (Svenska) *</Label>
                <Input
                  id="location_sv"
                  value={formData.location_sv || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_sv: e.target.value }))}
                  placeholder="t.ex. Östermalm, Stockholm"
                />
              </div>

              <div>
                <Label htmlFor="category_sv">Kategori (Svenska) *</Label>
                <Select 
                  value={formData.category_sv} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_sv: value }))}
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

            <div>
              <Label>Projektfunktioner (Svenska) *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Lägg till ny funktion..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('sv')}
                />
                <Button onClick={() => handleAddFeature('sv')} size="sm" type="button">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features_sv?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveFeature(feature, 'sv')}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="en" className="space-y-4 mt-4">
            {project?.id && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <Button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  variant="secondary"
                  className="w-full"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="mr-2 h-4 w-4" />
                      🤖 Auto-translate from Swedish
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Uses AI to translate all Swedish fields to English
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="title_en">Project Title (English)</Label>
              <Input
                id="title_en"
                value={formData.title_en || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                placeholder="e.g. Modern Kitchen Renovation"
              />
            </div>

            <div>
              <Label htmlFor="description_en">Description (English)</Label>
              <Textarea
                id="description_en"
                value={formData.description_en || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                placeholder="Detailed project description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_en">Location (English)</Label>
                <Input
                  id="location_en"
                  value={formData.location_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_en: e.target.value }))}
                  placeholder="e.g. Östermalm, Stockholm"
                />
              </div>

              <div>
                <Label htmlFor="category_en">Category (English)</Label>
                <Input
                  id="category_en"
                  value={formData.category_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_en: e.target.value }))}
                  placeholder="e.g. Kitchen & Bathroom"
                />
              </div>
            </div>

            <div>
              <Label>Project Features (English)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature('en')}
                />
                <Button onClick={() => handleAddFeature('en')} size="sm" type="button">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features_en?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveFeature(feature, 'en')}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">

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
              
              {formData.images && formData.images.length > 0 ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    💡 Använd pilarna för att ändra ordning. Klicka på "Sätt som thumbnail" för att välja huvudbild.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((image, index) => (
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
                          
                          {/* Image Number Badge */}
                          <Badge 
                            variant="secondary" 
                            className="absolute bottom-2 left-2 text-xs"
                          >
                            {index + 1}
                          </Badge>

                          {/* Thumbnail Badge */}
                          {formData.thumbnail_image === image && (
                            <Badge 
                              variant="default" 
                              className="absolute top-1 left-1 bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-0.5"
                            >
                              Thumbnail
                            </Badge>
                          )}

                          {/* Move Up Button */}
                          {index > 0 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                              onClick={() => handleMoveImageUp(index)}
                              type="button"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                          )}

                          {/* Move Down Button */}
                          {index < formData.images.length - 1 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-8 left-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                              onClick={() => handleMoveImageDown(index)}
                              type="button"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {/* Set as Thumbnail Button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs py-1 px-2 h-auto"
                            onClick={() => setFormData(prev => ({ ...prev, thumbnail_image: image }))}
                            type="button"
                          >
                            Sätt som thumbnail
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                            onClick={() => handleRemoveImage(image)}
                            type="button"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Inga bilder uppladdade än
                </p>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Actions - Fixed Footer */}
        <div className="flex justify-end gap-4 pt-4 border-t px-6 pb-4 flex-shrink-0">
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