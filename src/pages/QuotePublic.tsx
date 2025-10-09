import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Calendar, ExternalLink, CheckCircle2, AlertCircle, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

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
};

export default function QuotePublic() {
  const { token } = useParams<{ token: string }>();
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [changeFiles, setChangeFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

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
          // Check if quote is deleted
          if (error.message?.includes('deleted') || data?.error === 'deleted') {
            setIsDeleted(true);
            setError('Denna offert har raderats');
            return;
          }
          throw error;
        }
        if (!data) throw new Error('Ingen data returnerad');

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
    
    setAccepting(true);
    try {
      const { data, error } = await supabase.functions.invoke(`accept-quote-public/${token}`);

      if (error) throw error;
      
      if (data.error === 'expired') {
        alert('Offerten har tyvärr gått ut');
        return;
      }

      if (data.error === 'deleted') {
        alert('Denna offert har raderats och kan inte accepteras');
        setIsDeleted(true);
        return;
      }

      setAccepted(true);
    } catch (err: any) {
      console.error('Fel vid accept:', err);
      alert(err.message || 'Kunde inte acceptera offerten');
    } finally {
      setAccepting(false);
    }
  };

  const handleChangeRequest = async () => {
    if (!token || !changeMessage.trim()) {
      alert('Ange ett meddelande');
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
        alert('Denna offert har raderats och kan inte ändras');
        setIsDeleted(true);
        return;
      }

      alert('Din begäran är mottagen!');
      setChangeRequestOpen(false);
      setChangeMessage('');
      setChangeFiles([]);
    } catch (err: any) {
      console.error('Fel vid ändringsbegäran:', err);
      alert(err.message || 'Kunde inte skicka begäran');
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = quote?.valid_until && new Date(quote.valid_until) < new Date();

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

      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary-subtle opacity-50"></div>
          <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-4">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Offert {quote.number}
              </h1>
              <p className="text-muted-foreground text-lg">Från Fixco AB</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="border-border bg-surface/95 backdrop-blur-sm shadow-xl">
                <CardContent className="pt-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
                    {quote.title}
                  </h2>
                  
                  {/* Status badges */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {isDeleted ? (
                      <Badge variant="destructive" className="text-base px-4 py-2">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Raderad
                      </Badge>
                    ) : accepted ? (
                      <Badge className="bg-green-600 hover:bg-green-700 text-base px-4 py-2">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accepterad
                      </Badge>
                    ) : isExpired ? (
                      <Badge variant="destructive" className="text-base px-4 py-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Utgången
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-base px-4 py-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Väntar på svar
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 pb-12 space-y-6 -mt-6">
          {/* Customer & Validity Info */}
          <Card className="border-border bg-surface shadow-lg">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground font-semibold">
                    Mottagare
                  </p>
                  <p className="text-2xl font-bold text-foreground">{quote.customer_name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Giltig till
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {quote.valid_until 
                      ? new Date(quote.valid_until).toLocaleDateString('sv-SE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price breakdown */}
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">kr</span>
                </div>
                Kostnadsspecifikation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="text-lg text-muted-foreground">Arbetskostnad</span>
                  <span className="text-2xl font-bold text-foreground">
                    {quote.subtotal_work_sek.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="text-lg text-muted-foreground">Materialkostnad</span>
                  <span className="text-2xl font-bold text-foreground">
                    {quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="text-lg text-muted-foreground">Moms (25%)</span>
                  <span className="text-2xl font-bold text-foreground">
                    {quote.vat_sek.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                {quote.rot_deduction_sek > 0 && (
                  <div className="flex justify-between items-center py-4 border-b border-border bg-green-50 dark:bg-green-900/10 -mx-6 px-6 rounded-lg">
                    <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                      ROT-avdrag (30%)
                    </span>
                    <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                      −{quote.rot_deduction_sek.toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                )}
              </div>
              
              {/* Total - Highlighted */}
              <div className="mt-8 gradient-primary rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <span className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    Totalt att betala
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-primary-foreground">
                    {quote.total_sek.toLocaleString('sv-SE')} kr
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Download - Prominent */}
          {quote.pdf_url && (
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Download className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Ladda ner offert</h3>
                    <p className="text-muted-foreground">
                      Spara offertutkastet som PDF för dina arkiv
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="w-full md:w-auto gradient-primary hover:brightness-110 transition-all shadow-lg text-lg px-8 py-6"
                    onClick={() => window.open(quote.pdf_url, '_blank')}
                  >
                    <Download className="h-6 w-6 mr-3" />
                    Ladda ner PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons / Status messages */}
          {isDeleted ? (
            <Card className="border-destructive/50 bg-destructive/5 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-2xl font-bold text-destructive">Offert raderad</h3>
                  <p className="text-muted-foreground text-lg">
                    Denna offert har raderats och kan inte längre accepteras eller ändras
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : accepted ? (
            <Card className="border-green-600/50 bg-green-50 dark:bg-green-900/10 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                    Offert accepterad!
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Tack för ditt förtroende. Vi kommer att kontakta dig inom kort för att boka in arbetet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-surface shadow-lg">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-2xl text-center">Vad vill du göra?</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isExpired && (
                  <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6 mb-6">
                    <p className="text-destructive text-center font-semibold text-lg flex items-center justify-center gap-3">
                      <Clock className="h-6 w-6" />
                      Denna offert har tyvärr gått ut
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Button 
                    size="lg"
                    className="w-full h-auto py-6 gradient-primary hover:brightness-110 transition-all shadow-lg flex flex-col items-center gap-3"
                    onClick={handleAccept}
                    disabled={accepting || isExpired}
                  >
                    <CheckCircle2 className="h-8 w-8" />
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {accepting ? 'Accepterar...' : 'Acceptera offert'}
                      </div>
                      <div className="text-sm opacity-90 mt-1">
                        Jag godkänner alla villkor
                      </div>
                    </div>
                  </Button>
                  
                  <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full h-auto py-6 border-2 border-primary/30 hover:bg-primary/5 flex flex-col items-center gap-3"
                        disabled={isExpired}
                      >
                        <ExternalLink className="h-8 w-8" />
                        <div className="text-center">
                          <div className="text-xl font-bold">Begär ändring</div>
                          <div className="text-sm opacity-70 mt-1">
                            Jag vill justera offerten
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Begär ändring av offert</DialogTitle>
                        <p className="text-muted-foreground mt-2">
                          Beskriv vilka ändringar du önskar så återkommer vi med en uppdaterad offert.
                        </p>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-3">
                          <Label htmlFor="message" className="text-base font-semibold">
                            Beskriv önskade ändringar *
                          </Label>
                          <Textarea
                            id="message"
                            value={changeMessage}
                            onChange={(e) => setChangeMessage(e.target.value)}
                            placeholder="T.ex. 'Jag skulle vilja ändra materialval till...' eller 'Kan ni ta bort arbete på balkong?'"
                            rows={6}
                            className="resize-none text-base"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="files" className="text-base font-semibold">
                            Bifoga filer (valfritt)
                          </Label>
                          <Input
                            id="files"
                            type="file"
                            multiple
                            onChange={(e) => setChangeFiles(Array.from(e.target.files || []))}
                            className="cursor-pointer"
                          />
                          <p className="text-sm text-muted-foreground">
                            Du kan bifoga bilder, dokument eller andra filer som kan hjälpa oss förstå dina önskemål bättre.
                          </p>
                        </div>
                        <div className="flex justify-end gap-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => setChangeRequestOpen(false)}
                          >
                            Avbryt
                          </Button>
                          <Button 
                            size="lg"
                            onClick={handleChangeRequest} 
                            disabled={submitting || !changeMessage.trim()}
                            className="gradient-primary"
                          >
                            {submitting ? 'Skickar...' : 'Skicka begäran'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <Card className="border-border bg-surface/50">
            <CardContent className="pt-6 text-center">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">Har du frågor?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
                  <a href="mailto:info@fixco.se" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    info@fixco.se
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a href="tel:081234567" className="hover:text-primary transition-colors">
                    08-123 456 78
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
