import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { RegistrationWizard } from "./RegistrationWizard";

interface RegistrationWizardModalProps {
  open: boolean;
  onClose: () => void;
}

export function RegistrationWizardModal({ open, onClose }: RegistrationWizardModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  // Scroll lock + focus management
  useEffect(() => {
    if (open) {
      lastActive.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      
      setTimeout(() => {
        panelRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      
      setTimeout(() => {
        lastActive.current?.focus?.();
      }, 100);
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleSuccess = () => {
    onClose();
  };

  if (!open) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md grid place-items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        ref={panelRef}
        tabIndex={-1}
        className="
          w-full max-w-[560px] 
          rounded-2xl bg-background/95 backdrop-blur
          border border-white/10 shadow-2xl 
          overflow-hidden
          focus:outline-none
          relative
        "
      >
        <button
          aria-label="Stäng"
          onClick={onClose}
          className="
            absolute right-4 top-4 z-10
            rounded-full p-2 
            hover:bg-muted/80 
            focus-visible:ring-2 focus-visible:ring-primary 
            transition-colors
          "
        >
          <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </button>

        <div className="max-h-[80vh] overflow-y-auto">
          <RegistrationWizard onClose={onClose} onSuccess={handleSuccess} />
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