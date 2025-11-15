import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useRole } from '@/hooks/useRole';

interface SessionDebugInfo {
  session: {
    userId: string | null;
    email: string | null;
    tokenPreview: string | null;
    expiresAt: string | null;
    timeLeft: number | null;
    isExpired: boolean;
    createdAt: string | null;
  };
  roles: {
    allRoles: string[];
    isOwner: boolean;
    isAdmin: boolean;
    isWorker: boolean;
    primaryRole: string;
  };
  rlsTests: {
    authUidWorks: boolean | null;
    isAdminOrOwnerWorks: boolean | null;
    hasRoleWorks: boolean | null;
    servicesTableAccess: boolean | null;
    error: string | null;
  };
}

export const SessionDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState<SessionDebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { role, isOwner, isAdmin, isWorker } = useRole();

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // 1. Hämta session-information
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      const sessionInfo = {
        userId: session?.user?.id || null,
        email: session?.user?.email || null,
        tokenPreview: session?.access_token 
          ? `${session.access_token.substring(0, 10)}...${session.access_token.substring(session.access_token.length - 10)}`
          : null,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString('sv-SE') : null,
        timeLeft: session?.expires_at ? session.expires_at * 1000 - Date.now() : null,
        isExpired: session?.expires_at ? session.expires_at * 1000 < Date.now() : true,
        createdAt: session?.user?.created_at ? new Date(session.user.created_at).toLocaleString('sv-SE') : null,
      };

      // 2. Hämta roller från user_roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session?.user?.id || '');

      const rolesInfo = {
        allRoles: rolesData?.map(r => r.role) || [],
        isOwner,
        isAdmin,
        isWorker,
        primaryRole: role,
      };

      // 3. Kör RLS-tester
      const rlsTests = {
        authUidWorks: null as boolean | null,
        isAdminOrOwnerWorks: null as boolean | null,
        hasRoleWorks: null as boolean | null,
        servicesTableAccess: null as boolean | null,
        error: null as string | null,
      };

      try {
        // Test 1: Testa auth.uid() via debug_auth_context
        const { data: authContextData, error: authContextError } = await supabase
          .rpc('debug_auth_context');
        
        rlsTests.authUidWorks = !authContextError && 
          typeof authContextData === 'object' && 
          authContextData !== null && 
          'auth_uid' in authContextData &&
          authContextData.auth_uid !== null;

        // Test 2: Testa is_admin_or_owner() direkt
        if (session?.user?.id) {
          const { data: adminCheckData, error: adminCheckError } = await supabase
            .rpc('is_admin_or_owner', { user_uuid: session.user.id });
          
          rlsTests.isAdminOrOwnerWorks = !adminCheckError && adminCheckData === true;
        }

        // Test 3: Testa has_role() direkt
        if (session?.user?.id) {
          const { data: hasRoleData, error: hasRoleError } = await supabase
            .rpc('has_role', { _user_id: session.user.id, _role: 'owner' });
          
          rlsTests.hasRoleWorks = !hasRoleError && hasRoleData === true;
        }

        // Test 4: Testa faktisk services-tabell access
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id')
          .limit(1);

        rlsTests.servicesTableAccess = !servicesError;
        
        if (servicesError) {
          rlsTests.error = `${servicesError.code}: ${servicesError.message}`;
        }
      } catch (rlsError: any) {
        rlsTests.error = rlsError.message;
      }

      setDebugInfo({
        session: sessionInfo,
        roles: rolesInfo,
        rlsTests,
      });
    } catch (error: any) {
      console.error('Debug diagnostics error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Kör diagnostik...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!debugInfo) {
    return null;
  }

  const StatusBadge = ({ status, label }: { status: boolean | null; label: string }) => {
    if (status === null) {
      return <Badge variant="outline" className="gap-1"><AlertTriangle className="h-3 w-3" />{label}</Badge>;
    }
    return status ? (
      <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" />{label}</Badge>
    ) : (
      <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />{label}</Badge>
    );
  };

  const hasProblems = 
    debugInfo.session.isExpired ||
    !debugInfo.rlsTests.authUidWorks ||
    !debugInfo.rlsTests.isAdminOrOwnerWorks ||
    !debugInfo.rlsTests.servicesTableAccess;

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🔍 Session Debug Panel
            {hasProblems && <Badge variant="destructive">Problem upptäckt</Badge>}
          </CardTitle>
          <Button onClick={runDiagnostics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Information */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            📋 Session Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono">{debugInfo.session.userId || '❌ NULL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{debugInfo.session.email || '❌ NULL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token:</span>
              <span className="font-mono text-xs">{debugInfo.session.tokenPreview || '❌ NULL'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Expires:</span>
              <div className="flex items-center gap-2">
                <span>{debugInfo.session.expiresAt || '❌ NULL'}</span>
                {debugInfo.session.isExpired ? (
                  <Badge variant="destructive">UTGÅNGEN</Badge>
                ) : debugInfo.session.timeLeft && debugInfo.session.timeLeft < 5 * 60 * 1000 ? (
                  <Badge variant="outline" className="bg-yellow-500/10">
                    {Math.floor(debugInfo.session.timeLeft / 60000)} min kvar
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">Giltig</Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{debugInfo.session.createdAt || '❌ NULL'}</span>
            </div>
          </div>
        </div>

        {/* Roles Information */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            👤 Roller från user_roles
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Alla roller:</span>
              <div className="flex gap-1">
                {debugInfo.roles.allRoles.length > 0 ? (
                  debugInfo.roles.allRoles.map(r => (
                    <Badge key={r} variant="outline">{r}</Badge>
                  ))
                ) : (
                  <Badge variant="destructive">Inga roller!</Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primär roll:</span>
              <Badge variant="default">{debugInfo.roles.primaryRole}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">isOwner:</span>
              <StatusBadge status={debugInfo.roles.isOwner} label={debugInfo.roles.isOwner ? 'Ja' : 'Nej'} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">isAdmin:</span>
              <StatusBadge status={debugInfo.roles.isAdmin} label={debugInfo.roles.isAdmin ? 'Ja' : 'Nej'} />
            </div>
          </div>
        </div>

        {/* RLS Tests */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🔐 RLS Policy Test
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">auth.uid() fungerar:</span>
              <StatusBadge 
                status={debugInfo.rlsTests.authUidWorks} 
                label={debugInfo.rlsTests.authUidWorks ? 'OK' : 'FAIL'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">is_admin_or_owner():</span>
              <StatusBadge 
                status={debugInfo.rlsTests.isAdminOrOwnerWorks} 
                label={debugInfo.rlsTests.isAdminOrOwnerWorks ? 'TRUE' : 'FALSE'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">has_role('owner'):</span>
              <StatusBadge 
                status={debugInfo.rlsTests.hasRoleWorks} 
                label={debugInfo.rlsTests.hasRoleWorks ? 'TRUE' : 'FALSE'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Services-tabell åtkomst:</span>
              <StatusBadge 
                status={debugInfo.rlsTests.servicesTableAccess} 
                label={debugInfo.rlsTests.servicesTableAccess ? 'TILLÅTEN' : 'BLOCKERAD'} 
              />
            </div>
            {debugInfo.rlsTests.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className="text-xs font-mono">
                  {debugInfo.rlsTests.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Problem Summary */}
        {hasProblems && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-semibold mb-2">⚠️ PROBLEM IDENTIFIERAT!</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {debugInfo.session.isExpired && (
                  <li>JWT-token har gått ut - logga in igen</li>
                )}
                {!debugInfo.rlsTests.authUidWorks && (
                  <li>auth.uid() returnerar inte användar-ID</li>
                )}
                {!debugInfo.rlsTests.isAdminOrOwnerWorks && (
                  <li>is_admin_or_owner() returnerar FALSE trots owner-roll</li>
                )}
                {!debugInfo.rlsTests.servicesTableAccess && (
                  <li>RLS blockerar åtkomst till services-tabellen (PGRST301)</li>
                )}
              </ul>
              <div className="mt-3 text-sm">
                <strong>Rekommenderad åtgärd:</strong> Klicka på "Åtgärda Session" för att tvinga fram ny inloggning.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!hasProblems && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ Alla tester godkända! Session och RLS fungerar korrekt.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
