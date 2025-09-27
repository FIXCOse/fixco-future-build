import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import ServiceCardV3 from "./ServiceCardV3";
import SegmentedPriceToggle from "./SegmentedPriceToggle";
import { usePriceStore } from "@/stores/priceStore";
import { toast } from "sonner";
import { useCopy } from '@/copy/CopyProvider';
import { useServices } from '@/hooks/useServices';
import { serviceCategories } from '@/data/servicesDataNew';

const ITEMS_PER_PAGE = 12;

interface FastServiceFilterProps {
  onServiceSelect?: (service: any) => void;
  className?: string;
}

const FastServiceFilter: React.FC<FastServiceFilterProps> = ({ 
  onServiceSelect, 
  className = "" 
}) => {
  const { t, locale } = useCopy();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = usePriceStore();
  
  // Get services from database
  const { data: servicesFromDB = [], isLoading } = useServices(locale);
  
  // Convert database services to the expected format
  const allServices = useMemo(() => {
    return servicesFromDB.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      subCategory: service.sub_category || '',
      priceType: service.price_type,
      basePrice: service.base_price,
      priceUnit: service.price_unit,
      location: service.location,
      eligible: {
        rot: service.rot_eligible,
        rut: service.rut_eligible
      },
      laborShare: 1.0,
      translatedTitle: service.title,
      translatedDescription: service.description
    }));
  }, [servicesFromDB]);
  // Initialize state from URL and sessionStorage
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || sessionStorage.getItem('fixco-filter-search') || '';
  });
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get('category') || sessionStorage.getItem('fixco-filter-category') || 'alla';
  });
  
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  
  const [selectedPriceType, setSelectedPriceType] = useState(() => {
    return searchParams.get('priceType') || sessionStorage.getItem('fixco-filter-priceType') || 'alla';
  });
  
  const [indoorOutdoor, setIndoorOutdoor] = useState(() => {
    return searchParams.get('location') || sessionStorage.getItem('fixco-filter-location') || 'alla';
  });
  
  const [sortBy, setSortBy] = useState(() => {
    return searchParams.get('sort') || sessionStorage.getItem('fixco-filter-sort') || 'relevans';
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const searchDebounced = useDebounce(searchQuery, 300);

  // Restore subcategories from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('fixco-filter-subCategories');
    if (stored) {
      try {
        setSelectedSubCategories(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse stored subcategories');
      }
    }
  }, []);

  // Categories for filter chips
  const categories = useMemo(() => {
    return serviceCategories.map(cat => ({
      slug: cat.slug,
      name: t(`serviceCategories.${cat.slug}` as any) || cat.title
    }));
  }, [t]);

  // Get sub-categories for selected category
  const subCategories = useMemo(() => {
    if (selectedCategory === 'alla') return [];
    
    const servicesInCategory = allServices.filter(s => s.category === selectedCategory);
    const subCats = new Set(servicesInCategory.map(s => s.subCategory).filter(Boolean));
    return Array.from(subCats).sort();
  }, [selectedCategory, allServices]);

  // Main filtering logic
  const filteredServices = useMemo(() => {
    let filtered = [...allServices];

    // Text search
    if (searchDebounced) {
      const searchTerm = searchDebounced.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.subCategory.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (selectedCategory !== 'alla') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(service => 
        selectedSubCategories.includes(service.subCategory)
      );
    }

    // Price type filter
    if (selectedPriceType !== 'alla') {
      filtered = filtered.filter(service => service.priceType === selectedPriceType);
    }

    // Location filter
    if (indoorOutdoor !== 'alla') {
      filtered = filtered.filter(service => 
        service.location === indoorOutdoor || service.location === 'båda'
      );
    }

    // ROT/RUT filter based on price mode
    if (mode === 'rot') {
      filtered = filtered.filter(service => service.eligible.rot);
    } else if (mode === 'rut') {
      filtered = filtered.filter(service => service.eligible.rut);
    }

    // Sort
    if (sortBy === 'pris-låg') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'pris-hög') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'namn') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [allServices, searchDebounced, selectedCategory, selectedSubCategories, selectedPriceType, indoorOutdoor, mode, sortBy]);

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
                      location: indoorOutdoor, sort: sortBy });
  };

  const handleSubCategoryToggle = (subCat: string) => {
    const newSubCats = selectedSubCategories.includes(subCat)
      ? selectedSubCategories.filter(s => s !== subCat)
      : [...selectedSubCategories, subCat];
    setSelectedSubCategories(newSubCats);
    setCurrentPage(1);
    
    // Store subcategories in sessionStorage
    sessionStorage.setItem('fixco-filter-subCategories', JSON.stringify(newSubCats));
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
    ['search', 'category', 'priceType', 'location', 'sort', 'subCategories'].forEach(key => {
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Laddar tjänster...</span>
      </div>
    );
  }

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
              variant={selectedCategory === 'alla' ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange('alla')}
              className="h-8"
            >
              {t('filter.all_services')}
            </Button>
            {categories.map(category => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
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
                variant={selectedSubCategories.includes(subCat) ? "default" : "outline"}
                size="sm"
                onClick={() => handleSubCategoryToggle(subCat)}
                className="h-7 text-xs"
              >
                {subCat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {searchDebounced && (
            <span className="mr-4">
              <strong>{t('filter.searching')}</strong> "{searchDebounced}"
            </span>
          )}
          <strong>{filteredServices.length}</strong> {t('filter.services_found')}
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[400px]">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {mode !== 'all' ? (
              // Empty state for ROT/RUT filtering
              <div className="max-w-md mx-auto">
                <p className="text-muted-foreground mb-4">
                  {t('filter.no_services_rot_rut')} {mode === 'rot' ? 'ROT' : 'RUT'} {t('filter.with_current_filters')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => usePriceStore.getState().setMode('all')}
                  className="mb-4"
                >
                  {t('filter.show_all_services')}
                </Button>
                <div className="mt-4">
                  <Button variant="ghost" onClick={clearFilters}>
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
                <Button variant="ghost" onClick={clearFilters}>
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
                  title={service.title}
                  category={service.category}
                  description={service.description}
                  pricingType={service.priceType as 'hourly' | 'fixed' | 'quote'}
                  priceIncl={service.basePrice}
                  eligible={{
                    rot: service.eligible?.rot || false,
                    rut: service.eligible?.rut || false
                  }}
                  serviceSlug={service.id}
                  serviceId={service.id}
                  onBook={() => {
                    if (onServiceSelect) {
                      onServiceSelect(service);
                    } else {
                      toast.success(`${t('service_text.booking_for')} ${service.title} ${t('service_text.started')}`);
                    }
                  }}
                  onQuote={() => {
                    if (onServiceSelect) {
                      onServiceSelect(service);
                    } else {
                      toast.success(`${t('service_text.quote_for')} ${service.title} ${t('service_text.sent')}`);
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
                        variant={currentPage === pageNum ? "default" : "outline"}
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