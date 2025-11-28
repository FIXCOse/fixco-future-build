import { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ArrowLeft, CheckCircle, Home, Clock, MapPin, User, Zap, Droplets, Hammer, Paintbrush, Package, Sparkles, TreePine, Mountain, AlertCircle, CalendarClock, CalendarDays, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useBookHomeVisitModal } from '@/hooks/useBookHomeVisitModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';

interface WizardData {
  projectTypes: string[];
  desiredTime: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

const BookHomeVisitModal = () => {
  const { isOpen, close } = useBookHomeVisitModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    projectTypes: [],
    desiredTime: '',
    address: { street: '', postalCode: '', city: '' },
    contact: { name: '', email: '', phone: '', message: '' }
  });

  useScrollLock(isOpen);

  const totalSteps = 4;

  const projectTypes = [
    { id: 'el', name: 'El', icon: Zap, desc: 'Elmontör' },
    { id: 'vvs', name: 'VVS', icon: Droplets, desc: 'VVS-installation' },
    { id: 'snickeri', name: 'Snickeri', icon: Hammer, desc: 'Snickare' },
    { id: 'malning', name: 'Målning', icon: Paintbrush, desc: 'Målare' },
    { id: 'montering', name: 'Montering', icon: Package, desc: 'Montör' },
    { id: 'stadning', name: 'Städning', icon: Sparkles, desc: 'Städtjänster' },
    { id: 'tradgard', name: 'Trädgård', icon: TreePine, desc: 'Trädgårdsskötsel' },
    { id: 'mark', name: 'Mark', icon: Mountain, desc: 'Markarbeten' }
  ];

  const desiredTimes = [
    { id: 'asap', name: 'Så snart som möjligt', icon: AlertCircle, desc: 'Akut behov' },
    { id: '1-2days', name: 'Inom 1-2 dagar', icon: CalendarClock, desc: 'Snabbt besök' },
    { id: 'week', name: 'Inom en vecka', icon: CalendarDays, desc: 'Ingen brådska' },
    { id: 'month', name: 'Nästa månad', icon: CalendarRange, desc: 'Planerat projekt' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedProjects = projectTypes.filter(p => wizardData.projectTypes.includes(p.id));
      const selectedTime = desiredTimes.find(t => t.id === wizardData.desiredTime);

      const projectList = selectedProjects.map(p => p.name).join(', ');

      const payload = {
        mode: 'home_visit',
        name: wizardData.contact.name,
        email: wizardData.contact.email,
        phone: wizardData.contact.phone,
        address: wizardData.address.street,
        postal_code: wizardData.address.postalCode,
        city: wizardData.address.city,
        message: `${wizardData.contact.message}\n\nProjekttyper: ${projectList}\nÖnskad tid: ${selectedTime?.name}`,
        customer_type: 'private'
      };

      const { data, error } = await supabase.functions.invoke('create-booking-with-quote', {
        body: payload
      });

      if (error) throw error;

      toast({
        title: "Hembesök bokat! 🎉",
        description: "Vi kontaktar dig inom kort för att bekräfta tid.",
      });

      // Reset and close
      setWizardData({
        projectTypes: [],
        desiredTime: '',
        address: { street: '', postalCode: '', city: '' },
        contact: { name: '', email: '', phone: '', message: '' }
      });
      setCurrentStep(1);
      close();
    } catch (error) {
      console.error('Error booking home visit:', error);
      toast({
        title: "Något gick fel",
        description: "Kunde inte boka hembesök. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setWizardData({
      projectTypes: [],
      desiredTime: '',
      address: { street: '', postalCode: '', city: '' },
      contact: { name: '', email: '', phone: '', message: '' }
    });
    setCurrentStep(1);
    close();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-background border border-border rounded-xl shadow-elegant">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                Boka Hembesök
              </h2>
              <p className="text-muted-foreground text-sm">
                Steg {currentStep} av {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="shrink-0"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[50vh] overflow-y-auto overscroll-contain p-6">
            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Vad behöver du hjälp med?</h3>
                <p className="text-sm text-muted-foreground mb-4">Välj en eller flera tjänster</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {projectTypes.map(type => {
                    const IconComponent = type.icon;
                    const isSelected = wizardData.projectTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          const newTypes = isSelected
                            ? wizardData.projectTypes.filter(t => t !== type.id)
                            : [...wizardData.projectTypes, type.id];
                          setWizardData({...wizardData, projectTypes: newTypes});
                        }}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-center hover:scale-105",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-glow"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="mb-2 flex justify-center">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <div className="font-bold text-sm">{type.name}</div>
                        <div className="text-xs text-muted-foreground">{type.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Desired Time */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  När vill du ha hembesök?
                </h3>
                <div className="space-y-3">
                  {desiredTimes.map(time => {
                    const IconComponent = time.icon;
                    return (
                      <button
                        key={time.id}
                        onClick={() => setWizardData({...wizardData, desiredTime: time.id})}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 transition-all text-left hover:scale-[1.02]",
                          wizardData.desiredTime === time.id
                            ? "border-primary bg-primary/10 shadow-glow"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <div className="flex-1">
                            <div className="font-bold">{time.name}</div>
                            <div className="text-sm text-muted-foreground">{time.desc}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Var ligger projektet?
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Gatuadress</label>
                    <AddressAutocomplete
                      value={wizardData.address.street}
                      onChange={(value) => setWizardData({
                        ...wizardData,
                        address: { ...wizardData.address, street: value }
                      })}
                      onSelect={(address) => {
                        setWizardData({
                          ...wizardData,
                          address: {
                            street: address.street,
                            postalCode: address.postalCode,
                            city: address.city
                          }
                        });
                      }}
                      placeholder="Ex: Storgatan 12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Postnummer</label>
                      <input
                        type="text"
                        value={wizardData.address.postalCode}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          address: {...wizardData.address, postalCode: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="123 45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stad</label>
                      <input
                        type="text"
                        value={wizardData.address.city}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          address: {...wizardData.address, city: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Ex: Stockholm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Dina kontaktuppgifter
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Namn *</label>
                      <input
                        type="text"
                        value={wizardData.contact.name}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, name: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">E-post *</label>
                      <input
                        type="email"
                        value={wizardData.contact.email}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, email: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="din@email.se"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Telefon *</label>
                      <input
                        type="tel"
                        value={wizardData.contact.phone}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, phone: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="+46 70 123 45 67"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Meddelande (valfritt)</label>
                      <textarea
                        value={wizardData.contact.message}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, message: e.target.value}
                        })}
                        rows={3}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                        placeholder="Berätta mer om ditt projekt..."
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="font-bold mb-2">Sammanfattning:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projekttyper:</span>
                      <span className="font-medium">
                        {projectTypes.filter(p => wizardData.projectTypes.includes(p.id)).map(p => p.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Önskad tid:</span>
                      <span className="font-medium">
                        {desiredTimes.find(t => t.id === wizardData.desiredTime)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adress:</span>
                      <span className="font-medium">
                        {wizardData.address.city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Tillbaka</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && wizardData.projectTypes.length === 0) ||
                  (currentStep === 2 && !wizardData.desiredTime) ||
                  (currentStep === 3 && (!wizardData.address.street || !wizardData.address.postalCode || !wizardData.address.city))
                }
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
              >
                <span>Nästa</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  !wizardData.contact.name || 
                  !wizardData.contact.email || 
                  !wizardData.contact.phone ||
                  isSubmitting
                }
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                    <span>Skickar...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Boka hembesök</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookHomeVisitModal;
