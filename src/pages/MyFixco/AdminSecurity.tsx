import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const AdminSecurity = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Säkerhet & Behörigheter</h1>
        <p className="text-muted-foreground">
          Hantera åtkomst och säkerhetsinställningar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Säkerhet
          </CardTitle>
          <CardDescription>
            Säkerhetsinställningar och auditlogg
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Funktionalitet kommer snart...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;