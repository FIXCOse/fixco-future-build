import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { FileText, Download, Eye, Search, Calendar, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Label } from '@/components/ui/label';

interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  total_amount: number;
  vat_amount: number;
  subtotal: number;
  rot_amount?: number;
  rut_amount?: number;
  discount_amount?: number;
  pdf_url?: string;
  line_items: any; // Changed from any[] to any to match Supabase Json type
  booking_id?: string;
  quote_id?: string;
  paid_at?: string;
}

const InvoicesPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadInvoices();
    }
  }, [user?.id]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', user!.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda fakturor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    if (!invoice.pdf_url) {
      toast({
        title: "Fel",
        description: "PDF-fil inte tillgänglig",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('invoices')
        .createSignedUrl(invoice.pdf_url, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda ned PDF",
        variant: "destructive"
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'sent': return 'secondary';
      case 'overdue': return 'destructive';
      case 'draft': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Betald';
      case 'sent': return 'Skickad';
      case 'overdue': return 'Förfallen';
      case 'draft': return 'Utkast';
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.line_items && Array.isArray(invoice.line_items) && invoice.line_items.some((item: any) => 
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!profile) {
    return <div>Laddar...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Fakturor | Mitt Fixco</title>
        <meta name="description" content="Visa och hantera dina fakturor" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <DashboardHeader profile={profile} />

        <div>
          <h2 className="text-2xl font-bold">Fakturor</h2>
          <p className="text-muted-foreground">Visa och ladda ned dina fakturor</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sök fakturor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrera status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla statusar</SelectItem>
              <SelectItem value="draft">Utkast</SelectItem>
              <SelectItem value="sent">Skickad</SelectItem>
              <SelectItem value="paid">Betald</SelectItem>
              <SelectItem value="overdue">Förfallen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {invoices.length === 0 ? 'Inga fakturor ännu' : 'Inga matchande fakturor'}
              </h3>
              <p className="text-muted-foreground text-center">
                {invoices.length === 0 
                  ? 'Dina fakturor kommer att visas här när du genomför tjänster'
                  : 'Prova att ändra sökkriterier eller filter'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fakturanr</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Förfallodag</TableHead>
                  <TableHead>Belopp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ROT/RUT</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.issue_date), 'yyyy-MM-dd', { locale: sv })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.due_date), 'yyyy-MM-dd', { locale: sv })}
                    </TableCell>
                    <TableCell>
                      {invoice.total_amount.toLocaleString('sv-SE')} kr
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {((invoice.rot_amount || 0) + (invoice.rut_amount || 0) > 0) ? 
                        `${((invoice.rot_amount || 0) + (invoice.rut_amount || 0)).toLocaleString('sv-SE')} kr` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Faktura {selectedInvoice?.invoice_number}</DialogTitle>
                            </DialogHeader>
                            {selectedInvoice && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Fakturadatum</Label>
                                    <p className="text-sm">
                                      {format(new Date(selectedInvoice.issue_date), 'yyyy-MM-dd', { locale: sv })}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Förfallodag</Label>
                                    <p className="text-sm">
                                      {format(new Date(selectedInvoice.due_date), 'yyyy-MM-dd', { locale: sv })}
                                    </p>
                                  </div>
                                </div>

                                  <div>
                                    <Label className="text-sm font-medium">Fakturarader</Label>
                                    <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                                      {Array.isArray(selectedInvoice.line_items) ? selectedInvoice.line_items.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                                          <div>
                                            <p className="text-sm font-medium">{item.description}</p>
                                            {item.quantity && item.unit_price && (
                                              <p className="text-xs text-muted-foreground">
                                                {item.quantity} × {item.unit_price.toLocaleString('sv-SE')} kr
                                              </p>
                                            )}
                                          </div>
                                          <p className="text-sm font-medium">
                                            {item.total_amount?.toLocaleString('sv-SE')} kr
                                          </p>
                                        </div>
                                      )) : (
                                        <p className="text-sm text-muted-foreground">Inga fakturarader tillgängliga</p>
                                      )}
                                    </div>
                                  </div>

                                <div className="space-y-2 border-t pt-4">
                                  <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{selectedInvoice.subtotal.toLocaleString('sv-SE')} kr</span>
                                  </div>
                                  {selectedInvoice.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                      <span>Rabatt</span>
                                      <span>-{selectedInvoice.discount_amount.toLocaleString('sv-SE')} kr</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-sm">
                                    <span>Moms</span>
                                    <span>{selectedInvoice.vat_amount.toLocaleString('sv-SE')} kr</span>
                                  </div>
                                  {(selectedInvoice.rot_amount || 0) > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600">
                                      <span>ROT-avdrag</span>
                                      <span>-{selectedInvoice.rot_amount!.toLocaleString('sv-SE')} kr</span>
                                    </div>
                                  )}
                                  {(selectedInvoice.rut_amount || 0) > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600">
                                      <span>RUT-avdrag</span>
                                      <span>-{selectedInvoice.rut_amount!.toLocaleString('sv-SE')} kr</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Totalt</span>
                                    <span>{selectedInvoice.total_amount.toLocaleString('sv-SE')} kr</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {invoice.pdf_url && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDownloadPdf(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </>
  );
};

export default InvoicesPage;