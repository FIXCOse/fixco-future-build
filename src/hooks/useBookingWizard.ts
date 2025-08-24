import { useState } from 'react';
import { useAuth } from './useAuth';

export type ActionType = 'book' | 'quote';

export interface WizardData {
  // Contact info
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  
  // Address
  address: string;
  postal_code: string;
  city: string;
  
  // Service details
  service_id: string;
  service_name: string;
  
  // Booking specific
  price_type: 'hourly' | 'fixed' | 'quote';
  hours_estimated?: number;
  hourly_rate?: number;
  materials?: number;
  
  // Quote specific  
  message?: string;
  
  // Common
  rot_rut_type?: 'ROT' | 'RUT' | null;
  notes?: string;
}

export function useBookingWizard() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('book');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [wizardData, setWizardData] = useState<WizardData>({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    postal_code: '',
    city: '',
    service_id: '',
    service_name: '',
    price_type: 'hourly'
  });

  const openWizard = (type: ActionType, serviceId: string, serviceName: string) => {
    console.log('[BookingWizard] Opening wizard:', { type, serviceId, serviceName });
    
    // Reset wizard state
    setCurrentStep(1);
    setLoading(false);
    setActionType(type);
    
    // Pre-fill data
    const baseData: WizardData = {
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      postal_code: '',
      city: '',
      service_id: serviceId,
      service_name: serviceName,
      price_type: 'hourly'
    };

    // Pre-fill with user data if logged in
    if (user && profile) {
      baseData.contact_name = profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`
        : profile.first_name || '';
      baseData.contact_email = profile.email || user.email || '';
      baseData.contact_phone = profile.phone || '';
      baseData.address = profile.address_line || '';
      baseData.postal_code = profile.postal_code || '';
      baseData.city = profile.city || '';
    }
    
    setWizardData(baseData);
    setIsOpen(true);
  };

  const closeWizard = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setLoading(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const updateData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  return {
    isOpen,
    actionType,
    currentStep,
    wizardData,
    loading,
    setLoading,
    openWizard,
    closeWizard,
    nextStep,
    prevStep,
    updateData
  };
}