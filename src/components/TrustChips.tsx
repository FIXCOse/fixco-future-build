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
}

const TrustChips = ({ 
  variant = 'services', 
  className = "",
  maxVisible = 6,
  includeRating = false,
  includeLocation = false
}: TrustChipsProps) => {
  console.log("TrustChips component rendering with variant:", variant);
  const [showAll, setShowAll] = useState(false);

  // Select chip set based on variant
  let chips: TrustChip[] = [];
  
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

  // Add rating and location if requested
  if (includeRating) chips.push(RATING_CHIP);
  if (includeLocation) chips.push(LOCATION_CHIP);

  const visibleChips = showAll ? chips : chips.slice(0, maxVisible);
  const hasMoreChips = chips.length > maxVisible;
  const remainingCount = chips.length - maxVisible;

  const ChipComponent = ({ chip }: { chip: TrustChip }) => {
    const IconComponent = chip.icon;
    
    const chipContent = (
      <Badge 
        variant="secondary" 
        className="flex items-center space-x-2 px-3 py-2 bg-background/80 backdrop-blur border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
      >
        <IconComponent className={`h-4 w-4 ${chip.color} group-hover:scale-110 transition-transform duration-200`} aria-hidden="true" />
        <span className="font-medium text-sm">{chip.label}</span>
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

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
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
        
        {hasMoreChips && !showAll && (
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

      {/* Mobile Layout - Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center space-x-3 pb-2 min-w-max px-4">
          {chips.map((chip) => (
            <ChipComponent key={chip.id} chip={chip} />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TrustChips;