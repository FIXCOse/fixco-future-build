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

      <div className="min-h-screen bg-background py-6">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg mb-3">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Offert {quote.number}
            </h1>
            <p className="text-sm text-muted-foreground">Från Fixco AB</p>
            
            {/* Inline status badge */}
            <div className="mt-3">
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
              ) : isExpired ? (
                <Badge variant="destructive" className="px-3 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Utgången
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-3 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Väntar på svar
                </Badge>
              )}
            </div>
          </div>

          {/* Main Card - Everything in one */}
          <Card className="border-border bg-surface shadow-xl">
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="text-center pb-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">{quote.title}</h2>
              </div>

              {/* Customer & Date - Compact */}
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

              {/* Price breakdown - Compact */}
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
                
                {/* Total - Highlighted but compact */}
                <div className="gradient-primary rounded-xl p-4 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-foreground">Totalt att betala</span>
                    <span className="text-2xl font-bold text-primary-foreground">
                      {quote.total_sek.toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                </div>
              </div>

              {/* PDF Download - Inline */}
              {quote.pdf_url && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/5"
                    onClick={() => window.open(quote.pdf_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Ladda ner PDF
                  </Button>
                </div>
              )}

              {/* Actions - Compact */}
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
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-center text-sm font-semibold text-foreground mb-3">Vad vill du göra?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        className="gradient-primary hover:brightness-110 transition-all"
                        onClick={handleAccept}
                        disabled={accepting || isExpired}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {accepting ? 'Accepterar...' : 'Acceptera offert'}
                      </Button>
                      
                      <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            className="border-primary/30 hover:bg-primary/5"
                            disabled={isExpired}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
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
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Compact Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Frågor? Kontakta <a href="mailto:info@fixco.se" className="hover:text-primary">info@fixco.se</a> eller ring <a href="tel:081234567" className="hover:text-primary">08-123 456 78</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
