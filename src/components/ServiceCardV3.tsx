import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePriceStore, PriceMode } from "@/stores/priceStore";
import { useCopy } from "@/copy/CopyProvider";
import { type CopyKey } from "@/copy/keys";
import { useActionWizard } from "@/stores/actionWizardStore";
import { GradientText } from "@/components/v2/GradientText";

const VAT_RATE = 0.25;
const ROT_RATE = 0.50;
const RUT_RATE = 0.50;

interface ServiceCardV3Props {
  title: string;
  category: string;
  description: string;
  pricingType: 'hourly' | 'fixed' | 'quote';
  priceIncl: number;
  eligible: { rot: boolean; rut: boolean };
  onBook?: () => void;
  onQuote?: () => void;
  serviceSlug?: string;
  serviceId?: string;
  className?: string;
  showFullWidth?: boolean;
}

const formatMoney = (amount: number) => {
  return Math.round(amount).toLocaleString('sv-SE');
};

const ServiceCardV3 = ({ 
  title,
  category,
  description,
  pricingType,
  priceIncl,
  eligible,
  onBook,
  onQuote,
  serviceSlug,
  serviceId,
  className = "",
  showFullWidth = false
}: ServiceCardV3Props) => {
  const { mode } = usePriceStore();
  const { t } = useCopy();
  const actionWizard = useActionWizard();

  const translatedTitle = title;
  const translatedDescription = description;

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("[ServiceCardV3] Opening ActionWizard for booking");
    console.log("[ServiceCardV3] serviceId:", serviceId);
    console.log("[ServiceCardV3] serviceName:", translatedTitle);
    
    if (onBook) {
      onBook();
    } else {
      actionWizard.open({
        mode: "book",
        serviceId: serviceId,
        serviceName: translatedTitle,
        defaults: {
          hourlyRate: pricingType === 'hourly' ? priceIncl : undefined,
          priceType: pricingType
        }
      });
    }
  };

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("[ServiceCardV3] Opening ActionWizard for quote");
    console.log("[ServiceCardV3] serviceId:", serviceId);
    console.log("[ServiceCardV3] serviceName:", translatedTitle);
    
    if (onQuote) {
      onQuote();
    } else {
      actionWizard.open({
        mode: "quote",
        serviceId: serviceId,
        serviceName: translatedTitle,
        defaults: {
          hourlyRate: pricingType === 'hourly' ? priceIncl : undefined,
          priceType: pricingType
        }
      });
    }
  };

  const priceExcl = priceIncl / (1 + VAT_RATE);
  const afterROT = eligible.rot ? priceIncl - (priceExcl * ROT_RATE) : null;
  const afterRUT = eligible.rut ? priceIncl - (priceExcl * RUT_RATE) : null;

  let displayPrice = priceIncl;
  let savingsAmount = 0;

  if (mode === 'rot' && afterROT !== null) {
    displayPrice = afterROT;
    savingsAmount = priceIncl - afterROT;
  } else if (mode === 'rut' && afterRUT !== null) {
    displayPrice = afterRUT;
    savingsAmount = priceIncl - afterRUT;
  }

  if (pricingType === 'quote') {
    return (
      <div className={cn(
        "group relative bg-gradient-to-br from-card/50 to-card border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6 sm:p-8 flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {translatedTitle}
              </h3>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {category}
              </p>
            </div>
            {(eligible.rot || eligible.rut) && (
              <div className="flex gap-2 flex-wrap justify-end">
                {eligible.rot && (
                  <Badge variant="default" className="bg-accent text-accent-foreground font-semibold px-3 py-1">
                    ROT
                  </Badge>
                )}
                {eligible.rut && (
                  <Badge variant="default" className="bg-secondary text-secondary-foreground font-semibold px-3 py-1">
                    RUT
                  </Badge>
                )}
              </div>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
            {translatedDescription}
          </p>

          <div className="flex flex-col gap-4 mt-auto">
            <Button
              onClick={handleQuoteClick}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
            >
              {t('service.request_quote' as CopyKey)}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Vi kontaktar dig inom 24 timmar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group relative bg-gradient-to-br from-card/50 to-card border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 sm:p-8 flex flex-col h-full">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {translatedTitle}
            </h3>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {category}
            </p>
          </div>
          {(eligible.rot || eligible.rut) && (
            <div className="flex gap-2 flex-wrap justify-end">
              {eligible.rot && (
                <Badge variant="default" className="bg-accent text-accent-foreground font-semibold px-3 py-1">
                  ROT
                </Badge>
              )}
              {eligible.rut && (
                <Badge variant="default" className="bg-secondary text-secondary-foreground font-semibold px-3 py-1">
                  RUT
                </Badge>
              )}
            </div>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
          {translatedDescription}
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {mode === 'all' && 'Pris inkl. moms'}
                {mode === 'rot' && eligible.rot && 'Efter ROT-avdrag'}
                {mode === 'rut' && eligible.rut && 'Efter RUT-avdrag'}
                {mode === 'rot' && !eligible.rot && 'Pris inkl. moms'}
                {mode === 'rut' && !eligible.rut && 'Pris inkl. moms'}
              </p>
              <div className="flex items-baseline gap-2">
                <GradientText className="text-4xl sm:text-5xl font-bold">
                  {formatMoney(displayPrice)}
                </GradientText>
                <span className="text-xl text-muted-foreground font-medium">
                  kr/h
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 space-y-2">
            {mode === 'all' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exkl. moms</span>
                <span className="font-medium text-foreground">{formatMoney(priceExcl)} kr/h</span>
              </div>
            )}
            
            {mode !== 'all' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ordinarie pris</span>
                  <span className="font-medium text-foreground line-through opacity-60">
                    {formatMoney(priceIncl)} kr/h
                  </span>
                </div>
                {savingsAmount > 0 && (
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-green-600 dark:text-green-400">Du sparar</span>
                    <span className="text-green-600 dark:text-green-400">
                      {formatMoney(savingsAmount)} kr/h
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Button
          onClick={handleBookingClick}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
        >
          {t('service.book_now' as CopyKey)}
        </Button>
      </div>
    </div>
  );
};

export default ServiceCardV3;
