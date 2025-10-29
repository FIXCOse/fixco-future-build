import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Key, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/api/users';

interface UserProfileModalProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileModal = ({ user, open, onOpenChange }: UserProfileModalProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(user || {});
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin' | 'owner' | 'worker'>((user?.role as 'customer' | 'admin' | 'owner' | 'worker') || 'customer');

  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!user) return;
      
      // Build update object with only allowed profile fields (NO role)
      const updateData: any = {};
      if (data.first_name !== undefined) updateData.first_name = data.first_name;
      if (data.last_name !== undefined) updateData.last_name = data.last_name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.user_type !== undefined) updateData.user_type = data.user_type;
      if (data.company_name !== undefined) updateData.company_name = data.company_name;
      if (data.brf_name !== undefined) updateData.brf_name = data.brf_name;
      if (data.org_number !== undefined) updateData.org_number = data.org_number;
      if (data.address_line !== undefined) updateData.address_line = data.address_line;
      if (data.postal_code !== undefined) updateData.postal_code = data.postal_code;
      if (data.city !== undefined) updateData.city = data.city;
      
      // EXPLICIT SELECT - only return columns that exist in profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select('id, email, first_name, last_name, full_name, phone, user_type, company_name, brf_name, org_number, address_line, postal_code, city, loyalty_points, total_spent, created_at');

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Användare uppdaterad');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      if (error.message?.includes('violates row-level security')) {
        toast.error('Du har inte behörighet att uppdatera användare');
      } else if (error.message?.includes('invalid input value for enum')) {
        toast.error('Ogiltig användartyp vald');
      } else {
        toast.error('Kunde inte uppdatera användare');
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.functions.invoke('admin-reset-user-password', {
        body: { email },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Återställningslänk har skickats till användarens e-post');
    },
    onError: (error) => {
      toast.error('Kunde inte skicka återställningslänk');
      console.error('Error resetting password:', error);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (newRole: 'customer' | 'admin' | 'owner' | 'worker') => {
      if (!user) return;
      
      console.log('🔄 [updateRole] Starting role update for user:', user.id);
      console.log('🔄 [updateRole] New role:', newRole);

      // Check auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('❌ [updateRole] No valid session:', sessionError);
        throw new Error('No valid session found');
      }
      console.log('✅ [updateRole] Session valid, user:', session.user.id);

      // Use edge function for server-side handling with service role
      const { data, error } = await supabase.functions.invoke('admin-update-user-role', {
        body: { user_id: user.id, new_role: newRole }
      });

      if (error) {
        console.error('❌ [updateRole] Edge function error:', error);
        throw error;
      }

      console.log('✅ [updateRole] Role updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('✅ [updateRole] Mutation success, invalidating queries');
      toast.success('Roll uppdaterad');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
    onError: (error: any) => {
      console.error('❌ [updateRole] Mutation error:', error);
      console.error('❌ [updateRole] Error details:', {
        message: error.message,
        status: error.status,
        context: error.context
      });
      
      if (error.message?.includes('Forbidden')) {
        toast.error('Du har inte behörighet att ändra roller');
      } else if (error.message?.includes('Invalid role')) {
        toast.error('Ogiltig roll vald');
      } else if (error.message?.includes('Unauthorized')) {
        toast.error('Du måste vara inloggad för att ändra roller');
      } else {
        toast.error(`Kunde inte uppdatera roll: ${error.message || 'Okänt fel'}`);
      }
    },
  });

  const handleSave = async () => {
    try {
      // Update profile data
      await updateUserMutation.mutateAsync(formData);
      
      // Update role if changed
      if (selectedRole !== user?.role) {
        await updateRoleMutation.mutateAsync(selectedRole);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleResetPassword = () => {
    if (!user?.email) {
      toast.error('Ingen e-postadress hittades');
      return;
    }
    resetPasswordMutation.mutate(user.email);
  };

  // Sync selectedRole when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole((user.role as 'customer' | 'admin' | 'owner' | 'worker') || 'customer');
      setFormData(user);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Användarprofil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Grundläggande information</h3>
              <Badge variant="outline">
                {user.user_type === 'company' ? 'Företag' :
                 user.user_type === 'brf' ? 'BRF' : 'Privat'}
              </Badge>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Förnamn</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Efternamn</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="user_type">Användartyp</Label>
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) => setFormData({ ...formData, user_type: value as 'private' | 'company' | 'brf' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privat</SelectItem>
                      <SelectItem value="company">Företag</SelectItem>
                      <SelectItem value="brf">BRF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Förnamn</Label>
                  <p className="font-medium">{user.first_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Efternamn</Label>
                  <p className="font-medium">{user.last_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">E-post</Label>
                  <p className="font-medium">{user.email || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefon</Label>
                  <p className="font-medium">{user.phone || '-'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Role Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Systemroll</h3>
            {isEditing ? (
              <div>
                <Label htmlFor="role">Roll</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'customer' | 'admin' | 'owner' | 'worker')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Kund</SelectItem>
                    <SelectItem value="worker">Personal</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Ägare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Badge variant={
                selectedRole === 'owner' || selectedRole === 'admin' ? 'default' : 
                selectedRole === 'worker' ? 'secondary' : 'outline'
              }>
                {selectedRole === 'owner' ? 'Ägare' : 
                 selectedRole === 'admin' ? 'Admin' : 
                 selectedRole === 'worker' ? 'Personal' : 'Kund'}
              </Badge>
            )}
          </div>

          {/* Company Info */}
          {(user.user_type === 'company' || user.user_type === 'brf') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Företagsinformation</h3>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Företagsnamn</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name || formData.brf_name || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [user.user_type === 'brf' ? 'brf_name' : 'company_name']: e.target.value 
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_number">Organisationsnummer</Label>
                    <Input
                      id="org_number"
                      value={formData.org_number || ''}
                      onChange={(e) => setFormData({ ...formData, org_number: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Företagsnamn</Label>
                    <p className="font-medium">{user.company_name || user.brf_name || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Organisationsnummer</Label>
                    <p className="font-medium">{user.org_number || '-'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Address Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adress</h3>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="address_line">Adress</Label>
                  <Input
                    id="address_line"
                    value={formData.address_line || ''}
                    onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Postnummer</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code || ''}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Stad</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm">
                {user.address_line || user.city ? (
                  <p className="font-medium">
                    {user.address_line && `${user.address_line}, `}
                    {user.postal_code} {user.city}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Ingen adress registrerad</p>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statistik</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Lojalitetspoäng</Label>
                <p className="text-2xl font-bold">{user.loyalty_points || 0}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Totalt spenderat</Label>
                <p className="text-2xl font-bold">{user.total_spent?.toLocaleString() || 0} SEK</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Medlem sedan</Label>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString('sv-SE')}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Åtgärder</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetPassword}
                disabled={resetPasswordMutation.isPending || !user.email}
              >
                {resetPasswordMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                Återställ lösenord
              </Button>
              {user.email && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${user.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Skicka e-post
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setFormData(user);
              }}>
                Avbryt
              </Button>
              <Button 
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Spara ändringar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Stäng
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Redigera
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};