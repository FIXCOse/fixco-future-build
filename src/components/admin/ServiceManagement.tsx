import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useServices, useAddService, useUpdateService, useTranslateAllPending, Service } from '@/hooks/useServices';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const ServiceManagement = () => {
  const { data: services = [], isLoading } = useServices('sv');
  const addService = useAddService();
  const updateService = useUpdateService();
  const translateAll = useTranslateAllPending();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<{
    id: string;
    category: string;
    title_sv: string;
    description_sv: string;
    base_price: number;
    price_unit: string;
    price_type: 'hourly' | 'fixed' | 'quote';
    rot_eligible: boolean;
    rut_eligible: boolean;
    location: 'inomhus' | 'utomhus' | 'båda';
    sub_category: string;
    sort_order: number;
    is_active: boolean;
  }>({
    id: '',
    category: '',
    title_sv: '',
    description_sv: '',
    base_price: 0,
    price_unit: 'kr/h',
    price_type: 'hourly',
    rot_eligible: true,
    rut_eligible: false,
    location: 'inomhus',
    sub_category: '',
    sort_order: 0,
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      id: '',
      category: '',
      title_sv: '',
      description_sv: '',
      base_price: 0,
      price_unit: 'kr/h',
      price_type: 'hourly',
      rot_eligible: true,
      rut_eligible: false,
      location: 'inomhus',
      sub_category: '',
      sort_order: 0,
      is_active: true
    });
    setEditingService(null);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
    resetForm();
  };

  const handleEdit = (service: Service) => {
    setFormData({
      id: service.id,
      category: service.category,
      title_sv: service.title_sv,
      description_sv: service.description_sv,
      base_price: service.base_price,
      price_unit: service.price_unit,
      price_type: service.price_type,
      rot_eligible: service.rot_eligible,
      rut_eligible: service.rut_eligible,
      location: service.location,
      sub_category: service.sub_category || '',
      sort_order: service.sort_order,
      is_active: service.is_active
    });
    setEditingService(service);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      updateService.mutate({
        id: editingService.id,
        updates: formData
      }, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          resetForm();
        }
      });
    } else {
      addService.mutate(formData, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          resetForm();
        }
      });
    }
  };

  const getTranslationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Klar</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Väntar</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Misslyckades</Badge>;
      default:
        return <Badge variant="outline">Okänd</Badge>;
    }
  };

  const categories = ['el', 'vvs', 'snickeri', 'montering', 'tradgard', 'stadning', 'markarbeten', 'tekniska-installationer', 'flytt'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Laddar tjänster...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tjänsthantering</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => translateAll.mutate()}
            disabled={translateAll.isPending}
            variant="outline"
          >
            {translateAll.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Översätt alla väntande
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Lägg till tjänst
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.title_sv}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{service.category}</Badge>
                    {service.sub_category && (
                      <Badge variant="secondary">{service.sub_category}</Badge>
                    )}
                    <Badge variant={service.rot_eligible ? "default" : "secondary"}>
                      ROT: {service.rot_eligible ? 'Ja' : 'Nej'}
                    </Badge>
                    <Badge variant={service.rut_eligible ? "default" : "secondary"}>
                      RUT: {service.rut_eligible ? 'Ja' : 'Nej'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTranslationStatusBadge(service.translation_status)}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{service.description_sv}</p>
              <div className="flex justify-between items-center text-sm">
                <span>Pris: {service.base_price} {service.price_unit}</span>
                <span>Typ: {service.price_type}</span>
                <span>Plats: {service.location}</span>
              </div>
              {service.title_en && (
                <div className="mt-3 pt-3 border-t">
                  <p className="font-medium text-sm">Engelsk översättning:</p>
                  <p className="text-sm font-medium">{service.title_en}</p>
                  <p className="text-sm text-muted-foreground">{service.description_en}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Redigera tjänst' : 'Lägg till ny tjänst'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">Tjänst-ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="t.ex. el-12"
                  required
                  disabled={!!editingService}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title_sv">Titel (Svenska)</Label>
              <Input
                id="title_sv"
                value={formData.title_sv}
                onChange={(e) => setFormData(prev => ({ ...prev, title_sv: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description_sv">Beskrivning (Svenska)</Label>
              <Textarea
                id="description_sv"
                value={formData.description_sv}
                onChange={(e) => setFormData(prev => ({ ...prev, description_sv: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="base_price">Pris</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price_unit">Prisenhet</Label>
                <Select
                  value={formData.price_unit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, price_unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kr/h">kr/h</SelectItem>
                    <SelectItem value="kr">kr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price_type">Pristyp</Label>
                <Select
                  value={formData.price_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, price_type: value as any }))}
                >
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sub_category">Underkategori</Label>
                <Input
                  id="sub_category"
                  value={formData.sub_category}
                  onChange={(e) => setFormData(prev => ({ ...prev, sub_category: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Plats</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inomhus">Inomhus</SelectItem>
                    <SelectItem value="utomhus">Utomhus</SelectItem>
                    <SelectItem value="båda">Båda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="rot_eligible"
                  checked={formData.rot_eligible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rot_eligible: checked }))}
                />
                <Label htmlFor="rot_eligible">ROT-berättigad</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="rut_eligible"
                  checked={formData.rut_eligible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rut_eligible: checked }))}
                />
                <Label htmlFor="rut_eligible">RUT-berättigad</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="sort_order">Sorteringsordning</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Avbryt
              </Button>
              <Button 
                type="submit" 
                disabled={addService.isPending || updateService.isPending}
              >
                {(addService.isPending || updateService.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingService ? 'Uppdatera' : 'Lägg till'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;