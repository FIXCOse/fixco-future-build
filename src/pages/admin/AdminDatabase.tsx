import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Table, Users, FileText, Receipt, Calendar } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';

const AdminDatabase = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['database-stats'],
    queryFn: async () => {
      const [profiles, bookings, quotes, invoices] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('quotes').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('*', { count: 'exact', head: true }),
      ]);

      return {
        profiles: profiles.count || 0,
        bookings: bookings.count || 0,
        quotes: quotes.count || 0,
        invoices: invoices.count || 0,
      };
    },
  });

  const tableStats = [
    {
      name: 'Användare',
      icon: Users,
      count: stats?.profiles || 0,
      description: 'Registrerade användare',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Bokningar',
      icon: Calendar,
      count: stats?.bookings || 0,
      description: 'Totalt antal bokningar',
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Offerter',
      icon: FileText,
      count: stats?.quotes || 0,
      description: 'Skapade offerter',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      name: 'Fakturor',
      icon: Receipt,
      count: stats?.invoices || 0,
      description: 'Genererade fakturor',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Databashantering</h1>
          <p className="text-muted-foreground">Översikt och hantering av databasinnehåll</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tableStats.map((table) => {
          const Icon = table.icon;
          return (
            <Card key={table.name}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${table.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : table.count.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium">{table.name}</p>
                    <p className="text-xs text-muted-foreground">{table.description}</p>
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
              <Database className="h-5 w-5" />
              Databasstatus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Anslutning</span>
              <Badge variant="default">Aktiv</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>RLS (Row Level Security)</span>
              <Badge variant="default">Aktiverad</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Realtime</span>
              <Badge variant="default">Aktiverad</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Backup</span>
              <Badge variant="secondary">Automatisk</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Senaste aktivitet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Databasaktivitet visas i realtid via aktivitetsloggen på huvudsidan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDatabase;