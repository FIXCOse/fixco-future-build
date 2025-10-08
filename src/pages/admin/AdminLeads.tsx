import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminBack from "@/components/admin/AdminBack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, Phone, MapPin, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/features/ai/tools/estimateQuote";

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

                {lead.message && (
                  <div>
                    <p className="text-sm font-medium mb-1">Meddelande:</p>
                    <p className="text-sm text-muted-foreground">{lead.message}</p>
                  </div>
                )}

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

                {lead.images && Array.isArray(lead.images) && lead.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Uppladdade bilder ({lead.images.length})
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {lead.images.map((imageUrl: string, index: number) => (
                        <a
                          key={index}
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={imageUrl}
                            alt={`Lead bild ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
