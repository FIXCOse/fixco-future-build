import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FileText, Mail, Phone, MapPin, Trash2, Edit, Send, ExternalLink, Plus, Copy, Users, AlertTriangle, Briefcase, ChevronDown, Building2, User, Home, CheckCircle } from "lucide-react";
import { RequestWithQuote } from "@/hooks/useRequestsQuotes";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
  onAdminAccept?: (quoteId: string) => void;
  onAdminCompleteJob?: (jobId: string) => void;
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
  onAdminAccept,
  onAdminCompleteJob,
  onRefresh,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { booking, quote, customer, invoice, job, timeLogs, materialLogs, expenseLogs, totalHours: jobTotalHours, totalMaterialCost, totalExpenses } = item;
  const { workers, totalHours: workerTotalHours, estimatedHours, refresh: refreshWorkers } = useJobWorkers(job?.id);
  
  const handleRefresh = () => {
    if (job?.id) {
      refreshWorkers();
    }
    onRefresh();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; className?: string }> = {
      new: { variant: "outline", label: "Väntande", className: "text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30" },
      pending: { variant: "secondary", label: "Väntar" },
      confirmed: { variant: "default", label: "Bekräftad" },
      completed: { variant: "outline", label: "Klar", className: "text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30" },
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
  
  // Check if this is a home visit booking
  const isHomeVisit = booking.mode === 'home_visit';
  const serviceType = booking.payload?.service_type || booking.payload?.fields?.service_type;
  const timePreference = booking.payload?.time_preference || booking.payload?.fields?.time_preference;

  const isSyntheticBooking = booking.id.startsWith('synthetic-');

  // Get customer type label
  const getCustomerTypeLabel = () => {
    if (customer?.customer_type === 'company') return 'Företag';
    if (customer?.customer_type === 'brf') return 'BRF';
    return 'Privatperson';
  };

  // Get customer type icon
  const CustomerTypeIcon = () => {
    if (customer?.customer_type === 'company' || customer?.customer_type === 'brf') {
      return <Building2 className="h-5 w-5 text-muted-foreground" />;
    }
    return <User className="h-5 w-5 text-muted-foreground" />;
  };
  
  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      {/* Collapsed Header - Always Visible */}
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 rounded-lg border bg-card transition-colors">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              {isHomeVisit ? (
                <Home className="h-5 w-5 text-teal-500" />
              ) : (
                <CustomerTypeIcon />
              )}
            </div>
            
            {/* Customer Name + Status */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold truncate">{customerName}</span>
                <Badge 
                  variant={bookingStatus.variant} 
                  className={cn("text-xs", bookingStatus.className)}
                >
                  {bookingStatus.label}
                </Badge>
                {isHomeVisit && (
                  <Badge variant="outline" className="text-teal-600 border-teal-300 bg-teal-50 dark:bg-teal-950/30 text-xs">
                    🏠 Hembesök
                  </Badge>
                )}
                {quote && (
                  <Badge variant="outline" className="text-xs">Offert</Badge>
                )}
                {job && (
                  <Badge variant="secondary" className="text-xs">Jobb</Badge>
                )}
                {invoice && (
                  <Badge variant="default" className="text-xs">Faktura</Badge>
                )}
              </div>
              
              {/* Customer Type • Service • Date */}
              <div className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap mt-1">
                <span>{getCustomerTypeLabel()}</span>
                <span>•</span>
                <span className="truncate max-w-[200px]">{serviceName}</span>
                <span>•</span>
                <span>{format(new Date(booking.created_at), "d MMM yyyy 'kl.' HH:mm", { locale: sv })}</span>
              </div>
            </div>
          </div>
          
          {/* Chevron */}
          <ChevronDown className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
            isExpanded && "rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>
      
      {/* Expanded Content */}
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="pt-4 pb-4 px-4 space-y-6 border border-t-0 rounded-b-lg bg-card">
          {/* Contact Info + Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Kontaktinformation</h4>
              <div className="space-y-1.5 text-sm">
                {customerEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{customerEmail}</span>
                  </p>
                )}
                {customerPhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{customerPhone}</span>
                  </p>
                )}
                {customer?.personnummer && (
                  <p>
                    <span className="text-muted-foreground">Personnummer:</span>
                    <span className="ml-2">{customer.personnummer}</span>
                  </p>
                )}
                {(customer?.company_name || customer?.brf_name) && (
                  <p>
                    <span className="text-muted-foreground">{customer.customer_type === 'brf' ? 'BRF:' : 'Företag:'}</span>
                    <span className="ml-2">{customer.company_name || customer.brf_name}</span>
                    {customer.org_number && (
                      <span className="text-muted-foreground ml-1">({customer.org_number})</span>
                    )}
                  </p>
                )}
                
                {/* Customer saved indicator */}
                {customer?.id && (
                  <div className="flex items-center gap-2 pt-2 border-t mt-2">
                    <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30">
                      <Users className="h-3 w-3 mr-1" />
                      Sparad i kundregister
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/admin/customers?highlight=${customer.id}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visa kundkort
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Address */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Adress</h4>
              <div className="space-y-1.5 text-sm">
                {address && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{address}</span>
                  </p>
                )}
                {(booking.payload?.postal_code || booking.payload?.city) && (
                  <p className="pl-5">
                    {booking.payload?.postal_code}{' '}
                    {booking.payload?.city}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Project Description */}
          {(booking.payload?.description || booking.payload?.beskrivning) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Projektbeskrivning</h4>
              <p className="text-sm">{booking.payload.description || booking.payload.beskrivning}</p>
            </div>
          )}
          
          {/* Home visit specific info */}
          {isHomeVisit && (
            <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
              <div className="space-y-2 text-sm">
                {serviceType && (
                  <div>
                    <span className="font-medium">Projekttyp:</span>
                    <span className="ml-2 text-muted-foreground capitalize">{serviceType}</span>
                  </div>
                )}
                {timePreference && (
                  <div>
                    <span className="font-medium">Önskad tid:</span>
                    <span className="ml-2 text-muted-foreground">
                      {timePreference === 'asap' && 'Så snart som möjligt'}
                      {timePreference === 'morning' && 'Förmiddag (08-12)'}
                      {timePreference === 'afternoon' && 'Eftermiddag (12-17)'}
                      {timePreference === 'evening' && 'Kväll (17-20)'}
                      {timePreference === 'weekend' && 'Helg'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action: Create Quote */}
          {!quote && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onCreateQuote(booking.id)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Skapa offert
              </Button>
            </div>
          )}

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
                  {quote.status === 'accepted' && 
                   quote.updated_at && 
                   quote.accepted_at && 
                   new Date(quote.updated_at) > new Date(quote.accepted_at) && (
                    <Button
                      onClick={async () => {
                        try {
                          const { supabase } = await import('@/integrations/supabase/client');
                          const { toast } = await import('sonner');
                          
                          const { error: updateError } = await supabase
                            .from('quotes_new')
                            .update({
                              status: 'pending_reaccept',
                              reaccept_requested_at: new Date().toISOString(),
                              signature_name: null,
                              signature_date: null,
                              terms_accepted: false
                            })
                            .eq('id', quote.id);
                          
                          if (updateError) throw updateError;
                          
                          const { error: emailError } = await supabase.functions.invoke('send-reaccept-email', {
                            body: {
                              quoteId: quote.id,
                              customerEmail: customer.email,
                              customerName: customer.name
                            }
                          });
                          
                          if (emailError) {
                            console.error('Email error:', emailError);
                            toast.warning('Offerten uppdaterad, men kunde inte skicka email');
                          } else {
                            toast.success('Ny acceptans begärd och email skickat till kund');
                          }
                          
                          onRefresh();
                        } catch (err: any) {
                          const { toast } = await import('sonner');
                          console.error('Error:', err);
                          toast.error('Kunde inte begära ny acceptans: ' + err.message);
                        }
                      }}
                      size="sm"
                      variant="secondary"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Begär ny acceptans
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
                    onClick={() => onViewPdf(quote.id)}
                    variant="outline"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => {
                      const publicUrl = `${window.location.origin}/q/${quote.number}/${quote.public_token}`;
                      window.open(publicUrl, '_blank');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  {/* Admin-accept button for draft/sent/viewed quotes */}
                  {(quote.status === 'draft' || quote.status === 'sent' || quote.status === 'viewed') && onAdminAccept && (
                    <Button
                      onClick={() => onAdminAccept(quote.id)}
                      size="sm"
                      variant="secondary"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Acceptera (admin)
                    </Button>
                  )}
                  {quote.status === 'accepted' && !job && (
                    <>
                      <Button
                        onClick={() => onCreateJob(quote.id)}
                        size="sm"
                        variant="default"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Skapa jobb
                      </Button>
                      <Button
                        onClick={() => onCreateInvoice(quote.id)}
                        size="sm"
                        variant="outline"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Skapa faktura direkt
                      </Button>
                    </>
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

                {/* Admin complete job button */}
                {job.status !== 'completed' && onAdminCompleteJob && (
                  <Button
                    onClick={() => onAdminCompleteJob(job.id)}
                    size="sm"
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Markera som slutfört (admin)
                  </Button>
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
          {quote?.status === 'accepted' && (invoice !== undefined || job?.status === 'completed' || job?.status === 'invoiced') && (
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

          {/* Danger Zone */}
          <Separator className="my-4" />
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-destructive">Farlig zon</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isSyntheticBooking 
                    ? 'Att ta bort denna offert är permanent och kan inte ångras.'
                    : 'Att ta bort denna bokning är permanent och kan inte ångras. All associerad data (offert, jobb, faktura) kommer att påverkas.'}
                </p>
              </div>
              <Button
                onClick={() => onDeleteBooking(booking.id)}
                variant="destructive"
                size="sm"
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isSyntheticBooking ? 'Ta bort offert' : 'Ta bort bokning'}
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
