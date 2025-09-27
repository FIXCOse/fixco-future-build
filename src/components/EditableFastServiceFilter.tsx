import React, { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
import { useServices } from '@/hooks/useServices';
import { serviceCategories } from '@/data/servicesDataNew';
import { useEditMode } from '@/contexts/EditModeContext';
import { ServiceEditModal } from './ServiceEditModal';

const ITEMS_PER_PAGE = 12;

interface EditableFastServiceFilterProps {
  onServiceSelect?: (service: any) => void;
  className?: string;
}

const EditableFastServiceFilter: React.FC<EditableFastServiceFilterProps> = ({ 
  onServiceSelect, 
  className = "" 
}) => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = usePriceStore();
  
  // Get services from database
  const { data: servicesFromDB = [], isLoading } = useServices(locale);
  
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
      console.log('EditableFastServiceFilter services:', mappedServices.map(s => ({ id: s.id, title: s.title })));
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

  // Debounced search
  const searchDebounced = useDebounce(searchQuery, 300);

  // Drag and drop handlers
  const handleDragEnd = (result: DropResult) => {
    console.log('Service drag end result:', result);
    if (!result.destination) return;

    const newServices = Array.from(services);
    const [reorderedItem] = newServices.splice(result.source.index, 1);
    newServices.splice(result.destination.index, 0, reorderedItem);

    setServices(newServices);
    console.log('New service order:', newServices.map(s => s.id));
    toast.success('Tjänstordning uppdaterad');
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
    setServices(prev => prev.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
  };

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

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

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
          <strong>Redigeringsläge aktivt</strong> - Dra tjänsterna för att ändra ordning
        </p>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <strong>{filteredServices.length}</strong> tjänster hittade
        </div>
      </div>

      {/* Results with drag and drop */}
      <div className="min-h-[400px]">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Inga tjänster hittade</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="services-list" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px] p-4 rounded-lg transition-colors ${
                    snapshot.isDraggingOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
                  }`}
                >
                  {paginatedServices.map((service, index) => {
                    const uniqueId = `service-${service.id}-${index}`;
                    console.log('Rendering service draggable:', uniqueId, service.id, service.title);
                    
                    return (
                      <Draggable 
                        key={uniqueId} 
                        draggableId={uniqueId} 
                        index={index}
                      >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            relative
                            ${snapshot.isDragging ? 'shadow-2xl rotate-1 scale-105 z-50' : ''}
                            transition-all duration-200
                          `}
                        >
                          {/* Edit Controls */}
                          <div className="absolute top-2 left-2 z-20 flex gap-1">
                            <div
                              {...provided.dragHandleProps}
                              className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary/90"
                              title="Dra för att flytta"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <button
                              onClick={() => handleEditService(service.id)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
                              title="Redigera tjänst"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
                              title="Ta bort tjänst"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className={`
                            border-2 border-dashed border-primary/30 rounded-lg p-2
                            ${snapshot.isDragging ? 'border-primary bg-background' : ''}
                          `}>
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
                      )}
                    </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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

export default EditableFastServiceFilter;