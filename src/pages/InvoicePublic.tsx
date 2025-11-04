import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Download, FileText, AlertCircle, CheckCircle, CreditCard, Copy, Check, Mail, Phone, Send, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

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

      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
          {/* Hero Glassmorphism Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 border-2 border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative group hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-500">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              
              <CardContent className="p-12 relative">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <div className="flex items-center gap-6">
                    <Link to="/" className="inline-block">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wider">
                          FIXCO
                        </h1>
                        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-full mt-3 shadow-lg shadow-primary/50" />
                        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
                      </motion.div>
                    </Link>
                  </div>
                  
                  {/* Floating Status Badge */}
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className={`
                      px-6 py-3 rounded-2xl backdrop-blur-xl border-2 flex items-center gap-3 shadow-2xl
                      ${isPaid ? 'bg-green-500/20 border-green-500/50 shadow-green-500/30' :
                        isOverdue ? 'bg-red-500/20 border-red-500/50 shadow-red-500/30' :
                        'bg-blue-500/20 border-blue-500/50 shadow-blue-500/30'}
                    `}>
                      {isPaid && <CheckCircle className="w-7 h-7 text-green-400 animate-pulse" />}
                      {isOverdue && <AlertCircle className="w-7 h-7 text-red-400 animate-pulse" />}
                      {!isPaid && !isOverdue && <Send className="w-7 h-7 text-blue-400 animate-pulse" />}
                      <span className={`text-xl font-bold tracking-wide ${
                        isPaid ? 'text-green-300' :
                        isOverdue ? 'text-red-300' :
                        'text-blue-300'
                      }`}>
                        {isPaid ? 'BETALD' : isOverdue ? 'FÖRFALLEN' : 'SKICKAD'}
                      </span>
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-2xl blur-xl -z-10 ${
                      isPaid ? 'bg-green-500/30' :
                      isOverdue ? 'bg-red-500/30' :
                      'bg-blue-500/30'
                    }`} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timer Alert - Animated */}
          {!isPaid && daysUntilDue !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-6 rounded-2xl border-2 flex items-center gap-4 relative overflow-hidden ${
                daysUntilDue < 0 
                  ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20' 
                  : daysUntilDue <= 7
                  ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                  : 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20'
              }`}
            >
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className={`w-8 h-8 ${
                  daysUntilDue < 0 ? 'text-red-400' :
                  daysUntilDue <= 7 ? 'text-yellow-400' :
                  'text-blue-400'
                }`} />
              </motion.div>
              <div className="flex-1">
                <p className="font-bold text-lg">
                  {daysUntilDue < 0 ? (
                    <>Förfallen sedan {Math.abs(daysUntilDue)} {Math.abs(daysUntilDue) === 1 ? 'dag' : 'dagar'}</>
                  ) : daysUntilDue === 0 ? (
                    <>Förfaller idag!</>
                  ) : (
                    <>Förfallodatum: {formatDate(invoice.due_date)}</>
                  )}
                </p>
                <p className={`text-sm font-semibold ${
                  daysUntilDue < 0 ? 'text-red-400' :
                  daysUntilDue <= 7 ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {daysUntilDue > 0 ? `⏰ ${daysUntilDue} ${daysUntilDue === 1 ? 'dag' : 'dagar'} kvar` : `🚨 Förfallen`}
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Invoice Card - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-2 border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Faktura
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Fakturanummer:</span>
                      <motion.span 
                        className="font-mono font-bold text-foreground text-xl px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg border border-primary/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        {invoice.invoice_number}
                      </motion.span>
                    </div>
                    <p className="text-muted-foreground">
                      Utfärdad: {formatDate(invoice.issue_date)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyInvoiceNumber}
                    className="gap-2 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Kopiera nr
                  </Button>
                </div>
              {/* Customer Info - Modern Split Design */}
              {customer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-blue-500/5 border-2 border-primary/20 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-blue-500 shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        Till
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-lg">{customer.name}</p>
                      {customer.company_name && <p className="text-sm text-muted-foreground">{customer.company_name}</p>}
                      {customer.org_number && <p className="text-sm text-muted-foreground font-mono">Org.nr: {customer.org_number}</p>}
                      <div className="pt-3 space-y-2 border-t border-primary/20">
                        <p className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </p>
                        {customer.phone && (
                          <p className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2 border-purple-500/20 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Från
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-lg">Fixco AB</p>
                      <p className="text-sm text-muted-foreground font-mono">Org.nr: 556789-0123</p>
                      <div className="pt-3 space-y-2 border-t border-purple-500/20">
                        <p className="flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors">
                          <Mail className="w-4 h-4" />
                          info@fixco.se
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors">
                          <Phone className="w-4 h-4" />
                          08-123 45 67
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Due Date - Enhanced */}
              <motion.div 
                className="flex items-center justify-between p-6 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-2xl border-2 border-primary/20"
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-bold text-lg">Förfallodatum</span>
                <span className={`text-xl font-bold ${isOverdue ? 'text-red-400' : 'text-foreground'}`}>
                  {formatDate(invoice.due_date)}
                </span>
              </motion.div>

              {/* Line Items - Modern Data Display */}
              <div>
                <h3 className="font-bold text-2xl mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  <FileText className="w-6 h-6 text-primary" />
                  Artiklar
                </h3>
                <div className="overflow-hidden rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary via-blue-500 to-purple-600">
                        <th className="text-left py-5 px-6 font-bold text-sm text-white tracking-wide">BESKRIVNING</th>
                        <th className="text-center py-5 px-6 font-bold text-sm text-white tracking-wide">ANTAL</th>
                        <th className="text-right py-5 px-6 font-bold text-sm text-white tracking-wide">Á-PRIS</th>
                        <th className="text-right py-5 px-6 font-bold text-sm text-white tracking-wide">SUMMA</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 backdrop-blur-xl">
                      {invoice.line_items.map((item, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-white/10 hover:bg-white/10 transition-all duration-300 group"
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="py-5 px-6">
                            <span className="font-semibold text-base group-hover:text-primary transition-colors">
                              {item.description}
                            </span>
                          </td>
                          <td className="text-center py-5 px-6">
                            <span className="inline-block px-3 py-1 bg-primary/20 rounded-lg font-bold text-primary">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="text-right py-5 px-6 text-muted-foreground font-mono">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="text-right py-5 px-6 font-bold text-lg">
                            {formatCurrency(item.total_price)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals - Dramatic Summary Card */}
              <div className="flex justify-end">
                <motion.div 
                  className="w-full md:w-96 space-y-4 p-8 rounded-3xl border-2 border-white/30 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-600/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-50 animate-pulse" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground font-medium">Delsumma</span>
                      <span className="font-bold text-lg">{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    
                    {invoice.discount_amount > 0 && (
                      <motion.div 
                        className="flex justify-between text-base p-3 bg-red-500/10 rounded-xl border border-red-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-red-400 font-semibold">Rabatt</span>
                        <span className="font-bold text-red-400">-{formatCurrency(invoice.discount_amount)}</span>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground font-medium">Moms (25%)</span>
                      <span className="font-bold text-lg">{formatCurrency(invoice.vat_amount)}</span>
                    </div>
                    
                    <div className="pt-4 border-t-2 border-gradient-to-r from-primary via-blue-500 to-purple-600">
                      <motion.div 
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl"
                        animate={{ 
                          boxShadow: [
                            '0 0 20px rgba(168, 85, 247, 0.3)',
                            '0 0 40px rgba(59, 130, 246, 0.4)',
                            '0 0 20px rgba(168, 85, 247, 0.3)'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                          TOTAL
                        </span>
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent tabular-nums">
                          {formatCurrency(invoice.total_amount)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {isPaid && invoice.paid_at && (
                <motion.div 
                  className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-2xl shadow-lg shadow-green-500/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-green-400" />
                    <div>
                      <p className="text-lg font-bold text-green-400">Betald</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(invoice.paid_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
          </motion.div>

          {/* Action Buttons - Large Gradient CTAs */}
          <div className="flex flex-col sm:flex-row gap-6">
            {invoice.pdf_url && (
              <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="relative flex items-center justify-center gap-3"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Download className="w-6 h-6" />
                    Ladda ner PDF
                  </motion.div>
                </Button>
              </motion.div>
            )}
            
            {!isPaid && (
              <motion.div className="flex-1" whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  className="w-full h-16 text-xl font-bold border-4 border-primary/30 hover:bg-primary/10 hover:border-primary/50 relative group transition-all duration-300"
                  disabled
                >
                  <motion.span 
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-purple-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-xl"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🚀 Kommer snart
                  </motion.span>
                  <CreditCard className="w-6 h-6 mr-2" />
                  Betala med kort
                </Button>
              </motion.div>
            )}
          </div>

          <Button
            variant="ghost"
            size="lg"
            className="w-full mt-4 hover:bg-white/5"
            asChild
          >
            <Link to="/">
              Tillbaka till Fixco.se
            </Link>
          </Button>

          {/* Footer - Modern Contact Section */}
          <motion.div 
            className="mt-12 text-center p-8 rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" />
              <p className="text-base font-semibold">Frågor om fakturan?</p>
            </div>
            <p className="mb-3 text-muted-foreground">
              Kontakta oss på{" "}
              <a 
                href="mailto:info@fixco.se" 
                className="text-primary hover:text-blue-500 font-bold transition-colors inline-flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                info@fixco.se
              </a>
            </p>
            <p className="text-muted-foreground">
              eller ring oss på{" "}
              <a 
                href="tel:+46812345678"
                className="font-bold text-primary hover:text-blue-500 transition-colors inline-flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                08-123 45 67
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InvoicePublic;