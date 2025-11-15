import AdminBack from '@/components/admin/AdminBack';
import ServiceManagement from '@/components/admin/ServiceManagement';
import { SessionFixButton } from '@/components/admin/SessionFixButton';
import { SessionDebugPanel } from '@/components/admin/SessionDebugPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Wrench, Bug, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminServices = () => {
  const handleMigrateAddons = async () => {
    try {
      toast.info("Migrerar tilläggstjänster...");
      
      // 1. Update service_addons to point to vvs-13 instead of info-badrum
      const { data: updateData, error: updateError } = await supabase
        .from('service_addons')
        .update({ service_id: 'vvs-13' })
        .eq('service_id', 'info-badrum')
        .select();
      
      if (updateError) throw updateError;
      
      // 2. Deactivate info-badrum service
      const { data: deactivateData, error: deactivateError } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', 'info-badrum')
        .select();
      
      if (deactivateError) throw deactivateError;
      
      toast.success(`Migrering klar! ${updateData?.length || 0} tilläggstjänster flyttade till vvs-13`);
      
      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Migration error:", error);
      toast.error("Misslyckades med migrering: " + error.message);
    }
  };
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
        <SessionFixButton />
      </div>

      {/* Debug Panel - Collapsible */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Bug className="h-4 w-4" />
            Visa Session Debug Info
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <SessionDebugPanel />
        </CollapsibleContent>
      </Collapsible>

      {/* Migration Button */}
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Database className="h-5 w-5" />
            Migrera Tilläggstjänster
          </CardTitle>
          <CardDescription>
            Flytta tilläggstjänster från "info-badrum" till "vvs-13" och deaktivera info-badrum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleMigrateAddons}
            variant="outline"
            className="w-full border-orange-500/50 hover:bg-orange-500/10"
          >
            <Database className="h-4 w-4 mr-2" />
            Kör Migrering
          </Button>
        </CardContent>
      </Card>
      
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