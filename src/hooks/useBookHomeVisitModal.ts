import { create } from 'zustand';

interface BookHomeVisitModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useBookHomeVisitModal = create<BookHomeVisitModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
