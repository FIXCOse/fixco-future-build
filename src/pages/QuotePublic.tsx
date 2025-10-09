import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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

      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Huvudkort */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl">Offert {quote.number}</CardTitle>
                  <p className="text-muted-foreground mt-2">{quote.title}</p>
                </div>
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Kund och giltighetstid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Till</p>
                  <p className="font-semibold">{quote.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Giltig t.o.m.
                  </p>
                  <p className="font-semibold">
                    {quote.valid_until 
                      ? new Date(quote.valid_until).toLocaleDateString('sv-SE')
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Summering */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arbete</span>
                  <span>{quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Material</span>
                  <span>{quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moms</span>
                  <span>{quote.vat_sek.toLocaleString('sv-SE')} kr</span>
                </div>
                {quote.rot_deduction_sek > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>ROT-avdrag</span>
                    <span>−{quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Totalt att betala</span>
                  <span>{quote.total_sek.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>

              {/* PDF-länk */}
              {quote.pdf_url && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(quote.pdf_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visa PDF
                  </Button>
                </div>
              )}

              {/* Accept/Ändring knappar */}
              {isDeleted ? (
                <div className="pt-4 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 font-semibold">
                    ⚠️ Denna offert har raderats och kan inte längre accepteras eller ändras
                  </p>
                </div>
              ) : accepted ? (
                <div className="pt-4 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    ✓ Tack! Offerten är accepterad.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handleAccept}
                    disabled={accepting || isExpired}
                  >
                    {accepting ? 'Accepterar...' : 'Acceptera offert'}
                  </Button>
                  <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={isExpired}>
                        Begär ändring
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Begär ändring</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Meddelande</Label>
                          <Textarea
                            id="message"
                            value={changeMessage}
                            onChange={(e) => setChangeMessage(e.target.value)}
                            placeholder="Beskriv de ändringar du önskar..."
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="files">Bifoga filer (valfritt)</Label>
                          <Input
                            id="files"
                            type="file"
                            multiple
                            onChange={(e) => setChangeFiles(Array.from(e.target.files || []))}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setChangeRequestOpen(false)}>
                            Avbryt
                          </Button>
                          <Button onClick={handleChangeRequest} disabled={submitting}>
                            {submitting ? 'Skickar...' : 'Skicka'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              {isExpired && (
                <p className="text-sm text-red-600 text-center mt-2">
                  Denna offert har gått ut
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
