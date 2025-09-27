import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, MapPin, GripVertical, Edit, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import ServiceCardV3 from "./ServiceCardV3";
import SegmentedPriceToggle from "./SegmentedPriceToggle";
import { usePriceStore } from "@/stores/priceStore";
import { toast } from "sonner";
import { useCopy } from '@/copy/CopyProvider';
import { useServices, useUpdateService } from '@/hooks/useServices';
import { serviceCategories } from '@/data/servicesDataNew';
import { useEditMode } from '@/contexts/EditModeContext';
import { ServiceEditModal } from './ServiceEditModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ITEMS_PER_PAGE = 12;

interface SortableServiceItemProps {
  service: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onServiceSelect?: (service: any) => void;
}

function SortableServiceItem({ service, onEdit, onDelete, onServiceSelect }: SortableServiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  // DEBUG: Log when sortable item is created
  console.log('🔍 SortableServiceItem created for:', service.id, { isDragging });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      {/* Edit Controls */}
      <div className="absolute top-2 left-2 z-20 flex gap-1">
        <div
          {...attributes}
          {...listeners}
          className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary/90 touch-none"
          title="Dra för att flytta"
          onMouseDown={() => console.log('🔍 Drag handle clicked for:', service.id)}
          onTouchStart={() => console.log('🔍 Touch started for:', service.id)}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <button
          onClick={() => onEdit(service.id)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
          title="Redigera tjänst"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
          title="Ta bort tjänst"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className={`border-2 border-dashed border-primary/30 rounded-lg p-2 ${
        isDragging ? 'border-primary bg-background' : ''
      }`}>
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
    </div>
  );
}

interface EditableFastServiceFilterNewProps {
  onServiceSelect?: (service: any) => void;
  className?: string;
}

const EditableFastServiceFilterNew: React.FC<EditableFastServiceFilterNewProps> = ({ 
  onServiceSelect, 
  className = "" 
}) => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = usePriceStore();
  const queryClient = useQueryClient();
  
  // DEBUG: Log edit mode status
  console.log('🔍 EditableFastServiceFilterNew render:', { 
    isEditMode, 
    timestamp: new Date().toISOString() 
  });
  
  // Get services from database
  const { data: servicesFromDB = [], isLoading } = useServices(locale);
  const updateService = useUpdateService();
  
  // Mutation for bulk reordering services
  const reorderServices = useMutation({
    mutationFn: async (servicesToUpdate: { id: string; sort_order: number }[]) => {
      console.log('🔧 Starting database update for services:', servicesToUpdate);
      
      // Update each service individually since we only want to update sort_order
      for (const service of servicesToUpdate) {
        console.log(`📝 Updating service ${service.id} with sort_order ${service.sort_order}`);
        
        const { data, error } = await supabase
          .from('services')
          .update({ sort_order: service.sort_order })
          .eq('id', service.id)
          .select();
        
        if (error) {
          console.error('❌ Database error:', error);
          throw error;
        }
        
        console.log('✅ Updated service:', service.id, data);
      }
      return servicesToUpdate;
    },
    onSuccess: (data) => {
      console.log('🎉 All services updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setPendingChanges([]);
      setHasUnsavedChanges(false);
      toast.success('Tjänstordning sparad!');
    },
    onError: (error) => {
      console.error('💥 Mutation failed:', error);
      toast.error('Fel vid sparande av ordning: ' + error.message);
    }
  });
  
  // Convert database services to the expected format and add local state for reordering
  const [services, setServices] = useState(() => {
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
  });

  // Update services when data changes
  React.useEffect(() => {
    if (servicesFromDB.length > 0) {
      const mappedServices = servicesFromDB.map(service => ({
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
      setServices(mappedServices);
    }
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
  const [editingService, setEditingService] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{ id: string; sort_order: number }[]>([]);

  // Debounced search
  const searchDebounced = useDebounce(searchQuery, 300);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag distance before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Manual save function
  const handleManualSave = () => {
    console.log('🔴 SAVE BUTTON CLICKED!');
    console.log('🔴 Pending changes:', pendingChanges);
    console.log('🔴 Has unsaved changes:', hasUnsavedChanges);
    
    if (pendingChanges.length > 0) {
      console.log('🚀 Manually saving changes...', pendingChanges);
      reorderServices.mutate(pendingChanges);
    } else {
      console.log('🔴 NO PENDING CHANGES TO SAVE');
      toast.info('Inga ändringar att spara');
    }
  };

  // Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      console.log('🔄 Drag end detected, preparing changes...', { 
        active: active.id, 
        over: over?.id,
        currentPage,
        ITEMS_PER_PAGE 
      });
      
      setServices((allServices) => {
        // Find the dragged items in the current paginated view
        const paginatedItems = [...paginatedServices];
        const oldIndex = paginatedItems.findIndex((item) => item.id === active.id);
        const newIndex = paginatedItems.findIndex((item) => item.id === over?.id);

        console.log('📍 Reordering in paginated view:', { 
          oldIndex, 
          newIndex, 
          totalPaginatedItems: paginatedItems.length,
          paginatedIds: paginatedItems.map(i => i.id)
        });

        if (oldIndex === -1 || newIndex === -1) {
          console.warn('⚠️ Could not find dragged items in current page');
          return allServices;
        }

        // Reorder within the paginated view
        const reorderedPaginated = arrayMove(paginatedItems, oldIndex, newIndex);
        
        // Calculate the starting sort_order for this page
        const startingOrder = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        
        // Update sort_order for the reordered items
        const servicesToUpdate = reorderedPaginated.map((item, index) => ({
          id: item.id,
          sort_order: startingOrder + index
        }));
        
        console.log('💾 Changes prepared (not saved yet):', servicesToUpdate);
        console.log('💾 Setting pending changes and hasUnsavedChanges=true');
        
        // Store pending changes instead of saving immediately
        setPendingChanges(servicesToUpdate);
        setHasUnsavedChanges(true);
        
        // Update the full services array with new sort orders
        const updatedAllServices = allServices.map(service => {
          const updatedService = servicesToUpdate.find(s => s.id === service.id);
          return updatedService ? { ...service, sort_order: updatedService.sort_order } : service;
        });
        
        return updatedAllServices;
      });
    }
  };

  const handleEditService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setEditingService(service);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Är du säker på att du vill ta bort denna tjänst?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
      toast.success('Tjänst borttagen');
    }
  };

  const handleSaveService = (updatedService: any) => {
    // Use the database mutation to save the service
    updateService.mutate({
      id: updatedService.id,
      updates: updatedService
    });
  };

  // Update URL and sessionStorage  
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
    
    const servicesInCategory = services.filter(s => s.category === selectedCategory);
    const subCats = new Set(servicesInCategory.map(s => s.subCategory).filter(Boolean));
    return Array.from(subCats).sort();
  }, [selectedCategory, services]);

  // Main filtering logic  
  const filteredServices = useMemo(() => {
    let filtered = [...services];

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
  }, [services, searchDebounced, selectedCategory, selectedSubCategories, selectedPriceType, indoorOutdoor, mode, sortBy]);

  // Pagination
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Laddar tjänster...</span>
      </div>
    );
  }

  if (!isEditMode) {
    // Return original FastServiceFilter functionality here
    return <div>Använd FastServiceFilter för normal visning</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter info */}
      <div className="text-center p-4 bg-primary/10 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Redigeringsläge aktivt</strong> - Filtrera och dra tjänsterna för att ändra ordning
        </p>
      </div>

      {/* Filter Controls */}
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

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            updateStateAndURL({ sort: value });
          }}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Sortera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevans">Relevans</SelectItem>
              <SelectItem value="namn">Namn A-Ö</SelectItem>
              <SelectItem value="pris-låg">Pris: Låg-Hög</SelectItem>
              <SelectItem value="pris-hög">Pris: Hög-Låg</SelectItem>
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

      {/* Results with drag and drop */}
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
          <div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={(event) => {
                console.log('🔍 DND DRAG START:', event.active.id);
              }}
            >
              <SortableContext items={paginatedServices.map(s => s.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedServices.map((service) => (
                    <SortableServiceItem
                      key={service.id}
                      service={service}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      onServiceSelect={onServiceSelect}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Fixed save bar at bottom */}
            {hasUnsavedChanges && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900">Osparade ändringar</p>
                  <p className="text-sm text-gray-600">Tryck spara för att behålla ordningen</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🔴 UNDO CLICKED');
                      setPendingChanges([]);
                      setHasUnsavedChanges(false);
                      queryClient.invalidateQueries({ queryKey: ['services'] });
                      toast.info('Ändringar ångrades');
                    }}
                  >
                    Ångra
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      console.log('🔴 SAVE CLICKED FROM BOTTOM BAR');
                      handleManualSave();
                    }}
                    disabled={reorderServices.isPending}
                  >
                    {reorderServices.isPending ? 'Sparar...' : 'Spara'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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

export default EditableFastServiceFilterNew;