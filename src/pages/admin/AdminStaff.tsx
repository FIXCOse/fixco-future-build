import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Plus, User, Phone, Mail } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';

const AdminStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: staff, isLoading } = useQuery({
    queryKey: ['admin-staff', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'manager': return 'default' as const;
      case 'technician': return 'secondary' as const;
      case 'admin': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'manager': return 'Chef';
      case 'technician': return 'Tekniker';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personalhantering</h1>
          <p className="text-muted-foreground">Hantera alla anställda i systemet</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Lägg till personal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personal
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sök personal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : staff && staff.length > 0 ? (
            <div className="space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {getRoleDisplayName(member.role)}
                      </Badge>
                      {!member.active && (
                        <Badge variant="outline">Inaktiv</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {member.skills && member.skills.length > 0 && (
                        <span>Kompetenser: {member.skills.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Redigera
                    </Button>
                    <Button variant="ghost" size="sm">
                      {member.active ? 'Inaktivera' : 'Aktivera'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Ingen personal hittades' : 'Ingen personal registrerad än'}
              </p>
              <Button className="mt-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Lägg till första personen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktiv personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff?.filter(s => s.active).length || 0}
            </div>
            <p className="text-sm text-muted-foreground">av {staff?.length || 0} totalt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tekniker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff?.filter(s => s.role === 'technician').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">registrerade tekniker</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chefer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff?.filter(s => s.role === 'manager').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">registrerade chefer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStaff;