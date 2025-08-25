import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, MapPin, Settings, Save } from 'lucide-react';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WorkerSettings = () => {
  const { profile, loading } = useAuthProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    email: profile?.email || ''
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        })
        .eq('id', profile?.id);

      if (error) throw error;

      toast({
        title: "Profil uppdaterad",
        description: "Dina inställningar har sparats."
      });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground">
          Hantera dina arbetarinställningar och profil.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Min profil</CardTitle>
          <Button
            variant={editing ? "default" : "outline"}
            onClick={() => editing ? handleSave() : setEditing(true)}
          >
            {editing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Spara
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Redigera
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-lg">{profile?.first_name} {profile?.last_name}</h3>
              <Badge variant="secondary">Arbetare</Badge>
            </div>
          </div>
          
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Förnamn</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Efternamn</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">E-post kan inte ändras</p>
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="070-123 45 67"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">E-post</Label>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Telefon</Label>
                <p className="text-sm text-muted-foreground">{profile?.phone || 'Ej angivet'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifieringar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Notifieringsinställningar kommer snart...
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Arbetarinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Användar-ID</Label>
              <p className="text-xs text-muted-foreground font-mono">{profile?.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Medlem sedan</Label>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('sv-SE') : 'Okänt'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerSettings;