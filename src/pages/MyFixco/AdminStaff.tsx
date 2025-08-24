import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { UserCheck, Plus, Edit, Calendar, CheckCircle } from 'lucide-react';
import { listStaff, createStaff, updateStaff } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import AdminBack from '@/components/admin/AdminBack';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  active: boolean;
  user_id?: string;
  created_at: string;
}

const AdminStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Elektriker',
    skills: [] as string[],
  });
  const { toast } = useToast();

  const skillOptions = [
    'Elinstallationer', 'VVS-arbeten', 'Snickeri', 'Målning', 
    'Kakel & Klinker', 'Golvläggning', 'Fönster & Dörrar', 
    'Badrumsrenovering', 'Köksmontage', 'Städning'
  ];

  const roleTypes = ['Elektriker', 'VVS', 'Snickare', 'Admin', 'Koordinator'];

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await listStaff();
      setStaff(data || []);
    } catch (error) {
      console.error('Error loading staff:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda personal',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
        toast({
          title: 'Uppdaterad',
          description: 'Personal har uppdaterats'
        });
      } else {
        await createStaff(formData);
        toast({
          title: 'Skapad',
          description: 'Ny personal har lagts till'
        });
      }
      
      setDialogOpen(false);
      setEditingStaff(null);
      setFormData({ name: '', role: 'Elektriker', skills: [] });
      await loadStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara personal',
        variant: 'destructive'
      });
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await updateStaff(id, { active });
      await loadStaff();
      toast({
        title: active ? 'Aktiverad' : 'Inaktiverad',
        description: 'Personal-status har uppdaterats'
      });
    } catch (error) {
      console.error('Error toggling active:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera status',
        variant: 'destructive'
      });
    }
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      role: member.role,
      skills: member.skills || []
    });
    setDialogOpen(true);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personalhantering</h1>
          <p className="text-muted-foreground">
            Hantera anställda och deras behörigheter
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till personal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? 'Redigera personal' : 'Lägg till personal'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Namn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role">Roll</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleTypes.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Kompetenser</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {skillOptions.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded"
                      />
                      <label htmlFor={skill} className="text-sm">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingStaff ? 'Uppdatera' : 'Skapa'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingStaff(null);
                    setFormData({ name: '', role: 'Elektriker', skills: [] });
                  }}
                >
                  Avbryt
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Personal ({staff.filter(s => s.active).length} aktiva)
          </CardTitle>
          <CardDescription>
            Tekniker och personalhantering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.active ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktiv
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                          Inaktiv
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(member.skills || []).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Medlem sedan {new Date(member.created_at).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${member.id}`} className="text-sm">
                        Aktiv
                      </Label>
                      <Switch
                        id={`active-${member.id}`}
                        checked={member.active}
                        onCheckedChange={(checked) => toggleActive(member.id, checked)}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {staff.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Ingen personal registrerad än
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaff;