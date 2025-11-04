import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Mail, Phone, MapPin, Trash2, Edit, Send, ExternalLink, Plus, Copy, Users, AlertTriangle, Briefcase } from "lucide-react";
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
  onCopyInvoiceLink?: (invoiceId: string) => void;
  onCreateJob: (quoteId: string) => void;
  onCreateInvoiceFromJob?: (jobId: string, customerId: string) => void;
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
  onCopyInvoiceLink,
  onCreateJob,
  onCreateInvoiceFromJob,
  onRefresh,
}: Props) {
  const { booking, quote, customer, invoice, job, timeLogs, materialLogs, expenseLogs, totalHours: jobTotalHours, totalMaterialCost, totalExpenses } = item;
  const { workers, totalHours: workerTotalHours, estimatedHours, refresh: refreshWorkers } = useJobWorkers(job?.id);
  
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
    <Card className="overflow-hidden border-2 shadow-md hover:shadow-lg transition-shadow">
      {/* Container Header */}
      <CardHeader className="bg-muted/50 border-b pb-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold">#{booking.id.slice(0, 8)}</h2>
              <Badge variant={getStatusBadge(booking.status).variant as any}>
                {getStatusBadge(booking.status).label}
              </Badge>
              {quote && (
                <Badge variant="outline">Offert #{quote.number}</Badge>
              )}
              {job && (
                <Badge variant="secondary">Jobb #{job.id.slice(0, 8)}</Badge>
              )}
              {invoice && (
                <Badge variant="default">Faktura</Badge>
              )}
            </div>
            <p className="text-lg font-semibold">{serviceName}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {customerName}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {customerEmail}
              </span>
              <span>📅 {format(new Date(booking.created_at), "d MMM yyyy", { locale: sv })}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Booking Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">📋 Bokning</h3>
          
          <div className="space-y-2">
            {customerPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customerPhone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{address}</span>
              </div>
            )}
            {booking.payload?.description && (
              <p className="text-sm text-muted-foreground pt-2">
                {booking.payload.description}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {!quote && (
              <Button
                onClick={() => onCreateQuote(booking.id)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Skapa offert
              </Button>
            )}
          </div>
        </div>

        {/* Quote Section */}
        {quote && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">💰 Offert #{quote.number}</h3>
                <Badge variant={getQuoteStatusBadge(quote.status).variant}>
                  {getQuoteStatusBadge(quote.status).label}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Arbetskostnad:</span>
                  <span className="font-semibold ml-2">{quote.subtotal_work_sek?.toLocaleString('sv-SE')} kr</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Material:</span>
                  <span className="font-semibold ml-2">{quote.subtotal_mat_sek?.toLocaleString('sv-SE')} kr</span>
                </div>
                {quote.rot_deduction_sek > 0 && (
                  <div>
                    <span className="text-muted-foreground">ROT-avdrag:</span>
                    <span className="font-semibold ml-2 text-green-600">-{quote.rot_deduction_sek?.toLocaleString('sv-SE')} kr</span>
                  </div>
                )}
                <div className="w-full pt-2 border-t">
                  <span className="text-muted-foreground">Totalt:</span>
                  <span className="text-xl font-bold ml-2">{quote.total_sek?.toLocaleString('sv-SE')} kr</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap pt-2">
                <Button
                  onClick={() => onEditQuote(quote.id)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Redigera
                </Button>
                {(quote.status === 'draft' || quote.status === 'sent') && (
                  <Button
                    onClick={() => onSendQuote(quote.id)}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {quote.status === 'sent' ? 'Skicka igen' : 'Skicka'}
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
                {quote.status === 'accepted' && !job && (
                  <Button
                    onClick={() => onCreateJob(quote.id)}
                    size="sm"
                    variant="default"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Skapa jobb
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Job Section */}
        {job && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">🔧 Jobb #{job.id.slice(0, 8)}</h3>
                <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                  {job.status === 'completed' ? 'Slutfört ✓' : 'Pågående'}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold ml-2">{job.status}</span>
                </div>
                {workers && workers.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Arbetare:</span>
                    <span className="font-semibold ml-2">{workers.length} st</span>
                  </div>
                )}
                {jobTotalHours !== undefined && estimatedHours !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Timmar:</span>
                    <span className="font-semibold ml-2">{jobTotalHours}/{estimatedHours}h</span>
                  </div>
                )}
              </div>

              {/* Show totals for completed jobs */}
              {job.status === 'completed' && (
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">Sammanfattning</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Timmar arbetade</p>
                      <p className="font-bold">{jobTotalHours || 0}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Material</p>
                      <p className="font-bold">{totalMaterialCost?.toLocaleString('sv-SE')} kr</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Utlägg</p>
                      <p className="font-bold">{totalExpenses?.toLocaleString('sv-SE')} kr</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action button for completed jobs */}
              {job.status === 'completed' && !invoice && onCreateInvoiceFromJob && (
                <Button
                  onClick={() => onCreateInvoiceFromJob(job.id, booking.customer_id)}
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Visa & Skapa faktura
                </Button>
              )}
            </div>
          </>
        )}

        {/* Workers Section */}
        {job && workers && workers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Arbetare
              </h3>
              
              <div className="space-y-2">
                {workers.map((worker) => (
                  <div key={worker.worker_id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{worker.worker_name || 'Namnlös'}</span>
                    <span className="text-muted-foreground">{worker.total_hours || 0}h</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Invoice Section */}
        {quote?.status === 'accepted' && job?.status === 'completed' && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  📄 {invoice ? `Faktura ${invoice.invoice_number}` : 'Faktura'}
                </h3>
                {invoice && (
                  <Badge variant={getInvoiceStatusBadge(invoice.status).variant}>
                    {getInvoiceStatusBadge(invoice.status).label}
                  </Badge>
                )}
              </div>

              {invoice ? (
                <>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Belopp:</span>
                      <span className="text-xl font-bold ml-2">{invoice.total_amount?.toLocaleString('sv-SE')} kr</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Förfaller:</span>
                      <span className="font-semibold ml-2">
                        {format(new Date(invoice.due_date), "d MMM yyyy", { locale: sv })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
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
                    {(invoice as any).public_token && onCopyInvoiceLink && (
                      <>
                        <Button
                          onClick={() => onCopyInvoiceLink(invoice.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Kopiera
                        </Button>
                        <Button
                          onClick={() => {
                            const publicUrl = `${window.location.origin}/invoice/${(invoice as any).public_token}`;
                            window.open(publicUrl, '_blank');
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">Offert accepterad och jobb slutfört - skapa faktura</p>
                  <Button
                    onClick={() => onCreateInvoice(quote.id)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Skapa faktura
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Danger Zone - Ta bort bokning */}
        <Separator className="my-4" />
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">Farlig zon</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Att ta bort denna bokning är permanent och kan inte ångras. All associerad data (offert, jobb, faktura) kommer att påverkas.
              </p>
            </div>
            <Button
              onClick={() => onDeleteBooking(booking.id)}
              variant="destructive"
              size="sm"
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Ta bort bokning
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
