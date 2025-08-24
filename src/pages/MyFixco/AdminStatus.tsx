import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, Zap, Mail, Bell } from 'lucide-react';

const AdminStatus = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Systemstatus</h1>
        <p className="text-muted-foreground">
          Övervaka systemets olika komponenter
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Systemkomponenter</CardTitle>
          <CardDescription>
            Status för alla kritiska systemdelar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span className="font-medium">Databas</span>
              </div>
              <Badge variant="default">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Autentisering</span>
              </div>
              <Badge variant="default">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Edge Functions</span>
              </div>
              <Badge variant="default">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="font-medium">E-post</span>
              </div>
              <Badge variant="default">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span className="font-medium">Notifieringar</span>
              </div>
              <Badge variant="default">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatus;