import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Download, FileText, AlertCircle, CheckCircle, CreditCard, Copy, Check, Mail, Phone, Send } from 'lucide-react';
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
          <Card className="shadow-lg overflow-hidden border-0">
            <CardHeader className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 border-b-0 pb-8">
              <div className="flex justify-between items-start text-white">
                <div>
                  <Link to="/" className="inline-block mb-4">
                    <h1 className="text-5xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
                      FIXCO
                    </h1>
                  </Link>
                  <CardTitle className="text-2xl mb-2 text-white">Faktura</CardTitle>
                  <p className="text-white/90 text-lg font-medium">
                    {invoice.invoice_number}
                  </p>
                </div>
                <div className="text-right">
                  {isPaid ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-4 py-2 text-base">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Betald
                    </Badge>
                  ) : invoice.status === "sent" ? (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-4 py-2 text-base">
                      <Send className="w-4 h-4 mr-2" />
                      Skickad
                    </Badge>
                  ) : isOverdue ? (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-4 py-2 text-base">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Förfallen
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-0 px-4 py-2 text-base">
                      <FileText className="w-4 h-4 mr-2" />
                      {invoice.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

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
          <Card className="shadow-lg">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Fakturauppgifter</h2>
                  <p className="text-muted-foreground">
                    Utfärdad: {formatDate(invoice.issue_date)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInvoiceNumber}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Kopiera nr
                </Button>
              </div>
              {/* Customer Info */}
              {customer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">Till:</h3>
                    <div className="space-y-2">
                      <p className="font-semibold text-base">{customer.name}</p>
                      {customer.company_name && <p className="text-sm text-muted-foreground">{customer.company_name}</p>}
                      {customer.org_number && <p className="text-sm text-muted-foreground">Org.nr: {customer.org_number}</p>}
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </p>
                      {customer.phone && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <h3 className="font-semibold text-lg mb-3 text-primary">Från:</h3>
                    <div className="space-y-2">
                      <p className="font-semibold text-base">Fixco AB</p>
                      <p className="text-sm text-muted-foreground">Org.nr: 556789-0123</p>
                      <p className="text-sm text-muted-foreground">info@fixco.se</p>
                      <p className="text-sm text-muted-foreground">08-123 45 67</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Due Date */}
              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg">
                <span className="font-medium text-base">Förfallodatum</span>
                <span className={`text-base font-bold ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                  {formatDate(invoice.due_date)}
                </span>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Artiklar
                </h3>
                <div className="border-2 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                      <tr>
                        <th className="text-left p-4 font-semibold">Beskrivning</th>
                        <th className="text-right p-4 font-semibold">Antal</th>
                        <th className="text-right p-4 font-semibold">Pris</th>
                        <th className="text-right p-4 font-semibold">Summa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.line_items.map((item, index) => (
                        <tr key={index} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="p-4">{item.description}</td>
                          <td className="text-right p-4">{item.quantity}</td>
                          <td className="text-right p-4">{formatCurrency(item.unit_price)}</td>
                          <td className="text-right p-4 font-semibold">
                            {formatCurrency(item.total_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-6 shadow-sm">
                <div className="max-w-md ml-auto space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delsumma:</span>
                    <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rabatt:</span>
                      <span className="text-destructive font-semibold">- {formatCurrency(invoice.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Moms (25%):</span>
                    <span className="font-semibold">{formatCurrency(invoice.vat_amount)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t-2">
                    <span>Totalt att betala:</span>
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(invoice.total_amount)}
                    </span>
                  </div>
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
                className="w-full gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5" />
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