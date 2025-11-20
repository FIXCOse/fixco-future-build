import { ReactNode } from 'react';
import { useFeatureFlagRealtime } from '@/hooks/useFeatureFlagRealtime';
import { useTwoFactorEnforcement } from '@/hooks/useTwoFactorEnforcement';

interface FeatureFlagInitializerProps {
  children: ReactNode;
}

export function FeatureFlagInitializer({ children }: FeatureFlagInitializerProps) {
  // Enable realtime for feature flags
  useFeatureFlagRealtime();
  
  // Enforce 2FA if feature flag is enabled
  useTwoFactorEnforcement();

  return <>{children}</>;
}
