import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { TrendingUp, Download, Calendar, DollarSign, Award, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface RotRutSummary {
  year: number;
  rot_total: number;
  rut_total: number;
  rot_used: number;
  rut_used: number;
  rot_remaining: number;
  rut_remaining: number;
}

interface RotRutTransaction {
  id: string;
  invoice_number: string;
  service_name: string;
  invoice_date: string;
  rot_amount: number;
  rut_amount: number;
  status: string;
  booking_id?: string;
}

const ROT_MAX_AMOUNT = 50000; // Max ROT per year
const RUT_MAX_AMOUNT = 75000; // Max RUT per year

const RotRutPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState<RotRutSummary | null>(null);
  const [transactions, setTransactions] = useState<RotRutTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (user?.id) {
      loadRotRutData();
    }
  }, [user?.id, selectedYear]);

  const loadRotRutData = async () => {
    try {
      setLoading(true);

      // Load summary for selected year
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('rot_amount, rut_amount')
        .eq('customer_id', user!.id)
        .eq('status', 'paid')
        .gte('issue_date', `${selectedYear}-01-01`)
        .lt('issue_date', `${selectedYear + 1}-01-01`);

      if (invoiceError) throw invoiceError;

      const rot_used = invoiceData?.reduce((sum, inv) => sum + (inv.rot_amount || 0), 0) || 0;
      const rut_used = invoiceData?.reduce((sum, inv) => sum + (inv.rut_amount || 0), 0) || 0;

      setSummary({
        year: selectedYear,
        rot_total: ROT_MAX_AMOUNT,
        rut_total: RUT_MAX_AMOUNT,
        rot_used,
        rut_used,
        rot_remaining: Math.max(0, ROT_MAX_AMOUNT - rot_used),
        rut_remaining: Math.max(0, RUT_MAX_AMOUNT - rut_used)
      });

      // Load transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          issue_date,
          rot_amount,
          rut_amount,
          status,
          booking_id,
          line_items
        `)
        .eq('customer_id', user!.id)
        .gte('issue_date', `${selectedYear}-01-01`)
        .lt('issue_date', `${selectedYear + 1}-01-01`)
        .or('rot_amount.gt.0,rut_amount.gt.0')
        .order('issue_date', { ascending: false });

      if (transactionError) throw transactionError;

      const formattedTransactions = transactionData?.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        service_name: invoice.line_items?.[0]?.description || 'Okänd tjänst',
        invoice_date: invoice.issue_date,
        rot_amount: invoice.rot_amount || 0,
        rut_amount: invoice.rut_amount || 0,
        status: invoice.status,
        booking_id: invoice.booking_id
      })) || [];

      setTransactions(formattedTransactions);

    } catch (error) {
      console.error('Error loading ROT/RUT data:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda ROT/RUT-data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSummary = () => {
    if (!summary || transactions.length === 0) return;

    const csvContent = [
      ['ROT/RUT Sammanställning', selectedYear],
      [''],
      ['Typ', 'Använt belopp', 'Max belopp', 'Kvar'],
      ['ROT', summary.rot_used, summary.rot_total, summary.rot_remaining],
      ['RUT', summary.rut_used, summary.rut_total, summary.rut_remaining],
      [''],
      ['Detaljerad lista'],
      ['Fakturanr', 'Datum', 'Tjänst', 'ROT', 'RUT', 'Status'],
      ...transactions.map(t => [
        t.invoice_number,
        t.invoice_date,
        t.service_name,
        t.rot_amount,
        t.rut_amount,
        t.status
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rot-rut-${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Klart!",
      description: "ROT/RUT-sammanställning nedladdad"
    });
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  if (!profile) {
    return <div>Laddar...</div>;
  }

  return (
    <>
      <Helmet>
        <title>ROT/RUT | Mitt Fixco</title>
        <meta name="description" content="Översikt över dina ROT- och RUT-avdrag" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <DashboardHeader profile={profile} />

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">ROT & RUT</h2>
            <p className="text-muted-foreground">Översikt över dina skatteavdrag</p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getYearOptions().map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={exportSummary} disabled={!summary || transactions.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportera
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !summary ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ingen ROT/RUT-data för {selectedYear}</h3>
              <p className="text-muted-foreground text-center">
                Du har inga ROT- eller RUT-berättigade tjänster detta år
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ROT Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      ROT-avdrag
                    </span>
                    <Badge variant="secondary">{selectedYear}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {summary.rot_used.toLocaleString('sv-SE')} kr
                      </span>
                      <span className="text-sm text-muted-foreground">
                        av {summary.rot_total.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    <Progress 
                      value={(summary.rot_used / summary.rot_total) * 100} 
                      className="h-3"
                    />
                    <div className="text-sm text-muted-foreground">
                      Kvar: {summary.rot_remaining.toLocaleString('sv-SE')} kr
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm space-y-1">
                      <p><strong>ROT</strong> - Reparation, Ombyggnad, Tillbyggnad</p>
                      <p className="text-muted-foreground">
                        30% avdrag, max 50 000 kr per år
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RUT Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5" />
                      RUT-avdrag
                    </span>
                    <Badge variant="secondary">{selectedYear}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {summary.rut_used.toLocaleString('sv-SE')} kr
                      </span>
                      <span className="text-sm text-muted-foreground">
                        av {summary.rut_total.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    <Progress 
                      value={(summary.rut_used / summary.rut_total) * 100} 
                      className="h-3"
                    />
                    <div className="text-sm text-muted-foreground">
                      Kvar: {summary.rut_remaining.toLocaleString('sv-SE')} kr
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm space-y-1">
                      <p><strong>RUT</strong> - Rengöring, Underhåll, Tvätt</p>
                      <p className="text-muted-foreground">
                        30% avdrag, max 75 000 kr per år
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  ROT/RUT-transaktioner {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Inga ROT/RUT-transaktioner för {selectedYear}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fakturanr</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Tjänst</TableHead>
                        <TableHead className="text-right">ROT</TableHead>
                        <TableHead className="text-right">RUT</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.invoice_number}
                          </TableCell>
                          <TableCell>
                            {format(new Date(transaction.invoice_date), 'yyyy-MM-dd', { locale: sv })}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {transaction.service_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {transaction.rot_amount > 0 
                              ? `${transaction.rot_amount.toLocaleString('sv-SE')} kr`
                              : '-'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {transaction.rut_amount > 0 
                              ? `${transaction.rut_amount.toLocaleString('sv-SE')} kr`
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'paid' ? 'default' : 'secondary'}>
                              {transaction.status === 'paid' ? 'Betald' : 'Väntande'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default RotRutPage;