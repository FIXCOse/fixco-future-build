import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Link } from "react-router-dom";
import { servicesDataNew } from "@/data/servicesDataNew";
import { LucideIcon } from "lucide-react";
import { useCopy } from '@/copy/CopyProvider';
import { useEditMode } from '@/contexts/EditModeContext';
import { ModernDragTest } from './ModernDragTest';
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

const EditableCategoryGrid = () => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  const [services, setServices] = useState(servicesDataNew);

  // Debug logging
  React.useEffect(() => {
    console.log('EditableCategoryGrid services:', services.map(s => ({ slug: s.slug, title: s.title })));
  }, [services]);

  const handleDragEnd = (result: DropResult) => {
    console.log('Drag end result:', result);
    if (!result.destination) return;

    const newServices = Array.from(services);
    const [reorderedItem] = newServices.splice(result.source.index, 1);
    newServices.splice(result.destination.index, 0, reorderedItem);

    setServices(newServices);
    console.log('New order:', newServices.map(s => s.slug));
    // TODO: Save to database
  };

  const onDragStart = (start: any) => {
    console.log('Drag start:', start);
  };

  const onDragUpdate = (update: any) => {
    console.log('Drag update:', update);
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
                className="card-service p-6 text-center h-full hover:shadow-glow transition-all duration-300 animate-fade-in-up hover-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-all duration-300 z-10">
                  <img 
                    src="/assets/fixco-f-icon-new.png" 
                    alt="Fixco" 
                    className="h-6 w-6 object-contain opacity-90"
                  />
                </div>

                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300 ${getGradientForService(service.slug)}`}>
                  <IconComponent className="h-6 w-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
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

  // For now, show the modern drag test instead of the complex drag and drop
  return <ModernDragTest />;
};

export default EditableCategoryGrid;