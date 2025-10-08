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
import { useCopy } from "@/copy/CopyProvider";

export function QuotePreview() {
  const { t } = useCopy();
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
        title: t('ai.quote_pdf_created'),
        description: t('ai.quote_pdf_desc')
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: t('ai.quote_pdf_error'),
        description: t('ai.quote_pdf_error_desc'),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!estimate || !email || !selectedService) {
      toast({
        title: t('ai.quote_missing_email'),
        description: t('ai.quote_fill_email'),
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
        title: t('ai.quote_sent'),
        description: `${t('ai.quote_sent_desc')} ${email}`
      });
      setEmail("");
    } catch (error) {
      console.error("Email send error:", error);
      toast({
        title: t('ai.quote_email_error'),
        description: t('ai.quote_email_error_desc'),
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
          {t('ai.quote_title')}
        </CardTitle>
        <CardDescription>
          {t('ai.quote_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service">{t('ai.quote_service')}</Label>
          <Select
            value={selectedService?.id}
            onValueChange={(id) => {
              const service = services.find(s => s.id === id);
              setSelectedService(service);
            }}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder={t('ai.quote_choose_service')} />
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
            {t('ai.quote_quantity')} ({selectedService?.unit || 'timmar'})
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
          <Label htmlFor="material">{t('ai.quote_material')}</Label>
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
              <span>{t('ai.quote_work')}</span>
              <span className="font-medium">{formatPrice(estimate.workSek)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('ai.quote_material')}:</span>
              <span className="font-medium">{formatPrice(estimate.materialSek)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t('ai.quote_subtotal')}</span>
              <span>{formatPrice(estimate.subtotalSek)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t('ai.quote_vat')}</span>
              <span>{formatPrice(estimate.vatSek)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>{t('ai.quote_total_incl_vat')}</span>
              <span className="font-semibold">{formatPrice(estimate.totalInclVatSek)}</span>
            </div>
            {estimate.rotEligible && estimate.rotDeductionSek > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>{t('ai.quote_rot_deduction')}</span>
                  <span className="font-medium">−{formatPrice(estimate.rotDeductionSek)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg">
                  <span className="font-semibold">{t('ai.quote_after_rot')}</span>
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
            {isGenerating ? t('ai.quote_generating') : t('ai.quote_create_pdf')}
          </Button>

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder={t('ai.quote_email_placeholder')}
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
          {t('ai.quote_disclaimer')}
        </p>
      </CardContent>
    </Card>
  );
}
