import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, FileText, Calculator, DollarSign, FileEdit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface JobData {
  id: string;
  title: string;
  customer_id: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  totalHours: number;
  hourlyRate: number;
  totalMaterialCost: number;
  totalExpenses: number;
  pricing_mode?: string;
  fixed_price?: number;
}

interface AdvancedInvoiceEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobData: JobData | null;
  onCreateInvoice: (invoicePayload: any) => Promise<void>;
}

export function AdvancedInvoiceEditor({
  open,
  onOpenChange,
  jobData,
  onCreateInvoice
}: AdvancedInvoiceEditorProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  // Line items state
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Discount state
  const [discountType, setDiscountType] = useState<'none' | 'percent' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState(0);

  // VAT state
  const [vatEnabled, setVatEnabled] = useState(true);

  // Notes state
  const [customerNotes, setCustomerNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30 dagar');

  // Initialize line items from job data
  useEffect(() => {
    if (jobData) {
      const items: LineItem[] = [];

      // Add labor
      if (jobData.pricing_mode === 'hourly' && jobData.totalHours > 0) {
        items.push({
          description: 'Arbetstimmar',
          quantity: jobData.totalHours,
          unit_price: jobData.hourlyRate,
          total: jobData.totalHours * jobData.hourlyRate
        });
      } else if (jobData.pricing_mode === 'fixed' && jobData.fixed_price) {
        items.push({
          description: 'Arbete (fast pris)',
          quantity: 1,
          unit_price: jobData.fixed_price,
          total: jobData.fixed_price
        });
      }

      // Add materials
      if (jobData.totalMaterialCost > 0) {
        items.push({
          description: 'Material och delar',
          quantity: 1,
          unit_price: jobData.totalMaterialCost,
          total: jobData.totalMaterialCost
        });
      }

      // Add expenses
      if (jobData.totalExpenses > 0) {
        items.push({
          description: 'Utlägg och övriga kostnader',
          quantity: 1,
          unit_price: jobData.totalExpenses,
          total: jobData.totalExpenses
        });
      }

      setLineItems(items);
    }
  }, [jobData]);

  const addLineItem = () => {
    const newItem: LineItem = { description: '', quantity: 1, unit_price: 0, total: 0 };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...lineItems];
    const item = { ...newItems[index] };
    
    if (field === 'quantity') {
      item.quantity = parseFloat(value) || 0;
      item.total = item.quantity * item.unit_price;
    } else if (field === 'unit_price') {
      item.unit_price = parseFloat(value) || 0;
      item.total = item.quantity * item.unit_price;
    } else if (field === 'description') {
      item.description = value;
    } else if (field === 'total') {
      item.total = parseFloat(value) || 0;
    }
    
    newItems[index] = item;
    setLineItems(newItems);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percent') {
      return subtotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
      return discountValue;
    }
    return 0;
  };

  const calculateAfterDiscount = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateVat = () => {
    if (!vatEnabled) return 0;
    return calculateAfterDiscount() * 0.25;
  };

  const calculateTotal = () => {
    return calculateAfterDiscount() + calculateVat();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateInvoice = async () => {
    if (!jobData) return;

    if (lineItems.length === 0) {
      toast({
        title: 'Fel',
        description: 'Lägg till minst en rad',
        variant: 'destructive'
      });
      return;
    }

    const subtotal = calculateSubtotal();
    if (subtotal <= 0) {
      toast({
        title: 'Fel',
        description: 'Total summa måste vara större än 0',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const invoicePayload = {
        jobId: jobData.id,
        customerId: jobData.customer_id,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.total
        })),
        subtotal: Math.round(subtotal),
        discountType,
        discountValue,
        discountAmount: Math.round(calculateDiscount()),
        vatEnabled,
        vatAmount: Math.round(calculateVat()),
        totalAmount: Math.round(calculateTotal()),
        customerNotes: customerNotes.trim(),
        internalNotes: internalNotes.trim(),
        paymentTerms: paymentTerms.trim()
      };

      await onCreateInvoice(invoicePayload);
      onOpenChange(false);
      
      // Reset form
      setActiveTab('items');
      setDiscountType('none');
      setDiscountValue(0);
      setVatEnabled(true);
      setCustomerNotes('');
      setInternalNotes('');
      setPaymentTerms('30 dagar');
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Fel',
        description: error.message || 'Kunde inte skapa faktura',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!jobData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Skapa faktura
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Jobb: {jobData.title} • Kund: {jobData.customer?.name || 'Okänd'}
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="items">
              <FileEdit className="h-4 w-4 mr-2" />
              Rader
            </TabsTrigger>
            <TabsTrigger value="adjustments">
              <DollarSign className="h-4 w-4 mr-2" />
              Justeringar
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4 mr-2" />
              Anteckningar
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Calculator className="h-4 w-4 mr-2" />
              Förhandsgranska
            </TabsTrigger>
          </TabsList>

          {/* Line Items Tab */}
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Fakturarader</CardTitle>
                  <Button onClick={addLineItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Lägg till rad
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-muted/20">
                    <div className="col-span-5">
                      <Input
                        placeholder="Beskrivning"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Antal"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="À-pris"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(index, 'unit_price', e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={formatCurrency(item.total)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adjustments Tab */}
          <TabsContent value="adjustments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rabatt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rabatttyp</Label>
                  <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ingen rabatt</SelectItem>
                      <SelectItem value="percent">Procent (%)</SelectItem>
                      <SelectItem value="fixed">Fast belopp (kr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {discountType !== 'none' && (
                  <div className="space-y-2">
                    <Label>Rabattvärde</Label>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === 'percent' ? 'T.ex. 10' : 'T.ex. 1000'}
                      step="0.01"
                    />
                    <p className="text-sm text-muted-foreground">
                      Rabatt: {formatCurrency(calculateDiscount())}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Inkludera moms (25%)</Label>
                    <p className="text-sm text-muted-foreground">
                      Moms: {formatCurrency(calculateVat())}
                    </p>
                  </div>
                  <Switch
                    checked={vatEnabled}
                    onCheckedChange={setVatEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Anteckningar till kund</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Dessa anteckningar kommer att visas på fakturan..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interna anteckningar</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Endast för internt bruk, visas inte på fakturan..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Betalningsvillkor</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="T.ex. 30 dagar"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Faktura förhandsvisning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer info */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Kund</h4>
                  <p className="text-sm">{jobData.customer?.name || 'Okänd'}</p>
                  {jobData.customer?.email && (
                    <p className="text-sm text-muted-foreground">{jobData.customer.email}</p>
                  )}
                  {jobData.customer?.phone && (
                    <p className="text-sm text-muted-foreground">{jobData.customer.phone}</p>
                  )}
                </div>

                {/* Line items */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Specifikation</h4>
                  {lineItems.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <div className="flex-1">
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-2 pt-4 border-t-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                  </div>

                  {discountType !== 'none' && calculateDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="font-medium">Rabatt</span>
                      <span className="font-semibold">-{formatCurrency(calculateDiscount())}</span>
                    </div>
                  )}

                  {vatEnabled && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Moms (25%)</span>
                      <span className="font-medium">{formatCurrency(calculateVat())}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t-2 border-primary/20">
                    <span className="text-lg font-bold">Totalt</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                {customerNotes && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Anteckningar</h4>
                    <p className="text-sm whitespace-pre-wrap">{customerNotes}</p>
                  </div>
                )}

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Betalningsvillkor: {paymentTerms}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Avbryt
              </Button>
              <Button
                onClick={handleCreateInvoice}
                disabled={loading}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                {loading ? 'Skapar...' : 'Skapa faktura'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
