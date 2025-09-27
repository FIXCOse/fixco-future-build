import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2 } from "lucide-react";
import ServiceCardV3 from "./ServiceCardV3";
import React from 'react';

interface SortableServiceItemProps {
  id: string;
  service: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onServiceSelect?: (service: any) => void;
}

export function SortableServiceItem({ id, service, onEdit, onDelete, onServiceSelect }: SortableServiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // DEBUG: Log sortable creation
  console.log('🔍 SortableServiceItem created for:', id, { isDragging, attributes, listeners });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Edit Controls - Made more visible */}
      <div className="absolute top-2 left-2 z-20 flex gap-1">
        {/* DRAG HANDLE - Made more prominent */}
        <span
          className="p-3 bg-orange-500 text-white rounded-full shadow-xl cursor-grab active:cursor-grabbing hover:bg-orange-600 touch-none select-none border-2 border-white"
          {...attributes}
          {...listeners}
          style={{ 
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitUserDrag: 'none'
          } as React.CSSProperties}
          title="DRA HÄR för att flytta tjänst"
          role="button"
          aria-label="Dra för att flytta tjänst"
          onPointerDown={(e) => console.log('🔎 pointer down on handle', e.pointerType, 'id:', id)}
          onMouseDown={() => console.log('🔎 mouse down on handle, id:', id)}
          onTouchStart={() => console.log('🔎 touch start on handle, id:', id)}
        >
          ⇅ DRAG
        </span>
        
        {/* Other buttons WITHOUT listeners */}
        <button
          onClick={() => onEdit(id)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
          title="Redigera tjänst"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(id)}
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
            }
          }}
          onQuote={() => {
            if (onServiceSelect) {
              onServiceSelect(service);
            }
          }}
        />
      </div>
    </div>
  );
}
