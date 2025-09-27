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
import { ModernDragTest } from './ModernDragTest';

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

  // For now, show the modern drag test instead of the complex service filter
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center p-4 bg-primary/10 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Redigeringsläge aktivt</strong> - Test av ny drag-funktion
        </p>
      </div>
      <ModernDragTest />
    </div>
  );
};

export default EditableFastServiceFilter;