import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Send, Copy, Eye } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { fetchQuotesNew, createQuoteNew, sendQuoteEmail } from '@/lib/api/quotes-new';
import { fetchCustomers, upsertCustomer } from '@/lib/api/customers';
import type { Customer } from '@/lib/api/customers';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function QuotesNew() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    useExisting: false,
    existingCustomerId: '',
    title: '',
    itemsJson: '[]',
    subtotalWork: 0,
    subtotalMat: 0,
    vat: 0,
    rotDeduction: 0,
    total: 0,
    pdfUrl: '',
    validUntil: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [quotesData, customersData] = await Promise.all([
        fetchQuotesNew(),
        fetchCustomers()
      ]);
      setQuotes(quotesData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Kunde inte ladda data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateQuote(e: React.FormEvent) {
    e.preventDefault();
    try {
      let customerId = formData.existingCustomerId;

      if (!formData.useExisting) {
        const customer = await upsertCustomer({
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          address: formData.customerAddress
        });
        customerId = customer.id;
      }

      const quote = await createQuoteNew({
        customer_id: customerId,
        title: formData.title,
        items: JSON.parse(formData.itemsJson || '[]'),
        subtotal_work_sek: formData.subtotalWork,
        subtotal_mat_sek: formData.subtotalMat,
        vat_sek: formData.vat,
        rot_deduction_sek: formData.rotDeduction,
        total_sek: formData.total,
        pdf_url: formData.pdfUrl,
        valid_until: formData.validUntil
      });

      toast.success(`Offert ${quote.number} skapad!`);
      setDialogOpen(false);
      loadData();
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        useExisting: false,
        existingCustomerId: '',
        title: '',
        itemsJson: '[]',
        subtotalWork: 0,
        subtotalMat: 0,
        vat: 0,
        rotDeduction: 0,
        total: 0,
        pdfUrl: '',
        validUntil: ''
      });
    } catch (error: any) {
      console.error('Error creating quote:', error);
      toast.error(error.message || 'Kunde inte skapa offert');
    }
  }

  async function handleSendQuote(quoteId: string) {
    try {
      toast.info('Skickar e-post...');
      await sendQuoteEmail(quoteId);
      toast.success('Offert skickad!');
      loadData();
    } catch (error: any) {
      console.error('Error sending quote:', error);
      toast.error('Kunde inte skicka offert');
    }
  }

  function copyPublicLink(token: string) {
    const url = `${window.location.origin}/q/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Länk kopierad!');
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: 'secondary',
      sent: 'default',
      viewed: 'default',
      accepted: 'default',
      declined: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: 'Utkast',
      sent: 'Skickad',
      viewed: 'Visad',
      change_requested: 'Ändring begärd',
      accepted: 'Accepterad',
      declined: 'Avvisad',
      expired: 'Utgången'
    };
    return texts[status] || status;
  };

  if (loading) return <div className="p-6">Laddar...</div>;

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Offerter (Nya systemet)</h1>
          <p className="text-muted-foreground mt-2">
            End-to-end offertflöde med publik länk
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ny offert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Skapa ny offert</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuote} className="space-y-4">
              <div className="space-y-2">
                <Label>Kund</Label>
                <Select
                  value={formData.useExisting ? 'existing' : 'new'}
                  onValueChange={(v) => setFormData({...formData, useExisting: v === 'existing'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Ny kund</SelectItem>
                    <SelectItem value="existing">Befintlig kund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.useExisting ? (
                <div className="space-y-2">
                  <Label>Välj kund</Label>
                  <Select
                    value={formData.existingCustomerId}
                    onValueChange={(v) => setFormData({...formData, existingCustomerId: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kund" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Namn *</Label>
                    <Input
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-post *</Label>
                    <Input
                      required
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adress</Label>
                    <Input
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Titel *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Renovering badrum"
                />
              </div>

              <div className="space-y-2">
                <Label>Items (JSON)</Label>
                <Textarea
                  value={formData.itemsJson}
                  onChange={(e) => setFormData({...formData, itemsJson: e.target.value})}
                  placeholder='[{"name":"Arbete","qty":1,"price":10000}]'
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Arbete (kr)</Label>
                  <Input
                    type="number"
                    value={formData.subtotalWork}
                    onChange={(e) => setFormData({...formData, subtotalWork: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Material (kr)</Label>
                  <Input
                    type="number"
                    value={formData.subtotalMat}
                    onChange={(e) => setFormData({...formData, subtotalMat: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Moms (kr)</Label>
                  <Input
                    type="number"
                    value={formData.vat}
                    onChange={(e) => setFormData({...formData, vat: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ROT-avdrag (kr)</Label>
                  <Input
                    type="number"
                    value={formData.rotDeduction}
                    onChange={(e) => setFormData({...formData, rotDeduction: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Totalt (kr) *</Label>
                <Input
                  required
                  type="number"
                  value={formData.total}
                  onChange={(e) => setFormData({...formData, total: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>PDF URL</Label>
                <Input
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Giltig t.o.m.</Label>
                <Input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full">Skapa offert</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {quotes.map((quote) => (
          <Card key={quote.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{quote.title}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div>Kund: {quote.customer?.name || 'Okänd'} ({quote.customer?.email || '—'})</div>
                    <div>Nummer: {quote.number}</div>
                  </div>
                </div>
                <Badge variant={getStatusBadge(quote.status)}>
                  {getStatusText(quote.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <div className="font-medium">Totalt</div>
                  <div className="text-muted-foreground">
                    {Number(quote.total_sek).toLocaleString('sv-SE')} kr
                  </div>
                </div>
                <div>
                  <div className="font-medium">Giltig t.o.m.</div>
                  <div className="text-muted-foreground">
                    {quote.valid_until ? format(new Date(quote.valid_until), 'PPP', {locale: sv}) : '—'}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Skapad</div>
                  <div className="text-muted-foreground">
                    {format(new Date(quote.created_at), 'PPP', {locale: sv})}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`/q/${quote.public_token}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Öppna
                </Button>
                {quote.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => handleSendQuote(quote.id)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Skicka
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyPublicLink(quote.public_token)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Kopiera länk
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
