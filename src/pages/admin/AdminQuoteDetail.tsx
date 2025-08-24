import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ArrowLeft, Edit, Download, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { QuoteRow } from '@/lib/api/quotes';

export default function AdminQuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchQuote = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            customer:profiles!quotes_customer_id_fkey(first_name, last_name, email),
            property:properties(address, city)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setQuote(data as QuoteRow);
      } catch (error) {
        console.error('Error fetching quote:', error);
        toast.error('Kunde inte ladda offert');
        navigate('/admin/quotes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Utkast',
      sent: 'Skickad',
      accepted: 'Accepterad',
      rejected: 'Avvisad'
    };
    return statusMap[status] || status;
  };

  const handleSendQuote = async () => {
    if (!quote) return;
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'sent' })
        .eq('id', quote.id);

      if (error) throw error;
      
      setQuote({ ...quote, status: 'sent' as any });
      toast.success('Offert skickad till kund');
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.error('Kunde inte skicka offert');
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="container py-6">
        <p>Offert hittades inte</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/admin/quotes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till offerter
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Offertdetaljer</h1>
            <p className="text-muted-foreground mt-2">
              Offert #{quote.quote_number}
            </p>
          </div>
          <Badge className={getStatusColor(quote.status)}>
            {getStatusDisplayName(quote.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quote Information */}
        <Card>
          <CardHeader>
            <CardTitle>Offertinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Titel</p>
              <p className="text-muted-foreground">{quote.title}</p>
            </div>
            
            {quote.description && (
              <div>
                <p className="font-medium">Beskrivning</p>
                <p className="text-muted-foreground">{quote.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Subtotal</p>
                <p className="text-muted-foreground">{quote.subtotal.toLocaleString()} SEK</p>
              </div>
              <div>
                <p className="font-medium">Moms</p>
                <p className="text-muted-foreground">{quote.vat_amount.toLocaleString()} SEK</p>
              </div>
            </div>

            <div>
              <p className="font-medium">Totalt belopp</p>
              <p className="text-2xl font-bold">{quote.total_amount.toLocaleString()} SEK</p>
            </div>

            {(quote.rot_amount || quote.rut_amount) && (
              <div className="grid grid-cols-2 gap-4">
                {quote.rot_amount && (
                  <div>
                    <p className="font-medium">ROT-avdrag</p>
                    <p className="text-muted-foreground text-green-600">-{quote.rot_amount.toLocaleString()} SEK</p>
                  </div>
                )}
                {quote.rut_amount && (
                  <div>
                    <p className="font-medium">RUT-avdrag</p>
                    <p className="text-muted-foreground text-green-600">-{quote.rut_amount.toLocaleString()} SEK</p>
                  </div>
                )}
              </div>
            )}

            {quote.valid_until && (
              <div>
                <p className="font-medium">Giltig till</p>
                <p className="text-muted-foreground">
                  {format(new Date(quote.valid_until), 'PPP', { locale: sv })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Kundinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Namn</p>
              <p className="text-muted-foreground">
                {quote.customer ? `${quote.customer.first_name} ${quote.customer.last_name}` : (quote as any).customer_name || 'Ej angivet'}
              </p>
            </div>

            <div>
              <p className="font-medium">E-post</p>
              <p className="text-muted-foreground">{quote.customer?.email || (quote as any).customer_email || 'Ej angiven'}</p>
            </div>

            <div>
              <p className="font-medium">Adress</p>
              <p className="text-muted-foreground">
                {quote.property?.address
                  ? `${quote.property.address}, ${quote.property.city}`
                  : ((quote as any).customer_address || (quote as any).customer_city
                      ? `${(quote as any).customer_address || ''}${(quote as any).customer_address && (quote as any).customer_city ? ', ' : ''}${(quote as any).customer_postal_code || ''} ${(quote as any).customer_city || ''}`.trim()
                      : 'Ej angiven')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        {quote.line_items && Array.isArray(quote.line_items) && quote.line_items.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Specifikation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quote.line_items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {item.unit_price?.toLocaleString()} SEK
                      </p>
                    </div>
                    <p className="font-medium">{item.amount?.toLocaleString()} SEK</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quote Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offertinformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-medium">Skapad</p>
                <p className="text-muted-foreground">
                  {format(new Date(quote.created_at), 'PPP', { locale: sv })}
                </p>
              </div>
              {quote.updated_at && (
                <div>
                  <p className="font-medium">Senast uppdaterad</p>
                  <p className="text-muted-foreground">
                    {format(new Date(quote.updated_at), 'PPP', { locale: sv })}
                  </p>
                </div>
              )}
              {quote.accepted_at && (
                <div>
                  <p className="font-medium">Accepterad</p>
                  <p className="text-muted-foreground">
                    {format(new Date(quote.accepted_at), 'PPP', { locale: sv })}
                  </p>
                </div>
              )}
              <div>
                <p className="font-medium">Offertnummer</p>
                <p className="text-muted-foreground">{quote.quote_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <Button onClick={() => navigate(`/admin/quotes/${quote.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Redigera offert
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Ladda ner PDF
        </Button>
        {quote.status === 'draft' && (
          <Button onClick={handleSendQuote}>
            <Send className="h-4 w-4 mr-2" />
            Skicka offert
          </Button>
        )}
      </div>
    </div>
  );
}