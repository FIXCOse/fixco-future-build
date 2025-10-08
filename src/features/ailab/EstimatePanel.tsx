import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Send } from 'lucide-react';
import { useCopy } from '@/copy/CopyProvider';
import { formatPrice, EstimateResult } from '@/features/ai/tools/estimateQuote';

interface EstimatePanelProps {
  estimate: EstimateResult | null;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onContactInfoChange: (info: any) => void;
  onSaveLead: () => void;
  generatedImage: string;
}

export function EstimatePanel({
  estimate,
  contactInfo,
  onContactInfoChange,
  onSaveLead,
  generatedImage
}: EstimatePanelProps) {
  const { t } = useCopy();

  return (
    <div className="space-y-6">
      {estimate && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t('ailab.estimate_title')}</CardTitle>
            <CardDescription>{t('ailab.estimate_subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('ailab.labor')}</span>
              <span className="font-medium text-foreground">{formatPrice(estimate.workSek)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('ailab.material')}</span>
              <span className="font-medium text-foreground">{formatPrice(estimate.materialSek)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
              <span>{t('ailab.subtotal')}</span>
              <span>{formatPrice(estimate.subtotalSek)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('ailab.vat')}</span>
              <span>{formatPrice(estimate.vatSek)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 text-foreground">
              <span>{t('ailab.total_incl_vat')}</span>
              <span>{formatPrice(estimate.totalInclVatSek)}</span>
            </div>
            
            {estimate.rotEligible && estimate.rotDeductionSek > 0 && (
              <>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>{t('ailab.rot_deduction')}</span>
                  <span>−{formatPrice(estimate.rotDeductionSek)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 text-primary">
                  <span>{t('ailab.final_price')}</span>
                  <span>{formatPrice(estimate.totalAfterRotSek)}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {t('ailab.rot_info')}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{t('ailab.contact_title')}</CardTitle>
          <CardDescription>{t('ailab.contact_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">{t('ailab.name_label')}</Label>
            <Input
              id="name"
              value={contactInfo.name}
              onChange={(e) => onContactInfoChange({ ...contactInfo, name: e.target.value })}
              placeholder="Ditt namn"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">{t('ailab.email_label')}</Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => onContactInfoChange({ ...contactInfo, email: e.target.value })}
              placeholder="din@email.se"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">{t('ailab.phone_label')}</Label>
            <Input
              id="phone"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => onContactInfoChange({ ...contactInfo, phone: e.target.value })}
              placeholder="070-123 45 67"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">{t('ailab.address_label')}</Label>
            <Input
              id="address"
              value={contactInfo.address}
              onChange={(e) => onContactInfoChange({ ...contactInfo, address: e.target.value })}
              placeholder="Adress, postnr, ort"
            />
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={onSaveLead}
              disabled={!estimate || !generatedImage}
              className="w-full"
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t('ailab.create_pdf')}
            </Button>
            
            <Button
              onClick={onSaveLead}
              disabled={!estimate || !generatedImage || !contactInfo.email}
              variant="outline"
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {t('ailab.send_email')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
