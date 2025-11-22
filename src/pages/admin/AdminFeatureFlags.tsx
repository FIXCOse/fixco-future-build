import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Flag, History, Users, AlertCircle, Calendar } from 'lucide-react';
import { 
  useFeatureFlags, 
  useToggleFeatureFlag,
  useFeatureFlagHistory,
  useFeatureFlagOverrides 
} from '@/hooks/useFeatureFlag';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeatureFlagHistoryTable } from '@/components/admin/FeatureFlagHistoryTable';
import { FeatureFlagOverridesTable } from '@/components/admin/FeatureFlagOverridesTable';
import { CreateOverrideDialog } from '@/components/admin/CreateOverrideDialog';
import { ScheduleFlagDialog } from '@/components/admin/ScheduleFlagDialog';
import { ScheduledChangesTable } from '@/components/admin/ScheduledChangesTable';

const AdminFeatureFlags = () => {
  const { data: flags = [], isLoading } = useFeatureFlags();
  const { data: history = [] } = useFeatureFlagHistory();
  const { data: overrides = [] } = useFeatureFlagOverrides();
  const toggleFlag = useToggleFeatureFlag();
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);

  const handleToggle = async (flagKey: string, newValue: boolean) => {
    try {
      await toggleFlag.mutateAsync({
        flagKey,
        enabled: newValue,
        reason: 'Manual toggle from admin panel',
      });
      
      if (flagKey === 'maintenance_mode') {
        if (newValue) {
          toast.warning('⚠️ Maintenance mode aktiverat! Endast admins kan nu komma åt sidan.');
        } else {
          toast.success('✅ Maintenance mode avaktiverat! Sidan är nu tillgänglig för alla.');
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        toast.success(`Feature "${flagKey}" ${newValue ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      toast.error('Failed to toggle feature flag');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground">
            Hantera systemfunktioner och experimentella features
          </p>
        </div>
        <CreateOverrideDialog />
      </div>

      {/* Test-kombinationer Guide */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Test-kombinationer för Meny & Hero
          </CardTitle>
          <CardDescription>
            Använd dessa kombinationer för att testa olika varianter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="font-mono text-sm bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">MENY 1</div>
              <div className="flex-1">
                <div className="font-semibold mb-1">Navigation (TOP) + HeroUltra (gammal)</div>
                <div className="text-sm text-muted-foreground">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">use_top_menu: ✓ ON</code>
                  {' '} + {' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">use_new_hero: ✗ OFF</code>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="font-mono text-sm bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">MENY 2</div>
              <div className="flex-1">
                <div className="font-semibold mb-1">Navbar2 (BOTTOM) + HeroUltra (gammal)</div>
                <div className="text-sm text-muted-foreground">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">use_top_menu: ✗ OFF</code>
                  {' '} + {' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">use_new_hero: ✗ OFF</code>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-purple-300 dark:border-purple-700">
              <div className="font-mono text-sm bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">MENY 5</div>
              <div className="flex-1">
                <div className="font-semibold mb-1">Navbar2 (BOTTOM) + HeroV3 (NY lila gradient) ⭐</div>
                <div className="text-sm text-muted-foreground">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">use_top_menu: ✗ OFF</code>
                  {' '} + {' '}
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">use_new_hero: ✓ ON</code>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm font-medium mb-1">💡 Tips:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Ändringarna träder i kraft omedelbart (realtime)</li>
              <li>Refresha hemsidan för att se ändringarna</li>
              <li>Alla ändringar loggas i "Change History"-fliken</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flags.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flags.filter(f => f.enabled).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Overrides</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overrides.filter(o => !o.expires_at || new Date(o.expires_at) > new Date()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {history.filter(h => {
                const changed = new Date(h.changed_at);
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return changed > dayAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="flags" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flags">
            <Flag className="h-4 w-4 mr-2" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger value="overrides">
            <Users className="h-4 w-4 mr-2" />
            User Overrides ({overrides.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Changes
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Change History
          </TabsTrigger>
        </TabsList>

        {/* Feature Flags Table */}
        <TabsContent value="flags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Feature Flags</CardTitle>
              <CardDescription>
                Toggle features on/off or schedule changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flags.map((flag) => (
                  <div
                    key={flag.key}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{flag.key}</span>
                        <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                          {flag.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        {overrides.filter(o => o.flag_key === flag.key).length > 0 && (
                          <Badge variant="outline">
                            {overrides.filter(o => o.flag_key === flag.key).length} overrides
                          </Badge>
                        )}
                      </div>
                      {flag.meta?.description && (
                        <p className="text-sm text-muted-foreground">
                          {flag.meta.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {flag.meta?.impact_level && (
                          <Badge 
                            variant={
                              flag.meta.impact_level === 'critical' ? 'destructive' :
                              flag.meta.impact_level === 'high' ? 'default' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {flag.meta.impact_level}
                          </Badge>
                        )}
                        {flag.meta?.affected_users && (
                          <span className="text-xs text-muted-foreground">
                            Affects: {flag.meta.affected_users}
                          </span>
                        )}
                      </div>
                      {flag.updated_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last updated: {new Date(flag.updated_at).toLocaleString('sv-SE')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ScheduleFlagDialog flagKey={flag.key} currentEnabled={flag.enabled} />
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={(checked) => handleToggle(flag.key, checked)}
                        disabled={toggleFlag.isPending}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Overrides Table */}
        <TabsContent value="overrides">
          <FeatureFlagOverridesTable overrides={overrides} />
        </TabsContent>

        {/* Scheduled Changes Table */}
        <TabsContent value="scheduled">
          <ScheduledChangesTable />
        </TabsContent>

        {/* History Table */}
        <TabsContent value="history">
          <FeatureFlagHistoryTable history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeatureFlags;
