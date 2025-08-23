import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePriceStore, PriceMode } from "@/stores/priceStore";

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
  className = "",
  showFullWidth = false
}: ServiceCardV3Props) => {
  const { mode } = usePriceStore();
  
  if (pricingType === 'quote') {
    return (
      <article className={cn(
        "flex flex-col border border-card-border bg-card-bg rounded-2xl p-4 md:p-5 min-h-[320px] transition-all duration-300 hover:shadow-card hover:-translate-y-1",
        showFullWidth ? "w-full" : "max-w-[420px]",
        className
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base md:text-lg font-semibold text-foreground">
            {title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            {eligible.rot && (
              <Badge className="text-xs rounded-full bg-primary text-primary-foreground px-2 py-1">
                ROT
              </Badge>
            )}
            {eligible.rut && (
              <Badge className="text-xs rounded-full bg-primary text-primary-foreground px-2 py-1">
                RUT
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Price block */}
        <div className="space-y-1 mb-6">
          <div className="text-lg font-semibold text-primary">
            Begär offert
          </div>
          <div className="text-xs text-muted-foreground">
            Prisuppgift efter besiktning
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Button 
            className="w-full rounded-full py-2.5 font-medium hover:opacity-90" 
            variant="default"
            onClick={onQuote}
          >
            Begär offert
          </Button>
        </div>
      </article>
    );
  }

  // Calculate prices
  const priceExcl = priceIncl / (1 + VAT_RATE);
  const priceRotIncl = eligible.rot ? priceIncl * (1 - ROT_RATE) : priceIncl;
  const priceRutIncl = eligible.rut ? priceIncl * (1 - RUT_RATE) : priceIncl;
  const savingsRot = eligible.rot ? priceIncl - priceRotIncl : 0;
  const savingsRut = eligible.rut ? priceIncl - priceRutIncl : 0;

  // Helper function for savings text
  const formatSavingsText = (savings: number, deductionType: 'ROT' | 'RUT') => {
    const suffix = pricingType === 'hourly' ? '/h' : '';
    return `Sparar ${formatMoney(savings)} kr${suffix} med ${deductionType}`;
  };

  // Determine primary price and discounted state
  let primaryPrice = priceIncl;
  let originalPrice = null;
  let savingsText = "";
  let isDiscounted = false;
  
  // Show purple style for ALL services in all modes
  if (mode === 'rot' && eligible.rot) {
    primaryPrice = priceRotIncl;
    originalPrice = priceIncl;
    savingsText = formatSavingsText(savingsRot, 'ROT');
    isDiscounted = true;
  } else if (mode === 'rut' && eligible.rut) {
    primaryPrice = priceRutIncl;
    originalPrice = priceIncl;
    savingsText = formatSavingsText(savingsRut, 'RUT');
    isDiscounted = true;
  } else if (mode === 'all') {
    // Always show purple style in 'all' mode for ALL services
    isDiscounted = true;
    if (eligible.rot && eligible.rut) {
      // Show both savings if applicable
      const rotSavingsText = formatSavingsText(savingsRot, 'ROT');
      const rutSavingsText = formatSavingsText(savingsRut, 'RUT');
      savingsText = `${rotSavingsText} • ${rutSavingsText}`;
    } else if (eligible.rot) {
      savingsText = formatSavingsText(savingsRot, 'ROT');
    } else if (eligible.rut) {
      savingsText = formatSavingsText(savingsRut, 'RUT');
    }
  }

  const unit = pricingType === 'hourly' ? '/h' : '';
  const primaryDisplay = `${formatMoney(primaryPrice)} kr${unit} inkl. moms`;
  const secondaryDisplay = `${formatMoney(priceExcl)} kr${unit} exkl. moms`;

  // Determine CTA type
  const ctaType = pricingType === 'hourly' ? 'book' : 'quote';

  return (
    <article className={cn(
      "flex flex-col border border-card-border bg-card-bg rounded-2xl p-4 md:p-5 min-h-[320px] transition-all duration-300 hover:shadow-card hover:-translate-y-1",
      showFullWidth ? "w-full" : "max-w-[420px]",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          {title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          {mode === 'rot' && eligible.rot && (
            <Badge className="text-xs rounded-full bg-primary text-primary-foreground px-2 py-1">
              ROT
            </Badge>
          )}
          {mode === 'rut' && eligible.rut && (
            <Badge className="text-xs rounded-full bg-primary text-primary-foreground px-2 py-1">
              RUT
            </Badge>
          )}
          {mode === 'all' && (
            <>
              {eligible.rot && (
                <Badge className="text-xs rounded-full bg-primary text-primary-foreground px-2 py-1">
                  ROT
                </Badge>
              )}
              {eligible.rut && (
                <Badge className="text-xs rounded-full bg-primary text-primary-foreground px-2 py-1">
                  RUT
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {description}
      </p>

      {/* Price block */}
      <div className="space-y-1 mb-3">
        {/* Original price (strikethrough when discounted) */}
        {originalPrice && (
          <div className="text-[13px] text-muted-foreground line-through">
            Ordinarie: {formatMoney(originalPrice)} kr{unit}
          </div>
        )}
        
        {/* Main price */}
        <div className={cn(
          "text-lg font-semibold",
          isDiscounted ? "text-primary" : "text-foreground"
        )}>
          {primaryDisplay}
        </div>
        
        {/* Excl. VAT price */}
        <div className="text-[12px] text-muted-foreground">
          {secondaryDisplay}
        </div>
      </div>

      {/* Savings text (text-only, no chip) */}
      {savingsText && (
        <div className="text-[12px] font-medium text-good-text mb-4">
          {savingsText}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto">
        <Button 
          className="w-full rounded-full py-2.5 font-medium hover:opacity-90" 
          variant="default"
          onClick={ctaType === 'book' ? onBook : onQuote}
        >
          {ctaType === 'book' ? 'Boka nu' : 'Begär offert'}
        </Button>
      </div>
    </article>
  );
};

export default ServiceCardV3;