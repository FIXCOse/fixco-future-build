import React, { useEffect, useState } from 'react';
import { Edit3, Eye, MousePointer2, Save, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditMode } from '@/contexts/EditModeContext';
import { useRoleGate } from '@/hooks/useRoleGate';
import { Badge } from '@/components/ui/badge';

export const EditModeIndicator: React.FC = () => {
  const { isEditMode } = useEditMode();
  const { isAdmin, isOwner } = useRoleGate();
  const [showTip, setShowTip] = useState(false);

  // Show tip when entering edit mode - hook must run before any conditional returns
  useEffect(() => {
    if (isEditMode) {
      setShowTip(true);
      const timer = setTimeout(() => setShowTip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isEditMode]);

  // Only show for admin/owner - conditional return AFTER all hooks
  if (!isAdmin && !isOwner) {
    return null;
  }

  return (
    <AnimatePresence>
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-xl border-2 border-primary-foreground/20">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Edit3 className="h-5 w-5" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="font-semibold text-sm">REDIGERINGSLÄGE AKTIVT</span>
                <span className="text-xs opacity-90">Dubbelklicka på text för att redigera</span>
              </div>

              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                ADMIN
              </Badge>
            </div>
          </div>

          {/* Tip for first time users */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border rounded-lg shadow-lg p-4 max-w-sm text-center"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MousePointer2 className="h-4 w-4 text-primary" />
                  <span>Textelement har en prickad blå ram när de kan redigeras</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModeIndicator;