import React, { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { SortableServiceItem } from "./SortableServiceItem";
import SegmentedPriceToggle from "./SegmentedPriceToggle";
import { usePriceStore } from "@/stores/priceStore";
import { useCopy } from '@/copy/CopyProvider';
import { useServices, useUpdateService } from '@/hooks/useServices';
import { serviceCategories } from '@/data/servicesDataNew';
import { useEditMode } from '@/contexts/EditModeContext';
import { ServiceEditModal } from './ServiceEditModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ITEMS_PER_PAGE = 12;

interface EditableFastServiceFilterNewProps {
  onServiceSelect?: (service: any) => void;
  className?: string;
}

// Reorder services in Supabase using new RPC function
async function reorderServicesInSupabase(updates: {id: string, sort_order: number}[]) {
  console.log('🔧 Reordering services in Supabase using RPC:', updates);
  
  try {
    const { error } = await supabase.rpc('reorder_services', { 
      _service_updates: updates 
    });
    
    if (error) {
      console.error('❌ RPC Error:', error);
      return { error };
    }
    
    console.log('✅ Services reordered successfully');
    return { error: null };
  } catch (error) {
    console.error('❌ RPC Exception:', error);
    return { error };
  }
}

const EditableFastServiceFilterNew: React.FC<EditableFastServiceFilterNewProps> = ({ 
  onServiceSelect, 
  className 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useCopy();
  const mode = usePriceStore((state) => state.mode);
  const { isEditMode } = useEditMode();
  const queryClient = useQueryClient();

  // Get services from API
  const { data: servicesFromDB = [], isLoading } = useServices();
  
  // Transform services data consistently
  const services = useMemo(() => {
    return servicesFromDB.map(service => ({
      id: service.id,
      title: service.title_sv || service.title_en || 'Untitled',
      category: service.category,
      description: service.description_sv || service.description_en || '',
      basePrice: service.base_price,
      priceType: service.price_type,
      eligible: {
        rot: service.rot_eligible,
        rut: service.rut_eligible
      },
      sort_order: service.sort_order || 0
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
  const [editingService, setEditingService] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Debounced search
  const searchDebounced = useDebounce(searchQuery, 300);

  // CRITICAL: Stable IDs for drag and drop
  const [ids, setIds] = useState<string[]>(() => 
    services.map(s => s.id).sort((a, b) => {
      const serviceA = services.find(s => s.id === a);
      const serviceB = services.find(s => s.id === b);
      return (serviceA?.sort_order || 0) - (serviceB?.sort_order || 0);
    })
  );
  
  const [lastSaved, setLastSaved] = useState<string[]>(() => 
    services.map(s => s.id).sort((a, b) => {
      const serviceA = services.find(s => s.id === a);
      const serviceB = services.find(s => s.id === b);
      return (serviceA?.sort_order || 0) - (serviceB?.sort_order || 0);
    })
  );

  // Update ids when services change
  React.useEffect(() => {
    if (services.length > 0) {
      const sortedIds = services
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(s => s.id);
      setIds(sortedIds);
      setLastSaved(sortedIds);
    }
  }, [services]);

  // Check for unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(ids) !== JSON.stringify(lastSaved);
  }, [ids, lastSaved]);

  // CRITICAL: Sensors with proper activation constraint - using Mouse+Touch instead of Pointer
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 } // 6px drag distance before activating
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 5 } // 120ms delay, 5px tolerance for touch
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // CRITICAL: Drag end handler
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    console.log('🔍 DRAG END EVENT:', event);
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      console.log('🔍 No valid drop target or same position');
      return;
    }

    console.log('🔍 Moving service from', active.id, 'to', over.id);

    setIds((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      
      console.log('🔍 Indices:', { oldIndex, newIndex });
      
      if (oldIndex === -1 || newIndex === -1) {
        console.log('🔴 Invalid indices, aborting drag');
        return prev;
      }

      const next = arrayMove(prev, oldIndex, newIndex);
      console.log('♻️ New order:', next);
      return next;
    });
  }, []);

  // Reorder services mutation
  const reorderMutation = useMutation({
    mutationFn: reorderServicesInSupabase,
    onSuccess: () => {
      console.log('✅ Services reordered successfully');
      setLastSaved([...ids]);
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('❌ Failed to reorder services:', error);
      // Revert changes on error
      setIds([...lastSaved]);
    }
  });

  // Save changes
  const handleSave = useCallback(async () => {
    console.log('💾 Saving changes...');
    
    // Optimistically update lastSaved
    const prevSaved = lastSaved;
    setLastSaved([...ids]);
    
    // Create updates array with new sort_order values
    const updates = ids.map((id, index) => ({
      id,
      sort_order: index
    }));

    // Call mutation
    reorderMutation.mutate(updates);
  }, [ids, lastSaved, reorderMutation]);

  const updateStateAndURL = useCallback((newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'alla') {
        updatedParams.set(key, value);
        sessionStorage.setItem(`fixco-filter-${key}`, value);
      } else {
        updatedParams.delete(key);
        sessionStorage.removeItem(`fixco-filter-${key}`);
      }
    });
    
    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('alla');
    setSelectedSubCategories([]);
    setSelectedPriceType('alla');
    setIndoorOutdoor('alla');
    setSortBy('relevans');
    setCurrentPage(1);
    
    // Clear from sessionStorage
    sessionStorage.removeItem('fixco-filter-search');
    sessionStorage.removeItem('fixco-filter-category');
    sessionStorage.removeItem('fixco-filter-priceType');
    sessionStorage.removeItem('fixco-filter-location');
    sessionStorage.removeItem('fixco-filter-sort');
    
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const categories = useMemo(() => 
    serviceCategories.filter(cat => cat.slug !== 'all'),
    []
  );

  const subCategories = useMemo(() => {
    if (selectedCategory === 'alla') return [];
    // For now, return empty array since serviceCategories doesn't have subCategories
    return [];
  }, [selectedCategory]);

  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedSubCategories([]);
    setCurrentPage(1);
    updateStateAndURL({ category: categorySlug });
  }, [updateStateAndURL]);

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search filter
      if (searchDebounced && !service.title.toLowerCase().includes(searchDebounced.toLowerCase()) 
          && !service.description.toLowerCase().includes(searchDebounced.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'alla' && service.category !== selectedCategory) {
        return false;
      }

      // Price type filter
      if (selectedPriceType !== 'alla' && service.priceType !== selectedPriceType) {
        return false;
      }

      // ROT/RUT filter
      if (mode === 'rot' && !service.eligible.rot) return false;
      if (mode === 'rut' && !service.eligible.rut) return false;

      return true;
    });
  }, [services, searchDebounced, selectedCategory, selectedPriceType, mode]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'alla') count++;
    if (selectedPriceType !== 'alla') count++;
    if (indoorOutdoor !== 'alla') count++;
    if (sortBy !== 'relevans') count++;
    return count;
  }, [searchQuery, selectedCategory, selectedPriceType, indoorOutdoor, sortBy]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // CRITICAL: Stable items array for SortableContext - only IDs that are actually rendered
  const stableIds = useMemo(() => paginatedServices.map(s => s.id), [paginatedServices]);

  // Service operations
  const updateServiceMutation = useUpdateService();

  const handleEditService = useCallback((id: string) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setEditingService(service);
      setIsEditModalOpen(true);
    }
  }, [services]);

  const handleDeleteService = useCallback(async (id: string) => {
    if (confirm('Är du säker på att du vill ta bort denna tjänst?')) {
      try {
        const { error } = await supabase
          .from('services')
          .update({ is_active: false })
          .eq('id', id);
        
        if (error) throw error;
        
        queryClient.invalidateQueries({ queryKey: ['services'] });
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  }, [queryClient]);

  const handleSaveService = useCallback(async (serviceData: any) => {
    updateServiceMutation.mutate(serviceData, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingService(null);
      }
    });
  }, [updateServiceMutation]);

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
    return <div>Använd FastServiceFilter för normal visning</div>;
  }

  console.log('🔍 Rendering with stableIds:', stableIds.slice(0, 5), '...');
  console.log('🔍 Paginated services:', paginatedServices.map(s => s.id));

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
                {category.title}
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

        {/* Sub-category Chips */}
        {selectedCategory !== 'alla' && subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            {subCategories.map(subCategory => (
              <Button
                key={subCategory}
                variant={selectedSubCategories.includes(subCategory) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedSubCategories(prev => 
                    prev.includes(subCategory) 
                      ? prev.filter(sc => sc !== subCategory)
                      : [...prev, subCategory]
                  );
                  setCurrentPage(1);
                }}
                className="h-7 text-xs"
              >
                {subCategory}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Services Grid */}
      <div className="min-h-[400px]">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {mode !== 'all' ? (
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event: DragStartEvent) => {
              console.log('🔎 DND DRAG START:', event.active.id, event);
            }}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={stableIds} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedServices.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    id={service.id}
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    onServiceSelect={onServiceSelect}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* CRITICAL: Save bar when unsaved changes */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-xl p-4 flex items-center gap-4">
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
                setIds([...lastSaved]);
              }}
            >
              Ångra
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={reorderMutation.isPending}
            >
              {reorderMutation.isPending ? 'Sparar...' : 'Spara'}
            </Button>
          </div>
        </div>
      )}

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
