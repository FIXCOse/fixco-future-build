import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Loader2, CheckCircle, XCircle, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { useServices, useAddService, useUpdateService, Service } from '@/hooks/useServices';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ServiceManagement = () => {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useServices('sv');
  const addService = useAddService();
  const updateService = useUpdateService();
  
  // Hook for reordering services
  const reorderServices = useMutation({
    mutationFn: async ({ services: servicesToUpdate }: { services: { id: string; sort_order: number }[] }) => {
      // Update each service individually since we only want to update sort_order
      for (const service of servicesToUpdate) {
        const { error } = await supabase
          .from('services')
          .update({ sort_order: service.sort_order })
          .eq('id', service.id);
        
        if (error) throw error;
      }
      return servicesToUpdate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Ordning uppdaterad!');
    },
    onError: (error) => {
      toast.error('Fel vid uppdatering av ordning: ' + error.message);
    }
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const moveService = (serviceId: string, direction: 'up' | 'down') => {
    const currentIndex = filteredServices.findIndex(s => s.id === serviceId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= filteredServices.length) return;
    
    // Create new sort orders
    const servicesToUpdate = filteredServices.map((service, index) => {
      let newSortOrder = service.sort_order;
      
      if (index === currentIndex) {
        newSortOrder = filteredServices[newIndex].sort_order;
      } else if (index === newIndex) {
        newSortOrder = filteredServices[currentIndex].sort_order;
      }
      
      return {
        id: service.id,
        sort_order: newSortOrder
      };
    });
    
    reorderServices.mutate({ services: servicesToUpdate });
  };

  const categories = ['el', 'vvs', 'snickeri', 'montering', 'tradgard', 'stadning', 'markarbeten', 'tekniska-installationer', 'flytt'];
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

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
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Lägg till tjänst
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="category-filter">Filtrera efter kategori:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Välj kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla kategorier</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory !== 'all' && (
          <Badge variant="outline">
            {filteredServices.length} tjänster i {selectedCategory}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((service, index) => (
          <Card key={service.id} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{service.category}</Badge>
                  <Badge variant="secondary" className="text-xs">#{service.sort_order}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  {getTranslationStatusBadge(service.translation_status)}
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => moveService(service.id, 'up')}
                      disabled={index === 0 || reorderServices.isPending}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => moveService(service.id, 'down')}
                      disabled={index === filteredServices.length - 1 || reorderServices.isPending}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(service)} className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-sm font-medium leading-tight mb-2">{service.title_sv}</CardTitle>
              <div className="flex items-center gap-1 mb-2">
                <Badge variant={service.rot_eligible ? "default" : "secondary"} className="text-xs px-1 py-0">
                  ROT
                </Badge>
                <Badge variant={service.rut_eligible ? "default" : "secondary"} className="text-xs px-1 py-0">
                  RUT
                </Badge>
                {service.sub_category && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">{service.sub_category}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{service.description_sv}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">Pris:</span>
                  <span>{service.base_price} {service.price_unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Typ:</span>
                  <span>{service.price_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Plats:</span>
                  <span>{service.location}</span>
                </div>
                {!service.is_active && (
                  <Badge variant="destructive" className="w-full justify-center text-xs mt-2">Inaktiv</Badge>
                )}
              </div>
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