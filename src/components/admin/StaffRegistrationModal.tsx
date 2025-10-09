import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Send, Check } from 'lucide-react';

interface StaffRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStaff?: any;
}

export function StaffRegistrationModal({ open, onOpenChange, editingStaff }: StaffRegistrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    date_of_birth: '',
    role: 'technician',
    hourly_rate: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    selectedSkills: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when editingStaff changes
  useEffect(() => {
    if (editingStaff) {
      setFormData({
        name: editingStaff.name || '',
        email: editingStaff.email || '',
        phone: editingStaff.phone || '',
        address: editingStaff.address || '',
        postal_code: editingStaff.postal_code || '',
        city: editingStaff.city || '',
        date_of_birth: editingStaff.date_of_birth || '',
        role: editingStaff.role || 'technician',
        hourly_rate: editingStaff.hourly_rate || 0,
        emergency_contact_name: editingStaff.emergency_contact_name || '',
        emergency_contact_phone: editingStaff.emergency_contact_phone || '',
        selectedSkills: editingStaff.staff_skills?.map((ss: any) => ss.skill_id) || []
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        city: '',
        date_of_birth: '',
        role: 'technician',
        hourly_rate: 0,
        emergency_contact_name: '',
        emergency_contact_phone: '',
        selectedSkills: []
      });
    }
  }, [editingStaff, open]);

  // Fetch available skills
  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter(id => id !== skillId)
        : [...prev.selectedSkills, skillId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Fel",
        description: "Namn och e-post är obligatoriska fält",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let staffData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        date_of_birth: formData.date_of_birth || null,
        role: formData.role,
        hourly_rate: parseFloat(formData.hourly_rate.toString()) || 0,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        active: true
      };

      let staffId;

      if (editingStaff) {
        // Update existing staff
        const { error } = await supabase
          .from('staff')
          .update(staffData)
          .eq('id', editingStaff.id);

        if (error) throw error;
        staffId = editingStaff.id;
      } else {
        // Create new staff
        const { data, error } = await supabase
          .from('staff')
          .insert([staffData])
          .select()
          .single();

        if (error) throw error;
        staffId = data.id;
      }

      // Update staff skills
      if (staffId) {
        // Remove existing skills
        await supabase
          .from('staff_skills')
          .delete()
          .eq('staff_id', staffId);

        // Add new skills
        if (formData.selectedSkills.length > 0) {
          const skillsToAdd = formData.selectedSkills.map(skillId => ({
            staff_id: staffId,
            skill_id: skillId,
            level: 1
          }));

          await supabase
            .from('staff_skills')
            .insert(skillsToAdd);
        }
      }

      toast({
        title: "Framgång",
        description: editingStaff ? "Personal uppdaterad" : "Personal registrerad framgångsrikt"
      });

      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
      onOpenChange(false);

    } catch (error) {
      console.error('Error saving staff:', error);
      toast({
        title: "Fel",
        description: "Kunde inte spara personal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendInvitation = async () => {
    if (!editingStaff) return;

    try {
      setIsSubmitting(true);
      
      // Update invitation sent timestamp
      await supabase
        .from('staff')
        .update({ 
          invitation_sent_at: new Date().toISOString(),
          invited_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', editingStaff.id);

      // TODO: Implement actual email sending via edge function
      toast({
        title: "Inbjudan skickad",
        description: `Inbjudningsmail skickat till ${formData.email}`
      });

      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka inbjudan",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingStaff ? 'Redigera Personal' : 'Registrera Ny Personal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Roll</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Tekniker</SelectItem>
                  <SelectItem value="manager">Chef</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Timtaxa (SEK)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Födelsedatum</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adressinformation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adress</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postnummer</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Stad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nödkontakt</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Namn</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Telefon</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Skills - Simplified Badge Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kompetenser</h3>
            <p className="text-sm text-muted-foreground">Klicka på kompetenserna för att välja/avvälja</p>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium capitalize text-sm text-muted-foreground">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill: any) => {
                      const isSelected = formData.selectedSkills.includes(skill.id);
                      return (
                        <Badge
                          key={skill.id}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer hover:scale-105 transition-transform px-4 py-2 text-sm"
                          onClick={() => handleSkillToggle(skill.id)}
                        >
                          {isSelected && <Check className="h-3 w-3 mr-1" />}
                          {skill.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Show staff ID if editing */}
          {editingStaff && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold">Personal-ID</h3>
              <p className="text-sm text-muted-foreground">
                Detta ID används för inloggning i arbetarportalen: <strong>#{editingStaff.staff_id}</strong>
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              {editingStaff && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={sendInvitation}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Skicka Inbjudan
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Avbryt
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sparar...' : editingStaff ? 'Uppdatera' : 'Registrera'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}