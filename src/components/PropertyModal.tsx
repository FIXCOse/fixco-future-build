import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface PropertyModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function PropertyModal({ open, onClose, children, title = "Lägg till fastighet" }: PropertyModalProps) {
  // Lock scroll when modal is open
  useScrollLock(open);
  
  useEffect(() => {
    if (!open) return;
    
    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
        className="relative z-[110] w-full max-w-lg rounded-lg bg-background border shadow-2xl pointer-events-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Stäng modal"
            className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Body - Allow content to overflow for dropdowns */}
        <div className="p-4 overflow-visible flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}