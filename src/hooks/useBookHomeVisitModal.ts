import { create } from 'zustand';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';

interface BookHomeVisitModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useBookHomeVisitModal = create<BookHomeVisitModalStore>((set) => ({
  isOpen: false,
  open: () => {
    openServiceRequestModal({ mode: 'home_visit', showCategories: true });
    set({ isOpen: true });
  },
  close: () => set({ isOpen: false }),
}));
