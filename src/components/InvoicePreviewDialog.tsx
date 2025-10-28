import { 
  FileText, Calendar, Mail, Phone, Download, Send, CheckCircle2, 
  AlertCircle, Clock, XCircle, Copy, CreditCard 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface InvoicePreviewDialogProps {
  invoice: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceUpdated?: () => void;
}

export default function InvoicePreviewDialog({ 
  invoice, 
  open, 
  onOpenChange,
  onInvoiceUpdated 
}: InvoicePreviewDialogProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [marking, setMarking] = useState(false);

  if (!invoice) return null;

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '0 kr';
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'paid':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Betald
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Förfallen
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="default">
            <Mail className="h-3 w-3 mr-1" />
            Skickad
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Utkast
          </Badge>
        );
      default:
        return <Badge variant="secondary">{invoice.status}</Badge>;
    }
  };

  const copyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoice.invoice_number);
    toast({
      title: 'Kopierat!',
      description: 'Fakturanummer kopierat till urklipp',
    });
  };

  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoiceId: invoice.id }
      });

      if (error) throw error;

      toast({
        title: 'PDF genererad!',
        description: 'Fakturan är nu tillgänglig som PDF',
      });
      onInvoiceUpdated?.();
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Fel',
        description: error.message || 'Kunde inte generera PDF',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!invoice.pdf_url) {
        toast({
          title: 'Ingen PDF',
          description: 'Generera PDF först',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.storage
        .from('invoices')
        .createSignedUrl(invoice.pdf_url, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda ned PDF',
        variant: 'destructive',
      });
    }
  };

  const handleSendInvoice = async () => {
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { 
          invoiceId: invoice.id,
          toEmail: invoice.customer?.email 
        }
      });

      if (error) throw error;

      toast({
        title: 'Faktura skickad!',
        description: `Email skickat till ${invoice.customer?.email}`,
      });
      onInvoiceUpdated?.();
    } catch (error: any) {
      console.error('Error sending invoice:', error);
      toast({
        title: 'Fel',
        description: error.message || 'Kunde inte skicka faktura',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setMarking(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: 'Markerad som betald!',
        description: 'Fakturan är nu markerad som betald',
      });
      onInvoiceUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error marking as paid:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera status',
        variant: 'destructive',
      });
    } finally {
      setMarking(false);
    }
  };

  const lineItems = Array.isArray(invoice.line_items) ? invoice.line_items : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">
                  Faktura {invoice.invoice_number}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyInvoiceNumber}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Från Fixco AB</p>
            </div>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Kund & Datum Information */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Kund</p>
                  <p className="font-semibold text-foreground">{invoice.customer?.name || 'Okänd kund'}</p>
                  {invoice.customer?.email && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {invoice.customer.email}
                    </p>
                  )}
                  {invoice.customer?.phone && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {invoice.customer.phone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Datum</p>
                  <div className="space-y-1">
                    <p className="text-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Fakturadatum:</span>
                      <span className="font-medium">{formatDate(invoice.invoice_date)}</span>
                    </p>
                    <p className="text-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Förfallodatum:</span>
                      <span className="font-medium">{formatDate(invoice.due_date)}</span>
                    </p>
                    {invoice.paid_at && (
                      <p className="text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-xs">Betald:</span>
                        <span className="font-medium">{formatDate(invoice.paid_at)}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fakturarader */}
          {lineItems.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                  Specifikation
                </h3>
                <div className="space-y-2">
                  {lineItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.description}</p>
                        {item.quantity && item.unit_price && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.quantity} × {formatCurrency(item.unit_price)}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-foreground ml-4">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kostnadssammanfattning */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                Sammanfattning
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal_amount)}</span>
                </div>
                
                {invoice.vat_amount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Moms (25%)</span>
                    <span className="font-medium">{formatCurrency(invoice.vat_amount)}</span>
                  </div>
                )}

                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between py-2 bg-green-50 dark:bg-green-950/20 px-3 -mx-1 rounded">
                    <span className="text-green-700 dark:text-green-400 font-medium">Rabatt</span>
                    <span className="text-green-700 dark:text-green-400 font-semibold">
                      -{formatCurrency(invoice.discount_amount)}
                    </span>
                  </div>
                )}

                {invoice.rot_amount > 0 && (
                  <div className="flex justify-between py-2 bg-green-50 dark:bg-green-950/20 px-3 -mx-1 rounded">
                    <span className="text-green-700 dark:text-green-400 font-medium">ROT-avdrag</span>
                    <span className="text-green-700 dark:text-green-400 font-semibold">
                      -{formatCurrency(invoice.rot_amount)}
                    </span>
                  </div>
                )}

                {invoice.rut_amount > 0 && (
                  <div className="flex justify-between py-2 bg-green-50 dark:bg-green-950/20 px-3 -mx-1 rounded">
                    <span className="text-green-700 dark:text-green-400 font-medium">RUT-avdrag</span>
                    <span className="text-green-700 dark:text-green-400 font-semibold">
                      -{formatCurrency(invoice.rut_amount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t-2 border-primary/20">
                  <span className="text-lg font-bold text-foreground">Totalt att betala</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {!invoice.pdf_url ? (
              <Button
                onClick={handleGeneratePDF}
                disabled={generating}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                {generating ? 'Genererar...' : 'Generera PDF'}
              </Button>
            ) : (
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Ladda ned PDF
              </Button>
            )}

            {invoice.customer?.email && invoice.status !== 'paid' && (
              <Button
                onClick={handleSendInvoice}
                disabled={sending || !invoice.pdf_url}
                variant="outline"
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Skickar...' : 'Skicka via email'}
              </Button>
            )}

            {invoice.status !== 'paid' && (
              <Button
                onClick={handleMarkAsPaid}
                disabled={marking}
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {marking ? 'Markerar...' : 'Markera som betald'}
              </Button>
            )}
          </div>

          {!invoice.pdf_url && (
            <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              PDF ännu inte genererad. Generera PDF för att kunna skicka fakturan.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
