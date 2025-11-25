import { useState, useEffect } from "react";
import AdminBack from "@/components/admin/AdminBack";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Eye, Code } from "lucide-react";
import { generateQuoteHTML, generateInvoiceHTML } from "@/utils/pdf-html-preview";
import { toast } from "sonner";

// A4 Preview Container with scaling
const A4PreviewContainer = ({ html }: { html: string }) => {
  // A4 dimensions in pixels (at 96 DPI)
  const a4Width = 794;
  const a4Height = 1123;
  
  // Container height determines the scale
  const containerHeight = 800;
  const scale = containerHeight / a4Height;
  
  return (
    <div 
      className="relative overflow-hidden border rounded-lg bg-muted"
      style={{ height: `${containerHeight}px` }}
    >
      <div
        style={{
          width: a4Width,
          height: a4Height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: '50%',
          marginLeft: `-${(a4Width * scale) / 2}px`,
        }}
      >
        <iframe
          srcDoc={html}
          className="w-full h-full bg-background shadow-lg"
          title="A4 Preview"
          style={{ 
            border: 'none',
            width: a4Width,
            height: a4Height,
          }}
        />
      </div>
    </div>
  );
};

export default function QuoteHtmlPreview() {
  const [viewMode, setViewMode] = useState<'quote' | 'invoice'>('quote');
  const [showSource, setShowSource] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string>('');
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [useCustomHtml, setUseCustomHtml] = useState(false);

  // Load Fixco logo as base64
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/assets/fixco-logo-black.png');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setLogoBase64(base64);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Kunde inte ladda Fixco-loggan:', error);
      }
    };
    loadLogo();
  }, []);

  // Test data for quote
  const [quoteData, setQuoteData] = useState({
    title: "Elinstallation - Villa Ek",
    number: "2025-001",
    created_at: "2025-11-25",
    valid_until: "2025-12-25",
    customer_name: "Kalle Karlsson",
    customer_email: "kalle@example.com",
    customer_phone: "070-123 45 67",
    customer_address: "Testgatan 123, 753 20 Uppsala",
    items: [
      { description: "Installation av eluttag", quantity: 5, price: 800, unit: 'tim', type: 'work' as const },
      { description: "Byte av armaturer", quantity: 3, price: 1200, unit: 'tim', type: 'work' as const },
      { description: "Eluttag (Schneider)", quantity: 5, price: 150, unit: 'st', type: 'material' as const },
      { description: "Armaturer (Philips)", quantity: 3, price: 450, unit: 'st', type: 'material' as const },
    ],
    subtotal_work_sek: 5000,
    subtotal_mat_sek: 2100,
    vat_sek: 1775,
    rot_deduction_sek: 1500,
    rot_percentage: 30,
    total_sek: 7375,
  });

  // Test data for invoice
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: "F-2025-001",
    issue_date: "2025-11-25",
    due_date: "2025-12-25",
    customer_name: "Anna Andersson",
    customer_email: "anna@example.com",
    customer_phone: "070-987 65 43",
    customer_address: "Storgatan 456, 753 20 Uppsala",
    line_items: [
      { description: "Städning 3 rum + kök", quantity: 1, unit_price: 1500, total_price: 1500, unit: 'tim', type: 'work' as const },
      { description: "Fönsterputsning", quantity: 8, unit_price: 150, total_price: 1200, unit: 'st', type: 'work' as const },
      { description: "Städmaterial", quantity: 1, unit_price: 200, total_price: 200, unit: 'st', type: 'material' as const },
    ],
    subtotal: 2900,
    vat_amount: 725,
    total_amount: 3625,
    rut_amount: 870,
  });

  const html = viewMode === 'quote' 
    ? generateQuoteHTML(quoteData, logoBase64) 
    : generateInvoiceHTML(invoiceData, logoBase64);

  const displayHtml = editedHtml || html;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(displayHtml);
    toast.success('HTML kopierad till urklipp!');
  };

  const handleSaveHtml = () => {
    localStorage.setItem('custom_quote_html', editedHtml);
    toast.success('Källkod sparad!');
    setHasUnsavedChanges(false);
  };

  const handleResetHtml = () => {
    setEditedHtml('');
    setUseCustomHtml(false);
    localStorage.removeItem('custom_quote_html');
    toast.success('Återställd till standard');
    setHasUnsavedChanges(false);
  };

  const handleDeleteCustomHtml = () => {
    localStorage.removeItem('custom_quote_html');
    setEditedHtml('');
    setUseCustomHtml(true);
    toast.success('Anpassad källkod raderad - skriv in ny HTML');
    setHasUnsavedChanges(false);
  };

  const handleLoadStandardAsBase = () => {
    setEditedHtml(html);
    setUseCustomHtml(true);
    setHasUnsavedChanges(true);
    toast.success('Standard HTML laddad som bas');
  };

  const handleUpdateQuoteData = (field: string, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateInvoiceData = (field: string, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBack />
          <h1 className="text-3xl font-bold mt-2">HTML-förhandsgranskning</h1>
          <p className="text-muted-foreground">
            Förhandsgranska och testa PDF HTML-templates innan deployment
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showSource ? "default" : "outline"}
            onClick={() => setShowSource(!showSource)}
          >
            <Code className="h-4 w-4 mr-2" />
            {showSource ? "Dölj källkod" : "Visa källkod"}
          </Button>
          <Button onClick={handleCopyHtml}>
            <Copy className="h-4 w-4 mr-2" />
            Kopiera HTML
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'quote' | 'invoice')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="quote">Offert</TabsTrigger>
          <TabsTrigger value="invoice">Faktura</TabsTrigger>
        </TabsList>

        <TabsContent value="quote" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Data Editor */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Testdata - Offert</CardTitle>
                <CardDescription>Redigera testdata för att se uppdateringar i realtid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Offertnummer</Label>
                  <Input
                    value={quoteData.number}
                    onChange={(e) => handleUpdateQuoteData('number', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Kundnamn</Label>
                  <Input
                    value={quoteData.customer_name}
                    onChange={(e) => handleUpdateQuoteData('customer_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={quoteData.customer_email}
                    onChange={(e) => handleUpdateQuoteData('customer_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefon</Label>
                  <Input
                    value={quoteData.customer_phone}
                    onChange={(e) => handleUpdateQuoteData('customer_phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Adress</Label>
                  <Input
                    value={quoteData.customer_address}
                    onChange={(e) => handleUpdateQuoteData('customer_address', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Totalt belopp (kr)</Label>
                  <Input
                    type="number"
                    value={quoteData.total_sek}
                    onChange={(e) => handleUpdateQuoteData('total_sek', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>ROT-avdrag (kr)</Label>
                  <Input
                    type="number"
                    value={quoteData.rot_deduction_sek}
                    onChange={(e) => handleUpdateQuoteData('rot_deduction_sek', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live-förhandsgranskning
                </CardTitle>
                <CardDescription>Så kommer PDF:en att se ut</CardDescription>
              </CardHeader>
              <CardContent>
                {showSource ? (
                  <div className="space-y-4">
                    <Textarea
                      value={useCustomHtml ? editedHtml : html}
                      onChange={(e) => {
                        setEditedHtml(e.target.value);
                        setUseCustomHtml(true);
                        setHasUnsavedChanges(true);
                      }}
                      className="font-mono text-xs min-h-[600px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveHtml} disabled={!hasUnsavedChanges}>
                        Spara ändringar
                      </Button>
                      <Button variant="outline" onClick={handleResetHtml}>
                        Återställ
                      </Button>
                      <Button variant="secondary" onClick={handleLoadStandardAsBase}>
                        Ladda standard som bas
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteCustomHtml}>
                        Radera anpassad källkod
                      </Button>
                    </div>
                  </div>
                ) : (
                  <A4PreviewContainer html={displayHtml} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Data Editor */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Testdata - Faktura</CardTitle>
                <CardDescription>Redigera testdata för att se uppdateringar i realtid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Fakturanummer</Label>
                  <Input
                    value={invoiceData.invoice_number}
                    onChange={(e) => handleUpdateInvoiceData('invoice_number', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Kundnamn</Label>
                  <Input
                    value={invoiceData.customer_name}
                    onChange={(e) => handleUpdateInvoiceData('customer_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={invoiceData.customer_email}
                    onChange={(e) => handleUpdateInvoiceData('customer_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefon</Label>
                  <Input
                    value={invoiceData.customer_phone}
                    onChange={(e) => handleUpdateInvoiceData('customer_phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Adress</Label>
                  <Input
                    value={invoiceData.customer_address}
                    onChange={(e) => handleUpdateInvoiceData('customer_address', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Totalt belopp (kr)</Label>
                  <Input
                    type="number"
                    value={invoiceData.total_amount}
                    onChange={(e) => handleUpdateInvoiceData('total_amount', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>RUT-avdrag (kr)</Label>
                  <Input
                    type="number"
                    value={invoiceData.rut_amount}
                    onChange={(e) => handleUpdateInvoiceData('rut_amount', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live-förhandsgranskning
                </CardTitle>
                <CardDescription>Så kommer PDF:en att se ut</CardDescription>
              </CardHeader>
              <CardContent>
                {showSource ? (
                  <div className="space-y-4">
                    <Textarea
                      value={useCustomHtml ? editedHtml : html}
                      onChange={(e) => {
                        setEditedHtml(e.target.value);
                        setUseCustomHtml(true);
                        setHasUnsavedChanges(true);
                      }}
                      className="font-mono text-xs min-h-[600px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveHtml} disabled={!hasUnsavedChanges}>
                        Spara ändringar
                      </Button>
                      <Button variant="outline" onClick={handleResetHtml}>
                        Återställ
                      </Button>
                      <Button variant="secondary" onClick={handleLoadStandardAsBase}>
                        Ladda standard som bas
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteCustomHtml}>
                        Radera anpassad källkod
                      </Button>
                    </div>
                  </div>
                ) : (
                  <A4PreviewContainer html={displayHtml} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">💡 Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800 space-y-2">
          <p>• Redigera testdata i realtid och se uppdateringar direkt i förhandsvisningen</p>
          <p>• Klicka på "Visa källkod" för att se den genererade HTML:en</p>
          <p>• När du är nöjd med designen, uppdatera <code className="bg-amber-100 px-1 rounded">supabase/functions/_shared/pdf-html-templates.ts</code></p>
          <p>• Glöm inte att deploymenta edge functions efter ändringar!</p>
        </CardContent>
      </Card>
    </div>
  );
}
