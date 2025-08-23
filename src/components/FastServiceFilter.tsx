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
import GlobalPricingToggle from "@/components/GlobalPricingToggle";

interface FastServiceFilterProps {
  onServiceSelect?: (service: SubService) => void;
  className?: string;
}

const FastServiceFilter = ({ onServiceSelect, className = "" }: FastServiceFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode, shouldShowService } = usePriceStore();
  
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
      service.subServices
        .filter(subService => shouldShowService(subService.eligible))
        .map(subService => ({
          ...subService,
          parentService: service.title,
          parentSlug: service.slug,
          priceUnit: subService.priceUnit as "kr/h" | "kr" | "från",
          location: subService.location as "inomhus" | "utomhus" | "båda",
          priceType: subService.priceType as "hourly" | "fixed" | "quote"
        }))
    );
  }, [shouldShowService]);

  // Get unique categories
  const categories = useMemo(() => {
    return servicesDataNew.map(service => ({
      name: service.title,
      slug: service.slug
    }));
  }, []);

  // Get sub-categories for selected category
  const subCategories = useMemo(() => {
    if (selectedCategory === 'alla') return [];
    
    const service = servicesDataNew.find(s => s.slug === selectedCategory);
    if (!service) return [];
    
    const subCats = new Set(service.subServices.map(s => s.category));
    return Array.from(subCats).sort();
  }, [selectedCategory]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = allSubServices.filter(service => {
      // Search filter
      const matchesSearch = searchDebounced === "" || 
        service.title.toLowerCase().includes(searchDebounced.toLowerCase()) ||
        service.description.toLowerCase().includes(searchDebounced.toLowerCase()) ||
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
      selectedPriceType, indoorOutdoor, sortBy]);

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

  // Popular recommendations
  const popularChips = useMemo(() => [
    { label: "Populärt i El", filter: () => handleCategoryChange('el') },
    { label: "Snabbt & billigt", filter: () => { setSelectedPriceType('fixed'); updateStateAndURL({ priceType: 'fixed' }); } },
    { label: "ROT-favoriter", filter: () => handleCategoryChange('el') }
  ], []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Filter Row */}
      <div className="space-y-4">
        {/* Top Row - Search + ROT Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Sök efter tjänst, t.ex. 'dimmer', 'IKEA', 'diskmaskin'"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                updateStateAndURL({ search: e.target.value });
              }}
              className="pl-10 pr-4 h-12 text-base"
            />
          </div>

          {/* Global Pricing Toggle */}
          <GlobalPricingToggle />

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Uppsala & Stockholm</span>
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
              Alla tjänster
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
              <SelectItem value="alla">Alla priser</SelectItem>
              <SelectItem value="hourly">Timpris</SelectItem>
              <SelectItem value="fixed">Fast pris</SelectItem>
              <SelectItem value="quote">Begär offert</SelectItem>
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
              <SelectItem value="alla">Alla platser</SelectItem>
              <SelectItem value="inomhus">Inomhus</SelectItem>
              <SelectItem value="utomhus">Utomhus</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            updateStateAndURL({ sort: value });
          }}>
            <SelectTrigger className="w-36 h-8">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevans">Relevans</SelectItem>
              <SelectItem value="pris-låg">Lägsta pris</SelectItem>
              <SelectItem value="pris-hög">Högsta pris</SelectItem>
              <SelectItem value="mest-bokad">Mest bokad</SelectItem>
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
              Rensa ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Sub-category Chips (shown when category is selected) */}
        {selectedCategory !== 'alla' && subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <span className="text-sm text-muted-foreground mr-2">Specialområden:</span>
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

        {/* Popular Recommendations */}
        {activeFiltersCount === 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Populära val:</span>
            {popularChips.map((chip, index) => (
              <Button
                key={index}
                variant="ghost-premium"
                size="sm"
                onClick={chip.filter}
                className="h-7 text-xs"
              >
                {chip.label}
              </Button>
            ))}
          </div>
        )}

        {/* Active Filters Display */}
        {(searchDebounced || selectedSubCategories.length > 0) && (
          <div className="flex flex-wrap gap-2 items-center">
            {searchDebounced && (
              <Badge variant="secondary" className="text-xs">
                Sökning: "{searchDebounced}"
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
            {filteredServices.length} tjänster funna
          </h3>
        </div>

        {/* Results Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            {mode !== 'all' ? (
              // Empty state for ROT/RUT filtering
              <div className="max-w-md mx-auto">
                <p className="text-muted-foreground mb-4">
                  Inga tjänster är berättigade till {mode === 'rot' ? 'ROT' : 'RUT'} med dina nuvarande filter.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => usePriceStore.getState().setMode('all')}
                  className="mb-4"
                >
                  Visa alla tjänster
                </Button>
                <div className="mt-4">
                  <Button variant="ghost-premium" onClick={clearFilters}>
                    Rensa övriga filter
                  </Button>
                </div>
              </div>
            ) : (
              // General empty state
              <>
                <p className="text-muted-foreground mb-4">
                  Inga tjänster matchade dina sökkriterier
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">Förslag:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularChips.map((chip, index) => (
                      <Button
                        key={index}
                        variant="ghost-premium"
                        size="sm"
                        onClick={chip.filter}
                      >
                        {chip.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button variant="ghost-premium" onClick={clearFilters}>
                  Rensa filter och försök igen
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedServices.map(service => {
                return (
                  <div key={service.id} className="card-premium p-4 hover:shadow-glow transition-all duration-300 group">
                    <div className="space-y-3">
                      {/* Header */}
                         <div>
                           <div className="flex items-start justify-between mb-2">
                             <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                               {service.title}
                             </h4>
                           </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Kategori:</span>
                          <span>{service.category}</span>
                        </div>
                      </div>

                       {/* Pricing */}
                       {service.priceType === 'quote' ? (
                         <div className="space-y-1">
                           <div className="font-semibold text-base">Begär offert</div>
                           <div className="text-xs text-muted-foreground">Prisuppgift efter besiktning</div>
                         </div>
                       ) : (() => {
                         const VAT_RATE = 0.25;
                         const ROT_RATE = 0.50;
                         const RUT_RATE = 0.50;
                         
                         const priceIncl = service.basePrice;
                         const priceExcl = priceIncl / (1 + VAT_RATE);
                         const priceRotIncl = service.eligible.rot ? priceIncl * (1 - ROT_RATE) : priceIncl;
                         const priceRutIncl = service.eligible.rut ? priceIncl * (1 - RUT_RATE) : priceIncl;
                         const savingsRot = service.eligible.rot ? priceIncl - priceRotIncl : 0;
                         const savingsRut = service.eligible.rut ? priceIncl - priceRutIncl : 0;
                         
                         let primaryPrice = priceIncl;
                         let isDiscounted = false;
                         
                         if (mode === 'rot' && service.eligible.rot) {
                           primaryPrice = priceRotIncl;
                           isDiscounted = true;
                         } else if (mode === 'rut' && service.eligible.rut) {
                           primaryPrice = priceRutIncl;
                           isDiscounted = true;
                         }
                         
                         const unit = service.priceType === 'hourly' ? ' kr/h' : ' kr';
                         const formatMoney = (amount: number) => Math.round(amount).toLocaleString('sv-SE');
                         
                         return (
                           <div className="space-y-1">
                             <div className={`font-semibold text-base ${isDiscounted ? 'text-primary' : ''}`}>
                               {formatMoney(primaryPrice)}{unit} inkl. moms
                             </div>
                             <div className="text-xs text-muted-foreground">
                               {formatMoney(priceExcl)}{unit} exkl. moms
                             </div>
                             <div className="flex flex-wrap gap-1 mt-2">
                                {mode === 'rot' && service.eligible.rot && savingsRot > 0 && (
                                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    Sparar {formatMoney(savingsRot)}{unit} med ROT
                                  </Badge>
                                )}
                                {mode === 'rut' && service.eligible.rut && savingsRut > 0 && (
                                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    Sparar {formatMoney(savingsRut)}{unit} med RUT
                                  </Badge>
                                )}
                                {mode === 'all' && service.eligible.rot && (
                                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    ROT {savingsRot > 0 ? `-${formatMoney(savingsRot)}${unit}` : ''}
                                  </Badge>
                                )}
                                {mode === 'all' && service.eligible.rut && (
                                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    RUT {savingsRut > 0 ? `-${formatMoney(savingsRut)}${unit}` : ''}
                                  </Badge>
                                )}
                               {mode === 'rot' && !service.eligible.rot && (
                                 <Badge className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                   Ej ROT
                                 </Badge>
                               )}
                               {mode === 'rut' && !service.eligible.rut && (
                                 <Badge className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                   Ej RUT
                                 </Badge>
                               )}
                             </div>
                           </div>
                         );
                       })()}

                      {/* CTA */}
                      <Button 
                        variant="premium"
                        size="sm" 
                        className="w-full"
                        onClick={() => onServiceSelect?.(service)}
                      >
                        {service.priceType === 'quote' ? 'Begär offert' : 'Boka nu'}
                      </Button>
                    </div>
                  </div>
                );
              })}
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
