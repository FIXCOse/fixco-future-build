import AdminBack from '@/components/admin/AdminBack';
import ServiceManagement from '@/components/admin/ServiceManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

const AdminServices = () => {
  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tjänsthantering</h1>
          <p className="text-muted-foreground">
            Hantera alla tjänster och priser
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Hantera tjänster
          </CardTitle>
          <CardDescription>
            Lägg till, redigera och hantera alla tjänster. Automatisk engelskav översättning inkluderad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;