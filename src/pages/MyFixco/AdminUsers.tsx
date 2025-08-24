import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Download, Edit } from 'lucide-react';
import { listUsers, updateUserRole } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import AdminBack from '@/components/admin/AdminBack';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      const data = await listUsers(searchQuery);
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda användare',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole as any);
      await loadUsers();
      toast({
        title: 'Uppdaterat',
        description: 'Användarroll har ändrats'
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera roll',
        variant: 'destructive'
      });
    }
  };

  const exportUsers = () => {
    const csv = [
      'Email,Förnamn,Efternamn,Roll,Skapad',
      ...users.map(u => `${u.email},${u.first_name || ''},${u.last_name || ''},${u.role},${u.created_at}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'destructive';
      case 'admin': return 'secondary';
      case 'staff': return 'default';
      default: return 'outline';
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
                placeholder="Sök användare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Medlem sedan {new Date(user.created_at).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    
                    <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
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
    </div>
  );
};

export default AdminUsers;