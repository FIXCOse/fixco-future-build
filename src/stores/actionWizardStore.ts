import { create } from "zustand";

type Mode = "book" | "quote";
type OpenPayload = {
  mode: Mode;
  serviceId?: string;
  serviceName?: string;
  defaults?: { hourlyRate?: number; priceType?: "hourly"|"fixed"|"quote" };
};

type State = {
  isOpen: boolean;
  mode: Mode | null;
  payload: OpenPayload | null;
  open: (p: OpenPayload) => void;
  close: () => void;
};

export const useActionWizard = create<State>((set) => ({
  isOpen: false,
  mode: null,
  payload: null,
  open: (p) => set({ isOpen: true, mode: p.mode, payload: p }),
  close: () => set({ isOpen: false, mode: null, payload: null }),
}));