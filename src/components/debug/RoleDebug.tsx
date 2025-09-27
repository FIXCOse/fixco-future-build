import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useRoleGate } from '@/hooks/useRoleGate';
import { useEditMode } from '@/stores/useEditMode';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const RoleDebug: React.FC = () => {
  const { profile, role, loading } = useAuthProfile();
  const { canAccessAdmin } = useRoleGate();
  const { canEdit, isEditMode } = useEditMode();
  const [user, setUser] = React.useState<any>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['auth-profile'] });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 space-y-2 max-w-sm z-50 bg-background/95 backdrop-blur">
      <h3 className="font-semibold">Debug: Roll Status</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span>Inloggad:</span>
          <Badge variant={user ? 'default' : 'destructive'}>
            {user ? 'Ja' : 'Nej'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Email:</span>
          <span className="text-muted-foreground">
            {user?.email || 'Ej inloggad'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Profil roll:</span>
          <Badge variant={role === 'owner' || role === 'admin' ? 'default' : 'secondary'}>
            {role || 'Ingen'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span>canAccessAdmin:</span>
          <Badge variant={canAccessAdmin ? 'default' : 'destructive'}>
            {canAccessAdmin ? 'Ja' : 'Nej'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span>canEdit:</span>
          <Badge variant={canEdit ? 'default' : 'destructive'}>
            {canEdit ? 'Ja' : 'Nej'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span>isEditMode:</span>
          <Badge variant={isEditMode ? 'default' : 'secondary'}>
            {isEditMode ? 'Ja' : 'Nej'}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          EditToolbar visas när: canAccessAdmin = true OCH canEdit = true
        </div>
        
        <Button onClick={refreshProfile} size="sm" className="mt-2 w-full">
          Refresh Profile Cache
        </Button>
      </div>
    </Card>
  );
};