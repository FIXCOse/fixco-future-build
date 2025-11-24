import { create } from 'zustand';

interface ScrollSmootherStore {
  smoother: any | null;
  setSmoother: (smoother: any) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

export const useScrollSmootherStore = create<ScrollSmootherStore>((set, get) => ({
  smoother: null,
  isPaused: false,
  setSmoother: (smoother) => set({ smoother }),
  pause: () => {
    const { smoother } = get();
    if (smoother && !get().isPaused) {
      smoother.paused(true);
      set({ isPaused: true });
    }
  },
  resume: () => {
    const { smoother } = get();
    if (smoother && get().isPaused) {
      smoother.paused(false);
      set({ isPaused: false });
    }
  },
}));
