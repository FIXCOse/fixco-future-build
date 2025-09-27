import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Change {
  scope: string;
  data: any;
  type: 'content' | 'service' | 'media' | 'order';
}

interface EditModeState {
  isEditMode: boolean;
  canEdit: boolean;
  changes: Record<string, Change>;
  locks: Set<string>;
  isPublishing: boolean;
  
  // Actions
  setCanEdit: (canEdit: boolean) => void;
  toggleEditMode: () => void;
  stage: (scope: string, data: any, type: Change['type']) => void;
  discard: (scope?: string) => void;
  publishAll: () => Promise<void>;
  acquireLock: (scope: string) => Promise<boolean>;
  releaseLock: (scope: string) => Promise<void>;
  releaseAllLocks: () => Promise<void>;
}

export const useEditMode = create<EditModeState>((set, get) => ({
  isEditMode: false,
  canEdit: false,
  changes: {},
  locks: new Set(),
  isPublishing: false,

  setCanEdit: (canEdit: boolean) => {
    set({ canEdit });
  },

  toggleEditMode: () => {
    const { isEditMode, releaseAllLocks } = get();
    const newEditMode = !isEditMode;
    
    set({ isEditMode: newEditMode });
    
    // Set edit mode attribute on document for CSS targeting
    if (newEditMode) {
      document.documentElement.setAttribute('data-edit-mode', 'on');
    } else {
      document.documentElement.removeAttribute('data-edit-mode');
      releaseAllLocks();
    }
  },

  stage: (scope: string, data: any, type: Change['type']) => {
    const { changes } = get();
    set({
      changes: {
        ...changes,
        [scope]: { scope, data, type }
      }
    });
  },

  discard: (scope?: string) => {
    const { changes } = get();
    if (scope) {
      const newChanges = { ...changes };
      delete newChanges[scope];
      set({ changes: newChanges });
    } else {
      set({ changes: {} });
    }
  },

  publishAll: async () => {
    const { changes } = get();
    set({ isPublishing: true });

    try {
      const contentChanges: any[] = [];
      const serviceChanges: any[] = [];
      
      // Group changes by type
      Object.values(changes).forEach(change => {
        if (change.type === 'content') {
          const [, key, locale] = change.scope.split(':');
          contentChanges.push({ key, locale });
        } else if (change.type === 'service') {
          const [, serviceId] = change.scope.split(':');
          serviceChanges.push({ id: serviceId, patch: change.data });
        } else if (change.type === 'order') {
          // Handle service reordering
          supabase.rpc('reorder_services', { 
            _service_updates: change.data 
          });
        }
      });

      // Batch publish content blocks
      if (contentChanges.length > 0) {
        await supabase.rpc('rpc_batch_publish_content', {
          p_items: contentChanges
        });
      }

      // Update services individually with versioning
      for (const serviceChange of serviceChanges) {
        await supabase.rpc('rpc_update_service_partial', {
          p_id: serviceChange.id,
          p_patch: serviceChange.patch
        });
      }

      // Clear changes after successful publish
      set({ changes: {} });
      
      // Show success toast
      const { toast } = useToast();
      toast({
        title: "Ändringar publicerade",
        description: `${Object.keys(changes).length} ändringar har publicerats.`
      });

    } catch (error) {
      console.error('Failed to publish changes:', error);
      const { toast } = useToast();
      toast({
        title: "Publicering misslyckades", 
        description: "Försök igen eller kontakta support.",
        variant: "destructive"
      });
    } finally {
      set({ isPublishing: false });
    }
  },

  acquireLock: async (scope: string) => {
    try {
      const { data, error } = await supabase.rpc('rpc_acquire_lock', {
        p_scope: scope
      });

      if (!error && data) {
        const { locks } = get();
        const newLocks = new Set(locks);
        newLocks.add(scope);
        set({ locks: newLocks });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to acquire lock:', error);
      return false;
    }
  },

  releaseLock: async (scope: string) => {
    try {
      await supabase.rpc('rpc_release_lock', {
        p_scope: scope
      });

      const { locks } = get();
      const newLocks = new Set(locks);
      newLocks.delete(scope);
      set({ locks: newLocks });
    } catch (error) {
      console.error('Failed to release lock:', error);
    }
  },

  releaseAllLocks: async () => {
    const { locks } = get();
    const promises = Array.from(locks).map(scope => 
      supabase.rpc('rpc_release_lock', { p_scope: scope })
    );

    try {
      await Promise.all(promises);
      set({ locks: new Set() });
    } catch (error) {
      console.error('Failed to release all locks:', error);
    }
  }
}));