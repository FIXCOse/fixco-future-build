import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePriceStore, PriceMode } from "@/stores/priceStore";

const VAT_RATE = 0.25;
const ROT_RATE = 0.50;
const RUT_RATE = 0.50;

interface PriceSummaryProps {
  priceIncl: number;
  pricingType: 'hourly' | 'fixed' | 'quote';
  eligible: { rot: boolean; rut: boolean };
  className?: string;
  showChips?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const formatMoney = (amount: number) => {
  return Math.round(amount).toLocaleString('sv-SE');
};

const PriceSummary = ({ 
  priceIncl, 
  pricingType, 
  eligible, 
  className = "",
  showChips = true,
  size = 'md'
}: PriceSummaryProps) => {
  const { mode } = usePriceStore();
  
  if (pricingType === 'quote') {
    return (
      <div className={cn("space-y-1", className)}>
        <div className={cn(
          "font-bold",
          size === 'sm' && "text-base",
          size === 'md' && "text-lg", 
          size === 'lg' && "text-xl"
        )}>
          Begär offert
        </div>
        <div className="text-xs text-muted-foreground">
          Prisuppgift efter besiktning
        </div>
      </div>
    );
  }

  // Calculate prices
  const priceExcl = priceIncl / (1 + VAT_RATE);
  const priceRotIncl = eligible.rot ? priceIncl * (1 - ROT_RATE) : priceIncl;
  const priceRutIncl = eligible.rut ? priceIncl * (1 - RUT_RATE) : priceIncl;
  const savingsRot = eligible.rot ? priceIncl - priceRotIncl : 0;
  const savingsRut = eligible.rut ? priceIncl - priceRutIncl : 0;

  // Determine primary price and unit
  let primaryPrice = priceIncl;
  let isDiscounted = false;
  
  if (mode === 'rot' && eligible.rot) {
    primaryPrice = priceRotIncl;
    isDiscounted = true;
  } else if (mode === 'rut' && eligible.rut) {
    primaryPrice = priceRutIncl;
    isDiscounted = true;
  }

  const unit = pricingType === 'hourly' ? ' kr/h' : ' kr';
  const primaryDisplay = `${formatMoney(primaryPrice)}${unit} inkl. moms`;
  const secondaryDisplay = `${formatMoney(priceExcl)}${unit} exkl. moms`;

  return (
    <div className={cn("space-y-1", className)}>
      {/* Primary price line */}
      <div className={cn(
        "font-semibold",
        size === 'sm' && "text-base",
        size === 'md' && "text-lg", 
        size === 'lg' && "text-xl",
        isDiscounted && "text-primary"
      )}>
        {primaryDisplay}
      </div>
      
      {/* Secondary price line (excl. VAT) */}
      <div className="text-xs text-muted-foreground">
        {secondaryDisplay}
      </div>

      {/* Chips and savings */}
      {showChips && (
        <div className="flex flex-wrap gap-1 mt-2">
          {/* ROT chip */}
          {mode === 'rot' && eligible.rot && savingsRot > 0 && (
            <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Sparar {formatMoney(savingsRot)} kr med ROT
            </Badge>
          )}
          
          {/* RUT chip */}
          {mode === 'rut' && eligible.rut && savingsRut > 0 && (
            <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Sparar {formatMoney(savingsRut)} kr med RUT
            </Badge>
          )}
          
          {/* Show chips in 'all' mode */}
          {mode === 'all' && (
            <>
              {eligible.rot && (
                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  ROT {savingsRot > 0 ? `-${formatMoney(savingsRot)} kr` : ''}
                </Badge>
              )}
              {eligible.rut && (
                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  RUT {savingsRut > 0 ? `-${formatMoney(savingsRut)} kr` : ''}
                </Badge>
              )}
            </>
          )}
          
          {/* Not eligible chips */}
          {mode === 'rot' && !eligible.rot && (
            <Badge className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Ej ROT
            </Badge>
          )}
          
          {mode === 'rut' && !eligible.rut && (
            <Badge className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Ej RUT
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceSummary;