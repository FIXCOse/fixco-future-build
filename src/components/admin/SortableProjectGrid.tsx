import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReferenceProjectCard } from '@/components/ReferenceProjectCard';
import { ReferenceProject } from '@/hooks/useReferenceProjects';
import { GripVertical, Info } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { Locale } from '@/i18n/context';

interface SortableProjectGridProps {
  projects: ReferenceProject[];
  locale: Locale;
  isAdmin: boolean;
  isEditMode: boolean;
  onEdit: (project: ReferenceProject) => void;
  onDelete: (projectId: string) => void;
  onView: (project: ReferenceProject) => void;
}

function SortableItem({
  project,
  locale,
  isAdmin,
  isEditMode,
  onEdit,
  onDelete,
  onView,
}: {
  project: ReferenceProject;
  locale: Locale;
  isAdmin: boolean;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing bg-background/90 backdrop-blur-sm border border-border rounded-md p-1.5 shadow-sm hover:bg-accent transition-colors"
        title="Dra för att ändra ordning"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <ReferenceProjectCard
        project={project}
        locale={locale}
        isAdmin={isAdmin}
        isEditMode={isEditMode}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </div>
  );
}

export function SortableProjectGrid({
  projects,
  locale,
  isAdmin,
  isEditMode,
  onEdit,
  onDelete,
  onView,
}: SortableProjectGridProps) {
  const [items, setItems] = useState(projects);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Sync if projects change externally
  if (projects.length !== items.length || projects.some((p, i) => p.id !== items[i]?.id)) {
    setItems(projects);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Save new order to database
    setIsSaving(true);
    try {
      const updates = newItems.map((item, index) => 
        supabase
          .from('reference_projects')
          .update({ sort_order: index })
          .eq('id', item.id)
      );
      
      const results = await Promise.all(updates);
      const hasError = results.some((r) => r.error);
      
      if (hasError) throw new Error('Failed to save order');
      
      queryClient.invalidateQueries({ queryKey: ['reference-projects'] });
      queryClient.invalidateQueries({ queryKey: ['all-reference-projects'] });
      toast.success('Ordningen sparad!');
    } catch (error) {
      console.error('Sort save error:', error);
      toast.error('Kunde inte spara ordningen');
      setItems(projects); // revert
    } finally {
      setIsSaving(false);
    }
  }, [items, projects, queryClient]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <span>Dra i <GripVertical className="h-3.5 w-3.5 inline -mt-0.5" /> handtaget för att ändra ordningen på projekten. Ordningen sparas automatiskt.</span>
        {isSaving && <span className="ml-auto text-primary font-medium animate-pulse">Sparar...</span>}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((project) => (
              <SortableItem
                key={project.id}
                project={project}
                locale={locale}
                isAdmin={isAdmin}
                isEditMode={isEditMode}
                onEdit={() => onEdit(project)}
                onDelete={() => onDelete(project.id)}
                onView={() => onView(project)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
