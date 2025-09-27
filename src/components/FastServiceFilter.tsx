import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, X, SortAsc, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button-premium";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { servicesDataNew, SubService } from "@/data/servicesDataNew";
import { useSearchParams } from "react-router-dom";
import { usePriceStore } from "@/stores/priceStore";
import { cn } from "@/lib/utils";
import SegmentedPriceToggle from "@/components/SegmentedPriceToggle";
import ServiceCardV3 from "@/components/ServiceCardV3";
import { toast } from "sonner";
import { useCopy } from "@/copy/CopyProvider";

// Translation helper for service titles and descriptions
const getServiceTranslation = (serviceId: string, field: 'title' | 'description', locale: string = 'sv') => {
  const translations: { [key: string]: { title: { [locale: string]: string }, description: { [locale: string]: string } } } = {
    'el-1': {
      title: { sv: 'Byta vägguttag', en: 'Replace Wall Outlet' },
      description: { sv: 'Byte av vägguttag till nyare modeller. Antal väljs vid bokning', en: 'Replace wall outlets with newer models. Quantity selected at booking' }
    },
    'el-2': {
      title: { sv: 'Byta strömbrytare och dimmer', en: 'Replace Switch & Dimmer' },
      description: { sv: 'Installation av nya strömbrytare och dimrar. Antal väljs vid bokning', en: 'Installation of new switches and dimmers. Quantity selected at booking' }
    },
    'el-3': {
      title: { sv: 'Installera takarmatur/pendel', en: 'Install Ceiling Fixture/Pendant' },
      description: { sv: 'Montering av takarmaturer och pendellampor. Antal väljs vid bokning', en: 'Installation of ceiling fixtures and pendant lamps. Quantity selected at booking' }
    },
    'el-4': {
      title: { sv: 'Installera spotlights', en: 'Install Spotlights' },
      description: { sv: 'Installation av spotlights i tak. Antal väljs vid bokning (typiskt 0,5-1h per 4-6 st)', en: 'Installation of spotlights in ceiling. Quantity selected at booking (typically 0.5-1h per 4-6 pcs)' }
    },
    'el-5': {
      title: { sv: 'Utebelysning', en: 'Outdoor Lighting' },
      description: { sv: 'Installation av fasad- och trädgårdsbelysning. Typ väljs vid bokning', en: 'Installation of facade and garden lighting. Type selected at booking' }
    },
    'el-6': {
      title: { sv: 'Installera jordfelsbrytare', en: 'Install Ground Fault Breaker' },
      description: { sv: 'Installation av jordfelsbrytare för säkerhet', en: 'Installation of ground fault breakers for safety' }
    },
    'vvs-1': {
      title: { sv: 'Byta blandare', en: 'Replace Faucet' },
      description: { sv: 'Byte av blandare. Rum/typ väljs vid bokning', en: 'Replace faucet. Room/type selected at booking' }
    },
    'vvs-2': {
      title: { sv: 'Byta toalettstol', en: 'Replace Toilet' },
      description: { sv: 'Byte av toalettstol med installation', en: 'Replace toilet with installation' }
    },
    // Add more translations as needed based on most commonly used services
    'snickeri-1': {
      title: { sv: 'Montera köksluckor', en: 'Install Kitchen Doors' },
      description: { sv: 'Installation av köksluckor och lådor', en: 'Installation of kitchen doors and drawers' }
    },
    'montering-1': {
      title: { sv: 'Montera möbler', en: 'Assemble Furniture' },
      description: { sv: 'Montering av alla typer av möbler', en: 'Assembly of all types of furniture' }
    }
  };

  const translation = translations[serviceId];
  if (!translation) {
    // Fallback to original title/description from servicesDataNew if no translation exists
    return null;
  }

  return translation[field][locale] || translation[field]['sv'];
};

interface FastServiceFilterProps {
  onServiceSelect?: (service: SubService) => void;
  className?: string;
}

const FastServiceFilter = ({ onServiceSelect, className = "" }: FastServiceFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode, shouldShowService } = usePriceStore();
  const { t, locale } = useCopy();
  
  // Get initial state from URL and sessionStorage
  const getInitialState = (key: string, defaultValue: string | boolean) => {
    const urlValue = searchParams.get(key);
    const storageValue = sessionStorage.getItem(`fixco-filter-${key}`);
    
    if (urlValue !== null) return urlValue === 'true' ? true : urlValue;
    if (storageValue !== null) return storageValue === 'true' ? true : storageValue;
    return defaultValue;
  };

  const [searchQuery, setSearchQuery] = useState(() => getInitialState('search', '') as string);
  const [selectedCategory, setSelectedCategory] = useState(() => getInitialState('category', 'alla') as string);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedPriceType, setSelectedPriceType] = useState(() => getInitialState('priceType', 'alla') as string);
  const [showROTPrice, setShowROTPrice] = useState(() => getInitialState('rot', true) as boolean);
  const [indoorOutdoor, setIndoorOutdoor] = useState(() => getInitialState('location', 'alla') as string);
  const [sortBy, setSortBy] = useState(() => getInitialState('sort', 'relevans') as string);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDebounced, setSearchDebounced] = useState(searchQuery);

  const ITEMS_PER_PAGE = 12;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get all sub-services with parent info and filter by eligibility
  const allSubServices = useMemo(() => {
    return servicesDataNew.flatMap(service => 
      service.subServices.map(subService => ({
        ...subService,
        parentService: service.title,
        parentSlug: service.slug,
        priceUnit: subService.priceUnit as "kr/h" | "kr" | "från",
        location: subService.location as "inomhus" | "utomhus" | "båda",
        priceType: subService.priceType as "hourly" | "fixed" | "quote",
        // Add translated title and description
        translatedTitle: getServiceTranslation(subService.id, 'title', locale) || subService.title,
        translatedDescription: getServiceTranslation(subService.id, 'description', locale) || subService.description
      }))
    );
  }, [locale]);

  // Filter services based on eligibility and other filters
  const filteredServices = useMemo(() => {
    let filtered = allSubServices;

    // Apply eligibility filter first
    filtered = filtered.filter(service => shouldShowService(service.eligible));

    // Then apply other filters
    filtered = filtered.filter(service => {
      // Search filter
      const matchesSearch = searchDebounced === "" || 
        service.translatedTitle.toLowerCase().includes(searchDebounced.toLowerCase()) ||
        service.translatedDescription.toLowerCase().includes(searchDebounced.toLowerCase()) ||
        service.category.toLowerCase().includes(searchDebounced.toLowerCase()) ||
        service.parentService.toLowerCase().includes(searchDebounced.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === "alla" || service.parentSlug === selectedCategory;
      
      // Sub-category filter
      const matchesSubCategory = selectedSubCategories.length === 0 || 
        selectedSubCategories.includes(service.category);

      // Price type filter
      const matchesPriceType = selectedPriceType === "alla" || service.priceType === selectedPriceType;
      
      // Indoor/outdoor filter
      const matchesLocation = indoorOutdoor === "alla" || 
        service.location === indoorOutdoor || 
        service.location === "båda";

      return matchesSearch && matchesCategory && matchesSubCategory && 
             matchesPriceType && matchesLocation;
    });

    // Sort
    switch (sortBy) {
      case 'pris-låg':
        filtered.sort((a, b) => {
          const priceA = typeof a.basePrice === 'number' ? a.basePrice : parseInt(String(a.basePrice).replace(/[^\d]/g, '')) || 0;
          const priceB = typeof b.basePrice === 'number' ? b.basePrice : parseInt(String(b.basePrice).replace(/[^\d]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'pris-hög':
        filtered.sort((a, b) => {
          const priceA = typeof a.basePrice === 'number' ? a.basePrice : parseInt(String(a.basePrice).replace(/[^\d]/g, '')) || 0;
          const priceB = typeof b.basePrice === 'number' ? b.basePrice : parseInt(String(b.basePrice).replace(/[^\d]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'mest-bokad':
        // Mock popularity sorting - in real app would use booking data
        filtered.sort(() => Math.random() - 0.5);
        break;
      default: // relevans
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [allSubServices, searchDebounced, selectedCategory, selectedSubCategories, 
      selectedPriceType, indoorOutdoor, sortBy, shouldShowService, mode]);

  // Get unique categories for display with translations
  const categories = useMemo(() => {
    return servicesDataNew.map(service => ({
      name: t(`serviceCategories.${service.slug}` as any) || service.title,
      slug: service.slug
    }));
  }, [t]);

  // Get sub-categories for selected category
  const subCategories = useMemo(() => {
    if (selectedCategory === 'alla') return [];
    
    const service = servicesDataNew.find(s => s.slug === selectedCategory);
    if (!service) return [];
    
    const subCats = new Set(service.subServices.map(s => s.category));
    return Array.from(subCats).sort();
  }, [selectedCategory]);

  // Pagination
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  // Update URL and sessionStorage
  const updateStateAndURL = useCallback((updates: Record<string, string | boolean>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === 'alla' || value === false) {
        newParams.delete(key);
        sessionStorage.removeItem(`fixco-filter-${key}`);
      } else {
        newParams.set(key, String(value));
        sessionStorage.setItem(`fixco-filter-${key}`, String(value));
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Update handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategories([]);
    setCurrentPage(1);
    updateStateAndURL({ category, search: searchQuery, priceType: selectedPriceType, 
                      rot: showROTPrice, location: indoorOutdoor, sort: sortBy });
  };

  const handleSubCategoryToggle = (subCat: string) => {
    const newSubCats = selectedSubCategories.includes(subCat)
      ? selectedSubCategories.filter(s => s !== subCat)
      : [...selectedSubCategories, subCat];
    setSelectedSubCategories(newSubCats);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("alla");
    setSelectedSubCategories([]);
    setSelectedPriceType("alla");
    setIndoorOutdoor("alla");
    setSortBy("relevans");
    setCurrentPage(1);
    
    // Clear URL and storage
    setSearchParams({}, { replace: true });
    ['search', 'category', 'priceType', 'location', 'sort'].forEach(key => {
      sessionStorage.removeItem(`fixco-filter-${key}`);
    });
  };

  const activeFiltersCount = [
    searchDebounced !== "",
    selectedCategory !== "alla",
    selectedSubCategories.length > 0,
    selectedPriceType !== "alla",
    indoorOutdoor !== "alla"
  ].filter(Boolean).length;


  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Filter Row - Centered Toggle Layout */}
      <div className="space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('filter.search_placeholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                updateStateAndURL({ search: e.target.value });
              }}
              className="pl-10 pr-4 h-12 text-base"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Uppsala & Stockholm</span>
          </div>
        </div>
        
        {/* Centered Toggle Row */}
        <div className="w-full max-w-[1200px] mx-auto px-2">
          <div className="flex justify-center py-2">
            <SegmentedPriceToggle />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'alla' ? "premium" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange('alla')}
              className="h-8"
            >
              {t('filter.all_services')}
            </Button>
            {categories.map(category => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "premium" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.slug)}
                className="h-8"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Price Type */}
          <Select value={selectedPriceType} onValueChange={(value) => {
            setSelectedPriceType(value);
            setCurrentPage(1);
            updateStateAndURL({ priceType: value });
          }}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Pris" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alla">{t('filter.all_prices')}</SelectItem>
              <SelectItem value="hourly">{t('filter.hourly_rate')}</SelectItem>
              <SelectItem value="fixed">{t('filter.fixed_price')}</SelectItem>
              <SelectItem value="quote">{t('filter.request_quote')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Indoor/Outdoor */}
          <Select value={indoorOutdoor} onValueChange={(value) => {
            setIndoorOutdoor(value);
            setCurrentPage(1);
            updateStateAndURL({ location: value });
          }}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Plats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alla">{t('filter.all_locations')}</SelectItem>
              <SelectItem value="inomhus">{t('filter.indoor')}</SelectItem>
              <SelectItem value="utomhus">{t('filter.outdoor')}</SelectItem>
            </SelectContent>
          </Select>


          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t('filter.clear')} ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Sub-category Chips (shown when category is selected) */}
        {selectedCategory !== 'alla' && subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <span className="text-sm text-muted-foreground mr-2">{t('filter.specialty_areas')}</span>
            {subCategories.map(subCat => (
              <Button
                key={subCat}
                variant={selectedSubCategories.includes(subCat) ? "premium" : "outline"}
                size="sm"
                onClick={() => handleSubCategoryToggle(subCat)}
                className="h-7 text-xs"
              >
                {subCat}
                {selectedSubCategories.includes(subCat) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        )}


        {/* Active Filters Display */}
        {(searchDebounced || selectedSubCategories.length > 0) && (
          <div className="flex flex-wrap gap-2 items-center">
            {searchDebounced && (
              <Badge variant="secondary" className="text-xs">
                {t('filter.searching')} "{searchDebounced}"
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => {
                    setSearchQuery("");
                    updateStateAndURL({ search: "" });
                  }}
                />
              </Badge>
            )}
            {selectedSubCategories.map(subCat => (
              <Badge key={subCat} variant="secondary" className="text-xs">
                {subCat}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleSubCategoryToggle(subCat)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredServices.length} {t('filter.services_found')}
          </h3>
        </div>

        {/* Results Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            {mode !== 'all' ? (
              // Empty state for ROT/RUT filtering
              <div className="max-w-md mx-auto">
                <p className="text-muted-foreground mb-4">
                  {t('filter.no_services_rot_rut')} {mode === 'rot' ? 'ROT' : 'RUT'} med dina nuvarande filter.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => usePriceStore.getState().setMode('all')}
                  className="mb-4"
                >
                  {t('filter.show_all_services')}
                </Button>
                <div className="mt-4">
                  <Button variant="ghost-premium" onClick={clearFilters}>
                    {t('filter.clear_other_filters')}
                  </Button>
                </div>
              </div>
            ) : (
              // General empty state
              <>
                <p className="text-muted-foreground mb-4">
                  {t('filter.no_services_general')}
                </p>
                <Button variant="ghost-premium" onClick={clearFilters}>
                  {t('filter.clear_filters_try_again')}
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" key={`services-grid-${mode}`}>
              {paginatedServices.map(service => (
                <ServiceCardV3
                  key={`${service.id}-${mode}`}
                  title={service.translatedTitle}
                  category={service.category}
                  description={service.translatedDescription}
                  pricingType={service.priceType as 'hourly' | 'fixed' | 'quote'}
                  priceIncl={service.basePrice}
                  eligible={{
                    rot: service.eligible?.rot || false,
                    rut: service.eligible?.rut || false
                  }}
                  serviceSlug={service.id}
                  onBook={() => {
                    if (onServiceSelect) {
                      onServiceSelect(service);
                    } else {
                      toast.success(`${t('service_text.booking_for')} ${service.translatedTitle} ${t('service_text.started')}`);
                    }
                  }}
                  onQuote={() => {
                    if (onServiceSelect) {
                      onServiceSelect(service);
                    } else {
                      toast.success(`${t('service_text.quote_for')} ${service.translatedTitle} ${t('service_text.sent')}`);
                    }
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Föregående
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "premium" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Nästa
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FastServiceFilter;
