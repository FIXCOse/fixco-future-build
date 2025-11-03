import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FileText, Mail, Phone, MapPin, Trash2, Edit, Send, ExternalLink, Plus, Copy } from "lucide-react";
import { RequestWithQuote } from "@/hooks/useRequestsQuotes";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { JobManagementCard } from "./JobManagementCard";
import { WorkerStatusCard } from "./WorkerStatusCard";
import { useJobWorkers } from "@/hooks/useJobWorkers";

type Props = {
  item: RequestWithQuote;
  onCreateQuote: (bookingId: string) => void;
  onEditQuote: (quoteId: string) => void;
  onSendQuote: (quoteId: string) => void;
  onViewPdf: (quoteId: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onCopyLink: (quoteId: string) => void;
  onCreateInvoice: (quoteId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
  onSendInvoice: (invoiceId: string) => void;
  onRefresh: () => void;
};

export function RequestQuoteCard({
  item,
  onCreateQuote,
  onEditQuote,
  onSendQuote,
  onViewPdf,
  onDeleteBooking,
  onCopyLink,
  onCreateInvoice,
  onViewInvoice,
  onSendInvoice,
  onRefresh,
}: Props) {
  const { booking, quote, customer, invoice, job } = item;
  const { workers, totalHours, estimatedHours, refresh: refreshWorkers } = useJobWorkers(job?.id);
  
  const handleRefresh = () => {
    if (job?.id) {
      refreshWorkers();
    }
    onRefresh();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      new: { variant: "default", label: "Ny" },
      pending: { variant: "secondary", label: "Väntar" },
      confirmed: { variant: "default", label: "Bekräftad" },
      completed: { variant: "outline", label: "Klar" },
      cancelled: { variant: "destructive", label: "Avbruten" },
    };
    return variants[status] || { variant: "default", label: status };
  };

  const getQuoteStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "Utkast" },
      sent: { variant: "default", label: "Skickad" },
      accepted: { variant: "default", label: "Accepterad" },
      rejected: { variant: "destructive", label: "Avböjd" },
    };
    return variants[status] || { variant: "default", label: status };
  };

  const getInvoiceStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "Utkast" },
      sent: { variant: "default", label: "Skickad" },
      paid: { variant: "default", label: "Betald" },
      overdue: { variant: "destructive", label: "Förfallen" },
    };
    return variants[status] || { variant: "default", label: status };
  };

  const bookingStatus = getStatusBadge(booking.status);
  const serviceName = booking.payload?.service_name || booking.payload?.serviceName || booking.service_slug;
  const customerName = customer?.name || booking.payload?.name || booking.payload?.contact_name || 'Okänd kund';
  const customerEmail = customer?.email || booking.payload?.email || booking.payload?.contact_email;
  const customerPhone = customer?.phone || booking.payload?.phone || booking.payload?.contact_phone;
  const address = booking.payload?.address;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Booking Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{serviceName}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(booking.created_at), "d MMM yyyy 'kl.' HH:mm", { locale: sv })}
              </p>
            </div>
            <Badge variant={bookingStatus.variant}>{bookingStatus.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{customerName}</span>
            </div>
            {customerEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{customerEmail}</span>
              </div>
            )}
            {customerPhone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{customerPhone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
              </div>
            )}
          </div>
          {booking.payload?.description && (
            <p className="text-sm text-muted-foreground border-t pt-3">
              {booking.payload.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {!quote && (
            <Button
              onClick={() => onCreateQuote(booking.id)}
              size="sm"
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Skapa offert
            </Button>
          )}
          <Button
            onClick={() => onDeleteBooking(booking.id)}
            variant="outline"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Quote Card */}
      {quote ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Offert {quote.number}</h3>
                <p className="text-sm text-muted-foreground">{quote.title}</p>
              </div>
              <Badge variant={getQuoteStatusBadge(quote.status).variant}>
                {getQuoteStatusBadge(quote.status).label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Arbetskostnad</p>
                <p className="font-semibold">{quote.subtotal_work_sek?.toLocaleString('sv-SE')} kr</p>
              </div>
              <div>
                <p className="text-muted-foreground">Material</p>
                <p className="font-semibold">{quote.subtotal_mat_sek?.toLocaleString('sv-SE')} kr</p>
              </div>
              {quote.rot_deduction_sek > 0 && (
                <div>
                  <p className="text-muted-foreground">ROT-avdrag</p>
                  <p className="font-semibold text-green-600">-{quote.rot_deduction_sek?.toLocaleString('sv-SE')} kr</p>
                </div>
              )}
              <div className="col-span-2 pt-2 border-t">
                <p className="text-muted-foreground">Totalt</p>
                <p className="text-2xl font-bold">{quote.total_sek?.toLocaleString('sv-SE')} kr</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 flex-wrap">
            <Button
              onClick={() => onEditQuote(quote.id)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Redigera
            </Button>
            {quote.status === 'draft' && (
              <Button
                onClick={() => onSendQuote(quote.id)}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Skicka
              </Button>
            )}
            <Button
              onClick={() => onCopyLink(quote.id)}
              variant="outline"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Kopiera
            </Button>
            <Button
              onClick={() => {
                const publicUrl = `${window.location.origin}/q/${quote.public_token}`;
                window.open(publicUrl, '_blank');
              }}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ingen offert ännu</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Management Card */}
      {quote ? (
        job ? (
          <JobManagementCard 
            job={job} 
            workers={workers}
            onRefresh={handleRefresh}
          />
        ) : (
          <Card className="border-dashed opacity-50">
            <CardContent className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Väntar på jobb</p>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="border-dashed opacity-50">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Skapas efter offert</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Worker Status Card */}
      {job ? (
        <WorkerStatusCard 
          workers={workers}
          totalHours={totalHours}
          estimatedHours={estimatedHours}
          jobId={job.id}
          onRefresh={handleRefresh}
        />
      ) : (
        <Card className="border-dashed opacity-50">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Väntar på jobb</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Card */}
      {quote?.status === 'accepted' && job?.status === 'completed' ? (
        invoice ? (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">Faktura {invoice.invoice_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(invoice.created_at), "d MMM yyyy", { locale: sv })}
                  </p>
                </div>
                <Badge variant={getInvoiceStatusBadge(invoice.status).variant}>
                  {getInvoiceStatusBadge(invoice.status).label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Totalt belopp</p>
                  <p className="text-2xl font-bold">{invoice.total_amount?.toLocaleString('sv-SE')} kr</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Förfallodatum</p>
                  <p className="font-semibold">
                    {format(new Date(invoice.due_date), "d MMM yyyy", { locale: sv })}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => onViewInvoice(invoice.id)}
                variant="outline"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Visa
              </Button>
              {invoice.status === 'draft' && (
                <Button
                  onClick={() => onSendInvoice(invoice.id)}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Skicka
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">Offert accepterad - skapa faktura</p>
              <Button
                onClick={() => onCreateInvoice(quote.id)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Skapa faktura
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="border-dashed opacity-50">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {!quote ? 'Väntar på offert' : 
                 quote.status !== 'accepted' ? 'Väntar på accepterad offert' :
                 !job ? 'Väntar på jobb' :
                 'Väntar på slutfört jobb'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
