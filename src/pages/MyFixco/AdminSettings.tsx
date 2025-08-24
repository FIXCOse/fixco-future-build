import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Systeminställningar</h1>
        <p className="text-muted-foreground">
          Konfigurera systemparametrar och inställningar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Konfiguration
          </CardTitle>
          <CardDescription>
            Grundläggande systeminställningar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Funktionalitet kommer snart...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;