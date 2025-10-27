import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePriceStore, PriceMode } from "@/stores/priceStore";
import { useCopy } from "@/copy/CopyProvider";
import { type CopyKey } from "@/copy/keys";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";

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

  // Use database data directly - no need for copy system lookup for services
  const translatedTitle = title;
  const translatedDescription = description;

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("========== BOOKING BUTTON CLICKED ==========");
    const slug = serviceSlug || serviceId || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    console.log("[ServiceCard] handleBookingClick called");
    console.log("[ServiceCard] - serviceSlug:", serviceSlug);
    console.log("[ServiceCard] - serviceId:", serviceId);
    console.log("[ServiceCard] - computed slug:", slug);
    console.log("[ServiceCard] - title:", translatedTitle);
    console.log("[ServiceCard] - onBook exists?", !!onBook);
    
    if (onBook) {
      console.log("[ServiceCard] Calling onBook callback");
      onBook();
    } else {
      console.log("[ServiceCard] NO onBook callback - dispatching custom event");
      console.log("[ServiceCard] Event detail:", { slug, prefill: { service_name: translatedTitle, base_price: priceIncl } });
      
      // Dispatch the custom event
      const event = new CustomEvent("openServiceRequestModal", {
        detail: {
          serviceSlug: slug,
          prefill: {
            service_name: translatedTitle,
            base_price: priceIncl
          }
        }
      });
      
      console.log("[ServiceCard] Dispatching event:", event);
      window.dispatchEvent(event);
      console.log("[ServiceCard] Event dispatched successfully!");
      
      // Also call the function directly as backup
      openServiceRequestModal({
        serviceSlug: slug,
        prefill: {
          service_name: translatedTitle,
          base_price: priceIncl
        }
      });
      console.log("[ServiceCard] Direct function call completed!");
    }
  };

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("========== QUOTE BUTTON CLICKED ==========");
    const slug = serviceSlug || serviceId || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    console.log("[ServiceCard] handleQuoteClick called");
    console.log("[ServiceCard] - serviceSlug:", serviceSlug);
    console.log("[ServiceCard] - serviceId:", serviceId);
    console.log("[ServiceCard] - computed slug:", slug);
    console.log("[ServiceCard] - title:", translatedTitle);
    console.log("[ServiceCard] - onQuote exists?", !!onQuote);
    
    if (onQuote) {
      console.log("[ServiceCard] Calling onQuote callback");
      onQuote();
    } else {
      console.log("[ServiceCard] NO onQuote callback - dispatching custom event");
      console.log("[ServiceCard] Event detail:", { slug, prefill: { service_name: translatedTitle } });
      
      // Dispatch the custom event
      const event = new CustomEvent("openServiceRequestModal", {
        detail: {
          serviceSlug: slug,
          prefill: {
            service_name: translatedTitle
          }
        }
      });
      
      console.log("[ServiceCard] Dispatching event:", event);
      window.dispatchEvent(event);
      console.log("[ServiceCard] Event dispatched successfully!");
      
      // Also call the function directly as backup
      openServiceRequestModal({
        serviceSlug: slug,
        prefill: {
          service_name: translatedTitle
        }
      });
      console.log("[ServiceCard] Direct function call completed!");
    }
  };
  
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
          {translatedTitle}
        </h3>
          <div className="flex gap-1 flex-shrink-0">
            {eligible.rot && (
              <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
                ROT
              </Badge>
            )}
            {eligible.rut && (
              <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
                RUT
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {translatedDescription}
        </p>

        {/* Price block */}
        <div className="space-y-1 mb-6">
          <div className="text-lg font-semibold text-primary">
            {t('cta.request_quote')}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('services.quote_after_inspection')}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
        <Button 
          type="button"
          className="w-full rounded-full py-2.5 font-medium hover:opacity-90" 
          variant="default"
          onClick={handleQuoteClick}
          data-wizard="quote"
          data-service-id={serviceSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}
          data-service-name={translatedTitle}
        >
            {t('cta.request_quote')}
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
    const deductionKey = deductionType === 'ROT' ? 'price.with_rot_discount' : 'price.with_rut_discount';
    return `${t('services.savings')} ${formatMoney(savings)} kr${suffix} ${t(deductionKey)}`;
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
          {translatedTitle}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          {mode === 'rot' && eligible.rot && (
            <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
              ROT
            </Badge>
          )}
          {mode === 'rut' && eligible.rut && (
            <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
              RUT
            </Badge>
          )}
          {mode === 'all' && (
            <>
              {eligible.rot && eligible.rut ? (
                <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
                  ROT • RUT
                </Badge>
              ) : (
                <>
                  {eligible.rot && (
                    <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
                      ROT
                    </Badge>
                  )}
                  {eligible.rut && (
                    <Badge className="text-xs rounded-full bg-gradient-rainbow text-white px-2 py-1">
                      RUT
                    </Badge>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {translatedDescription}
      </p>

      {/* Price block */}
      <div className="space-y-1 mb-3">
        {/* Original price (strikethrough when discounted) */}
        {originalPrice && (
          <div className="text-[13px] text-muted-foreground line-through">
            {t('services.ordinary_price')} {formatMoney(originalPrice)} kr{unit}
          </div>
        )}
        
        {/* Main price */}
        <div className={cn(
          "text-lg font-semibold",
          isDiscounted ? "gradient-rainbow" : "text-foreground"
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
          type="button"
          className="w-full rounded-full py-2.5 font-medium hover:opacity-90" 
          variant="default"
          onClick={ctaType === 'book' ? handleBookingClick : handleQuoteClick}
          data-wizard={ctaType}
          data-service-id={serviceSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}
          data-service-name={translatedTitle}
        >
          {ctaType === 'book' ? t('cta.book_now') : t('cta.request_quote')}
        </Button>
      </div>
    </article>
  );
};

export default ServiceCardV3;