import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminBack from "@/components/admin/AdminBack";
import { useLeadsRealtime } from "@/hooks/useLeadsRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, Phone, MapPin, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/features/ai/tools/estimateQuote";
import { QuoteFormModal } from "@/components/admin/QuoteFormModal";
import { createCustomer } from "@/lib/api/customers";
import type { QuoteNewRow } from "@/lib/api/quotes-new";

type ParsedMessageData = {
  serviceCategory?: string;
  projectScope?: string;
  size?: string;
  timeline?: string;
  budget?: string;
  additionalDetails?: string;
  leadScore?: number;
  leadPriority?: 'high' | 'medium' | 'low';
  generatedImages?: string[];
};

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  message: string | null;
  images: any;
  service_interest: string | null;
  estimated_quote: any;
  status: string;
  source: string;
  created_at: string;
};

const STATUS_COLORS = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  quoted: "bg-purple-500",
  won: "bg-green-500",
  lost: "bg-gray-500"
};

const STATUS_LABELS = {
  new: "Ny",
  contacted: "Kontaktad",
  quoted: "Offerterad",
  won: "Vunnen",
  lost: "Förlorad"
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [prefilledCustomerId, setPrefilledCustomerId] = useState<string | null>(null);
  const [prefilledQuoteData, setPrefilledQuoteData] = useState<any>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enable realtime updates
  useLeadsRealtime(loadLeads);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));

      toast({
        title: "Status uppdaterad",
        description: `Lead markerad som ${STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS]}`
      });
    } catch (error) {
      console.error("Failed to update lead status:", error);
      toast({
        title: "Fel vid uppdatering",
        description: "Kunde inte uppdatera status",
        variant: "destructive"
      });
    }
  };

  const handleCreateQuote = async (lead: Lead) => {
    try {
      // 1. Hitta eller skapa kund
      let customerId = null;
      
      if (lead.email) {
        // Kolla om kund redan finns
        const { data: existingCustomers } = await supabase
          .from('customers')
          .select('id')
          .eq('email', lead.email)
          .limit(1);
        
        if (existingCustomers && existingCustomers.length > 0) {
          customerId = existingCustomers[0].id;
        } else {
          // Skapa ny kund
          const newCustomer = await createCustomer({
            name: lead.name || 'Okänd',
            email: lead.email,
            phone: lead.phone || undefined,
            address: lead.address || undefined,
            postalCode: lead.postal_code || undefined,
            city: lead.city || undefined
          });
          customerId = newCustomer.id;
        }
      }
      
      // 2. Förbered offertdata
      let messageData: ParsedMessageData | null = null;
      try {
        messageData = lead.message ? JSON.parse(lead.message) : null;
      } catch {}
      
      const title = messageData?.serviceCategory 
        ? `${messageData.serviceCategory} - ${lead.name || 'Kund'}`
        : `AI Lead - ${lead.name || 'Kund'}`;
      
      // 3. Förbered radposter från estimerad offert
      let items: any[] = [];
      if (lead.estimated_quote) {
        const est = lead.estimated_quote;
        
        // Lägg till arbete om > 0
        if (est.workSek > 0) {
          items.push({
            type: 'work',
            description: messageData?.serviceCategory || 'Arbete',
            quantity: 1,
            unit: 'st',
            price: est.workSek
          });
        }
        
        // Lägg till material om > 0
        if (est.materialSek > 0) {
          items.push({
            type: 'material',
            description: 'Material',
            quantity: 1,
            unit: 'st',
            price: est.materialSek
          });
        }
      }
      
      // Om inga items, lägg till en tom rad
      if (items.length === 0) {
        items = [{ type: 'work', description: '', quantity: 1, unit: 'tim', price: 0 }];
      }
      
      // 4. Sätt prefilled data
      setPrefilledCustomerId(customerId);
      setPrefilledQuoteData({
        title,
        items,
        enableRot: lead.estimated_quote?.rotDeductionSek && lead.estimated_quote.rotDeductionSek > 0
      });
      setSelectedLead(lead);
      setShowQuoteModal(true);
      
    } catch (error) {
      console.error('Error preparing quote:', error);
      toast({
        title: "Fel",
        description: "Kunde inte förbereda offert",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Namn', 'E-post', 'Telefon', 'Adress', 'Meddelande', 'Tjänst', 'Status', 'Skapad'];
    const rows = leads.map(lead => [
      lead.name || '',
      lead.email || '',
      lead.phone || '',
      `${lead.address || ''} ${lead.postal_code || ''} ${lead.city || ''}`.trim(),
      lead.message || '',
      lead.service_interest || '',
      STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS],
      new Date(lead.created_at).toLocaleDateString('sv-SE')
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fixco-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Concierge Leads</h1>
          <p className="text-muted-foreground">
            Leads från AI-chatten med visualiseringar och offerter
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Exportera CSV
        </Button>
      </div>

      <div className="grid gap-4">
        {leads.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Inga leads ännu</p>
            </CardContent>
          </Card>
        ) : (
          leads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {lead.name || "Anonym"}
                      <Badge className={STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}>
                        {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date(lead.created_at).toLocaleString('sv-SE')}
                    </CardDescription>
                  </div>
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Ny</SelectItem>
                      <SelectItem value="contacted">Kontaktad</SelectItem>
                      <SelectItem value="quoted">Offerterad</SelectItem>
                      <SelectItem value="won">Vunnen</SelectItem>
                      <SelectItem value="lost">Förlorad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${lead.email}`} className="hover:underline">
                          {lead.email}
                        </a>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${lead.phone}`} className="hover:underline">
                          {lead.phone}
                        </a>
                      </div>
                    )}
                    {(lead.address || lead.city) && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {[lead.address, lead.postal_code, lead.city]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {lead.service_interest && (
                    <div>
                      <p className="text-sm font-medium mb-1">Intresserad av:</p>
                      <p className="text-sm text-muted-foreground">{lead.service_interest}</p>
                    </div>
                  )}
                </div>

                {lead.message && (() => {
                  try {
                    const messageData: ParsedMessageData = JSON.parse(lead.message);
                    return (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Projektdetaljer:</p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          {messageData.serviceCategory && (
                            <div>
                              <span className="text-muted-foreground">Kategori:</span>
                              <span className="ml-2 font-medium">{messageData.serviceCategory}</span>
                            </div>
                          )}
                          {messageData.projectScope && (
                            <div>
                              <span className="text-muted-foreground">Omfattning:</span>
                              <span className="ml-2 font-medium">{messageData.projectScope}</span>
                            </div>
                          )}
                          {messageData.size && (
                            <div>
                              <span className="text-muted-foreground">Storlek:</span>
                              <span className="ml-2 font-medium">{messageData.size}</span>
                            </div>
                          )}
                          {messageData.timeline && (
                            <div>
                              <span className="text-muted-foreground">Tidsplan:</span>
                              <span className="ml-2 font-medium">{messageData.timeline}</span>
                            </div>
                          )}
                          {messageData.budget && (
                            <div>
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="ml-2 font-medium">{messageData.budget}</span>
                            </div>
                          )}
                        </div>
                        {messageData.additionalDetails && (
                          <div>
                            <span className="text-sm text-muted-foreground">Ytterligare detaljer:</span>
                            <p className="text-sm mt-1">{messageData.additionalDetails}</p>
                          </div>
                        )}
                        {messageData.leadScore && (
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant={messageData.leadPriority === 'high' ? 'default' : 'secondary'}>
                              Lead Score: {messageData.leadScore}/100
                            </Badge>
                            <Badge variant="outline">
                              Prioritet: {messageData.leadPriority}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  } catch {
                    return (
                      <div>
                        <p className="text-sm font-medium mb-1">Meddelande:</p>
                        <p className="text-sm text-muted-foreground">{lead.message}</p>
                      </div>
                    );
                  }
                })()}

                {lead.estimated_quote && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium mb-2">Estimerad offert:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Arbete:</span>
                        <span>{formatPrice(lead.estimated_quote.workSek)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Material:</span>
                        <span>{formatPrice(lead.estimated_quote.materialSek)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Totalt efter ROT:</span>
                        <span>{formatPrice(lead.estimated_quote.totalAfterRotSek)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {lead.images && (() => {
                  try {
                    const imageArray = typeof lead.images === 'string' 
                      ? JSON.parse(lead.images) 
                      : lead.images;
                    
                    return Array.isArray(imageArray) && imageArray.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Uppladdade bilder ({imageArray.length})
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {imageArray.filter((url: string) => url && url.trim()).map((imageUrl: string, index: number) => (
                            <div
                              key={index}
                              className="rounded-lg overflow-hidden border hover:opacity-80 transition-opacity cursor-pointer"
                              onClick={() => window.open(imageUrl, '_blank')}
                            >
                              <img
                                src={imageUrl}
                                alt={`Lead bild ${index + 1}`}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } catch (error) {
                    console.error('Failed to parse images:', error);
                    return null;
                  }
                })()}

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleCreateQuote(lead)}
                    className="flex-1"
                    variant="default"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Skapa offert
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <QuoteFormModal
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        quote={null}
        onSuccess={async (createdQuote: QuoteNewRow | undefined) => {
          if (selectedLead && createdQuote) {
            await updateLeadStatus(selectedLead.id, 'quoted');
          }
          setShowQuoteModal(false);
          setSelectedLead(null);
          setPrefilledCustomerId(null);
          setPrefilledQuoteData(null);
        }}
        prefilledCustomerId={prefilledCustomerId}
        prefilledData={prefilledQuoteData}
      />
    </div>
  );
}
