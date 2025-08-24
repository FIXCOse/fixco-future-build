import { useEffect } from 'react';
import { useBookingWizard } from '../hooks/useBookingWizard';
import { BookingWizardModal } from './BookingWizardModal';

export function BookingWizardProvider({ children }: { children: React.ReactNode }) {
  const wizard = useBookingWizard();

  useEffect(() => {
    const handleOpenWizard = (event: CustomEvent) => {
      const { type, serviceId, serviceName } = event.detail;
      console.log('[BookingWizardProvider] Opening wizard:', { type, serviceId, serviceName });
      wizard.openWizard(type, serviceId, serviceName);
    };

    // Listen for global booking wizard events
    window.addEventListener('open-booking-wizard', handleOpenWizard as EventListener);

    return () => {
      window.removeEventListener('open-booking-wizard', handleOpenWizard as EventListener);
    };
  }, [wizard]);

  return (
    <>
      {children}
      <BookingWizardModal
        isOpen={wizard.isOpen}
        onClose={wizard.closeWizard}
        actionType={wizard.actionType}
        currentStep={wizard.currentStep}
        wizardData={wizard.wizardData}
        loading={wizard.loading}
        setLoading={wizard.setLoading}
        nextStep={wizard.nextStep}
        prevStep={wizard.prevStep}
        updateData={wizard.updateData}
      />
    </>
  );
}