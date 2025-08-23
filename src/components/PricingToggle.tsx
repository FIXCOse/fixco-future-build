import { useState } from 'react';
import { cn } from '@/lib/utils';
import useGlobalPricing, { PricingMode } from '@/hooks/useGlobalPricing';

interface PricingToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PricingToggle = ({ className, size = 'md' }: PricingToggleProps) => {
  const { pricingMode, setPricingMode } = useGlobalPricing();
  
  const options: { value: PricingMode; label: string; description: string }[] = [
    { value: 'ordinarie', label: 'Ordinarie', description: 'Inkl. moms' },
    { value: 'rot', label: 'ROT', description: '50% avdrag' },
    { value: 'rut', label: 'RUT', description: '50% avdrag' }
  ];

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  return (
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      {/* Toggle Buttons */}
      <div className="inline-flex rounded-lg border border-border bg-background p-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setPricingMode(option.value)}
            className={cn(
              "relative rounded-md font-medium transition-all duration-200",
              sizeClasses[size],
              pricingMode === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="text-center">
        <p className={cn(
          "font-medium transition-colors duration-200",
          pricingMode === 'ordinarie' && "text-foreground",
          pricingMode === 'rot' && "text-green-600",
          pricingMode === 'rut' && "text-blue-600"
        )}>
          {options.find(o => o.value === pricingMode)?.description}
        </p>
        {pricingMode !== 'ordinarie' && (
          <p className="text-xs text-muted-foreground mt-1">
            {pricingMode === 'rot' ? 'För renovering, el, VVS & snickeri' : 'För städning, trädgård & flytt'}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingToggle;