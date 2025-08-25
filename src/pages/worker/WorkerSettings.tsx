import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, Phone, MapPin, Settings } from 'lucide-react';
import { useAuthProfile } from '@/hooks/useAuthProfile';

const WorkerSettings = () => {
  const { profile } = useAuthProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground">
          Hantera dina arbetarinställningar och profil.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Min profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <Label className="text-sm font-medium">E-post</Label>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Telefon</Label>
              <p className="text-sm text-muted-foreground">{profile?.phone || 'Ej angivet'}</p>
            </div>
          </div>
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
    </div>
  );
};

export default WorkerSettings;