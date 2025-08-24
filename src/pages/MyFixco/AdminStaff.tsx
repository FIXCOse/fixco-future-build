import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

const AdminStaff = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Personalhantering</h1>
        <p className="text-muted-foreground">
          Hantera anställda och deras behörigheter
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Personal
          </CardTitle>
          <CardDescription>
            Tekniker och personalhantering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Funktionalitet kommer snart...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaff;