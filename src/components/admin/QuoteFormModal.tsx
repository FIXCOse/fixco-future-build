import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Info, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCustomers, createCustomer, type Customer } from '@/lib/api/customers';
import { createQuoteNew, updateQuoteNew, type QuoteNewRow } from '@/lib/api/quotes-new';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CustomerCombobox } from '@/components/admin/CustomerCombobox';

type LineItem = {
  type: 'work' | 'material';
  description: string;
  quantity: number;
  unit?: string;
  price: number;
};

type QuoteFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: QuoteNewRow | null;
  onSuccess: (created?: QuoteNewRow) => void;
  prefilledCustomerId?: string | null;
  prefilledData?: {
    title?: string;
    items?: LineItem[];
    enableRot?: boolean;
  } | null;
  bookingData?: {
    id: string;
    payload?: any;
    customer_id?: string;
  } | null;
};

export function QuoteFormModal({ open, onOpenChange, quote, onSuccess, prefilledCustomerId, prefilledData, bookingData }: QuoteFormModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '',
    personnummer: '',
    postalCode: '',
    city: ''
  });
  
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ type: 'work', description: '', quantity: 1, unit: 'tim', price: 0 }]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  
  // ROT/RUT settings
  const [enableRot, setEnableRot] = useState(false);
  const [rotRate, setRotRate] = useState(30); // Default 30% för ROT
  const [enableRut, setEnableRut] = useState(false);
  const [rutRate, setRutRate] = useState(50); // Default 50% för RUT
  
  // Discount settings
  const [discountType, setDiscountType] = useState<'none' | 'percent' | 'amount'>('none');
  const [discountValue, setDiscountValue] = useState(0);
  
  // Material options
  const [materialIncluded, setMaterialIncluded] = useState(true);
  
  // VAT settings
  const [customVat, setCustomVat] = useState(false);
  const [customVatRate, setCustomVatRate] = useState(25);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (quote) {
      setTitle(quote.title);
      setSelectedCustomerId(quote.customer_id || '');
      setPdfUrl(quote.pdf_url || '');
      setValidUntil(quote.valid_until || '');
      
      try {
        const parsedItems = Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
        if (parsedItems.length > 0) {
          setItems(parsedItems);
        }
      } catch (e) {
        console.error('Failed to parse items:', e);
      }
      
      // Load ROT/RUT settings from quote
      if (quote.rot_deduction_sek > 0) {
        setEnableRot(true);
        setRotRate(quote.rot_percentage || 30);
      }
      
      if (quote.rut_percentage && quote.rut_percentage > 0) {
        setEnableRut(true);
        setRutRate(quote.rut_percentage);
      }
      
      // Load discount settings from quote
      if (quote.discount_type && quote.discount_type !== 'none') {
        setDiscountType(quote.discount_type as any);
        setDiscountValue(quote.discount_value || 0);
      }
    } else if (bookingData?.payload) {
      // Prefill from booking payload
      const payload = bookingData.payload;
      
      // Find or prepare customer data
      if (bookingData.customer_id) {
        setSelectedCustomerId(bookingData.customer_id);
      } else if (payload.email) {
        // Try to find existing customer by email
        const existingCustomer = customers.find(c => c.email === payload.email);
        if (existingCustomer) {
          setSelectedCustomerId(existingCustomer.id);
        } else {
          // Prepare new customer form with prefilled data
          setShowNewCustomer(true);
          setNewCustomer({
            name: payload.name || '',
            email: payload.email || '',
            phone: payload.phone || '',
            address: payload.address || '',
            personnummer: payload.personnummer || '',
            postalCode: payload.postal_code || '',
            city: payload.city || ''
          });
        }
      }
      
      // Set title from service name
      if (payload.service_name) {
        setTitle(payload.service_name);
      }
      
      // Create initial line item from service
      if (payload.service_name) {
        setItems([{
          type: 'work',
          description: payload.service_name,
          quantity: payload.estimated_hours || 1,
          unit: 'tim',
          price: 0
        }]);
      }
      
      // Enable ROT if service is ROT eligible
      if (payload.rot_eligible !== false) {
        setEnableRot(true);
        setRotRate(30);
      }
    } else if (prefilledCustomerId || prefilledData) {
      // Load prefilled data from AI lead
      if (prefilledCustomerId) {
        setSelectedCustomerId(prefilledCustomerId);
      }
      if (prefilledData?.title) {
        setTitle(prefilledData.title);
      }
      if (prefilledData?.items && prefilledData.items.length > 0) {
        setItems(prefilledData.items);
      }
      if (prefilledData?.enableRot) {
        setEnableRot(true);
        setRotRate(30);
      }
    } else {
      resetForm();
    }
  }, [quote, prefilledCustomerId, prefilledData, bookingData, customers]);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Kunde inte ladda kunder');
    }
  };

  const resetForm = () => {
    setTitle('');
    setSelectedCustomerId('');
    setItems([{ type: 'work', description: '', quantity: 1, unit: 'tim', price: 0 }]);
    setPdfUrl('');
    setValidUntil('');
    setNotes('');
    setEnableRot(false);
    setRotRate(30);
    setEnableRut(false);
    setRutRate(50);
    setDiscountType('none');
    setDiscountValue(0);
    setMaterialIncluded(true);
    setCustomVat(false);
    setCustomVatRate(25);
    setShowNewCustomer(false);
    setNewCustomer({ name: '', email: '', phone: '', address: '', personnummer: '', postalCode: '', city: '' });
  };

  const addItem = () => {
    setItems([...items, { type: 'work', description: '', quantity: 1, unit: 'st', price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.error('Måste ha minst en rad');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotalWork = () => {
    return items
      .filter(item => item.type === 'work')
      .reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateSubtotalMaterial = () => {
    if (!materialIncluded) return 0;
    return items
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateSubtotal = () => {
    return calculateSubtotalWork() + calculateSubtotalMaterial();
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percent') {
      return Math.round(subtotal * (discountValue / 100));
    } else if (discountType === 'amount') {
      return discountValue;
    }
    return 0;
  };

  const calculateSubtotalAfterDiscount = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateVat = () => {
    const subtotalAfterDiscount = calculateSubtotalAfterDiscount();
    const vatRate = customVat ? customVatRate : 25;
    return Math.round(subtotalAfterDiscount * (vatRate / 100));
  };

  const calculateRotRutDeduction = () => {
    const workCost = calculateSubtotalWork();
    let deduction = 0;
    
    if (enableRot) {
      deduction += Math.round(workCost * (rotRate / 100));
    }
    
    if (enableRut) {
      deduction += Math.round(workCost * (rutRate / 100));
    }
    
    return deduction;
  };

  const calculateTotal = () => {
    const subtotalAfterDiscount = calculateSubtotalAfterDiscount();
    const vat = calculateVat();
    const rotRutDeduction = calculateRotRutDeduction();
    return subtotalAfterDiscount + vat - rotRutDeduction;
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.personnummer || !newCustomer.postalCode || !newCustomer.city) {
      toast.error('Namn, e-post, personnummer, postnummer och postort krävs');
      return;
    }

    try {
      const created = await createCustomer(newCustomer);
      setCustomers([...customers, created]);
      setSelectedCustomerId(created.id);
      setShowNewCustomer(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '', personnummer: '', postalCode: '', city: '' });
      toast.success('Kund skapad');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Kunde inte skapa kund');
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      toast.error('Välj en kund');
      return;
    }

    if (!title.trim()) {
      toast.error('Titel krävs');
      return;
    }

    const total = calculateTotal();
    if (total <= 0) {
      toast.error('Total summa måste vara större än 0');
      return;
    }

    setLoading(true);

    try {
      const quoteData = {
        customer_id: selectedCustomerId,
        title: title.trim(),
        items: items,
        subtotal_work_sek: Math.round(calculateSubtotalWork()),
        subtotal_mat_sek: Math.round(calculateSubtotalMaterial()),
        vat_sek: Math.round(calculateVat()),
        rot_deduction_sek: Math.round(calculateRotRutDeduction()),
        rot_percentage: enableRot ? rotRate : 0,
        rut_percentage: enableRut ? rutRate : 0,
        discount_type: discountType,
        discount_value: discountValue,
        discount_amount_sek: Math.round(calculateDiscount()),
        total_sek: Math.round(total),
        pdf_url: pdfUrl.trim() || undefined,
        valid_until: validUntil || undefined,
      };

      let result;
      if (quote) {
        result = await updateQuoteNew(quote.id, quoteData);
        toast.success('Offert uppdaterad');
      } else {
        result = await createQuoteNew(quoteData);
        toast.success('Offert skapad');
      }

      onSuccess(result);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast.error(error.message || 'Kunde inte spara offert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            {quote ? 'Redigera offert' : 'Ny offert'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kundinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showNewCustomer ? (
                <div className="space-y-2">
                  <Label>Kund *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomerCombobox
                        customers={customers}
                        value={selectedCustomerId}
                        onValueChange={setSelectedCustomerId}
                        placeholder="Välj kund"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={() => setShowNewCustomer(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ny kund
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Skapa ny kund</h4>
                    <Button size="sm" variant="ghost" onClick={() => setShowNewCustomer(false)}>
                      Avbryt
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Namn *"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    />
                    <Input
                      placeholder="E-post *"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                    <Input
                      placeholder="Personnummer *"
                      value={newCustomer.personnummer}
                      onChange={(e) => setNewCustomer({ ...newCustomer, personnummer: e.target.value })}
                    />
                    <Input
                      placeholder="Telefon"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                    <div className="col-span-2">
                      <Input
                        placeholder="Adress"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="Postnummer *"
                      value={newCustomer.postalCode}
                      onChange={(e) => setNewCustomer({ ...newCustomer, postalCode: e.target.value })}
                    />
                    <Input
                      placeholder="Postort *"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateCustomer} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Skapa kund
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Offerttitel *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="T.ex. Renovering badrum"
                />
              </div>

              <div className="space-y-2">
                <Label>Giltig till</Label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Radposter</CardTitle>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Lägg till rad
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-muted/20">
                  <div className="col-span-2">
                    <Select
                      value={item.type}
                      onValueChange={(value: any) => updateItem(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Arbete</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Input
                      placeholder="Beskrivning"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Antal"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      placeholder="Enh"
                      value={item.unit || ''}
                      onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="À-pris"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm whitespace-nowrap">
                      {Math.round(item.quantity * item.price).toLocaleString()} kr
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ROT/RUT - Prominent Section */}
          <div className="border-2 border-primary/20 rounded-lg shadow-lg bg-card">
            <div className="p-6 bg-gradient-to-r from-green-950/10 to-blue-950/10 rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  %
                </div>
                <h3 className="text-xl font-semibold">ROT & RUT Skatteavdrag</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Aktivera skattelättnader för att ge kunden upp till 50% rabatt på arbetskostnaden
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* ROT */}
                <div className={`p-6 rounded-lg border transition-all ${enableRot ? 'ring-2 ring-green-500 shadow-lg border-green-500/50' : 'opacity-60 border-border'}`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                            R
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">ROT-avdrag</h3>
                            <p className="text-xs text-muted-foreground">
                              Renovering, Ombyggnad, Tillbyggnad
                            </p>
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={enableRot} 
                        onCheckedChange={setEnableRot}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                    
                    {enableRot && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-semibold">Avdragssats</Label>
                            <span className="text-2xl font-bold text-green-400">
                              {rotRate}%
                            </span>
                          </div>
                          <Input
                            type="range"
                            min="0"
                            max="50"
                            step="5"
                            value={rotRate}
                            onChange={(e) => setRotRate(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-foreground/60 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-500/10 rounded-xl border-2 border-green-500/30">
                          <p className="text-xs text-foreground/70 mb-1">Kundens besparing:</p>
                          <p className="text-3xl font-bold text-green-400">
                            {Math.round(calculateSubtotalWork() * (rotRate / 100)).toLocaleString()} kr
                          </p>
                          <p className="text-xs text-foreground/60 mt-1">
                            av {calculateSubtotalWork().toLocaleString()} kr arbetskostnad
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {!enableRot && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Aktivera för att tillämpa ROT-avdrag
                      </div>
                    )}
                  </div>
                </div>

                {/* RUT */}
                <div className={`p-6 rounded-lg border transition-all ${enableRut ? 'ring-2 ring-blue-500 shadow-lg border-blue-500/50' : 'opacity-60 border-border'}`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            R
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">RUT-avdrag</h3>
                            <p className="text-xs text-muted-foreground">
                              Reparation, Underhåll, Tvätt/Städ
                            </p>
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={enableRut} 
                        onCheckedChange={setEnableRut}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                    
                    {enableRut && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-semibold">Avdragssats</Label>
                            <span className="text-2xl font-bold text-blue-400">
                              {rutRate}%
                            </span>
                          </div>
                          <Input
                            type="range"
                            min="0"
                            max="50"
                            step="5"
                            value={rutRate}
                            onChange={(e) => setRutRate(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-foreground/60 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
                          <p className="text-xs text-foreground/70 mb-1">Kundens besparing:</p>
                          <p className="text-3xl font-bold text-blue-400">
                            {Math.round(calculateSubtotalWork() * (rutRate / 100)).toLocaleString()} kr
                          </p>
                          <p className="text-xs text-foreground/60 mt-1">
                            av {calculateSubtotalWork().toLocaleString()} kr arbetskostnad
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {!enableRut && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Aktivera för att tillämpa RUT-avdrag
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Combined Savings Highlight */}
              {(enableRot || enableRut) && (
                <div className="p-6 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 rounded-xl border-2 border-dashed border-primary animate-in fade-in zoom-in">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Total skattereduktion för kunden
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {calculateRotRutDeduction().toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-muted-foreground">kr</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {enableRot && enableRut ? 'ROT + RUT kombinerat' : enableRot ? 'ROT-avdrag' : 'RUT-avdrag'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Övriga tillval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Material Options */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Materialkostnad ingår</Label>
                  <p className="text-sm text-muted-foreground">
                    {materialIncluded ? 'Material ingår i offerten' : 'Material tillkommer (faktureras separat)'}
                  </p>
                </div>
                <Switch
                  checked={materialIncluded}
                  onCheckedChange={setMaterialIncluded}
                />
              </div>

              {/* Discount */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <Label className="text-base font-semibold">Rabatt</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ingen rabatt</SelectItem>
                      <SelectItem value="percent">Procent (%)</SelectItem>
                      <SelectItem value="amount">Belopp (kr)</SelectItem>
                    </SelectContent>
                  </Select>
                  {discountType !== 'none' && (
                    <>
                      <Input
                        type="number"
                        min="0"
                        step={discountType === 'percent' ? '1' : '100'}
                        max={discountType === 'percent' ? '100' : undefined}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                        placeholder={discountType === 'percent' ? '0-100' : 'Belopp'}
                      />
                      <div className="flex items-center font-semibold text-lg">
                        −{calculateDiscount().toLocaleString()} kr
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Custom VAT */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Anpassad momssats</Label>
                  <Switch checked={customVat} onCheckedChange={setCustomVat} />
                </div>
                {customVat && (
                  <div className="space-y-2">
                    <Label className="text-sm">Momssats (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={customVatRate}
                      onChange={(e) => setCustomVatRate(parseFloat(e.target.value) || 25)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg">Sammanfattning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arbetskostnad:</span>
                  <span className="font-medium">{calculateSubtotalWork().toLocaleString()} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Materialkostnad{!materialIncluded && ' (tillkommer)'}:
                  </span>
                  <span className="font-medium">
                    {materialIncluded ? calculateSubtotalMaterial().toLocaleString() : '—'} kr
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Delsumma:</span>
                  <span className="font-semibold">{calculateSubtotal().toLocaleString()} kr</span>
                </div>
                
                {discountType !== 'none' && (
                  <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                    <span>
                      Rabatt ({discountType === 'percent' ? `${discountValue}%` : `${discountValue} kr`}):
                    </span>
                    <span className="font-medium">−{calculateDiscount().toLocaleString()} kr</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moms ({customVat ? customVatRate : 25}%):</span>
                  <span className="font-medium">+{calculateVat().toLocaleString()} kr</span>
                </div>
                
                {(enableRot || enableRut) && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>
                      {enableRot && enableRut ? 'ROT/RUT-avdrag' : enableRot ? 'ROT-avdrag' : 'RUT-avdrag'}:
                    </span>
                    <span className="font-medium">−{calculateRotRutDeduction().toLocaleString()} kr</span>
                  </div>
                )}
                
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="text-xl font-bold">Totalt att betala:</span>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotal().toLocaleString()} kr
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ytterligare information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Anteckningar (valfritt)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Interna anteckningar eller kommentarer..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>PDF-URL (valfritt)</Label>
                <Input
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Länk till extern PDF om sådan finns
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="min-w-32">
            {loading ? 'Sparar...' : quote ? 'Uppdatera offert' : 'Skapa offert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}