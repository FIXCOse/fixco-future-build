import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, MapPin, Edit, Trash2, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import ServiceCardV3 from "./ServiceCardV3";
import SegmentedPriceToggle from "./SegmentedPriceToggle";
import { usePriceStore } from "@/stores/priceStore";
import { toast } from "sonner";
import { useCopy } from '@/copy/CopyProvider';
import { useServices, useUpdateService, useAddService, useDeleteService } from '@/hooks/useServices';
import { serviceCategories } from '@/data/servicesDataNew';
import { ServiceEditModal } from './ServiceEditModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 12;

interface EditableServiceFilterProps {
  onServiceSelect?: (service: any) => void;
  className?: string;
}

const EditableServiceFilter: React.FC<EditableServiceFilterProps> = ({ 
  onServiceSelect, 
  className = "" 
}) => {
  const { t, locale } = useCopy();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = usePriceStore();
  
  // Get services from database
  const { data: servicesFromDB = [], isLoading, refetch } = useServices(locale);
  const updateService = useUpdateService();
  const addService = useAddService();
  const deleteService = useDeleteService();
  
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

  // State
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
  const [editingService, setEditingService] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add new service form state
  const [newServiceData, setNewServiceData] = useState({
    title_sv: '',
    description_sv: '',
    category: '',
    sub_category: '',
    base_price: 0,
    price_type: 'hourly' as 'hourly' | 'fixed' | 'quote',
    price_unit: 'kr/tim',
    location: 'båda' as 'inomhus' | 'utomhus' | 'båda',
    rot_eligible: true,
    rut_eligible: false,
    sort_order: 0
  });

  const searchDebounced = useDebounce(searchQuery, 300);

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

  // Handlers
  const updateStateAndURL = React.useCallback((updates: Record<string, string | boolean>) => {
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
    
    setSearchParams({}, { replace: true });
    ['search', 'category', 'priceType', 'location', 'sort', 'subCategories'].forEach(key => {
      sessionStorage.removeItem(`fixco-filter-${key}`);
    });
  };

  const handleEditService = (serviceId: string) => {
    const service = allServices.find(s => s.id === serviceId);
    if (service) {
      setEditingService(service);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna tjänst?')) return;
    
    try {
      console.log('Deleting service:', serviceId);
      deleteService.mutate(serviceId);
    } catch (error) {
      console.error('Delete service error:', error);
      toast.error('Fel vid borttagning: ' + (error as Error).message);
    }
  };

  const handleSaveService = (updatedService: any) => {
    console.log('Saving service:', updatedService);
    updateService.mutate({
      id: updatedService.id,
      updates: {
        title_sv: updatedService.title,
        description_sv: updatedService.description,
        category: updatedService.category,
        sub_category: updatedService.subCategory,
        price_type: updatedService.priceType,
        base_price: updatedService.basePrice,
        rot_eligible: updatedService.eligible?.rot || false,
        rut_eligible: updatedService.eligible?.rut || false,
        location: updatedService.location || 'båda',
        price_unit: updatedService.priceUnit || 'kr/tim'
      }
    });
  };

  const handleAddNewService = () => {
    console.log('Adding new service:', newServiceData);
    
    // Generate unique ID using timestamp + random
    const newId = `${newServiceData.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    addService.mutate({
      id: newId,
      ...newServiceData,
      is_active: true
    });
    
    setIsAddModalOpen(false);
    setNewServiceData({
      title_sv: '',
      description_sv: '',
      category: '',
      sub_category: '',
      base_price: 0,
      price_type: 'hourly',
      price_unit: 'kr/tim',
      location: 'båda',
      rot_eligible: true,
      rut_eligible: false,
      sort_order: 0
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
      {/* Edit Mode Header */}
      <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            <strong>Redigeringsläge aktivt</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Klicka på redigera-ikonen för att ändra tjänster
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Lägg till ny tjänst
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lägg till ny tjänst</DialogTitle>
              <DialogDescription>
                Skapa en ny tjänst. Engelsk översättning skapas automatiskt.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titel (svenska)</Label>
                <Input
                  id="title"
                  value={newServiceData.title_sv}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, title_sv: e.target.value }))}
                  placeholder="T.ex. Målning av rum"
                />
              </div>
              <div>
                <Label htmlFor="description">Beskrivning (svenska)</Label>
                <Textarea
                  id="description"
                  value={newServiceData.description_sv}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, description_sv: e.target.value }))}
                  placeholder="Detaljerad beskrivning av tjänsten..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select value={newServiceData.category} onValueChange={(value) => setNewServiceData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(cat => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subCategory">Subkategori (valfri)</Label>
                <Input
                  id="subCategory"
                  value={newServiceData.sub_category}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, sub_category: e.target.value }))}
                  placeholder="T.ex. Innerväggar, Ytterväggar"
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Grundpris</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={newServiceData.base_price}
                  onChange={(e) => setNewServiceData(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="priceType">Pristyp</Label>
                <Select value={newServiceData.price_type} onValueChange={(value: any) => setNewServiceData(prev => ({ ...prev, price_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Timpris</SelectItem>
                    <SelectItem value="fixed">Fast pris</SelectItem>
                    <SelectItem value="quote">Offert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Plats</Label>
                <Select value={newServiceData.location} onValueChange={(value: any) => setNewServiceData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inomhus">Inomhus</SelectItem>
                    <SelectItem value="utomhus">Utomhus</SelectItem>
                    <SelectItem value="båda">Både inomhus och utomhus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rot"
                    checked={newServiceData.rot_eligible}
                    onCheckedChange={(checked) => setNewServiceData(prev => ({ ...prev, rot_eligible: checked }))}
                  />
                  <Label htmlFor="rot">ROT-berättigad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rut"
                    checked={newServiceData.rut_eligible}
                    onCheckedChange={(checked) => setNewServiceData(prev => ({ ...prev, rut_eligible: checked }))}
                  />
                  <Label htmlFor="rut">RUT-berättigad</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleAddNewService} disabled={!newServiceData.title_sv || !newServiceData.category}>
                  Lägg till tjänst
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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

        {/* Sub-category Chips */}
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
            <p className="text-muted-foreground mb-4">
              Inga tjänster hittades med nuvarande filter.
            </p>
            <Button variant="ghost" onClick={clearFilters}>
              Rensa filter och försök igen
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.map(service => (
                <div key={service.id} className="relative">
                  {/* Edit Controls */}
                  <div className="absolute top-2 right-2 z-20 flex gap-1">
                    <button
                      onClick={() => handleEditService(service.id)}
                      className="p-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full shadow-lg transition-colors"
                      title="Redigera tjänst"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full shadow-lg transition-colors"
                      title="Ta bort tjänst"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <ServiceCardV3
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
                        toast.success(`Bokning för ${service.title} startad`);
                      }
                    }}
                    onQuote={() => {
                      if (onServiceSelect) {
                        onServiceSelect(service);
                      } else {
                        toast.success(`Offert för ${service.title} skickad`);
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
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

      {/* Edit Modal */}
      <ServiceEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
        onSave={handleSaveService}
      />
    </div>
  );
};

export default EditableServiceFilter;