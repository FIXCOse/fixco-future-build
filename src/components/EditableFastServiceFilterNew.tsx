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
import { useServices } from '@/hooks/useServices';
import { serviceCategories } from '@/data/servicesDataNew';
import { useEditMode } from '@/contexts/EditModeContext';
import { ServiceEditModal } from './ServiceEditModal';

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
          className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary/90"
          title="Dra för att flytta"
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

  const [currentPage, setCurrentPage] = useState(1);
  const [editingService, setEditingService] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log('New service order:', newItems.map(s => s.id));
        toast.success('Tjänstordning uppdaterad');
        return newItems;
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
    setServices(prev => prev.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
  };

  // Main filtering logic  
  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Text search - removed for now but can be added back
    // Category filter - removed for now but can be added back  
    // Price type filter - removed for now but can be added back
    // Location filter - removed for now but can be added back

    // ROT/RUT filter based on price mode
    if (mode === 'rot') {
      filtered = filtered.filter(service => service.eligible.rot);
    } else if (mode === 'rut') {
      filtered = filtered.filter(service => service.eligible.rut);
    }

    // Sort alphabetically by default
    filtered.sort((a, b) => a.title.localeCompare(b.title));

    return filtered;
  }, [services, mode]);

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
          <div className="select-none">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
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