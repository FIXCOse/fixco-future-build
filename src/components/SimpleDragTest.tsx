import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

// Simple test data
const initialItems = [
  { id: 'item-1', content: 'El tjänster' },
  { id: 'item-2', content: 'VVS tjänster' },
  { id: 'item-3', content: 'Snickeri' },
  { id: 'item-4', content: 'Montering' },
];

export const SimpleDragTest = () => {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    console.log('New order:', newItems.map(item => item.content));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Drag Test</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="test-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 p-4 rounded-lg min-h-[200px] ${
                snapshot.isDraggingOver ? 'bg-primary/10' : 'bg-muted/20'
              }`}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                        snapshot.isDragging 
                          ? 'border-primary bg-background shadow-lg' 
                          : 'border-border bg-background'
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span>{item.content}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};