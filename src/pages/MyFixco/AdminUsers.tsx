import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Download, Edit, RefreshCw, Mail, Shield, Trash2, Bug, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminBack from '@/components/admin/AdminBack';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 🔍 MEGA DEBUG LOGGER
  const logDebug = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(`🐛 ${logEntry}`, data || '');
    setDebugLogs(prev => [`${logEntry}${data ? ': ' + JSON.stringify(data, null, 2) : ''}`, ...prev].slice(0, 50));
  };

  // Fetch users using the edge function
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users', searchQuery, roleFilter],
    queryFn: async () => {
      logDebug('🚀 STARTING admin-list-users Edge Function call', {
        searchQuery,
        roleFilter,
        timestamp: new Date().toISOString()
      });

      try {
        const { data, error } = await supabase.functions.invoke('admin-list-users', {
          body: { 
            q: searchQuery,
            role: roleFilter === 'all' ? '' : roleFilter,
            page: 1,
            pageSize: 100
          }
        });

        if (error) {
          logDebug('❌ ERROR from admin-list-users', {
            error,
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            stack: new Error().stack
          });
          throw error;
        }

        logDebug('✅ SUCCESS from admin-list-users', {
          userCount: data?.users?.length || 0,
          sampleUser: data?.users?.[0] ? {
            id: data.users[0].id,
            email: data.users[0].email,
            role: data.users[0].role,
            hasRoleField: 'role' in data.users[0]
          } : null
        });

        return data;
      } catch (err: any) {
        logDebug('💥 CAUGHT ERROR in queryFn', {
          errorType: err?.constructor?.name,
          message: err?.message,
          code: err?.code,
          details: err?.details,
          hint: err?.hint,
          fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)),
          stack: err?.stack
        });
        throw err;
      }
    },
    refetchInterval: 30000,
    staleTime: 10000
  });

  const users = usersData?.users || [];

  // Log when data changes
  useEffect(() => {
    if (usersData) {
      logDebug('📊 Users data updated', { 
        userCount: users.length,
        timestamp: new Date().toISOString()
      });
    }
  }, [usersData]);

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
    logDebug('🔄 STARTING handleRoleChange', { userId, newRole });

    try {
      logDebug('📤 Invoking admin-update-user-role Edge Function', {
        body: { user_id: userId, new_role: newRole }
      });
      
      const { data, error } = await supabase.functions.invoke('admin-update-user-role', {
        body: { 
          user_id: userId,
          new_role: newRole
        }
      });

      if (error) {
        logDebug('❌ ERROR from admin-update-user-role', {
          error,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          stack: new Error().stack
        });
        throw error;
      }

      logDebug('✅ SUCCESS admin-update-user-role', { data });
      logDebug('🔄 Invalidating queries');

      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      toast({
        title: 'Uppdaterat',
        description: 'Användarroll har ändrats'
      });
    } catch (error: any) {
      logDebug('💥 CAUGHT ERROR in handleRoleChange', {
        errorType: error?.constructor?.name,
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        stack: error?.stack
      });
      
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

  // 🔍 DEBUG: Test direct profiles query
  const testProfilesQuery = async () => {
    logDebug('🧪 TESTING direct profiles query (without role column)');
    
    try {
      logDebug('📤 Executing: supabase.from("profiles").select("id, email, first_name, last_name").limit(1)');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .limit(1);

      if (error) {
        logDebug('❌ ERROR from profiles query', {
          error,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
      } else {
        logDebug('✅ SUCCESS profiles query', { data });
      }
    } catch (err: any) {
      logDebug('💥 CAUGHT ERROR in testProfilesQuery', {
        errorType: err?.constructor?.name,
        message: err?.message,
        fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
      });
    }
  };

  // 🔍 DEBUG: Test user_roles query
  const testUserRolesQuery = async () => {
    logDebug('🧪 TESTING user_roles query');
    
    try {
      logDebug('📤 Executing: supabase.from("user_roles").select("*").limit(5)');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(5);

      if (error) {
        logDebug('❌ ERROR from user_roles query', {
          error,
          message: error.message,
          code: error.code,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
      } else {
        logDebug('✅ SUCCESS user_roles query', { data });
      }
    } catch (err: any) {
      logDebug('💥 CAUGHT ERROR in testUserRolesQuery', {
        errorType: err?.constructor?.name,
        message: err?.message,
        fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
      });
    }
  };

  // 🔍 DEBUG: Clear logs
  const clearLogs = () => {
    setDebugLogs([]);
    logDebug('🧹 Logs cleared');
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

      {/* 🐛 DEBUG PANEL */}
      <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
        <Collapsible open={showDebugPanel} onOpenChange={setShowDebugPanel}>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Bug className="h-5 w-5" />
                  🐛 MEGA DEBUG PANEL
                  <Badge variant="outline" className="ml-2">
                    {debugLogs.length} logs
                  </Badge>
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CollapsibleTrigger>
            <CardDescription className="text-orange-600 dark:text-orange-400">
              Detaljerad logging för PGRST204-felet
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={testProfilesQuery} variant="outline" size="sm">
                  🧪 Test Profiles Query
                </Button>
                <Button onClick={testUserRolesQuery} variant="outline" size="sm">
                  🧪 Test UserRoles Query
                </Button>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  🔄 Refetch Users
                </Button>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  🧹 Clear Logs
                </Button>
                <Button 
                  onClick={() => {
                    const logs = debugLogs.join('\n\n');
                    const blob = new Blob([logs], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `debug-logs-${Date.now()}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  variant="outline" 
                  size="sm"
                >
                  💾 Download Logs
                </Button>
              </div>

              <div className="bg-black text-green-400 p-4 rounded-lg max-h-[400px] overflow-y-auto font-mono text-xs">
                {debugLogs.length === 0 ? (
                  <div className="text-muted-foreground">Inga loggar ännu. Klicka på en test-knapp eller utför en åtgärd.</div>
                ) : (
                  debugLogs.map((log, i) => (
                    <div key={i} className="mb-2 pb-2 border-b border-green-900/30">
                      <pre className="whitespace-pre-wrap break-words">{log}</pre>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

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