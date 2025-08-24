import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const AdminDatabase = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Databashantering</h1>
        <p className="text-muted-foreground">
          Backup, underhåll och datahantering
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Databas
          </CardTitle>
          <CardDescription>
            Databasverktyg och underhåll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Funktionalitet kommer snart...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDatabase;