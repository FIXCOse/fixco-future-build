import { create } from 'zustand';

export type ActionType = 'book' | 'quote';

interface WizardState {
  isOpen: boolean;
  actionType: ActionType;
  serviceId: string;
  serviceName: string;
  openWizard: (type: ActionType, serviceId: string, serviceName: string) => void;
  closeWizard: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  isOpen: false,
  actionType: 'book',
  serviceId: '',
  serviceName: '',
  openWizard: (type, serviceId, serviceName) => {
    console.log('[WizardStore] Opening wizard:', { type, serviceId, serviceName });
    console.log('[WizardStore] Current state before:', get());
    set({
      isOpen: true,
      actionType: type,
      serviceId,
      serviceName
    });
    console.log('[WizardStore] New state after:', get());
  },
  closeWizard: () => {
    console.log('[WizardStore] Closing wizard');
    set({
      isOpen: false,
      serviceId: '',
      serviceName: ''
    });
  }
}));