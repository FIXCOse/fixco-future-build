import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const SessionFixButton = () => {
  const fixSession = async () => {
    try {
      toast.loading('Åtgärdar session...');
      
      // Rensa lokal data
      localStorage.clear();
      sessionStorage.clear();
      
      // Logga ut från Supabase
      await supabase.auth.signOut();
      
      // Omdirigera
      window.location.href = '/auth?message=session-fixed';
    } catch (error) {
      console.error('Fix session error:', error);
      toast.error('Kunde inte åtgärda session');
    }
  };

  return (
    <Button
      onClick={fixSession}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Åtgärda Session
    </Button>
  );
};
