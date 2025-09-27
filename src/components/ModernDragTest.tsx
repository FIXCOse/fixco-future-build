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
import { GripVertical } from 'lucide-react';

// Simple test data
const initialItems = [
  { id: 'item-1', content: 'El tjänster' },
  { id: 'item-2', content: 'VVS tjänster' },  
  { id: 'item-3', content: 'Snickeri' },
  { id: 'item-4', content: 'Montering' },
];

interface SortableItemProps {
  id: string;
  content: string;
}

function SortableItem({ id, content }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg border-2 flex items-center gap-3 bg-background ${
        isDragging ? 'border-primary shadow-lg' : 'border-border'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <span>{content}</span>
    </div>
  );
}

export const ModernDragTest = () => {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log('New order:', newItems.map(item => item.content));
        return newItems;
      });
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Modern Drag Test (@dnd-kit)</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Denna använder @dnd-kit istället för react-beautiful-dnd
      </p>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};