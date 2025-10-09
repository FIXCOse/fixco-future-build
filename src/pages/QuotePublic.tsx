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
        {/* Header with gradient */}
        <div className="gradient-primary-subtle border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Offert {quote.number}</h1>
                <p className="text-muted-foreground text-sm md:text-base">Från Fixco AB</p>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl text-foreground font-semibold">{quote.title}</h2>
            
            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {isDeleted ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Raderad
                </Badge>
              ) : accepted ? (
                <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Accepterad
                </Badge>
              ) : isExpired ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Utgången
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Väntar på svar
                </Badge>
              )}
              {quote.valid_until && !isExpired && !accepted && !isDeleted && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Giltig t.o.m. {new Date(quote.valid_until).toLocaleDateString('sv-SE')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
          {/* Customer info card */}
          <Card className="border-border bg-surface">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Till</p>
                  <p className="text-lg font-semibold text-foreground">{quote.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Giltig t.o.m.
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {quote.valid_until 
                      ? new Date(quote.valid_until).toLocaleDateString('sv-SE')
                      : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price breakdown card */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-xl">Kostnadsöversikt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Arbete</span>
                  <span className="text-lg font-semibold">{quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Material</span>
                  <span className="text-lg font-semibold">{quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Moms (25%)</span>
                  <span className="text-lg font-semibold">{quote.vat_sek.toLocaleString('sv-SE')} kr</span>
                </div>
                {quote.rot_deduction_sek > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-green-600 dark:text-green-400 font-medium">ROT-avdrag</span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      −{quote.rot_deduction_sek.toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="gradient-primary-subtle rounded-xl p-6 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-foreground">Totalt att betala</span>
                  <span className="text-3xl font-bold text-primary">{quote.total_sek.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF download card */}
          {quote.pdf_url && (
            <Card className="border-primary/30 bg-surface-2">
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open(quote.pdf_url, '_blank')}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Ladda ner PDF
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          {isDeleted ? (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-semibold text-lg">
                  Denna offert har raderats och kan inte längre accepteras eller ändras
                </p>
              </CardContent>
            </Card>
          ) : accepted ? (
            <Card className="border-green-600/50 bg-green-600/10">
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <p className="text-green-600 dark:text-green-300 font-semibold text-lg">
                  Tack! Offerten är accepterad.
                </p>
                <p className="text-muted-foreground mt-2">Vi kommer att kontakta dig inom kort.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-surface">
              <CardContent className="pt-6 space-y-4">
                {isExpired && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
                    <p className="text-destructive text-center font-medium flex items-center justify-center gap-2">
                      <Clock className="h-5 w-5" />
                      Denna offert har tyvärr gått ut
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    size="lg"
                    className="w-full gradient-primary hover:brightness-110 transition-all shadow-lg"
                    onClick={handleAccept}
                    disabled={accepting || isExpired}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    {accepting ? 'Accepterar...' : 'Acceptera offert'}
                  </Button>
                  
                  <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full border-primary/30 hover:bg-primary/5"
                        disabled={isExpired}
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Begär ändring
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Begär ändring av offert</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="message">Beskriv önskade ändringar *</Label>
                          <Textarea
                            id="message"
                            value={changeMessage}
                            onChange={(e) => setChangeMessage(e.target.value)}
                            placeholder="T.ex. 'Jag skulle vilja ändra materialval till...' eller 'Kan ni ta bort arbete på balkong?'"
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
                            Du kan bifoga bilder, dokument eller andra filer som kan hjälpa oss förstå dina önskemål.
                          </p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
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

          {/* Footer info */}
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>Har du frågor? Kontakta oss på info@fixco.se eller ring 08-123 456 78</p>
          </div>
        </div>
      </div>
    </>
  );
}
