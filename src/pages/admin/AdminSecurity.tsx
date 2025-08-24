import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, RefreshCw } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

const AdminSecurity = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock security events data
  const { data: securityEvents } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      // Simulate API call
      return [
        {
          id: '1',
          type: 'login_success',
          user_email: 'admin@fixco.se',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          severity: 'info',
        },
        {
          id: '2',
          type: 'login_failed',
          user_email: 'unknown@example.com',
          ip_address: '203.0.113.195',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          severity: 'warning',
        },
        {
          id: '3',
          type: 'data_access',
          user_email: 'admin@fixco.se',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          severity: 'info',
        },
      ];
    },
  });

  const securityMetrics = [
    {
      title: 'Aktiva sessioner',
      value: '3',
      status: 'good',
      icon: Lock,
    },
    {
      title: 'Misslyckade inloggningar (24h)',
      value: '2',
      status: 'warning',
      icon: AlertTriangle,
    },
    {
      title: 'RLS policies',
      value: '15',
      status: 'good',
      icon: Shield,
    },
    {
      title: 'SSL-certifikat',
      value: 'Giltigt',
      status: 'good',
      icon: CheckCircle,
    },
  ];

  const getEventBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'warning': return 'destructive' as const;
      case 'error': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_success': return CheckCircle;
      case 'login_failed': return AlertTriangle;
      case 'data_access': return Eye;
      default: return Shield;
    }
  };

  const getEventDescription = (type: string) => {
    switch (type) {
      case 'login_success': return 'Lyckad inloggning';
      case 'login_failed': return 'Misslyckad inloggning';
      case 'data_access': return 'Dataåtkomst';
      default: return 'Säkerhetshändelse';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Säkerhet</h1>
          <p className="text-muted-foreground">Övervaka systemets säkerhet och aktivitet</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Uppdatera
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric) => {
          const Icon = metric.icon;
          const statusColor = metric.status === 'good' ? 'text-green-600' : 'text-yellow-600';
          const bgColor = metric.status === 'good' ? 'bg-green-100' : 'bg-yellow-100';
          
          return (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${bgColor}`}>
                    <Icon className={`h-6 w-6 ${statusColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Säkerhetsstatus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Row Level Security</span>
              <Badge variant="default">Aktiverad</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SSL/TLS</span>
              <Badge variant="default">Aktiverad</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>2FA för admins</span>
              <Badge variant="secondary">Rekommenderas</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API Rate Limiting</span>
              <Badge variant="default">Aktiverad</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Intrusion Detection</span>
              <Badge variant="default">Aktiv</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Senaste säkerhetshändelser
            </CardTitle>
          </CardHeader>
          <CardContent>
            {securityEvents && securityEvents.length > 0 ? (
              <div className="space-y-4">
                {securityEvents.map((event) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getEventDescription(event.type)}</span>
                          <Badge variant={getEventBadgeVariant(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.user_email} från {event.ip_address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.timestamp), { 
                            addSuffix: true, 
                            locale: sv 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">Inga säkerhetshändelser att visa</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSecurity;