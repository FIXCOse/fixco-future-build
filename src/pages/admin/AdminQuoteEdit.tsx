import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AdminBack from '@/components/admin/AdminBack';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

const AdminQuoteEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [quoteData, setQuoteData] = useState({
    title: '',
    description: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_postal_code: '',
    customer_city: '',
    valid_until: '',
    status: 'draft' as 'draft' | 'sent' | 'accepted' | 'rejected',
    line_items: [] as LineItem[],
    subtotal: 0,
    discount_percent: 0,
    discount_amount: 0,
    vat_amount: 0,
    total_amount: 0,
    rot_amount: 0,
    rut_amount: 0,
  });

  useEffect(() => {
    if (id) {
      loadQuote();
    }
  }, [id]);

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Offert hittades inte');

      // Parse description if it's JSON
      let description = data.description || '';
      try {
        const parsed = JSON.parse(description);
        description = parsed.beskrivning || parsed.description || description;
      } catch {
        // Keep as is
      }

      setQuoteData({
        title: data.title || '',
        description: description || '',
        customer_name: data.customer_name || '',
        customer_email: data.customer_email || '',
        customer_phone: data.customer_phone || '',
        customer_address: data.customer_address || '',
        customer_postal_code: data.customer_postal_code || '',
        customer_city: data.customer_city || '',
        valid_until: data.valid_until || '',
        status: (data.status === 'expired' ? 'draft' : data.status) || 'draft',
        line_items: Array.isArray(data.line_items) ? data.line_items.map((item: any) => ({
          description: item.description || '',
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          amount: item.amount || 0
        })) : [],
        subtotal: data.subtotal || 0,
        discount_percent: data.discount_percent || 0,
        discount_amount: data.discount_amount || 0,
        vat_amount: data.vat_amount || 0,
        total_amount: data.total_amount || 0,
        rot_amount: data.rot_amount || 0,
        rut_amount: data.rut_amount || 0,
      });

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading quote:', error);
      toast.error(error.message || 'Kunde inte ladda offert');
      navigate('/admin/quotes');
    }
  };

  const handleAddLineItem = () => {
    setQuoteData(prev => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        { description: '', quantity: 1, unit_price: 0, amount: 0 }
      ]
    }));
  };

  const handleRemoveLineItem = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
    calculateTotals();
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
    setQuoteData(prev => {
      const newLineItems = [...prev.line_items];
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: value
      };
      
      // Calculate amount
      if (field === 'quantity' || field === 'unit_price') {
        newLineItems[index].amount = newLineItems[index].quantity * newLineItems[index].unit_price;
      }

      return { ...prev, line_items: newLineItems };
    });
    
    // Recalculate totals
    setTimeout(calculateTotals, 0);
  };

  const calculateTotals = () => {
    setQuoteData(prev => {
      const subtotal = prev.line_items.reduce((sum, item) => sum + item.amount, 0);
      const discount = prev.discount_percent > 0 
        ? subtotal * (prev.discount_percent / 100)
        : prev.discount_amount;
      const subtotalAfterDiscount = subtotal - discount;
      const vat = subtotalAfterDiscount * 0.25;
      const total = subtotalAfterDiscount + vat;

      return {
        ...prev,
        subtotal,
        discount_amount: discount,
        vat_amount: vat,
        total_amount: total
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('quotes')
        .update({
          title: quoteData.title,
          description: quoteData.description,
          customer_name: quoteData.customer_name,
          customer_email: quoteData.customer_email,
          customer_phone: quoteData.customer_phone,
          customer_address: quoteData.customer_address,
          customer_postal_code: quoteData.customer_postal_code,
          customer_city: quoteData.customer_city,
          valid_until: quoteData.valid_until || null,
          status: quoteData.status,
          line_items: quoteData.line_items as any,
          subtotal: quoteData.subtotal,
          discount_percent: quoteData.discount_percent,
          discount_amount: quoteData.discount_amount,
          vat_amount: quoteData.vat_amount,
          total_amount: quoteData.total_amount,
          rot_amount: quoteData.rot_amount,
          rut_amount: quoteData.rut_amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Offert uppdaterad!');
      navigate(`/admin/quotes/${id}`);
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast.error(error.message || 'Kunde inte spara offert');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <AdminBack />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Redigera offert</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/quotes/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sparar...' : 'Spara'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Grundläggande information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titel</Label>
              <Input
                value={quoteData.title}
                onChange={(e) => setQuoteData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Offerttitel"
              />
            </div>
            <div>
              <Label>Beskrivning</Label>
              <Textarea
                value={quoteData.description}
                onChange={(e) => setQuoteData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beskrivning av arbetet"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={quoteData.status}
                  onValueChange={(value) => setQuoteData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Utkast</SelectItem>
                    <SelectItem value="sent">Skickad</SelectItem>
                    <SelectItem value="accepted">Accepterad</SelectItem>
                    <SelectItem value="rejected">Avvisad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Giltig till</Label>
                <Input
                  type="date"
                  value={quoteData.valid_until}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, valid_until: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Kundinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Namn</Label>
                <Input
                  value={quoteData.customer_name}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, customer_name: e.target.value }))}
                  placeholder="Kundens namn"
                />
              </div>
              <div>
                <Label>E-post</Label>
                <Input
                  type="email"
                  value={quoteData.customer_email}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, customer_email: e.target.value }))}
                  placeholder="E-postadress"
                />
              </div>
            </div>
            <div>
              <Label>Telefon</Label>
              <Input
                value={quoteData.customer_phone}
                onChange={(e) => setQuoteData(prev => ({ ...prev, customer_phone: e.target.value }))}
                placeholder="Telefonnummer"
              />
            </div>
            <div>
              <Label>Adress</Label>
              <Input
                value={quoteData.customer_address}
                onChange={(e) => setQuoteData(prev => ({ ...prev, customer_address: e.target.value }))}
                placeholder="Gatuadress"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Postnummer</Label>
                <Input
                  value={quoteData.customer_postal_code}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, customer_postal_code: e.target.value }))}
                  placeholder="Postnummer"
                />
              </div>
              <div>
                <Label>Stad</Label>
                <Input
                  value={quoteData.customer_city}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, customer_city: e.target.value }))}
                  placeholder="Stad"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Specifikation</span>
              <Button size="sm" onClick={handleAddLineItem}>
                <Plus className="h-4 w-4 mr-2" />
                Lägg till rad
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quoteData.line_items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Beskrivning"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Antal"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Á-pris"
                      value={item.unit_price}
                      onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      value={item.amount.toFixed(2)}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveLineItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Sammanfattning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Delsumma:</span>
              <span className="font-medium">{quoteData.subtotal.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span>Rabatt:</span>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  className="w-20"
                  value={quoteData.discount_percent}
                  onChange={(e) => {
                    setQuoteData(prev => ({ ...prev, discount_percent: parseFloat(e.target.value) || 0 }));
                    calculateTotals();
                  }}
                  placeholder="%"
                />
                <span>%</span>
                <span className="font-medium">−{quoteData.discount_amount.toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Moms (25%):</span>
              <span className="font-medium">{quoteData.vat_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Totalt inkl. moms:</span>
              <span>{quoteData.total_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            {quoteData.rot_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>ROT-avdrag:</span>
                <span>−{quoteData.rot_amount.toLocaleString('sv-SE')} kr</span>
              </div>
            )}
            {quoteData.rut_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>RUT-avdrag:</span>
                <span>−{quoteData.rut_amount.toLocaleString('sv-SE')} kr</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminQuoteEdit;

