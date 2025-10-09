import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Mail, Phone, Shield, Building, Users as UsersIcon, Filter } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { fetchAllUsers, type UserProfile } from '@/lib/api/users';
import { useUsersRealtime } from '@/hooks/useUsersRealtime';
import { UserProfileModal } from '@/components/admin/UserProfileModal';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm, userTypeFilter, roleFilter],
    queryFn: async () => {
      return fetchAllUsers({
        q: searchTerm || undefined,
        userType: userTypeFilter !== 'all' ? userTypeFilter : undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        limit: 200
      });
    },
  });

  const users = usersData?.data || [];

  // Real-time updates
  const handleUsersChange = useCallback(() => {
    refetch();
  }, [refetch]);

  useUsersRealtime(handleUsersChange);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default' as const;
      case 'admin': return 'secondary' as const;
      case 'technician': return 'default' as const;
      case 'manager': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const getUserTypeStats = () => {
    if (!users) return { private: 0, company: 0, brf: 0, total: 0 };
    return {
      private: users.filter(u => u.user_type === 'private' || !u.user_type).length,
      company: users.filter(u => u.user_type === 'company').length,
      brf: users.filter(u => u.user_type === 'brf').length,
      total: users.length
    };
  };

  const getRoleStats = () => {
    if (!users) return { customers: 0, staff: 0, admins: 0 };
    return {
      customers: users.filter(u => u.role === 'customer' || !u.role).length,
      staff: users.filter(u => ['technician', 'manager'].includes(u.role)).length,
      admins: users.filter(u => ['owner', 'admin'].includes(u.role)).length,
    };
  };

  const userTypeStats = getUserTypeStats();
  const roleStats = getRoleStats();

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Användarhantering</h1>
          <p className="text-muted-foreground">Hantera alla användare i systemet</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userTypeStats.total}</p>
                <p className="text-sm text-muted-foreground">Totalt användare</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userTypeStats.private}</p>
                <p className="text-sm text-muted-foreground">Privatkunder</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userTypeStats.company}</p>
                <p className="text-sm text-muted-foreground">Företag</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Building className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userTypeStats.brf}</p>
                <p className="text-sm text-muted-foreground">BRF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alla ({userTypeStats.total})</TabsTrigger>
          <TabsTrigger value="private">Privat ({userTypeStats.private})</TabsTrigger>
          <TabsTrigger value="company">Företag ({userTypeStats.company})</TabsTrigger>
          <TabsTrigger value="brf">BRF ({userTypeStats.brf})</TabsTrigger>
          <TabsTrigger value="staff">Personal ({roleStats.staff})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  Alla användare
                </CardTitle>
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Sök namn, e-post, telefon, företag, org.nr..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla typer</SelectItem>
                      <SelectItem value="private">Privat</SelectItem>
                      <SelectItem value="company">Företag</SelectItem>
                      <SelectItem value="brf">BRF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla roller</SelectItem>
                      <SelectItem value="customer">Kunder</SelectItem>
                      <SelectItem value="technician">Tekniker</SelectItem>
                      <SelectItem value="manager">Chefer</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="owner">Ägare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : users && users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {user.user_type === 'company' || user.user_type === 'brf' ? 
                          <Building className="h-6 w-6 text-primary" /> : 
                          <User className="h-6 w-6 text-primary" />
                        }
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">
                            {user.user_type === 'company' || user.user_type === 'brf' 
                              ? user.company_name || user.brf_name || 'Okänt företag'
                              : user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.email || 'Okänt namn'
                            }
                          </h3>
                          <Badge variant={getRoleBadgeVariant(user.role || 'customer')}>
                            {user.role === 'owner' ? 'Ägare' : 
                             user.role === 'admin' ? 'Admin' : 
                             user.role === 'technician' ? 'Tekniker' :
                             user.role === 'manager' ? 'Chef' : 'Kund'}
                          </Badge>
                          <Badge variant="outline">
                            {user.user_type === 'company' ? 'Företag' :
                             user.user_type === 'brf' ? 'BRF' : 'Privat'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          {user.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </div>
                          )}
                          {user.org_number && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              Org.nr: {user.org_number}
                            </div>
                          )}
                        </div>
                        {(user.city || user.address_line) && (
                          <div className="text-sm text-muted-foreground">
                            {user.address_line && `${user.address_line}, `}{user.city} {user.postal_code}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <p className="font-medium">{user.loyalty_points || 0} poäng</p>
                          <p className="text-muted-foreground">{user.total_spent?.toLocaleString() || 0} SEK</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setProfileModalOpen(true);
                          }}
                        >
                          Visa profil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || userTypeFilter !== 'all' || roleFilter !== 'all' ? 
                      'Inga användare hittades med dessa filter' : 
                      'Inga användare att visa'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserProfileModal 
        user={selectedUser}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </div>
  );
};

export default AdminUsers;