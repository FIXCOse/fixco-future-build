import { X } from "lucide-react";
import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AuthModal({ open, onClose, children }: AuthModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      // Store the currently focused element
      lastActive.current = document.activeElement as HTMLElement;
      
      // Lock body scroll
      document.body.style.overflow = "hidden";
      
      // Focus the modal
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = "";
      
      // Restore focus to the previously focused element
      setTimeout(() => {
        lastActive.current?.focus?.();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Focus trap implementation
      if (e.key === "Tab" && open) {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            ref={dialogRef}
            tabIndex={-1}
            className="relative w-full max-w-[420px] rounded-2xl bg-background/95 backdrop-blur border border-border/20 shadow-2xl outline-none"
          >
            <button
              aria-label="Stäng"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 p-2 rounded-full hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
            
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}