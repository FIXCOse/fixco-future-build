import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  useAllServiceAddons, 
  useAddServiceAddon, 
  useUpdateServiceAddon, 
  useDeleteServiceAddon,
  useToggleAddonActive,
  ServiceAddon 
} from '@/hooks/useServiceAddons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ServiceAddonsManagementProps {
  serviceId: string;
  serviceName: string;
}

const ServiceAddonsManagement = ({ serviceId, serviceName }: ServiceAddonsManagementProps) => {
  const { data: addons = [], isLoading } = useAllServiceAddons(serviceId, 'sv');
  const addAddon = useAddServiceAddon();
  const updateAddon = useUpdateServiceAddon();
  const deleteAddon = useDeleteServiceAddon();
  const toggleActive = useToggleAddonActive();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    title_sv: string;
    description_sv: string;
    addon_price: number;
    price_unit: string;
    rot_eligible: boolean;
    rut_eligible: boolean;
    icon: string;
  }>({
    title_sv: '',
    description_sv: '',
    addon_price: 0,
    price_unit: 'kr',
    rot_eligible: true,
    rut_eligible: false,
    icon: '',
  });

  const resetForm = () => {
    setFormData({
      title_sv: '',
      description_sv: '',
      addon_price: 0,
      price_unit: 'kr',
      rot_eligible: true,
      rut_eligible: false,
      icon: '',
    });
    setEditingAddon(null);
  };

  const handleEdit = (addon: ServiceAddon) => {
    setEditingAddon(addon);
    setFormData({
      title_sv: addon.title_sv,
      description_sv: addon.description_sv || '',
      addon_price: addon.addon_price,
      price_unit: addon.price_unit,
      rot_eligible: addon.rot_eligible,
      rut_eligible: addon.rut_eligible,
      icon: addon.icon || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title_sv.trim() || formData.addon_price <= 0) {
      return;
    }

    if (editingAddon) {
      await updateAddon.mutateAsync({
        id: editingAddon.id,
        ...formData,
      });
    } else {
      await addAddon.mutateAsync({
        service_id: serviceId,
        ...formData,
        is_active: true,
        sort_order: addons.length,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (addonToDelete) {
      await deleteAddon.mutateAsync(addonToDelete);
      setDeleteDialogOpen(false);
      setAddonToDelete(null);
    }
  };

  const confirmDelete = (addonId: string) => {
    setAddonToDelete(addonId);
    setDeleteDialogOpen(true);
  };

  const handleToggleActive = async (addonId: string, currentStatus: boolean) => {
    await toggleActive.mutateAsync({ id: addonId, is_active: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tilläggstjänster för: {serviceName}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Hantera valbara tillägg som kunder kan lägga till huvudtjänsten
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till tillägg
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddon ? 'Redigera tilläggstjänst' : 'Ny tilläggstjänst'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titel (Svenska) *</Label>
                <Input
                  id="title"
                  value={formData.title_sv}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_sv: e.target.value }))}
                  placeholder="T.ex. Kabelhantering"
                />
              </div>

              <div>
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={formData.description_sv}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_sv: e.target.value }))}
                  placeholder="Beskriv vad som ingår i tilläggstjänsten"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Pris *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.addon_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, addon_price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Enhet</Label>
                  <select
                    id="unit"
                    value={formData.price_unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_unit: e.target.value }))}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="kr">kr (engångskostnad)</option>
                    <option value="kr/h">kr/h (per timme)</option>
                    <option value="kr/st">kr/st (per styck)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="icon">Ikon (emoji eller text)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="🔌"
                  maxLength={10}
                />
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rot">ROT-berättigad</Label>
                  <Switch
                    id="rot"
                    checked={formData.rot_eligible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rot_eligible: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="rut">RUT-berättigad</Label>
                  <Switch
                    id="rut"
                    checked={formData.rut_eligible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rut_eligible: checked }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.title_sv.trim() || formData.addon_price <= 0}
                  className="flex-1"
                >
                  {editingAddon ? 'Uppdatera' : 'Lägg till'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                >
                  Avbryt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Inga tilläggstjänster ännu
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Skapa tilläggstjänster som kunder kan välja till huvudtjänsten, 
              t.ex. kabelhantering, bortforsling av gammal utrustning, etc.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addons.map((addon) => (
            <Card key={addon.id} className={!addon.is_active ? 'opacity-60' : ''}>
              <CardContent className="flex items-center gap-4 p-4">
                {addon.icon && (
                  <div className="text-2xl">{addon.icon}</div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{addon.title_sv}</h4>
                    {!addon.is_active && (
                      <Badge variant="secondary">Inaktiv</Badge>
                    )}
                  </div>
                  {addon.description_sv && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {addon.description_sv}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="default">
                      {addon.addon_price} {addon.price_unit}
                    </Badge>
                    {addon.rot_eligible && (
                      <Badge variant="outline">ROT</Badge>
                    )}
                    {addon.rut_eligible && (
                      <Badge variant="outline">RUT</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(addon.id, addon.is_active)}
                  >
                    {addon.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(addon)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(addon.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta bort tilläggstjänst?</AlertDialogTitle>
            <AlertDialogDescription>
              Denna åtgärd kan inte ångras. Tilläggstjänsten kommer att tas bort permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceAddonsManagement;
