import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { PropertyModal } from '@/components/PropertyModal';
import { PropertyForm } from '@/components/PropertyForm';
import { Plus, MapPin, Edit, Trash2, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface Property {
  id: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  type: 'villa' | 'lägenhet' | 'kontor' | 'lokal' | 'fastighet';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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

  const startEdit = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handlePropertySuccess = async (property: any) => {
    // Update the list optimistically
    if (editingProperty) {
      setProperties(prev => prev.map(p => p.id === property.id ? property : p));
    } else {
      setProperties(prev => [property, ...prev]);
    }
    
    setIsModalOpen(false);
    setEditingProperty(null);
    
    // Reload to ensure consistency
    await loadProperties();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      'villa': 'Villa',
      'lägenhet': 'Lägenhet', 
      'kontor': 'Kontor',
      'lokal': 'Lokal',
      'fastighet': 'Fastighet'
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
          
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Lägg till fastighet
          </Button>
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
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Lägg till första fastigheten
              </Button>
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

      {/* Property Modal */}
      <PropertyModal
        open={isModalOpen}
        onClose={handleModalClose}
        title={editingProperty ? 'Redigera fastighet' : 'Lägg till fastighet'}
      >
        <PropertyForm
          onSuccess={handlePropertySuccess}
          onCancel={handleModalClose}
          editingProperty={editingProperty}
        />
      </PropertyModal>
    </>
  );
};

export default PropertiesPage;