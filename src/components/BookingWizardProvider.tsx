import { useEffect } from 'react';
import { useBookingWizard } from '../hooks/useBookingWizard';
import { BookingWizardModal } from './BookingWizardModal';

export function BookingWizardProvider({ children }: { children: React.ReactNode }) {
  const wizard = useBookingWizard();

  console.log('[BookingWizardProvider] Render with wizard state:', { 
    isOpen: wizard.isOpen, 
    actionType: wizard.actionType, 
    serviceId: wizard.wizardData.service_id 
  });

  useEffect(() => {
    const handleOpenWizard = (event: CustomEvent) => {
      const { type, serviceId, serviceName } = event.detail;
      console.log('[BookingWizardProvider] Received wizard event:', { type, serviceId, serviceName });
      console.log('[BookingWizardProvider] Current wizard state:', { isOpen: wizard.isOpen });
      wizard.openWizard(type, serviceId, serviceName);
      
      // Force re-render check
      setTimeout(() => {
        console.log('[BookingWizardProvider] After openWizard - wizard state:', { 
          isOpen: wizard.isOpen,
          serviceId: wizard.wizardData.service_id 
        });
      }, 100);
    };

    console.log('[BookingWizardProvider] Setting up event listener');
    // Listen for global booking wizard events
    window.addEventListener('open-booking-wizard', handleOpenWizard as EventListener);

    return () => {
      console.log('[BookingWizardProvider] Cleaning up event listener');
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