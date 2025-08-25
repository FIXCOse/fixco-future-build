import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { TRUST_CHIPS_BASE, TRUST_CHIPS_EXTENDED, RATING_CHIP, LOCATION_CHIP, type TrustChip } from "@/data/trustChips.config";

interface TrustChipsProps {
  variant?: 'home' | 'services' | 'category' | 'minimal';
  className?: string;
  maxVisible?: number;
  includeRating?: boolean;
  includeLocation?: boolean;
  showAll?: boolean;
}

const TrustChips = ({ 
  variant = 'services', 
  className = "",
  maxVisible = 6,
  includeRating = false,
  includeLocation = false,
  showAll: forceShowAll = false
}: TrustChipsProps) => {
  const [showAll, setShowAll] = useState(forceShowAll);

  // Select chip set based on variant - if showAll is true, always use extended set
  let chips: TrustChip[] = [];
  
  if (showAll || forceShowAll) {
    chips = [...TRUST_CHIPS_EXTENDED];
  } else {
    switch (variant) {
      case 'home':
        chips = [...TRUST_CHIPS_EXTENDED];
        break;
      case 'services':
      case 'category':
        chips = [...TRUST_CHIPS_EXTENDED];
        break;
      case 'minimal':
        chips = [...TRUST_CHIPS_BASE];
        break;
      default:
        chips = [...TRUST_CHIPS_BASE];
    }
  }

  // Add rating and location if requested
  if (includeRating) chips.push(RATING_CHIP);
  if (includeLocation) chips.push(LOCATION_CHIP);

  const visibleChips = (showAll || forceShowAll) ? chips : chips.slice(0, maxVisible);
  const hasMoreChips = chips.length > maxVisible && !forceShowAll && !showAll;
  const remainingCount = chips.length - maxVisible;

  const ChipComponent = ({ chip }: { chip: TrustChip }) => {
    const IconComponent = chip.icon;
    
    const chipContent = (
      <Badge 
        variant="secondary" 
        className={`flex items-center space-x-2 px-4 py-3 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group text-white ${chip.backgroundGradient || 'bg-gradient-to-r from-gray-600 to-gray-700'}`}
      >
        <IconComponent className="h-4 w-4 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
        <span className="font-medium text-sm drop-shadow-sm">{chip.label}</span>
      </Badge>
    );

    if (chip.link) {
      return (
        <Link to={chip.link} className="inline-block">
          {chip.tooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {chipContent}
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{chip.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : chipContent}
        </Link>
      );
    }

    if (chip.tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {chipContent}
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{chip.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return chipContent;
  };

  // When showAll is true, use unified layout for all variants
  if (showAll || forceShowAll || variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`} style={{ minHeight: '80px' }}>
        {visibleChips.map((chip) => (
          <ChipComponent key={chip.id} chip={chip} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-3">
        {visibleChips.map((chip) => (
          <ChipComponent key={chip.id} chip={chip} />
        ))}
        
        {hasMoreChips && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>+{remainingCount} fler</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="center">
              <div className="grid grid-cols-2 gap-2">
                {chips.slice(maxVisible).map((chip) => (
                  <ChipComponent key={chip.id} chip={chip} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Mobile Layout - Wrapped */}
      <div className="md:hidden flex flex-wrap items-center justify-center gap-3 px-4 py-2">
        {chips.map((chip) => (
          <ChipComponent key={chip.id} chip={chip} />
        ))}
      </div>
    </div>
  );
};

export default TrustChips;