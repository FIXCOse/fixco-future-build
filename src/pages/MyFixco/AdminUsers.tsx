import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Download, Edit, RefreshCw, Mail, Shield, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminBack from '@/components/admin/AdminBack';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users using the edge function
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users', searchQuery, roleFilter],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-list-users', {
        body: { 
          q: searchQuery,
          role: roleFilter === 'all' ? '' : roleFilter,
          page: 1,
          pageSize: 100
        }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  });

  const users = usersData?.users || [];

  // Set up realtime sync for user_roles changes (not profiles to avoid PGRST204 error)
  useEffect(() => {
    const channel = supabase
      .channel('admin-users-roles-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_roles' }, 
        () => {
          console.log('🔄 [AdminUsers] user_roles changed, invalidating queries');
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleRoleChange = async (userId: string, newRole: 'customer' | 'admin' | 'owner' | 'worker') => {
    try {
      console.log('🔄 [AdminUsers] Updating role via Edge Function:', { userId, newRole });
      
      const { data, error } = await supabase.functions.invoke('admin-update-user-role', {
        body: { 
          user_id: userId,
          new_role: newRole
        }
      });

      if (error) {
        console.error('❌ [AdminUsers] Edge Function error:', error);
        throw error;
      }

      console.log('✅ [AdminUsers] Role updated successfully:', data);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      toast({
        title: 'Uppdaterat',
        description: 'Användarroll har ändrats'
      });
    } catch (error: any) {
      console.error('❌ [AdminUsers] Error updating role:', error);
      
      const errorMessage = error?.message || 'Kunde inte uppdatera roll';
      
      toast({
        title: 'Fel',
        description: errorMessage.includes('Forbidden') 
          ? 'Du har inte behörighet att ändra roller'
          : errorMessage.includes('Invalid role')
          ? 'Ogiltig roll vald'
          : errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) throw error;

      toast({
        title: 'Skickat',
        description: 'Återställningslänk har skickats till användaren'
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte skicka återställningslänk',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: userToDelete.id }
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      toast({
        title: 'Raderad',
        description: 'Användaren har tagits bort'
      });
      
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte radera användaren',
        variant: 'destructive'
      });
    }
  };

  const exportUsers = () => {
    const csv = [
      'Email,Förnamn,Efternamn,Roll,Skapad,Senaste inloggning,Användartyp',
      ...users.map(u => 
        `${u.email || ''},${u.first_name || ''},${u.last_name || ''},${u.role || ''},${u.created_at || ''},${u.last_sign_in_at || ''},${u.user_type || ''}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return 'default';
      case 'worker':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div>
        <h1 className="text-3xl font-bold">Användarhantering</h1>
        <p className="text-muted-foreground">
          Hantera kunder, personal och roller
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Användare ({users.length})
            </div>
            <Button onClick={exportUsers} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportera CSV
            </Button>
          </CardTitle>
          <CardDescription>
            Lista över alla registrerade användare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök användare efter namn eller email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla roller</SelectItem>
                <SelectItem value="customer">Kund</SelectItem>
                <SelectItem value="worker">Personal</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Ägare</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Namnlös'}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Medlem sedan {new Date(user.created_at).toLocaleDateString('sv-SE')}</div>
                      {user.last_sign_in_at && (
                        <div>Senaste inloggning: {new Date(user.last_sign_in_at).toLocaleDateString('sv-SE')}</div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>Typ: {user.user_type}</span>
                        {!user.email_confirmed_at && (
                          <Badge variant="outline" className="text-xs">Obekräftad email</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    
                    <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as 'customer' | 'admin' | 'owner' | 'worker')}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Kund</SelectItem>
                        <SelectItem value="worker">Personal</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Ägare</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => handlePasswordReset(user.email)}
                      variant="outline"
                      size="sm"
                      title="Skicka återställningslänk"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => setUserToDelete(user)}
                      variant="outline"
                      size="sm"
                      title="Radera användare"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Inga användare hittades
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer permanent radera användaren <strong>{userToDelete?.email}</strong> och all relaterad data. 
              Denna åtgärd kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;