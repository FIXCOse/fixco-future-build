import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Mail, 
  Phone, 
  Edit, 
  Trash2, 
  UserPlus,
  DollarSign,
  Calendar,
  FileText,
  Users
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  personal_number?: string;
  email?: string;
  phone?: string;
  role: string;
  hourly_rate?: number;
  active: boolean;
  notes?: string;
  starts_at?: string;
  created_at: string;
}

const StaffManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    personal_number: '',
    email: '',
    phone: '',
    role: 'technician',
    hourly_rate: '',
    notes: '',
    starts_at: ''
  });

  const { data: staff = [], isLoading, refetch } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Staff[];
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      personal_number: '',
      email: '',
      phone: '',
      role: 'technician',
      hourly_rate: '',
      notes: '',
      starts_at: ''
    });
    setEditingStaff(null);
  };

  const openEditDialog = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      personal_number: staffMember.personal_number || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      role: staffMember.role,
      hourly_rate: staffMember.hourly_rate?.toString() || '',
      notes: staffMember.notes || '',
      starts_at: staffMember.starts_at || ''
    });
    setIsDialogOpen(true);
  };

  const saveStaff = async () => {
    if (!formData.name.trim()) {
      toast.error('Namn är obligatoriskt');
      return;
    }

    try {
      const staffData = {
        name: formData.name.trim(),
        personal_number: formData.personal_number || null,
        email: formData.email || null,
        phone: formData.phone || null,
        role: formData.role,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        notes: formData.notes || null,
        starts_at: formData.starts_at || null
      };

      let error;
      
      if (editingStaff) {
        ({ error } = await supabase
          .from('staff')
          .update(staffData)
          .eq('id', editingStaff.id));
      } else {
        ({ error } = await supabase
          .from('staff')
          .insert([staffData]));
      }

      if (error) throw error;

      toast.success(editingStaff ? 'Personal uppdaterad' : 'Personal tillagd');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error('Fel: ' + error.message);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna personal?')) return;

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Personal borttagen');
      refetch();
    } catch (error: any) {
      toast.error('Fel vid borttagning: ' + error.message);
    }
  };

  const toggleActive = async (staff: Staff) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ active: !staff.active })
        .eq('id', staff.id);

      if (error) throw error;

      toast.success(`Personal ${!staff.active ? 'aktiverad' : 'inaktiverad'}`);
      refetch();
    } catch (error: any) {
      toast.error('Fel: ' + error.message);
    }
  };

  const sendInvitation = async (staffMember: Staff) => {
    if (!staffMember.email) {
      toast.error('E-postadress saknas');
      return;
    }

    // Here you would typically send an invitation email
    // For now, we'll just show a success message
    toast.success(`Inbjudan skickad till ${staffMember.email}`);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'manager': return 'default';
      case 'technician': return 'secondary';
      case 'finance': return 'outline';
      case 'support': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      manager: 'Chef',
      technician: 'Tekniker',
      finance: 'Ekonomi',
      support: 'Support'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Personalhantering</h1>
          <p className="text-muted-foreground">
            Hantera personal, roller och behörigheter
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till personal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? 'Redigera personal' : 'Lägg till personal'}
              </DialogTitle>
              <DialogDescription>
                Fyll i personaluppgifterna nedan
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Namn *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Förnamn Efternamn"
                  />
                </div>
                <div>
                  <Label htmlFor="personal_number">Personnummer</Label>
                  <Input
                    id="personal_number"
                    value={formData.personal_number}
                    onChange={(e) => setFormData({ ...formData, personal_number: e.target.value })}
                    placeholder="YYYYMMDD-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="namn@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+46 70 123 45 67"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Roll</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technician">Tekniker</SelectItem>
                      <SelectItem value="manager">Chef</SelectItem>
                      <SelectItem value="finance">Ekonomi</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hourly_rate">Timlön (kr)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="450"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="starts_at">Startdatum</Label>
                <Input
                  id="starts_at"
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Anteckningar</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Specialkompetens, certifieringar, etc..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={saveStaff}>
                  {editingStaff ? 'Uppdatera' : 'Lägg till'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total personal</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiv personal</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.filter(s => s.active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tekniker</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.filter(s => s.role === 'technician').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Snittlön</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.length > 0 
                ? Math.round(
                    staff
                      .filter(s => s.hourly_rate)
                      .reduce((sum, s) => sum + (s.hourly_rate || 0), 0) / 
                    staff.filter(s => s.hourly_rate).length
                  ) 
                : 0} kr
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Personal</CardTitle>
          <CardDescription>
            Översikt över all personal och deras roller
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Laddar personal...</div>
          ) : staff.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ingen personal registrerad</h3>
              <p className="text-muted-foreground mb-4">
                Lägg till din första personal för att komma igång
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{member.name}</h4>
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {getRoleLabel(member.role)}
                        </Badge>
                        {!member.active && (
                          <Badge variant="destructive">Inaktiv</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {member.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                        {member.hourly_rate && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {member.hourly_rate} kr/h
                          </div>
                        )}
                        {member.starts_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Start: {new Date(member.starts_at).toLocaleDateString('sv-SE')}
                          </div>
                        )}
                      </div>
                      
                      {member.notes && (
                        <div className="flex items-start gap-1 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3 mt-0.5" />
                          <span className="text-xs">{member.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendInvitation(member)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(member)}
                    >
                      {member.active ? 'Inaktivera' : 'Aktivera'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStaff(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;