import { usePriceStore, PriceMode } from '@/stores/priceStore';
import { cn } from '@/lib/utils';

interface SegmentedPriceToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SegmentedPriceToggle = ({ className = "", size = 'md' }: SegmentedPriceToggleProps) => {
  const { mode, setMode } = usePriceStore();

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

  const sizeConfig = {
    sm: {
      wrapper: 'h-8 min-w-[220px] p-0.5',
      button: 'h-7 px-3 text-xs min-w-[70px]'
    },
    md: {
      wrapper: 'h-10 min-w-[260px] p-1',
      button: 'h-8 px-4 text-sm min-w-[84px]'
    },
    lg: {
      wrapper: 'h-12 min-w-[300px] p-1.5',
      button: 'h-9 px-6 text-base min-w-[96px]'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Segmented Toggle */}
      <div className={cn(
        "inline-flex items-center rounded-lg bg-muted/50 border border-border select-none",
        config.wrapper
      )}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setMode(option.value)}
            className={cn(
              "flex-1 rounded-md font-medium transition-colors duration-200",
              "border border-transparent box-border leading-tight",
              config.button,
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

export default SegmentedPriceToggle;