import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Download,
  FileText,
  Receipt,
  Users
} from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

const AdminReports = () => {
  const [period, setPeriod] = useState('30');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-reports', period],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const [bookings, quotes, invoices, revenue] = await Promise.all([
        supabase
          .from('bookings')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('quotes')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('invoices')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('invoices')
          .select('total_amount')
          .eq('status', 'paid')
          .gte('created_at', startDate.toISOString()),
      ]);

      const totalRevenue = revenue.data?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;
      const acceptedQuotes = quotes.data?.filter(q => q.status === 'accepted').length || 0;
      const quoteAcceptanceRate = quotes.data?.length ? (acceptedQuotes / quotes.data.length) * 100 : 0;

      return {
        bookings: bookings.data || [],
        quotes: quotes.data || [],
        invoices: invoices.data || [],
        totalRevenue,
        quoteAcceptanceRate,
        bookingsCount: bookings.data?.length || 0,
        quotesCount: quotes.data?.length || 0,
        invoicesCount: invoices.data?.length || 0,
      };
    },
  });

  const kpiCards = [
    {
      title: 'Totala intäkter',
      value: reportData?.totalRevenue ? `${reportData.totalRevenue.toLocaleString()} SEK` : '0 SEK',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Bokningar',
      value: reportData?.bookingsCount.toString() || '0',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Offert-acceptans',
      value: reportData ? `${reportData.quoteAcceptanceRate.toFixed(1)}%` : '0%',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Fakturor',
      value: reportData?.invoicesCount.toString() || '0',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const handleExport = () => {
    // Mock export functionality
    const csvData = [
      ['Datum', 'Typ', 'Beskrivning', 'Belopp'],
      ...(reportData?.bookings.map(b => [
        new Date(b.created_at).toLocaleDateString('sv-SE'),
        'Bokning',
        b.service_slug,
        (b.payload as any)?.base_price || 0
      ]) || []),
      ...(reportData?.invoices.map(i => [
        new Date(i.created_at).toLocaleDateString('sv-SE'),
        'Faktura',
        `Faktura ${i.invoice_number}`,
        i.total_amount
      ]) || [])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${period}-dagar.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detaljerad analys</h1>
          <p className="text-muted-foreground">Försäljningsrapporter och KPI:er</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dagar</SelectItem>
              <SelectItem value="30">30 dagar</SelectItem>
              <SelectItem value="90">90 dagar</SelectItem>
              <SelectItem value="365">1 år</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportera CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : kpi.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
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
              <BarChart3 className="h-5 w-5" />
              Senaste bokningar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-3 h-3 bg-muted rounded-full" />
                    <div className="flex-1 h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : reportData?.bookings.length ? (
              <div className="space-y-3">
                {reportData.bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{(booking.payload as any)?.service_name || booking.service_slug}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(booking.created_at), { 
                          addSuffix: true, 
                          locale: sv 
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">{booking.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Inga bokningar för vald period</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prestanda översikt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Genomsnittlig ordervärde</span>
              <span className="font-medium">
                {reportData?.bookings.length 
                  ? `${Math.round(reportData.totalRevenue / reportData.bookings.length).toLocaleString()} SEK`
                  : '0 SEK'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Betalda fakturor</span>
              <span className="font-medium">
                {reportData?.invoices.filter(i => i.status === 'paid').length || 0} av {reportData?.invoicesCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Offert → Bokning</span>
              <span className="font-medium">
                {reportData ? `${reportData.quoteAcceptanceRate.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;