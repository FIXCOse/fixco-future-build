import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  TRUST_CHIPS_BASE, 
  TRUST_CHIPS_EXTENDED, 
  RATING_CHIP, 
  LOCATION_CHIP,
  getTrustChipConfig,
  RATING_CONFIG,
  LOCATION_CONFIG,
  type TrustChipConfig 
} from "@/data/trustChips.config";
import { useCopy } from "@/copy/CopyProvider";
import type { CopyKey } from '@/copy/keys';

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
  const { t } = useCopy();

  // Select chip set based on variant - if showAll is true, always use extended set
  let chips: CopyKey[] = [];
  
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

  const ChipComponent = ({ chip }: { chip: CopyKey }) => {
    const config = getTrustChipConfig(chip);
    const IconComponent = config.icon;
    
    const chipContent = (
        <Badge 
          variant="secondary" 
          className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group text-white text-xs sm:text-sm ${config.backgroundGradient || 'bg-gradient-to-r from-gray-600 to-gray-700'}`}
        >
        <IconComponent className="h-4 w-4 shrink-0 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
        <span className="font-medium drop-shadow-sm">{t(chip)}</span>
      </Badge>
    );

    // Handle links with language awareness
    if (config.link) {
      const isEnglish = window.location.pathname.startsWith('/en');
      let localizedLink = config.link;
      
      // Make ROT/RUT links language-aware
      if (config.link === '/rot') {
        localizedLink = isEnglish ? '/en/rot' : '/rot';
      } else if (config.link === '/rut') {
        localizedLink = isEnglish ? '/en/rut' : '/rut';
      } else if (config.link.startsWith('/tjanster') && isEnglish) {
        localizedLink = '/en/services' + config.link.substring('/tjanster'.length);
      }
      
      return (
        <Link to={localizedLink} className="transition-transform hover:scale-105 duration-200">
          {chipContent}
        </Link>
      );
    }

    return chipContent;
  };

  // When showAll is true, use unified layout for all variants
  if (showAll || forceShowAll || variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 px-4 sm:gap-3 sm:px-0 ${className}`}>
        {visibleChips.map((chip) => (
          <ChipComponent key={chip} chip={chip} />
        ))}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Unified cloud layout for all screens */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-4 sm:gap-3 sm:px-0">
        {visibleChips.map((chip) => (
          <ChipComponent key={chip} chip={chip} />
        ))}
        
        {hasMoreChips && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="inline-flex items-center gap-1 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                <span>+{remainingCount} {t('chips.more')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {chips.slice(maxVisible).map((chip) => (
                  <ChipComponent key={chip} chip={chip} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default TrustChips;