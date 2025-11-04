import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Download, FileText, AlertCircle, CheckCircle, CreditCard, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface PublicInvoice {
  id: string;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  total_amount: number;
  pdf_url: string | null;
  paid_at: string | null;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  org_number?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const InvoicePublic = () => {
  const { token } = useParams<{ token: string }>();
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Ogiltig fakturalänk');
      setLoading(false);
      return;
    }

    loadInvoice();
  }, [token]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: invoiceError } = await supabase.functions.invoke('get-invoice-public', {
        body: { token }
      });

      if (invoiceError) throw invoiceError;
      if (!data?.invoice) throw new Error('Fakturan hittades inte');

      setInvoice(data.invoice);
      setCustomer(data.customer);
    } catch (err: any) {
      console.error('Error loading invoice:', err);
      setError(err.message || 'Kunde inte ladda fakturan');
      toast.error('Kunde inte ladda fakturan');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInvoiceNumber = () => {
    if (invoice?.invoice_number) {
      navigator.clipboard.writeText(invoice.invoice_number);
      setCopied(true);
      toast.success('Fakturanummer kopierat!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    if (invoice?.pdf_url) {
      window.open(invoice.pdf_url, '_blank');
    } else {
      toast.error('PDF är inte tillgänglig ännu');
    }
  };

  const getStatusBadge = (status: string, isPaid: boolean, isOverdue: boolean) => {
    if (isPaid) {
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1" />Betald</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Förfallen</Badge>;
    }
    if (status === 'sent') {
      return <Badge variant="secondary">Skickad</Badge>;
    }
    if (status === 'cancelled') {
      return <Badge variant="outline">Annullerad</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Fakturan kunde inte laddas
            </CardTitle>
            <CardDescription>{error || 'Fakturan hittades inte'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline" className="w-full">Tillbaka till startsidan</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date() && !invoice.paid_at;
  const daysUntilDue = invoice.due_date ? calculateDaysUntilDue(invoice.due_date) : null;
  const isPaid = !!invoice.paid_at;

  return (
    <>
      <Helmet>
        <title>Faktura {invoice.invoice_number} | Fixco</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/assets/fixco-logo.webp" 
                alt="Fixco" 
                className="h-12 mx-auto"
              />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Faktura {invoice.invoice_number}</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                {getStatusBadge(invoice.status, isPaid, !!isOverdue)}
              </div>
            </div>
          </div>

          {/* Timer / Status Alert */}
          {!isPaid && daysUntilDue !== null && (
            <Card className={daysUntilDue < 0 ? 'border-destructive' : daysUntilDue <= 7 ? 'border-yellow-500' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${daysUntilDue < 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <div>
                    {daysUntilDue < 0 ? (
                      <p className="text-sm font-medium text-destructive">
                        Förfallen sedan {Math.abs(daysUntilDue)} {Math.abs(daysUntilDue) === 1 ? 'dag' : 'dagar'}
                      </p>
                    ) : daysUntilDue === 0 ? (
                      <p className="text-sm font-medium text-yellow-600">
                        Förfaller idag!
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {daysUntilDue} {daysUntilDue === 1 ? 'dag' : 'dagar'} kvar till förfallodatum
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Invoice Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Fakturauppgifter</CardTitle>
                  <CardDescription className="mt-1">
                    Utfärdad: {formatDate(invoice.issue_date)}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInvoiceNumber}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {invoice.invoice_number}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              {customer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Till</h3>
                    <div className="space-y-1">
                      <p className="font-medium">{customer.name}</p>
                      {customer.company_name && <p className="text-sm text-muted-foreground">{customer.company_name}</p>}
                      {customer.org_number && <p className="text-sm text-muted-foreground">Org.nr: {customer.org_number}</p>}
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Från</h3>
                    <div className="space-y-1">
                      <p className="font-medium">Fixco AB</p>
                      <p className="text-sm text-muted-foreground">Org.nr: 556789-0123</p>
                      <p className="text-sm text-muted-foreground">info@fixco.se</p>
                      <p className="text-sm text-muted-foreground">08-123 45 67</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Due Date */}
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                <span className="text-sm font-medium">Förfallodatum</span>
                <span className={`text-sm font-bold ${isOverdue ? 'text-destructive' : ''}`}>
                  {formatDate(invoice.due_date)}
                </span>
              </div>

              <Separator />

              {/* Line Items */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Specifikation</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Beskrivning</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Antal</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Enhetspris</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Totalt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.line_items.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 text-sm">{item.description}</td>
                          <td className="py-3 text-sm text-right">{item.quantity}</td>
                          <td className="py-3 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="py-3 text-sm text-right font-medium">{formatCurrency(item.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rabatt</span>
                    <span className="text-destructive">- {formatCurrency(invoice.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moms (25%)</span>
                  <span>{formatCurrency(invoice.vat_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Att betala</span>
                  <span className="text-primary">{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>

              {isPaid && invoice.paid_at && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Betald</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(invoice.paid_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {!isPaid && (
              <Button 
                size="lg" 
                className="w-full"
                disabled
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Betala {formatCurrency(invoice.total_amount)} med kort
                <Badge variant="outline" className="ml-2">Kommer snart</Badge>
              </Button>
            )}
            
            {invoice.pdf_url && (
              <Button 
                variant="outline" 
                size="lg"
                className="w-full"
                onClick={handleDownloadPDF}
              >
                <Download className="mr-2 h-5 w-5" />
                Ladda ner PDF
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              asChild
            >
              <Link to="/">
                Tillbaka till Fixco.se
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8">
            <p>Har du frågor om denna faktura?</p>
            <p className="mt-1">
              Kontakta oss på <a href="mailto:info@fixco.se" className="text-primary hover:underline">info@fixco.se</a> eller 08-123 45 67
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePublic;