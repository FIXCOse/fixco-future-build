import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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

const EditableReferenceGrid: React.FC<EditableReferenceGridProps> = ({ initialReferences }) => {
  const { isEditMode } = useEditMode();
  const [references, setReferences] = useState(initialReferences);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newReferences = Array.from(references);
    const [reorderedItem] = newReferences.splice(result.source.index, 1);
    newReferences.splice(result.destination.index, 0, reorderedItem);

    setReferences(newReferences);
    // TODO: Save to database
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="references-grid">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid lg:grid-cols-2 gap-8"
          >
            {references.map((ref, index) => (
              <Draggable key={ref.id.toString()} draggableId={ref.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`
                      ${snapshot.isDragging ? 'shadow-2xl rotate-1 scale-105' : ''}
                      transition-all duration-200
                    `}
                  >
                    <Card className={`
                      overflow-hidden transition-all duration-300 relative group
                      ${snapshot.isDragging ? 'shadow-glow border-2 border-primary' : 'hover:shadow-premium'}
                    `}>
                      {/* Edit Controls */}
                      <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                        <div
                          {...provided.dragHandleProps}
                          className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary/90"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(ref.id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(ref.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <ReferenceCard reference={ref} />
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
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