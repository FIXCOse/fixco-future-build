import { Button } from '@/components/ui/button';
import { Power, Loader2 } from 'lucide-react';
import { useBulkToggleAllAddons } from '@/hooks/useServiceAddons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const BulkToggleAddonsButton = () => {
  const bulkToggle = useBulkToggleAllAddons();
  
  // Check current status
  const { data: allActive } = useQuery({
    queryKey: ['addons-status'],
    queryFn: async () => {
      const { data } = await supabase
        .from('service_addons')
        .select('is_active');
      
      if (!data || data.length === 0) return true;
      return data.every(a => a.is_active);
    },
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const handleToggle = () => {
    bulkToggle.mutate(!allActive);
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={bulkToggle.isPending}
      variant={allActive ? "destructive" : "default"}
      size="sm"
      className="gap-2"
    >
      {bulkToggle.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Power className="h-4 w-4" />
      )}
      {allActive ? 'Avaktivera alla tillägg' : 'Aktivera alla tillägg'}
    </Button>
  );
};
