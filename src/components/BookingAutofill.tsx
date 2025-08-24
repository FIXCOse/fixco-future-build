import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { formatPostcode } from "@/helpers/postcode";
import { Plus, MapPin } from "lucide-react";

interface Property {
  id: string;
  name?: string;
  address: string;
  postal_code: string;
  city: string;
  notes?: string;
}

interface Profile {
  id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address_line?: string;
  postal_code?: string;
  city?: string;
}

interface BookingAutofillProps {
  user: User | null;
  onPropertySelect: (property: Property) => void;
  onContactInfo: (info: { name: string; email: string; phone: string }) => void;
}

export function BookingAutofill({ user, onPropertySelect, onContactInfo }: BookingAutofillProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    postal_code: "",
    city: "",
    notes: ""
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        const displayName = profileData.full_name || 
          `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
        
        onContactInfo({
          name: displayName,
          email: user.email || '',
          phone: profileData.phone || ''
        });
      }

      // Load properties (private)
      const { data: privateProperties } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);

      // Load organization properties
      const { data: orgMemberships } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);

      const orgIds = orgMemberships?.map(m => m.organization_id) || [];
      
      let orgProperties: Property[] = [];
      if (orgIds.length > 0) {
        const { data: orgProps } = await supabase
          .from('properties')
          .select('*')
          .in('organization_id', orgIds);
        
        orgProperties = orgProps || [];
      }

      const allProperties = [...(privateProperties || []), ...orgProperties];
      setProperties(allProperties);

      // Auto-select first property if available
      if (allProperties.length > 0) {
        setSelectedPropertyId(allProperties[0].id);
        onPropertySelect(allProperties[0]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      onPropertySelect(property);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          name: newProperty.name || `${newProperty.address}`,
          address: newProperty.address,
          postal_code: newProperty.postal_code.replace(/\s/g, ''),
          city: newProperty.city,
          notes: newProperty.notes || null,
          type: 'villa' // Default type
        })
        .select()
        .single();

      if (error) throw error;

      // Add to properties list and select it
      setProperties(prev => [...prev, property]);
      setSelectedPropertyId(property.id);
      onPropertySelect(property);

      // Reset form
      setNewProperty({
        name: "",
        address: "",
        postal_code: "",
        city: "",
        notes: ""
      });
      setShowNewPropertyForm(false);
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  if (!user) {
    return (
      <Card className="p-4">
        <p className="text-center text-muted-foreground">
          Logga in för att spara adresser och kontaktuppgifter
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Kontaktuppgifter</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <Label className="text-muted-foreground">Namn</Label>
            <p>
              {profile 
                ? (profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Ej angivet')
                : 'Laddar...'
              }
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">E-post</Label>
            <p>{user.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Telefon</Label>
            <p>{profile?.phone || 'Ej angivet'}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Välj adress</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowNewPropertyForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ny adress
          </Button>
        </div>

        {properties.length > 0 ? (
          <Select value={selectedPropertyId} onValueChange={handlePropertySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Välj en sparad adress" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <div>
                      <div className="font-medium">
                        {property.name || property.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPostcode(property.postal_code)} {property.city}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-muted-foreground text-sm">
            Inga sparade adresser. Skapa en ny nedan.
          </p>
        )}
      </Card>

      {showNewPropertyForm && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Lägg till ny adress</h4>
          <form onSubmit={handleCreateProperty} className="space-y-3">
            <div>
              <Label htmlFor="new-property-name">Namn (valfritt)</Label>
              <Input
                id="new-property-name"
                value={newProperty.name}
                onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                placeholder="T.ex. Hemadress, Kontor"
              />
            </div>

            <div>
              <Label htmlFor="new-property-address">Gatuadress *</Label>
              <Input
                id="new-property-address"
                value={newProperty.address}
                onChange={(e) => setNewProperty(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Exempelgatan 123"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-property-postcode">Postnummer *</Label>
                <Input
                  id="new-property-postcode"
                  value={newProperty.postal_code}
                  onChange={(e) => setNewProperty(prev => ({ 
                    ...prev, 
                    postal_code: formatPostcode(e.target.value)
                  }))}
                  placeholder="123 45"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-property-city">Ort *</Label>
                <Input
                  id="new-property-city"
                  value={newProperty.city}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Stockholm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-property-notes">Notering (valfritt)</Label>
              <Input
                id="new-property-notes"
                value={newProperty.notes}
                onChange={(e) => setNewProperty(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="T.ex. portlås, parkeringsinfo"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Spara adress
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewPropertyForm(false)}
              >
                Avbryt
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}