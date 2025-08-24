import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { Plus, MapPin, Edit, Trash2, Star, Calendar, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface Property {
  id: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  type: 'apartment' | 'house' | 'office' | 'warehouse' | 'other';
  description?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

const PropertiesPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postal_code: '',
    city: '',
    type: 'apartment' as Property['type'],
    description: '',
    notes: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadProperties();
    }
  }, [user?.id]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user!.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda fastigheter",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        owner_id: user!.id,
        organization_id: null
      };

      let result;
      if (editingProperty) {
        result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Klart!",
        description: editingProperty ? "Fastighet uppdaterad" : "Fastighet tillagd"
      });

      setIsAddDialogOpen(false);
      setEditingProperty(null);
      resetForm();
      await loadProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara fastighet",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (property: Property) => {
    if (!confirm('Är du säker på att du vill ta bort denna fastighet?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Klart!",
        description: "Fastighet borttagen"
      });

      await loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ta bort fastighet",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      postal_code: '',
      city: '',
      type: 'apartment',
      description: '',
      notes: ''
    });
  };

  const startEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address: property.address,
      postal_code: property.postal_code,
      city: property.city,
      type: property.type,
      description: property.description || '',
      notes: property.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      'apartment': 'Lägenhet',
      'house': 'Hus',
      'office': 'Kontor',
      'warehouse': 'Lager',
      'other': 'Övrigt'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (!profile) {
    return <div>Laddar...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Fastigheter | Mitt Fixco</title>
        <meta name="description" content="Hantera dina fastigheter och adresser" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <DashboardHeader profile={profile} />

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Fastigheter</h2>
            <p className="text-muted-foreground">Hantera dina adresser och fastigheter</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Lägg till fastighet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'Redigera fastighet' : 'Lägg till fastighet'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Namn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="t.ex. Hemma, Sommarstugan"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adress</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Gatuadress och nummer"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postnummer</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      placeholder="12345"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ort</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Stockholm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Typ av fastighet</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Property['type']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Lägenhet</SelectItem>
                      <SelectItem value="house">Hus</SelectItem>
                      <SelectItem value="office">Kontor</SelectItem>
                      <SelectItem value="warehouse">Lager</SelectItem>
                      <SelectItem value="other">Övrigt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beskrivning (valfritt)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Beskriv fastigheten..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Anteckningar (valfritt)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Särskilda noteringar..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit">
                    {editingProperty ? 'Uppdatera' : 'Lägg till'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Inga fastigheter ännu</h3>
              <p className="text-muted-foreground text-center mb-6">
                Lägg till dina adresser för att snabbare kunna boka tjänster
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Lägg till första fastigheten
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  {/* Same form content as above */}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{property.name}</span>
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {getPropertyTypeLabel(property.type)}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(property)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(property)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="text-sm">
                      <div>{property.address}</div>
                      <div className="text-muted-foreground">
                        {property.postal_code} {property.city}
                      </div>
                    </div>
                  </div>
                  
                  {property.description && (
                    <p className="text-sm text-muted-foreground">
                      {property.description}
                    </p>
                  )}

                  <div className="pt-2 border-t">
                    <Link to={`/boka-hembesok?property=${property.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Boka tjänst här
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PropertiesPage;