import React, { useState } from 'react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditableServiceCard } from './EditableServiceCard';
import { ServiceEditorModal } from './ServiceEditorModal';
import { useEditMode } from '@/stores/useEditMode';

interface Service {
  id: string;
  title_sv: string;
  title_en?: string;
  description_sv: string;
  description_en?: string;
  base_price: number;
  price_type: string;
  category: string;
  sub_category?: string;
  is_active: boolean;
  rot_eligible: boolean;
  rut_eligible: boolean;
  sort_order: number;
}

interface SortableItemProps {
  service: Service;
  onEdit: (service: Service) => void;
}

function SortableItem({ service, onEdit }: SortableItemProps) {
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
    <div ref={setNodeRef} style={style}>
      <EditableServiceCard
        service={service}
        onEdit={onEdit}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

interface SortableServiceListProps {
  services: Service[];
  onServicesReorder?: (services: Service[]) => void;
}

export const SortableServiceList: React.FC<SortableServiceListProps> = ({
  services,
  onServicesReorder
}) => {
  const { stage } = useEditMode();
  const [items, setItems] = useState(services);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setItems(services);
  }, [services]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Create reorder data for staging
      const reorderData = newItems.map((item, index) => ({
        id: item.id,
        sort_order: index
      }));

      // Stage the reorder change
      stage('services:order', reorderData, 'order');

      // Call optional callback
      onServicesReorder?.(newItems);
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <SortableItem
                key={service.id}
                service={service}
                onEdit={setEditingService}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingService && (
        <ServiceEditorModal
          service={editingService}
          isOpen={Boolean(editingService)}
          onClose={() => setEditingService(null)}
        />
      )}
    </>
  );
};