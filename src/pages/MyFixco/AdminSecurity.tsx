import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Eye, Search, AlertTriangle } from 'lucide-react';
import { getAuditLog, setSetting, getSettings } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import AdminBack from '@/components/admin/AdminBack';

const AdminSecurity = () => {
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [force2FA, setForce2FA] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [actionFilter]);

  const loadData = async () => {
    try {
      const [auditData, settings] = await Promise.all([
        getAuditLog({ action: actionFilter === 'all' ? undefined : actionFilter, limit: 50 }),
        getSettings(['force_2fa'])
      ]);
      
      setAuditLog(auditData || []);
      setForce2FA(settings['force_2fa'] === true);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda säkerhetsdata',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggle2FA = async (enabled: boolean) => {
    try {
      await setSetting('force_2fa', enabled);
      setForce2FA(enabled);
      toast({
        title: enabled ? 'Aktiverat' : 'Inaktiverat',
        description: `2FA ${enabled ? 'krävs nu' : 'är nu valfritt'} för alla användare`
      });
    } catch (error) {
      console.error('Error updating 2FA setting:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera 2FA-inställning',
        variant: 'destructive'
      });
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('remove')) return 'destructive';
    if (action.includes('update') || action.includes('change')) return 'default';
    if (action.includes('create') || action.includes('add')) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div>
        <h1 className="text-3xl font-bold">Säkerhet & Behörigheter</h1>
        <p className="text-muted-foreground">
          Hantera åtkomst och säkerhetsinställningar
        </p>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Säkerhetsinställningar
          </CardTitle>
          <CardDescription>
            Konfigurera säkerhetspolicies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <Label className="text-base">Kräv 2FA för alla användare</Label>
                <p className="text-sm text-muted-foreground">
                  Tvångsaktivera tvåfaktorsautentisering för alla konton
                </p>
              </div>
            </div>
            <Switch
              checked={force2FA}
              onCheckedChange={toggle2FA}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Auditlogg ({auditLog.length})
            </div>
          </CardTitle>
          <CardDescription>
            Alla administrativa åtgärder loggas här
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrera på åtgärd..."
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Alla åtgärder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla åtgärder</SelectItem>
                <SelectItem value="update_user_role">Rolländringar</SelectItem>
                <SelectItem value="update_setting">Inställningar</SelectItem>
                <SelectItem value="create_staff">Skapa personal</SelectItem>
                <SelectItem value="assign_work">Tilldela arbete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLog.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getActionColor(entry.action)}>
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        av {entry.profiles?.first_name} {entry.profiles?.last_name}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      {entry.target && <span className="font-mono text-xs">Target: {entry.target}</span>}
                      {entry.meta && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(entry.meta, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString('sv-SE')}
                  </div>
                </div>
              ))}
              
              {auditLog.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Inga loggposter hittades
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;