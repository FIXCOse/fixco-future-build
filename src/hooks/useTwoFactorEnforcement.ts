import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useTwoFactorEnforcement() {
  const { data: force2FAEnabled } = useFeatureFlag('force_2fa');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTwoFactor = async () => {
      if (!force2FAEnabled || !user) return;

      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      const has2FA = factors?.totp && factors.totp.length > 0;

      if (!has2FA) {
        navigate('/settings/security?setup2fa=true');
      }
    };

    checkTwoFactor();
  }, [force2FAEnabled, user, navigate]);
}
