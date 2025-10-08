import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Send } from "lucide-react";
import { estimateQuote, formatPrice, EstimateInput } from "./tools/estimateQuote";
import { getServices, generatePdf, sendQuoteEmail } from "./lib/ai";
import { useToast } from "@/hooks/use-toast";

export function QuotePreview() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState(8);
  const [material, setMaterial] = useState(0);
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
      if (data.length > 0) {
        setSelectedService(data[0]);
      }
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const estimate = selectedService ? estimateQuote({
    serviceName: selectedService.name,
    serviceId: selectedService.id,
    quantity,
    unit: selectedService.unit,
    materialSek: material,
    hourlySek: selectedService.base_price_sek,
    rotEligible: selectedService.rot_eligible
  }, selectedService.base_price_sek) : null;

  const handleGeneratePdf = async () => {
    if (!estimate || !selectedService) return;
    
    setIsGenerating(true);
    try {
      const pdfUrl = await generatePdf({
        service: selectedService,
        estimate,
        quantity,
        material
      });
      
      window.open(pdfUrl, '_blank');
      toast({
        title: "PDF skapad!",
        description: "Öppnar offerten i nytt fönster"
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Fel vid PDF-generering",
        description: "Försök igen eller kontakta support",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!estimate || !email || !selectedService) {
      toast({
        title: "Saknas information",
        description: "Fyll i e-postadress",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const pdfUrl = await generatePdf({
        service: selectedService,
        estimate,
        quantity,
        material
      });
      
      await sendQuoteEmail(email, pdfUrl, {
        service: selectedService,
        estimate
      });
      
      toast({
        title: "Offert skickad!",
        description: `PDF-offert skickad till ${email}`
      });
      setEmail("");
    } catch (error) {
      console.error("Email send error:", error);
      toast({
        title: "Fel vid e-postsändning",
        description: "Försök igen eller kontakta support",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Offert
        </CardTitle>
        <CardDescription>
          Beräkna preliminär offert med ROT-avdrag
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service">Tjänst</Label>
          <Select
            value={selectedService?.id}
            onValueChange={(id) => {
              const service = services.find(s => s.id === id);
              setSelectedService(service);
            }}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Välj tjänst" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {formatPrice(service.base_price_sek)}/{service.unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Omfattning ({selectedService?.unit || 'timmar'})
          </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            step="0.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material (kr)</Label>
          <Input
            id="material"
            type="number"
            value={material}
            onChange={(e) => setMaterial(Number(e.target.value))}
            min="0"
          />
        </div>

        {estimate && (
          <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Arbete:</span>
              <span className="font-medium">{formatPrice(estimate.workSek)}</span>
            </div>
            <div className="flex justify-between">
              <span>Material:</span>
              <span className="font-medium">{formatPrice(estimate.materialSek)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delsumma:</span>
              <span>{formatPrice(estimate.subtotalSek)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Moms (25%):</span>
              <span>{formatPrice(estimate.vatSek)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Totalt inkl. moms:</span>
              <span className="font-semibold">{formatPrice(estimate.totalInclVatSek)}</span>
            </div>
            {estimate.rotEligible && estimate.rotDeductionSek > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Indikativt ROT-avdrag (30% på arbete):</span>
                  <span className="font-medium">−{formatPrice(estimate.rotDeductionSek)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg">
                  <span className="font-semibold">Efter ROT:</span>
                  <span className="font-bold text-primary">{formatPrice(estimate.totalAfterRotSek)}</span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Button 
            onClick={handleGeneratePdf}
            disabled={!estimate || isGenerating}
            className="w-full"
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? "Genererar..." : "Skapa PDF"}
          </Button>

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="E-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleSendEmail}
              disabled={!estimate || !email || isGenerating}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          OBS: Detta är en preliminär beräkning. Slutligt pris kan variera beroende på projektets komplexitet.
          ROT-avdraget bedöms slutligt av Skatteverket.
        </p>
      </CardContent>
    </Card>
  );
}
