import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { propertySchema, PROPERTY_TYPES, type PropertyFormData } from '@/schemas/propertySchema';
import { useToast } from '@/components/ui/use-toast';

interface PropertyFormProps {
  onSuccess: (property: any) => void;
  onCancel: () => void;
  editingProperty?: any;
}

export function PropertyForm({ onSuccess, onCancel, editingProperty }: PropertyFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    setValue,
    watch
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: editingProperty?.name || '',
      address: editingProperty?.address || '',
      postal_code: editingProperty?.postal_code || '',
      city: editingProperty?.city || '',
      type: editingProperty?.type || 'Villa',
      description: editingProperty?.description || '',
      notes: editingProperty?.notes || '',
      is_primary: editingProperty?.is_primary || false,
    }
  });

  const isPrimary = watch('is_primary');

  useEffect(() => {
    // Focus first field when modal opens
    const timer = setTimeout(() => setFocus('name'), 100);
    return () => clearTimeout(timer);
  }, [setFocus]);

  const onSubmit = async (data: PropertyFormData) => {
    if (!user?.id) {
      toast({
        title: "Fel",
        description: "Du måste vara inloggad",
        variant: "destructive"
      });
      return;
    }

    try {
      // Clean postal code
      const cleanedPostalCode = data.postal_code.replace(/\s/g, '');
      
      const propertyData = {
        name: data.name,
        address: data.address,
        postal_code: cleanedPostalCode,
        city: data.city,
        type: data.type,
        description: data.description || null,
        notes: data.notes || null,
        is_primary: data.is_primary || false,
        owner_id: user.id,
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
          .insert(propertyData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Klart!",
        description: editingProperty ? "Fastighet uppdaterad" : "Fastighet tillagd"
      });

      onSuccess(result.data);
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara fastighet",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Namn */}
      <div className="space-y-2">
        <Label htmlFor="name">Namn *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="t.ex. Hemma, Sommarstugan"
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Adress */}
      <div className="space-y-2">
        <Label htmlFor="address">Adress *</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="Gatuadress och nummer"
          className="w-full"
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Postnummer och Ort */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postnummer *</Label>
          <Input
            id="postal_code"
            {...register('postal_code')}
            placeholder="123 45"
            inputMode="numeric"
            className="w-full"
          />
          {errors.postal_code && (
            <p className="text-sm text-destructive">{errors.postal_code.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Ort *</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Stockholm"
            className="w-full"
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Typ av fastighet */}
      <div className="space-y-2">
        <Label htmlFor="type">Typ av fastighet *</Label>
        <select
          id="type"
          {...register('type', { required: 'Välj typ av fastighet' })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Välj typ...</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* Beskrivning */}
      <div className="space-y-2">
        <Label htmlFor="description">Beskrivning (valfritt)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Beskriv fastigheten..."
          rows={3}
          className="resize-none"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Anteckningar */}
      <div className="space-y-2">
        <Label htmlFor="notes">Anteckningar/Åtkomst (valfritt)</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Särskilda noteringar, portkod, etc..."
          rows={3}
          className="resize-none"
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      {/* Primary Address */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_primary"
          checked={isPrimary}
          onCheckedChange={(checked) => setValue('is_primary', checked as boolean)}
        />
        <Label htmlFor="is_primary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Sätt som huvudadress
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sparar...' : (editingProperty ? 'Uppdatera' : 'Lägg till')}
        </Button>
      </div>
    </form>
  );
}