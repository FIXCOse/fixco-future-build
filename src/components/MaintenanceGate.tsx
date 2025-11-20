import { ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useRole } from '@/hooks/useRole';
import { Wrench, Shield } from 'lucide-react';

interface MaintenanceGateProps {
  children: ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { data: maintenanceEnabled, isLoading: flagLoading } = useFeatureFlag('maintenance_mode');
  const { isAdmin, isOwner, loading: roleLoading } = useRole();

  if (flagLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const shouldShowMaintenancePage = maintenanceEnabled && !isAdmin && !isOwner;

  if (shouldShowMaintenancePage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full"></div>
              <div className="relative bg-primary/10 p-8 rounded-full">
                <Wrench className="h-20 w-20 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Vi är strax tillbaka!
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Fixco genomgår för tillfället planerat underhåll för att förbättra din upplevelse.
            </p>
            <p className="text-sm text-muted-foreground">
              Vi beräknar att vara tillbaka inom kort. Tack för ditt tålamod!
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-3">Behöver du akut hjälp?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📞 Ring oss: <a href="tel:08-123 456 78" className="text-primary hover:underline">08-123 456 78</a></p>
              <p>📧 Email: <a href="mailto:info@fixco.se" className="text-primary hover:underline">info@fixco.se</a></p>
            </div>
          </div>

          {(isAdmin || isOwner) && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Administratörsläge</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Du har admin-behörighet. Detta meddelande visas för andra användare.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
