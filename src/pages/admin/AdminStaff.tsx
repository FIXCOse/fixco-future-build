import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Plus, User, Phone, Mail, Send, Edit2, UserX, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminBack from '@/components/admin/AdminBack';
import { StaffRegistrationModal } from '@/components/admin/StaffRegistrationModal';
import { SkillsManagement } from '@/components/admin/SkillsManagement';


const AdminStaff = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const [editingStaff, setEditingStaff] = useState<any>(null);
  

  // Fetch staff with their skills
  const { data: staff, isLoading } = useQuery({
    queryKey: ['admin-staff', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('staff')
        .select(`
          *,
          staff_skills (
            skill_id,
            level,
            skills (name, category)
          )
        `)
        .order('staff_id', { ascending: true });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
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

  const toggleActive = async (staffId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ active: !currentActive })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Framgång",
        description: `Personal ${!currentActive ? 'aktiverad' : 'inaktiverad'}`
      });

      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });

    } catch (error) {
      console.error('Error toggling staff status:', error);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera personalstatus",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (member: any) => {
    setEditingStaff(member);
    setIsRegistrationModalOpen(true);
  };

  const sendInvitation = async (member: any) => {
    try {
      await supabase
        .from('staff')
        .update({ 
          invitation_sent_at: new Date().toISOString(),
          invited_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', member.id);

      toast({
        title: "Inbjudan skickad",
        description: `Inbjudning skickad till ${member.email}`
      });

      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka inbjudan",
        variant: "destructive"
      });
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
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingStaff(null);
            setIsRegistrationModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Registrera Ny Personal
        </Button>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Personal</TabsTrigger>
          <TabsTrigger value="skills">Kompetenser</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">
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
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{member.name}</h3>
                          <Badge variant="outline">#{member.staff_id}</Badge>
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {getRoleDisplayName(member.role)}
                          </Badge>
                          {!member.active && (
                            <Badge variant="destructive">Inaktiv</Badge>
                          )}
                          {member.invitation_sent_at && !member.invitation_accepted_at && (
                            <Badge variant="outline">Inbjudan skickad</Badge>
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
                        </div>

                        {member.staff_skills && member.staff_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {member.staff_skills.map((ss: any) => (
                              <Badge key={ss.skill_id} variant="secondary" className="text-xs">
                                {ss.skills.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {member.email && !member.invitation_sent_at && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendInvitation(member)}
                            className="flex items-center gap-1"
                          >
                            <Send className="h-3 w-3" />
                            Skicka Inbjudan
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit2 className="h-3 w-3" />
                          Redigera
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleActive(member.id, member.active)}
                        >
                          {member.active ? (
                            <>
                              <UserX className="h-3 w-3" />
                              Inaktivera
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3" />
                              Aktivera
                            </>
                          )}
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
                  <Button 
                    className="mt-4 flex items-center gap-2"
                    onClick={() => {
                      setEditingStaff(null);
                      setIsRegistrationModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Registrera Första Personen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aktiv Personal</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Väntande Inbjudningar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staff?.filter(s => s.invitation_sent_at && !s.invitation_accepted_at).length || 0}
                </div>
                <p className="text-sm text-muted-foreground">skickade inbjudningar</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <SkillsManagement />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <StaffRegistrationModal
        open={isRegistrationModalOpen}
        onOpenChange={(open) => {
          setIsRegistrationModalOpen(open);
          if (!open) setEditingStaff(null);
        }}
        editingStaff={editingStaff}
      />

    </div>
  );
};

export default AdminStaff;