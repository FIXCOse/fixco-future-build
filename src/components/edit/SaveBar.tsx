import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Save, FileText } from 'lucide-react';
import { useEditMode } from '@/stores/useEditMode';
import { cn } from '@/lib/utils';

export const SaveBar: React.FC = () => {
  const { 
    changes, 
    isPublishing, 
    publishAll, 
    discard 
  } = useEditMode();

  const changeCount = Object.keys(changes).length;

  if (changeCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-medium">
                {changeCount} {changeCount === 1 ? 'ändring väntar' : 'ändringar väntar'}
              </span>
            </div>
            
            {isPublishing && (
              <div className="flex items-center gap-2">
                <Progress value={undefined} className="w-32 h-2" />
                <span className="text-sm opacity-90">Publicerar...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => discard()}
              disabled={isPublishing}
              className="text-white hover:bg-white/10 gap-2"
            >
              <X className="h-4 w-4" />
              Ångra alla
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={isPublishing}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Spara utkast
            </Button>

            <Button
              onClick={publishAll}
              disabled={isPublishing}
              className={cn(
                "bg-white text-primary hover:bg-white/90 gap-2",
                "shadow-lg font-medium px-6"
              )}
            >
              <Save className="h-4 w-4" />
              {isPublishing ? 'Publicerar...' : 'Publicera alla'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};