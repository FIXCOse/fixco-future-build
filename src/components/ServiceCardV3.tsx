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
      <div className={cn(
        "border border-card-border bg-card-bg rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1",
        showFullWidth ? "w-full" : "max-w-[420px]",
        className
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg md:text-xl font-semibold text-foreground pr-2">
            {title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            {eligible.rot && (
              <Badge className="text-xs rounded-full bg-primary text-primary-foreground">
                ROT
              </Badge>
            )}
            {eligible.rut && (
              <Badge className="text-xs rounded-full bg-primary text-primary-foreground">
                RUT
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Meta info */}
        <div className="text-xs text-muted-foreground mb-6">
          Kategori: {category}
        </div>

        {/* Price block */}
        <div className="space-y-1 mb-6">
          <div className="text-lg md:text-xl font-semibold text-primary">
            Begär offert
          </div>
          <div className="text-xs text-muted-foreground">
            Prisuppgift efter besiktning
          </div>
        </div>

        {/* CTA */}
        <Button 
          className="w-full rounded-full" 
          variant="default"
          onClick={onQuote}
        >
          Begär offert
        </Button>
      </div>
    );
  }

  // Calculate prices
  const priceExcl = priceIncl / (1 + VAT_RATE);
  const priceRotIncl = eligible.rot ? priceIncl * (1 - ROT_RATE) : priceIncl;
  const priceRutIncl = eligible.rut ? priceIncl * (1 - RUT_RATE) : priceIncl;
  const savingsRot = eligible.rot ? priceIncl - priceRotIncl : 0;
  const savingsRut = eligible.rut ? priceIncl - priceRutIncl : 0;

  // Determine primary price and discounted state
  let primaryPrice = priceIncl;
  let originalPrice = null;
  let savingsText = "";
  let isDiscounted = false;
  
  // Show purple style for ALL services in all modes
  if (mode === 'rot' && eligible.rot) {
    primaryPrice = priceRotIncl;
    originalPrice = priceIncl;
    savingsText = `Sparar ${formatMoney(savingsRot)}${pricingType === 'hourly' ? ' kr/h' : ' kr'} med ROT`;
    isDiscounted = true;
  } else if (mode === 'rut' && eligible.rut) {
    primaryPrice = priceRutIncl;
    originalPrice = priceIncl;
    savingsText = `Sparar ${formatMoney(savingsRut)}${pricingType === 'hourly' ? ' kr' : ' kr'} med RUT`;
    isDiscounted = true;
  } else if (mode === 'all') {
    // Always show purple style in 'all' mode for ALL services
    isDiscounted = true;
    if (eligible.rot && eligible.rut) {
      // Show both savings if applicable
      const rotSavingsText = `ROT: ${formatMoney(savingsRot)}${pricingType === 'hourly' ? ' kr/h' : ' kr'}`;
      const rutSavingsText = `RUT: ${formatMoney(savingsRut)}${pricingType === 'hourly' ? ' kr/h' : ' kr'}`;
      savingsText = `${rotSavingsText} • ${rutSavingsText}`;
    } else if (eligible.rot) {
      savingsText = `ROT: ${formatMoney(savingsRot)}${pricingType === 'hourly' ? ' kr/h' : ' kr'}`;
    } else if (eligible.rut) {
      savingsText = `RUT: ${formatMoney(savingsRut)}${pricingType === 'hourly' ? ' kr/h' : ' kr'}`;
    }
  }

  const unit = pricingType === 'hourly' ? ' kr/h' : ' kr';
  const primaryDisplay = `${formatMoney(primaryPrice)}${unit} inkl. moms`;
  const secondaryDisplay = `${formatMoney(priceExcl)}${unit} exkl. moms`;

  // Determine CTA type
  const ctaType = pricingType === 'hourly' ? 'book' : 'quote';

  return (
    <div className={cn(
      "border border-card-border bg-card-bg rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1",
      showFullWidth ? "w-full" : "max-w-[420px]",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg md:text-xl font-semibold text-foreground pr-2">
          {title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          {mode === 'rot' && eligible.rot && (
            <Badge className="text-xs rounded-full bg-primary text-primary-foreground">
              ROT
            </Badge>
          )}
          {mode === 'rut' && eligible.rut && (
            <Badge className="text-xs rounded-full bg-primary text-primary-foreground">
              RUT
            </Badge>
          )}
          {mode === 'all' && (
            <>
              {eligible.rot && (
                <Badge className="text-xs rounded-full bg-primary text-primary-foreground">
                  ROT
                </Badge>
              )}
              {eligible.rut && (
                <Badge className="text-xs rounded-full bg-primary text-primary-foreground">
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

      {/* Meta info */}
      <div className="text-xs text-muted-foreground mb-6">
        Kategori: {category}
      </div>

      {/* Price block */}
      <div className="space-y-1 mb-2">
        {/* Original price (strikethrough when discounted) */}
        {originalPrice && (
          <div className="text-sm text-muted-foreground line-through">
            Ordinarie: {formatMoney(originalPrice)}{unit}
          </div>
        )}
        
        {/* Main price */}
        <div className={cn(
          "text-lg md:text-xl font-semibold",
          isDiscounted ? "text-primary" : "text-foreground"
        )}>
          {primaryDisplay}
        </div>
        
        {/* Excl. VAT price */}
        <div className="text-xs text-muted-foreground">
          {secondaryDisplay}
        </div>
      </div>

      {/* Savings text (text-only, no chip) */}
      {savingsText && (
        <div className="text-xs text-good-text mb-6">
          {savingsText}
        </div>
      )}

      {/* CTA */}
      <Button 
        className="w-full rounded-full" 
        variant="default"
        onClick={ctaType === 'book' ? onBook : onQuote}
      >
        {ctaType === 'book' ? 'Boka nu' : 'Begär offert'}
      </Button>
    </div>
  );
};

export default ServiceCardV3;