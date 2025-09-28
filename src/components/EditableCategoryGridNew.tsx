import React, { useState } from 'react';
import { Link } from "react-router-dom";
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
import { servicesDataNew } from "@/data/servicesDataNew";
import { LucideIcon, GripVertical } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';
import { useEditMode } from '@/contexts/EditModeContext';
import { toast } from 'sonner';
import type { CopyKey } from '@/copy/keys';

// Smart hem-inspirerade färger för olika tjänstekategorier
const getGradientForService = (slug: string): string => {
  const gradients: Record<string, string> = {
    'el': 'bg-gradient-to-r from-yellow-400 to-orange-500',
    'vvs': 'bg-gradient-to-r from-blue-400 to-cyan-500',
    'snickeri': 'bg-gradient-to-r from-amber-500 to-orange-600',
    'montering': 'bg-gradient-to-r from-purple-500 to-violet-600',
    'tradgard': 'bg-gradient-to-r from-green-400 to-lime-500',
    'stadning': 'bg-gradient-to-r from-pink-400 to-rose-500',
    'markarbeten': 'bg-gradient-to-r from-stone-500 to-amber-600',
    'tekniska-installationer': 'bg-gradient-to-r from-slate-500 to-gray-600',
    'flytt': 'bg-gradient-to-r from-red-400 to-pink-500'
  };
  
  return gradients[slug] || 'bg-gradient-to-r from-gray-400 to-gray-500';
};

interface SortableCategoryItemProps {
  service: typeof servicesDataNew[0];
  index: number;
  t: any;
  locale: string;
}

function SortableCategoryItem({ service, index, t, locale }: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = service.icon as LucideIcon;
  const basePath = locale === 'en' ? '/en/services' : '/tjanster';
  const translateKey = `serviceCategories.${service.slug}` as CopyKey;

  if (isDragging) {
    // Render a simplified version while dragging
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="card-service p-6 text-center h-full shadow-2xl border-2 border-primary bg-background transform rotate-2 scale-105 z-50 opacity-90"
      >
        <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 bg-primary">
          <IconComponent className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-base font-bold mb-2">
          {t(translateKey) || service.title}
        </h3>
        <p className="text-xs text-muted-foreground">Flyttar...</p>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
        title="Dra för att flytta"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <Link
        to={`${basePath}/${service.slug}`}
        className="block"
      >
        <div 
          className="card-service p-6 text-center h-full transition-all duration-300 animate-fade-in-up hover-scale border-2 border-dashed border-primary/30 group-hover:border-primary/50"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-all duration-300 z-10">
            <img 
              src="/assets/fixco-f-icon-new.png" 
              alt="Fixco" 
              className="h-6 w-6 object-contain opacity-90"
            />
          </div>

          <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${getGradientForService(service.slug)}`}>
             <IconComponent className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          <h3 className="text-base font-bold group-hover:text-primary transition-colors mb-2">
            {t(translateKey) || service.title}
          </h3>
          
          <p className="text-xs text-muted-foreground">
            {service.subServices.length} {t('services.count')}
          </p>
          
          <div className="mt-3 text-primary text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
            {t('cta.see_all')}
          </div>
        </div>
      </Link>
    </div>
  );
}

const EditableCategoryGridNew = () => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  const [services, setServices] = useState(servicesDataNew);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.slug === active.id);
        const newIndex = items.findIndex((item) => item.slug === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        console.log('New category order:', newItems.map(s => s.slug));
        toast.success('Kategoriordning uppdaterad');
        return newItems;
      });
    }
  };

  if (!isEditMode) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {services.map((service, index) => {
          const IconComponent = service.icon as LucideIcon;
          const basePath = locale === 'en' ? '/en/services' : '/tjanster';
          const translateKey = `serviceCategories.${service.slug}` as CopyKey;
          
          return (
            <Link
              key={service.slug}
              to={`${basePath}/${service.slug}`}
              className="group"
            >
              <div 
                className="card-service p-6 text-center h-full transition-all duration-300 animate-fade-in-up hover-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-all duration-300 z-10">
                  <img 
                    src="/assets/fixco-f-icon-new.png" 
                    alt="Fixco" 
                    className="h-6 w-6 object-contain opacity-90"
                  />
                </div>

                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${getGradientForService(service.slug)}`}>
                  <IconComponent className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-base font-bold group-hover:text-primary transition-colors mb-2">
                  {t(translateKey) || service.title}
                </h3>
                
                <p className="text-xs text-muted-foreground">
                  {service.subServices.length} {t('services.count')}
                </p>
                
                <div className="mt-3 text-primary text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  {t('cta.see_all')}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="select-none">
      <div className="text-center p-4 bg-primary/10 rounded-lg mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>Redigeringsläge aktivt</strong> - Hovra över kategorier och dra handtaget för att ändra ordning
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={services.map(s => s.slug)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <SortableCategoryItem
                key={service.slug}
                service={service}
                index={index}
                t={t}
                locale={locale}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default EditableCategoryGridNew;