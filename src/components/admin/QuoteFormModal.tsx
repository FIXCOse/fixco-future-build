import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCustomers, createCustomer, type Customer } from '@/lib/api/customers';
import { createQuoteNew, updateQuoteNew, type QuoteNewRow } from '@/lib/api/quotes-new';

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
  onSuccess: () => void;
};

export function QuoteFormModal({ open, onOpenChange, quote, onSuccess }: QuoteFormModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ type: 'work', description: '', quantity: 1, unit: 'st', price: 0 }]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [manualVat, setManualVat] = useState(false);
  const [manualVatAmount, setManualVatAmount] = useState(0);
  const [manualRot, setManualRot] = useState(false);
  const [manualRotAmount, setManualRotAmount] = useState(0);
  
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
      
      if (quote.vat_sek !== calculateAutoVat()) {
        setManualVat(true);
        setManualVatAmount(quote.vat_sek);
      }
      
      if (quote.rot_deduction_sek > 0) {
        setManualRot(true);
        setManualRotAmount(quote.rot_deduction_sek);
      }
    } else {
      resetForm();
    }
  }, [quote]);

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
    setItems([{ type: 'work', description: '', quantity: 1, unit: 'st', price: 0 }]);
    setPdfUrl('');
    setValidUntil('');
    setManualVat(false);
    setManualVatAmount(0);
    setManualRot(false);
    setManualRotAmount(0);
    setShowNewCustomer(false);
    setNewCustomer({ name: '', email: '', phone: '', address: '' });
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
    return items
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateAutoVat = () => {
    return Math.round((calculateSubtotalWork() + calculateSubtotalMaterial()) * 0.25);
  };

  const calculateAutoRot = () => {
    return Math.round(calculateSubtotalWork() * 0.3);
  };

  const calculateTotal = () => {
    const work = calculateSubtotalWork();
    const material = calculateSubtotalMaterial();
    const vat = manualVat ? manualVatAmount : calculateAutoVat();
    const rot = manualRot ? manualRotAmount : 0;
    return work + material + vat - rot;
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Namn och e-post krävs');
      return;
    }

    try {
      const created = await createCustomer(newCustomer);
      setCustomers([...customers, created]);
      setSelectedCustomerId(created.id);
      setShowNewCustomer(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
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
    if (total === 0) {
      toast.error('Total summa kan inte vara 0');
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
        vat_sek: Math.round(manualVat ? manualVatAmount : calculateAutoVat()),
        rot_deduction_sek: Math.round(manualRot ? manualRotAmount : 0),
        total_sek: Math.round(total),
        pdf_url: pdfUrl.trim() || undefined,
        valid_until: validUntil || undefined,
      };

      if (quote) {
        await updateQuoteNew(quote.id, quoteData);
        toast.success('Offert uppdaterad');
      } else {
        await createQuoteNew(quoteData);
        toast.success('Offert skapad');
      }

      onSuccess();
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quote ? 'Redigera offert' : 'Ny offert'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label>Kund *</Label>
            {!showNewCustomer ? (
              <div className="flex gap-2">
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger className="flex-1">
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
                <Button type="button" variant="outline" onClick={() => setShowNewCustomer(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium">Ny kund</h4>
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
                  placeholder="Telefon"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
                <Textarea
                  placeholder="Adress"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateCustomer}>Skapa kund</Button>
                  <Button variant="outline" onClick={() => setShowNewCustomer(false)}>Avbryt</Button>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Titel *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Renovering badrum"
            />
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Rader</Label>
              <Button type="button" size="sm" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Lägg till rad
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 p-3 border rounded-lg">
                  <Select
                    value={item.type}
                    onValueChange={(value: any) => updateItem(index, 'type', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Arbete</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="flex-1"
                    placeholder="Beskrivning"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                  <Input
                    className="w-20"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Antal"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    className="w-20"
                    placeholder="Enhet"
                    value={item.unit || ''}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                  />
                  <Input
                    className="w-32"
                    type="number"
                    min="0"
                    placeholder="à-pris (kr)"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                  <div className="w-32 flex items-center justify-end font-medium">
                    {Math.round(item.quantity * item.price).toLocaleString()} kr
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span>Arbete:</span>
              <span className="font-medium">{calculateSubtotalWork().toLocaleString()} kr</span>
            </div>
            <div className="flex justify-between">
              <span>Material:</span>
              <span className="font-medium">{calculateSubtotalMaterial().toLocaleString()} kr</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Moms (kr):</span>
                <input
                  type="checkbox"
                  checked={manualVat}
                  onChange={(e) => setManualVat(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-muted-foreground">Manuell</span>
              </div>
              {manualVat ? (
                <Input
                  type="number"
                  min="0"
                  className="w-32"
                  value={manualVatAmount}
                  onChange={(e) => setManualVatAmount(parseFloat(e.target.value) || 0)}
                />
              ) : (
                <span className="font-medium">{calculateAutoVat().toLocaleString()} kr</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>ROT-avdrag (kr):</span>
                <input
                  type="checkbox"
                  checked={manualRot}
                  onChange={(e) => {
                    setManualRot(e.target.checked);
                    if (e.target.checked && !manualRotAmount) {
                      setManualRotAmount(calculateAutoRot());
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-muted-foreground">ROT möjligt</span>
              </div>
              {manualRot ? (
                <Input
                  type="number"
                  min="0"
                  className="w-32"
                  value={manualRotAmount}
                  onChange={(e) => setManualRotAmount(parseFloat(e.target.value) || 0)}
                />
              ) : (
                <span className="font-medium">0 kr</span>
              )}
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-lg">{calculateTotal().toLocaleString()} kr</span>
            </div>
          </div>

          {/* PDF URL */}
          <div className="space-y-2">
            <Label>PDF-URL (valfritt)</Label>
            <Input
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <Label>Giltig till</Label>
            <Input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sparar...' : quote ? 'Uppdatera' : 'Skapa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
