import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Användarhantering</h1>
        <p className="text-muted-foreground">
          Hantera kunder, personal och roller
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Användare
          </CardTitle>
          <CardDescription>
            Lista över alla registrerade användare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Funktionalitet kommer snart...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;