import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, GripVertical } from 'lucide-react';
import { useEditMode } from '@/stores/useEditMode';
import { InlineText } from './InlineText';
import { useCopy } from '@/copy/CopyProvider';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  title_sv: string;
  title_en?: string;
  description_sv: string;
  description_en?: string;
  base_price: number;
  price_type: string;
  category: string;
  is_active: boolean;
}

interface EditableServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const EditableServiceCard: React.FC<EditableServiceCardProps> = ({
  service,
  onEdit,
  isDragging,
  dragHandleProps
}) => {
  const { isEditMode } = useEditMode();
  const { locale } = useCopy();

  const titleField = `title_${locale}` as keyof Service;
  const descriptionField = `description_${locale}` as keyof Service;

  const title = service[titleField] as string || service.title_sv;
  const description = service[descriptionField] as string || service.description_sv;

  return (
    <Card 
      className={cn(
        "relative transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 rotate-2 shadow-lg",
        isEditMode && "hover:ring-2 hover:ring-primary/20"
      )}
    >
      {isEditMode && (
        <>
          {/* Drag Handle */}
          <div 
            {...dragHandleProps}
            className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Edit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(service)}
            className="absolute top-2 right-2 p-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </>
      )}

      <CardContent className={cn(
        "p-6",
        isEditMode && "pl-12 pr-12"
      )}>
        <div className="space-y-4">
          {/* Title */}
          <InlineText
            id={`service.${service.id}.title`}
            value={title}
            as="h3"
            className="text-lg font-semibold"
          />

          {/* Description */}
          <InlineText
            id={`service.${service.id}.description`}
            value={description}
            as="p"
            className="text-sm text-muted-foreground line-clamp-3"
          />

          {/* Price & Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {service.category}
              </Badge>
              {!service.is_active && (
                <Badge variant="destructive">
                  Inaktiv
                </Badge>
              )}
            </div>

            <div className="text-right">
              <InlineText
                id={`service.${service.id}.base_price`}
                value={service.base_price.toString()}
                as="span"
                className="font-semibold"
              />
              <div className="text-xs text-muted-foreground">
                {service.price_type === 'hourly' ? '/timme' : '/jobb'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};