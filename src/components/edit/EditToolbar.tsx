import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Edit3, 
  Eye, 
  EyeOff, 
  Save, 
  Undo, 
  Redo, 
  Settings,
  Globe
} from 'lucide-react';
import { useEditMode } from '@/stores/useEditMode';
import { useRoleGate } from '@/hooks/useRoleGate';
import { useCopy } from '@/copy/CopyProvider';

interface EditToolbarProps {
  showPublished?: boolean;
  onTogglePreview?: (showPublished: boolean) => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({ 
  showPublished = false, 
  onTogglePreview 
}) => {
  const { canAccessAdmin } = useRoleGate();
  const { 
    isEditMode, 
    canEdit, 
    changes, 
    isPublishing, 
    toggleEditMode, 
    publishAll,
    discard 
  } = useEditMode();
  const { locale } = useCopy();

  // Debug logging
  console.log('EditToolbar render:', { 
    canAccessAdmin, 
    canEdit, 
    isEditMode,
    shouldRender: canAccessAdmin && canEdit 
  });

  if (!canAccessAdmin || !canEdit) {
    console.log('EditToolbar returning null because:', { canAccessAdmin, canEdit });
    return null;
  }

  const changeCount = Object.keys(changes).length;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Edit Mode Toggle */}
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-muted-foreground" />
              <Switch 
                checked={isEditMode}
                onCheckedChange={toggleEditMode}
                disabled={isPublishing}
              />
              <span className="text-sm font-medium">
                {isEditMode ? 'Redigeringsläge' : 'Visningsläge'}
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePreview?.(!showPublished)}
                disabled={!isEditMode}
                className="gap-2"
              >
                {showPublished ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Publicerat
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Utkast
                  </>
                )}
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Language Indicator */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">
                {locale.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Change Counter */}
            {changeCount > 0 && (
              <Badge variant="default" className="gap-1">
                {changeCount} {changeCount === 1 ? 'ändring' : 'ändringar'}
              </Badge>
            )}

            {/* Action Buttons */}
            {isEditMode && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={changeCount === 0}
                  className="gap-2"
                >
                  <Undo className="h-4 w-4" />
                  Ångra
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={changeCount === 0}
                  className="gap-2"
                >
                  <Redo className="h-4 w-4" />
                  Gör om
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => discard()}
                  disabled={changeCount === 0 || isPublishing}
                >
                  Avbryt ändringar
                </Button>

                <Button
                  onClick={publishAll}
                  disabled={changeCount === 0 || isPublishing}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isPublishing ? 'Publicerar...' : 'Publicera'}
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Inställningar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};