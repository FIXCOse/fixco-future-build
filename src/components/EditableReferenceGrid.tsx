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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MapPin, Calendar, Euro, GripVertical, Edit, Trash2 } from "lucide-react";
import { useEditMode } from '@/contexts/EditModeContext';
import { Button } from '@/components/ui/button';

interface Reference {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  duration: string;
  budget: string;
  rotSaving: string;
  image: string;
  description: string;
  services: string[];
  quote: string;
  client: string;
  rating: number;
  beforeAfter: {
    before: string;
    after: string;
  };
}

interface EditableReferenceGridProps {
  initialReferences: Reference[];
}

interface SortableReferenceProps {
  reference: Reference;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function SortableReference({ reference: ref, onEdit, onDelete }: SortableReferenceProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ref.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      <Card className={`
        overflow-hidden transition-all duration-300 relative group
        ${isDragging ? 'shadow-glow border-2 border-primary' : 'hover:shadow-premium'}
      `}>
        {/* Edit Controls */}
        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <div
            {...attributes}
            {...listeners}
            className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary/90"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <Button
            size="sm"
            onClick={() => onEdit(ref.id)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => onDelete(ref.id)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <ReferenceCard reference={ref} />
      </Card>
    </div>
  );
}

const EditableReferenceGrid: React.FC<EditableReferenceGridProps> = ({ initialReferences }) => {
  const { isEditMode } = useEditMode();
  const [references, setReferences] = useState(initialReferences);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setReferences((items) => {
        const oldIndex = items.findIndex((item) => item.id.toString() === active.id);
        const newIndex = items.findIndex((item) => item.id.toString() === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log('New reference order:', newItems.map(r => r.id));
        // TODO: Save to database
        return newItems;
      });
    }
  };

  const handleEdit = (id: number) => {
    // TODO: Open edit modal
    console.log('Edit reference:', id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Är du säker på att du vill ta bort detta projekt?')) {
      setReferences(prev => prev.filter(ref => ref.id !== id));
      // TODO: Delete from database
    }
  };

  if (!isEditMode) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        {references.map((ref) => (
          <ReferenceCard key={ref.id} reference={ref} />
        ))}
      </div>
    );
  }

  return (
    <div className="select-none">
      <div className="text-center p-4 bg-primary/10 rounded-lg mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>Redigeringsläge aktivt</strong> - Hovra över projekt och dra handtaget för att ändra ordning
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={references.map(r => r.id.toString())} strategy={rectSortingStrategy}>
          <div className="grid lg:grid-cols-2 gap-8">
            {references.map((ref) => (
              <SortableReference
                key={ref.id}
                reference={ref}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const ReferenceCard: React.FC<{ reference: Reference }> = ({ reference: ref }) => (
  <>
    {/* Project Image */}
    <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-sm">{ref.title}</div>
        </div>
      </div>
      <Badge className="absolute top-4 left-4">{ref.category}</Badge>
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
        <Star className="h-3 w-3 fill-current text-yellow-500" />
        <span className="text-xs font-medium">{ref.rating}.0</span>
      </div>
    </div>

    <div className="p-6">
      {/* Project Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{ref.title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{ref.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{ref.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Euro className="h-4 w-4" />
            <span>{ref.budget}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-4">{ref.description}</p>

      {/* Services */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ref.services.map(service => (
          <Badge key={service} variant="secondary">{service}</Badge>
        ))}
      </div>

      {/* ROT Saving */}
      {ref.rotSaving !== "0 kr" && (
        <div className="p-3 bg-primary/10 rounded-lg mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">ROT-besparing: </span>
            <span className="font-bold text-primary">{ref.rotSaving}</span>
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="relative p-4 bg-muted/20 rounded-lg mb-4">
        <Quote className="h-6 w-6 text-primary mb-2" />
        <p className="text-sm italic mb-2">"{ref.quote}"</p>
        <p className="text-xs text-muted-foreground font-medium">– {ref.client}</p>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Projekttid:</span>
          <div className="font-medium">{ref.duration}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Total investering:</span>
          <div className="font-medium">{ref.budget}</div>
        </div>
      </div>
    </div>
  </>
);

export default EditableReferenceGrid;