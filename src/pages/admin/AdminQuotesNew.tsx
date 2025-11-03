import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { QuoteFormModal } from "@/components/admin/QuoteFormModal";
import { getQuoteNew, type QuoteNewRow } from "@/lib/api/quotes-new";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Mail, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminBack from "@/components/admin/AdminBack";

export default function AdminQuotesNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quote, setQuote] = useState<QuoteNewRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const quoteId = searchParams.get('id');
  const requestId = searchParams.get('request');

  useEffect(() => {
    if (quoteId) {
      loadQuote(quoteId);
    } else if (requestId) {
      // Find or create draft quote for booking
      loadQuoteForBooking(requestId);
    } else {
      // Open modal for new quote if no ID or request
      setModalOpen(true);
    }
  }, [quoteId, requestId, navigate]);

  const loadQuote = async (id: string) => {
    setLoading(true);
    try {
      const data = await getQuoteNew(id);
      setQuote(data);
    } catch (error: any) {
      console.error('Error loading quote:', error);
      toast.error('Kunde inte ladda offert');
    } finally {
      setLoading(false);
    }
  };

  const loadQuoteForBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      // Check if quote exists for this booking
      const { data: existingQuote, error: fetchError } = await supabase
        .from('quotes_new')
        .select('*, customer:customers(*)')
        .eq('request_id', bookingId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingQuote) {
        setQuote(existingQuote as any);
        setModalOpen(true); // Open modal automatically
        return;
      }

      // Call DB function to create draft quote
      const { data: quoteId, error: rpcError } = await supabase
        .rpc('create_draft_quote_for_booking', {
          booking_id: bookingId
        });

      if (rpcError) throw rpcError;
      
      // Load the newly created quote
      if (quoteId) {
        await loadQuote(String(quoteId));
        setModalOpen(true); // Open modal automatically after creating quote
      }
    } catch (error: any) {
      console.error('Error loading quote for booking:', error);
      toast.error('Kunde inte ladda offert');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPublicLink = () => {
    if (!quote) return;
    const url = `${window.location.origin}/q/${quote.public_token}`;
    navigator.clipboard.writeText(url);
    toast.success('Publik länk kopierad!');
  };

  const handleSendQuote = async () => {
    if (!quote) return;
    
    try {
      const { error } = await supabase.functions.invoke('send-quote-email-new', {
        body: {
          quoteId: quote.id,
          customerEmail: quote.customer?.email,
          customerName: quote.customer?.name
        }
      });

      if (error) throw error;

      toast.success('Offert skickad!');
      loadQuote(quote.id);
    } catch (error: any) {
      console.error('Error sending quote:', error);
      toast.error(error.message || 'Kunde inte skicka offert');
    }
  };

  const handleOpenPdf = () => {
    if (!quote?.pdf_url) {
      toast.error('Ingen PDF genererad ännu');
      return;
    }
    window.open(quote.pdf_url, '_blank');
  };

  if (loading) {
    return (
      <div className="container py-6">
        <AdminBack />
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Laddar offert...</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container py-6">
      <AdminBack />
      
      {quote && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Offert: {quote.number}</h1>
                <p className="text-muted-foreground mt-2">{quote.title}</p>
              </div>
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                Redigera
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Kund</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{quote.customer?.name || 'Okänd'}</p>
                <p className="text-sm text-muted-foreground">{quote.customer?.email}</p>
                {quote.customer?.phone && (
                  <p className="text-sm text-muted-foreground">{quote.customer.phone}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Belopp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Arbete:</span>
                  <span>{quote.subtotal_work_sek.toLocaleString()} kr</span>
                </div>
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>{quote.subtotal_mat_sek.toLocaleString()} kr</span>
                </div>
                {quote.discount_amount_sek > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt:</span>
                    <span>-{quote.discount_amount_sek.toLocaleString()} kr</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Moms:</span>
                  <span>{quote.vat_sek.toLocaleString()} kr</span>
                </div>
                {quote.rot_deduction_sek > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ROT-avdrag ({quote.rot_percentage}%):</span>
                    <span>-{quote.rot_deduction_sek.toLocaleString()} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Totalt:</span>
                  <span>{quote.total_sek.toLocaleString()} kr</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Åtgärder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopyPublicLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Kopiera publik länk
                </Button>
                <Button 
                  onClick={handleSendQuote}
                  disabled={quote.status !== 'draft'}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Skicka till kund
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleOpenPdf}
                  disabled={!quote.pdf_url}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Visa PDF
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Publik länk: {window.location.origin}/q/{quote.public_token}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <QuoteFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        quote={quote}
        onSuccess={(updated) => {
          if (updated) {
            setQuote(updated);
            setModalOpen(false);
          }
        }}
      />
    </div>
  );
}
