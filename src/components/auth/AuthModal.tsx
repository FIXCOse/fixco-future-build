import { X } from "lucide-react";
import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AuthModal({ open, onClose, children }: AuthModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  // Scroll lock + focus management
  useEffect(() => {
    if (open) {
      // Store the currently focused element
      lastActive.current = document.activeElement as HTMLElement;
      
      // Lock body scroll
      document.body.style.overflow = "hidden";
      
      // Focus the modal panel
      setTimeout(() => {
        panelRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = "";
      
      // Restore focus to the previously focused element
      setTimeout(() => {
        lastActive.current?.focus?.();
      }, 100);
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC key to close + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      
      // Focus trap implementation
      if (e.key === "Tab" && open && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey) {
            // Shift + Tab - go to last element if on first
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab - go to first element if on last
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

  if (!open) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      role="dialog"
      aria-modal="true"
      data-testid="auth-modal"
      className="
        fixed inset-0 z-[100] 
        flex items-center justify-center
        p-4
        bg-black/50 
        backdrop-blur-sm md:backdrop-blur
        overflow-y-auto
        min-h-[100dvh]
      "
      onMouseDown={(e) => {
        // Click outside to close - use onMouseDown to prevent bubbling issues
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        ref={panelRef}
        tabIndex={-1}
        className="
          relative w-full max-w-[420px] 
          rounded-2xl bg-background/95 backdrop-blur
          border border-border/20 shadow-2xl outline-none
          max-h-none overflow-visible
          my-8
          no-scrollbar
          pointer-events-auto
          focus:outline-none
        "
      >
        <button
          aria-label="Stäng"
          onClick={onClose}
          className="
            absolute right-3 top-3 z-10
            rounded-full p-2 
            hover:bg-muted/80 
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
            transition-colors
          "
        >
          <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </button>

        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>
      {open && modalContent}
    </AnimatePresence>, 
    document.body
  );
}