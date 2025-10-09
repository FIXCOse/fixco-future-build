import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, Calendar, ExternalLink, CheckCircle2, AlertCircle, Clock, Download,
  XCircle, MessageCircle, Share2, Bell, CreditCard, List, Shield, Copy, Mail, Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type QuoteQuestion = {
  id: string;
  question: string;
  customer_name: string;
  customer_email: string;
  asked_at: string;
  answered: boolean;
  answer?: string;
  answered_at?: string;
};

type PublicQuote = {
  number: string;
  title: string;
  items: any;
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek: number;
  total_sek: number;
  pdf_url?: string;
  valid_until?: string;
  customer_name: string;
  customer_email: string;
  questions: QuoteQuestion[];
};

export default function QuotePublic() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Accept/Reject states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  // Change request states
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [changeFiles, setChangeFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Question states
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);

  // Reminder states
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [reminderSubmitting, setReminderSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Ingen token angiven');
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(`get-quote-public/${token}`);

        if (error) {
          if (error.message?.includes('deleted') || data?.error === 'deleted') {
            setIsDeleted(true);
            setError('Denna offert har raderats');
            return;
          }
          throw error;
        }
        if (!data) throw new Error('Ingen data returnerad');

        console.log('📋 Quote data loaded:', data);
        console.log('❓ Questions found:', data.questions?.length || 0, data.questions);
        setQuote(data);
      } catch (err: any) {
        console.error('Fel vid hämtning av offert:', err);
        setError(err.message || 'Offerten kunde inte hittas');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    
    if (!termsAccepted) {
      toast({
        title: 'Villkor måste accepteras',
        description: 'Du måste godkänna våra villkor för att acceptera offerten',
        variant: 'destructive'
      });
      return;
    }

    if (!signatureName.trim()) {
      toast({
        title: 'Signatur saknas',
        description: 'Ange ditt namn för att signera offerten',
        variant: 'destructive'
      });
      return;
    }
    
    setAccepting(true);
    try {
      const { data, error } = await supabase.functions.invoke(`accept-quote-public/${token}`, {
        method: 'POST',
        body: JSON.stringify({
          signature_name: signatureName,
          terms_accepted: termsAccepted
        })
      });

      if (error) throw error;
      
      if (data.error === 'expired') {
        toast({
          title: 'Offerten har gått ut',
          description: 'Tyvärr har denna offert passerat sitt sista giltighetsdatum',
          variant: 'destructive'
        });
        return;
      }

      if (data.error === 'deleted') {
        toast({
          title: 'Offerten är raderad',
          description: 'Denna offert har raderats och kan inte accepteras',
          variant: 'destructive'
        });
        setIsDeleted(true);
        return;
      }

      setAccepted(true);
      toast({
        title: 'Offert accepterad!',
        description: 'Vi kontaktar dig inom kort för att boka start',
      });
    } catch (err: any) {
      console.error('Fel vid accept:', err);
      toast({
        title: 'Kunde inte acceptera',
        description: err.message || 'Ett fel uppstod',
        variant: 'destructive'
      });
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!token || !rejectReason) {
      toast({
        title: 'Välj en anledning',
        description: 'Berätta varför du tackar nej',
        variant: 'destructive'
      });
      return;
    }

    setRejectSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke(`reject-quote-public/${token}`, {
        method: 'POST',
        body: JSON.stringify({
          reason: rejectReason,
          reason_text: rejectReasonText,
          customer_name: quote?.customer_name || 'Okänd',
        })
      });

      if (error) throw error;

      setDeclined(true);
      setRejectModalOpen(false);
      toast({
        title: 'Tack för din feedback',
        description: 'Vi har registrerat ditt svar',
      });
    } catch (err: any) {
      console.error('Fel vid avslag:', err);
      toast({
        title: 'Kunde inte registrera',
        description: err.message || 'Ett fel uppstod',
        variant: 'destructive'
      });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const handleChangeRequest = async () => {
    if (!token || !changeMessage.trim()) {
      toast({
        title: 'Ange ett meddelande',
        description: 'Beskriv vilka ändringar du önskar',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('message', changeMessage);
      
      changeFiles.forEach((file) => {
        formData.append('files', file);
      });

      const { data, error } = await supabase.functions.invoke('request-change-quote-public', {
        body: formData
      });

      if (error) throw error;

      if (data?.error === 'deleted') {
        toast({
          title: 'Offerten är raderad',
          description: 'Denna offert har raderats',
          variant: 'destructive'
        });
        setIsDeleted(true);
        return;
      }

      toast({
        title: 'Din begäran är mottagen!',
        description: 'Vi återkommer med en uppdaterad offert',
      });
      setChangeRequestOpen(false);
      setChangeMessage('');
      setChangeFiles([]);
    } catch (err: any) {
      console.error('Fel vid ändringsbegäran:', err);
      toast({
        title: 'Kunde inte skicka',
        description: err.message || 'Ett fel uppstod',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!token || !question.trim() || !questionName.trim()) {
      toast({
        title: 'Fyll i alla fält',
        description: 'Namn och fråga krävs',
        variant: 'destructive'
      });
      return;
    }

    setQuestionSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke(`ask-question-quote/${token}`, {
        method: 'POST',
        body: JSON.stringify({
          question,
          customer_name: questionName,
          customer_email: questionEmail || null
        })
      });

      if (error) throw error;

      toast({
        title: 'Fråga mottagen!',
        description: 'Vi svarar så snart som möjligt',
      });
      setQuestionModalOpen(false);
      setQuestion('');
      setQuestionName('');
      setQuestionEmail('');
    } catch (err: any) {
      console.error('Fel vid fråga:', err);
      toast({
        title: 'Kunde inte skicka',
        description: err.message || 'Ett fel uppstod',
        variant: 'destructive'
      });
    } finally {
      setQuestionSubmitting(false);
    }
  };

  const handleSetReminder = async () => {
    if (!token || !reminderEmail.trim()) {
      toast({
        title: 'Email krävs',
        description: 'Ange din email för påminnelsen',
        variant: 'destructive'
      });
      return;
    }

    setReminderSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke(`set-reminder-quote/${token}`, {
        method: 'POST',
        body: JSON.stringify({
          customer_email: reminderEmail,
          days: parseInt(reminderDays)
        })
      });

      if (error) throw error;

      toast({
        title: 'Påminnelse inställd!',
        description: `Vi skickar en påminnelse om ${reminderDays} dagar`,
      });
      setReminderModalOpen(false);
      setReminderEmail('');
    } catch (err: any) {
      console.error('Fel vid påminnelse:', err);
      toast({
        title: 'Kunde inte skapa påminnelse',
        description: err.message || 'Ett fel uppstod',
        variant: 'destructive'
      });
    } finally {
      setReminderSubmitting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Offert ${quote?.number}`,
          text: `Se offert från Fixco`,
          url: url
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Länk kopierad!',
        description: 'Länken har kopierats till urklipp',
      });
    }
  };

  const isExpired = quote?.valid_until && new Date(quote.valid_until) < new Date();
  const daysLeft = quote?.valid_until 
    ? Math.ceil((new Date(quote.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar offert...</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <>
        <Helmet>
          <title>Offert hittades inte - Fixco</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Offert hittades inte</h1>
              <p className="text-muted-foreground">
                {error || 'Offerten du söker kunde inte hittas. Kontrollera att länken är korrekt.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Offert {quote.number} - Fixco</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background py-6">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg mb-3">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Offert {quote.number}
            </h1>
            <p className="text-sm text-muted-foreground">Från Fixco AB</p>
            
            {/* Status & Timer */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              {isDeleted ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Raderad
                </Badge>
              ) : accepted ? (
                <Badge className="bg-green-600 hover:bg-green-700 px-3 py-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Accepterad
                </Badge>
              ) : declined ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <XCircle className="h-3 w-3 mr-1" />
                  Nekad
                </Badge>
              ) : isExpired ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Utgången
                </Badge>
              ) : (
                <>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Väntar på svar
                  </Badge>
                  {daysLeft !== null && daysLeft > 0 && (
                    <Badge 
                      variant={daysLeft <= 2 ? "destructive" : daysLeft <= 7 ? "default" : "secondary"}
                      className="px-3 py-1"
                    >
                      {daysLeft} {daysLeft === 1 ? 'dag' : 'dagar'} kvar
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Main Card */}
          <Card className="border-border bg-surface shadow-xl">
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="text-center pb-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">{quote.title}</h2>
              </div>

              {/* Customer & Date */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Mottagare</p>
                  <p className="font-semibold text-foreground">{quote.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Giltig till
                  </p>
                  <p className="font-semibold text-foreground">
                    {quote.valid_until 
                      ? new Date(quote.valid_until).toLocaleDateString('sv-SE')
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-xs">kr</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Kostnadsspecifikation</h3>
                </div>
                
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Arbetskostnad</span>
                    <span className="font-semibold">{quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Materialkostnad</span>
                    <span className="font-semibold">{quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Moms (25%)</span>
                    <span className="font-semibold">{quote.vat_sek.toLocaleString('sv-SE')} kr</span>
                  </div>
                  {quote.rot_deduction_sek > 0 && (
                    <div className="flex justify-between py-2 border-b border-border bg-green-50 dark:bg-green-900/10 -mx-3 px-3 rounded">
                      <span className="font-medium text-green-700 dark:text-green-400">ROT-avdrag (30%)</span>
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        −{quote.rot_deduction_sek.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Total */}
                <div className="gradient-primary rounded-xl p-4 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-foreground">Totalt att betala</span>
                    <span className="text-2xl font-bold text-primary-foreground">
                      {quote.total_sek.toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                </div>
              </div>

              {/* PDF Download & Share */}
              <div className="grid grid-cols-2 gap-3">
                {quote.pdf_url && (
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/5"
                    onClick={() => window.open(quote.pdf_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Ladda ner PDF
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Dela
                </Button>
              </div>

              {/* Next Steps Info */}
              {!isDeleted && !accepted && !declined && !isExpired && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Efter acceptans
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Du får omedelbar bekräftelse via email</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Vi kontaktar dig för att boka starttid</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Arbete påbörjas enligt överenskommelse</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment & Trust Info */}
              {!isDeleted && !declined && (
                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Betalning
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-1">
                      <p>• Faktura efter slutfört arbete</p>
                      <p>• Kortbetalning & Swish</p>
                      <p>• ROT-avdrag hanteras automatiskt</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Trygg handel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-1">
                      <p>• Org.nr: 559240-3418</p>
                      <p>• F-skatt & försäkring</p>
                      <p>• 2 års garanti på arbete</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Actions */}
              {isDeleted ? (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive font-semibold">
                    Denna offert har raderats
                  </p>
                </div>
              ) : accepted ? (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-600/30 rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    Offert accepterad!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Vi kontaktar dig inom kort</p>
                </div>
              ) : declined ? (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                  <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive font-semibold">
                    Offert nekad
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Tack för din feedback</p>
                </div>
              ) : (
                <>
                  {isExpired && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center">
                      <p className="text-destructive font-medium text-sm flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Denna offert har tyvärr gått ut
                      </p>
                    </div>
                  )}
                  
                  {/* Terms & Signature */}
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        disabled={isExpired}
                      />
                      <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        Jag godkänner{' '}
                        <a 
                          href="/terms" 
                          target="_blank" 
                          className="text-primary hover:underline font-medium"
                        >
                          Fixcos allmänna villkor
                        </a>
                        {' '}och bekräftar att all information är korrekt
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signature">Digital signatur *</Label>
                      <Input
                        id="signature"
                        placeholder="Ditt fullständiga namn"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        disabled={isExpired}
                        className="font-serif text-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Din signatur bekräftar att du accepterar offerten
                      </p>
                    </div>
                  </div>

                  {/* Main Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="gradient-primary hover:brightness-110 transition-all"
                      onClick={handleAccept}
                      disabled={accepting || isExpired || !termsAccepted || !signatureName.trim()}
                      size="lg"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {accepting ? 'Accepterar...' : 'Acceptera offert'}
                    </Button>
                    
                    <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="border-destructive/30 hover:bg-destructive/5 text-destructive"
                          disabled={isExpired}
                          size="lg"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Neka offert
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Varför tackar du nej?</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            Din feedback hjälper oss att förbättra våra tjänster
                          </p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <RadioGroup value={rejectReason} onValueChange={setRejectReason}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="too_expensive" id="r1" />
                              <Label htmlFor="r1">För dyrt</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="chose_other" id="r2" />
                              <Label htmlFor="r2">Valde annan leverantör</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="changed_plans" id="r3" />
                              <Label htmlFor="r3">Ändrade planer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="r4" />
                              <Label htmlFor="r4">Annan anledning</Label>
                            </div>
                          </RadioGroup>

                          {rejectReason === 'other' && (
                            <Textarea
                              placeholder="Berätta mer (valfritt)"
                              value={rejectReasonText}
                              onChange={(e) => setRejectReasonText(e.target.value)}
                              rows={3}
                            />
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                            Avbryt
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={handleReject}
                            disabled={rejectSubmitting || !rejectReason}
                          >
                            {rejectSubmitting ? 'Skickar...' : 'Neka offert'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid md:grid-cols-3 gap-2">
                    {/* Change Request */}
                    <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="border-primary/30 hover:bg-primary/5"
                          disabled={isExpired}
                          size="sm"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Begär ändring
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Begär ändring av offert</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            Beskriv vilka ändringar du önskar så återkommer vi med en uppdaterad offert.
                          </p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="message">Beskriv önskade ändringar *</Label>
                            <Textarea
                              id="message"
                              value={changeMessage}
                              onChange={(e) => setChangeMessage(e.target.value)}
                              placeholder="T.ex. 'Jag skulle vilja ändra materialval till...'"
                              rows={5}
                              className="resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="files">Bifoga filer (valfritt)</Label>
                            <Input
                              id="files"
                              type="file"
                              multiple
                              onChange={(e) => setChangeFiles(Array.from(e.target.files || []))}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground">
                              Bifoga bilder eller dokument som kan hjälpa oss förstå dina önskemål.
                            </p>
                          </div>
                          <div className="flex justify-end gap-3 pt-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setChangeRequestOpen(false)}
                            >
                              Avbryt
                            </Button>
                            <Button 
                              onClick={handleChangeRequest} 
                              disabled={submitting || !changeMessage.trim()}
                              className="gradient-primary"
                            >
                              {submitting ? 'Skickar...' : 'Skicka'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Ask Question */}
                    <Dialog 
                      open={questionModalOpen} 
                      onOpenChange={(open) => {
                        setQuestionModalOpen(open);
                        if (open && quote) {
                          // Auto-fylla namn och email från offerten
                          setQuestionName(quote.customer_name || '');
                          setQuestionEmail(quote.customer_email || '');
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="border-primary/30 hover:bg-primary/5"
                          disabled={isExpired}
                          size="sm"
                        >
                          <MessageCircle className="h-3 w-3 mr-2" />
                          Ställ fråga
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Har du frågor?</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            Vi svarar så snart som möjligt
                          </p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="qname">Ditt namn *</Label>
                            <Input
                              id="qname"
                              value={questionName}
                              onChange={(e) => setQuestionName(e.target.value)}
                              placeholder="För- och efternamn"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qemail">Din email (valfritt)</Label>
                            <Input
                              id="qemail"
                              type="email"
                              value={questionEmail}
                              onChange={(e) => setQuestionEmail(e.target.value)}
                              placeholder="din@email.se"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="question">Din fråga *</Label>
                            <Textarea
                              id="question"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              placeholder="Vad undrar du över?"
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setQuestionModalOpen(false)}
                            >
                              Avbryt
                            </Button>
                            <Button 
                              onClick={handleAskQuestion} 
                              disabled={questionSubmitting || !question.trim() || !questionName.trim()}
                            >
                              {questionSubmitting ? 'Skickar...' : 'Skicka fråga'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Reminder */}
                    <Dialog open={reminderModalOpen} onOpenChange={setReminderModalOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="border-primary/30 hover:bg-primary/5"
                          disabled={isExpired}
                          size="sm"
                        >
                          <Bell className="h-3 w-3 mr-2" />
                          Påminn mig
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Spara för senare</DialogTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            Vi skickar en påminnelse till din email
                          </p>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="remail">Din email *</Label>
                            <Input
                              id="remail"
                              type="email"
                              value={reminderEmail}
                              onChange={(e) => setReminderEmail(e.target.value)}
                              placeholder="din@email.se"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="days">Påminn om</Label>
                            <RadioGroup value={reminderDays} onValueChange={setReminderDays}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="d1" />
                                <Label htmlFor="d1">1 dag</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="d3" />
                                <Label htmlFor="d3">3 dagar</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="7" id="d7" />
                                <Label htmlFor="d7">1 vecka</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setReminderModalOpen(false)}
                            >
                              Avbryt
                            </Button>
                            <Button 
                              onClick={handleSetReminder} 
                              disabled={reminderSubmitting || !reminderEmail.trim()}
                            >
                              {reminderSubmitting ? 'Skapar...' : 'Skapa påminnelse'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Q&A Section - visa frågor och svar */}
          {quote && quote.questions && quote.questions.length > 0 && (
            <>
              {console.log('🎨 Rendering Q&A section:', quote.questions.length)}
              <Card className="border-primary/20 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Frågor & Svar
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Har du ställt frågor om offerten kan du se våra svar här
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.questions.map((q) => (
                  <div key={q.id} className="border border-border rounded-lg p-4 space-y-3">
                    {/* Frågan */}
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-muted-foreground">
                            {q.customer_name}
                          </p>
                          <p className="text-sm text-foreground mt-1">{q.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(q.asked_at).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Svaret (om det finns) */}
                    {q.answered && q.answer ? (
                      <div className="ml-10 pl-4 border-l-2 border-primary/30 space-y-1">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-primary">
                              Svar från Fixco
                            </p>
                            <p className="text-sm text-foreground mt-1">{q.answer}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(q.answered_at!).toLocaleDateString('sv-SE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-10 pl-4 border-l-2 border-border">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Väntar på svar
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <span>Frågor?</span>
              <a href="mailto:info@fixco.se" className="hover:text-primary flex items-center gap-1">
                <Mail className="h-3 w-3" />
                info@fixco.se
              </a>
              <span>eller</span>
              <a href="tel:081234567" className="hover:text-primary flex items-center gap-1">
                <Phone className="h-3 w-3" />
                08-123 456 78
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
