import React from 'react';
import { Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/contentStore';

export const ContentLoadingIndicator: React.FC = () => {
  const { isLoading } = useContentStore();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-5 w-5 text-primary" />
            </motion.div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Laddar innehåll</span>
              </div>
              <span className="text-xs text-muted-foreground">Hämtar senaste ändringar...</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};