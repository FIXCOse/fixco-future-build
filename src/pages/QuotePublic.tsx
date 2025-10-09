import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuoteByToken, markQuoteViewed } from '@/lib/api/quotes-new';
import { FileText } from 'lucide-react';

export default function QuotePublic() {
  const { token } = useParams<{ token: string }>();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    
    (async () => {
      try {
        const data = await getQuoteByToken(token);
        if (!data) {
          setError('Offerten hittades inte');
          return;
        }
        
        setQuote(data);
        
        // Mark as viewed if sent
        if (data.status === 'sent') {
          await markQuoteViewed(token);
        }
      } catch (e) {
        console.error('Error loading quote:', e);
        setError('Kunde inte ladda offerten');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-lg font-medium mb-2">Offerten hittades inte</div>
            <div className="text-sm text-muted-foreground">
              {error || 'Länken kan vara ogiltig eller utgången.'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Offert {quote.number}</h1>
          <p className="text-sm text-muted-foreground">
            Giltig t.o.m. {quote.valid_until || '—'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{quote.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Kund</div>
              <div className="font-medium">{quote.customer?.name || 'Kund'}</div>
              {quote.customer?.email && (
                <div className="text-sm text-muted-foreground">{quote.customer.email}</div>
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Totalsumma (inkl. moms)</div>
              <div className="text-2xl font-bold">
                {Number(quote.total_sek).toLocaleString('sv-SE')} kr
              </div>
            </div>

            {quote.pdf_url && (
              <div className="pt-4">
                <a 
                  href={quote.pdf_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Visa PDF
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="text-sm font-medium mb-2">Svara på offert</div>
            <div className="grid gap-3 md:grid-cols-2">
              <Button disabled className="w-full">
                Acceptera offert
              </Button>
              <Button disabled variant="outline" className="w-full">
                Begär ändring
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Funktionerna kommer snart
            </p>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground text-center pt-4">
          Obs: Visualiseringar är illustrativa. Offerten kan kräva platsbesök för slutligt pris.
        </div>
      </div>
    </div>
  );
}
