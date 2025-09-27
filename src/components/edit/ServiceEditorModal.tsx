import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { History, Save, X } from 'lucide-react';
import { useEditMode } from '@/stores/useEditMode';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  title_sv: string;
  title_en?: string;
  description_sv: string;
  description_en?: string;
  base_price: number;
  price_type: string;
  category: string;
  sub_category?: string;
  is_active: boolean;
  rot_eligible: boolean;
  rut_eligible: boolean;
}

interface ServiceVersion {
  id: number;
  snapshot: Service;
  edited_by: string;
  edited_at: string;
}

interface ServiceEditorModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceEditorModal: React.FC<ServiceEditorModalProps> = ({
  service,
  isOpen,
  onClose
}) => {
  const { stage } = useEditMode();
  const [formData, setFormData] = useState<Service>(service);
  const [activeTab, setActiveTab] = useState('sv');

  // Fetch service versions for history
  const { data: versions } = useQuery({
    queryKey: ['service-versions', service.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_versions')
        .select(`
          id,
          snapshot,
          edited_by,
          edited_at
        `)
        .eq('service_id', service.id)
        .order('edited_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data?.map(item => ({
        id: item.id,
        edited_at: item.edited_at,
        edited_by: item.edited_by,
        snapshot: item.snapshot as unknown as Service
      })) || [];
    },
    enabled: isOpen
  });

  useEffect(() => {
    setFormData(service);
  }, [service]);

  const handleSave = () => {
    // Stage the changes
    const patch = {
      title_sv: formData.title_sv,
      title_en: formData.title_en,
      description_sv: formData.description_sv,
      description_en: formData.description_en,
      base_price: formData.base_price,
      price_type: formData.price_type,
      category: formData.category,
      sub_category: formData.sub_category,
      is_active: formData.is_active,
      rot_eligible: formData.rot_eligible,
      rut_eligible: formData.rut_eligible
    };

    stage(`service:${service.id}`, patch, 'service');
    onClose();
  };

  const handleRestore = (version: ServiceVersion) => {
    if (confirm('Vill du återställa till denna version? Osparade ändringar går förlorade.')) {
      setFormData(version.snapshot);
    }
  };

  const categories = [
    'Bygg & Renovering',
    'Rör & VVS', 
    'El & Automation',
    'Måleri & Finish',
    'Trädgård & Utemiljö',
    'Service & Underhåll'
  ];

  const priceTypes = [
    { value: 'hourly', label: 'Per timme' },
    { value: 'fixed', label: 'Fast pris' },
    { value: 'quote', label: 'Offerteras' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Redigera tjänst: {service.title_sv}
            <Badge variant={formData.is_active ? 'default' : 'secondary'}>
              {formData.is_active ? 'Aktiv' : 'Inaktiv'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sv">Svenska</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="settings">Inställningar</TabsTrigger>
          </TabsList>

          <TabsContent value="sv" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title_sv">Titel (Svenska)</Label>
                <Input
                  id="title_sv"
                  value={formData.title_sv}
                  onChange={(e) => setFormData({ ...formData, title_sv: e.target.value })}
                  placeholder="Tjänstetitel på svenska"
                />
              </div>

              <div>
                <Label htmlFor="description_sv">Beskrivning (Svenska)</Label>
                <Textarea
                  id="description_sv"
                  value={formData.description_sv}
                  onChange={(e) => setFormData({ ...formData, description_sv: e.target.value })}
                  placeholder="Detaljerad beskrivning på svenska"
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="en" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title_en">Titel (English)</Label>
                <Input
                  id="title_en"
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Service title in English"
                />
              </div>

              <div>
                <Label htmlFor="description_en">Beskrivning (English)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en || ''}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Detailed description in English"
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Prissättning</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base_price">Grundpris</Label>
                    <Input
                      id="base_price"
                      type="number"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_type">Pristyp</Label>
                    <Select
                      value={formData.price_type}
                      onValueChange={(value) => setFormData({ ...formData, price_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Kategorisering</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sub_category">Underkategori</Label>
                    <Input
                      id="sub_category"
                      value={formData.sub_category || ''}
                      onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                      placeholder="Valfritt"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Inställningar</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Aktiv tjänst</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="rot_eligible">ROT-berättigad</Label>
                    <Switch
                      id="rot_eligible"
                      checked={formData.rot_eligible}
                      onCheckedChange={(checked) => setFormData({ ...formData, rot_eligible: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="rut_eligible">RUT-berättigad</Label>
                    <Switch
                      id="rut_eligible"
                      checked={formData.rut_eligible}
                      onCheckedChange={(checked) => setFormData({ ...formData, rut_eligible: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Version History */}
            {versions && versions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Versionshistorik
                  </h3>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {versions.map((version) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {new Date(version.edited_at).toLocaleString('sv-SE')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Version {version.id}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(version)}
                        >
                          Återställ
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Avbryt
          </Button>
          
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Spara ändringar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};