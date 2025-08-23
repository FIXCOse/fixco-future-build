import { usePriceStore, PriceMode } from '@/stores/priceStore';
import { cn } from '@/lib/utils';

interface GlobalPricingToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const GlobalPricingToggle = ({ className = "", size = 'md' }: GlobalPricingToggleProps) => {
  const { mode, setMode } = usePriceStore();

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const options: { value: PriceMode; label: string; description: string }[] = [
    {
      value: 'all',
      label: 'Alla',
      description: 'Visa alla tjänster'
    },
    {
      value: 'rot',
      label: 'ROT',
      description: 'Endast ROT-berättigade tjänster'
    },
    {
      value: 'rut',
      label: 'RUT', 
      description: 'Endast RUT-berättigade tjänster'
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle Buttons */}
      <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setMode(option.value)}
            className={cn(
              "flex-1 rounded-md transition-all duration-200 font-medium",
              sizeClasses[size],
              mode === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {options.find(opt => opt.value === mode)?.description}
        </p>
        {mode !== 'all' && (
          <p className="text-xs text-muted-foreground mt-1">
            Vi sköter administrationen och drar av direkt på fakturan
          </p>
        )}
      </div>
    </div>
  );
};

export default GlobalPricingToggle;