import { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ArrowLeft, Calculator, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfferWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WizardData {
  service: string;
  scope: string;
  timeline: string;
  location: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const OfferWizardModal = ({ isOpen, onClose }: OfferWizardModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    service: '',
    scope: '',
    timeline: '',
    location: '',
    contact: { name: '', email: '', phone: '' }
  });

  const totalSteps = 5;

  const services = [
    { id: 'el', name: 'El', icon: '⚡', price: '480 kr/h' },
    { id: 'vvs', name: 'VVS', icon: '🚿', price: '480 kr/h' },
    { id: 'snickeri', name: 'Snickeri', icon: '🔨', price: '480 kr/h' },
    { id: 'montering', name: 'Montering', icon: '🔧', price: '350 kr/h' },
    { id: 'markarbeten', name: 'Mark', icon: '⛏️', price: '600 kr/h' },
    { id: 'stadning', name: 'Städning', icon: '✨', price: '45 kr/m²' }
  ];

  const scopes = [
    { id: 'small', name: 'Litet projekt', desc: '1-2 timmar', hours: 1.5 },
    { id: 'medium', name: 'Mellanstor', desc: '3-8 timmar', hours: 5.5 },
    { id: 'large', name: 'Stort projekt', desc: '1-3 dagar', hours: 16 },
    { id: 'custom', name: 'Anpassat', desc: 'Begär offert', hours: 0 }
  ];

  const timelines = [
    { id: 'acute', name: 'Akut (inom 4h)', icon: '🚨', extra: '+50% akuttillägg' },
    { id: 'asap', name: 'Inom < 5 dagar', icon: '⚡', extra: 'Standardpris' },
    { id: 'week', name: 'Inom veckan', icon: '📅', extra: '5% rabatt' },
    { id: 'month', name: 'Nästa månad', icon: '🗓️', extra: '10% rabatt' }
  ];

  const locations = [
    'Stockholm centrum', 'Stockholm söder', 'Stockholm norr', 'Stockholm väster', 'Stockholm öster',
    'Uppsala centrum', 'Uppsala norr', 'Uppsala söder', 'Övriga Uppsala län'
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

  const calculateEstimate = () => {
    const selectedService = services.find(s => s.id === wizardData.service);
    const selectedScope = scopes.find(s => s.id === wizardData.scope);
    
    if (!selectedService || !selectedScope || selectedScope.hours === 0) {
      return { estimate: 'Offert', rotSavings: 'Varierar' };
    }

    const basePrice = parseInt(selectedService.price.split(' ')[0]);
    const hours = selectedScope.hours;
    const total = basePrice * hours;
    const rotSavings = Math.min(total * 0.5, 50000);
    
    return {
      estimate: `${total.toLocaleString('sv-SE')} kr`,
      rotSavings: `${rotSavings.toLocaleString('sv-SE')} kr`
    };
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="card-premium bg-background border border-border rounded-xl shadow-glow flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold">Få din offert på 2 minuter</h2>
              <p className="text-muted-foreground text-sm">
                Steg {currentStep} av {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4 flex-shrink-0">
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="h-2 bg-gradient-primary rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Vilken tjänst behöver du?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map(service => (
                    <button
                      key={service.id}
                      onClick={() => setWizardData({...wizardData, service: service.id})}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        wizardData.service === service.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-bold">{service.name}</div>
                      <div className="text-sm text-primary">{service.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Scope */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Projektets omfattning?</h3>
                <div className="space-y-3">
                  {scopes.map(scope => (
                    <button
                      key={scope.id}
                      onClick={() => setWizardData({...wizardData, scope: scope.id})}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 transition-all text-left",
                        wizardData.scope === scope.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold">{scope.name}</div>
                          <div className="text-sm text-muted-foreground">{scope.desc}</div>
                        </div>
                        {scope.hours > 0 && (
                          <div className="text-primary font-bold">
                            {scope.hours}h
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Timeline */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-bold mb-4">När vill du starta?</h3>
                <div className="space-y-3">
                  {timelines.map(timeline => (
                    <button
                      key={timeline.id}
                      onClick={() => setWizardData({...wizardData, timeline: timeline.id})}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 transition-all text-left",
                        wizardData.timeline === timeline.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{timeline.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold">{timeline.name}</div>
                          <div className="text-sm text-muted-foreground">{timeline.extra}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Var ligger projektet?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {locations.map(location => (
                    <button
                      key={location}
                      onClick={() => setWizardData({...wizardData, location})}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-left",
                        wizardData.location === location
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{location}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Contact & Summary */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Din preliminära offert</h3>
                  
                  {/* Summary */}
                  <div className="card-premium p-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Tjänst:</span>
                        <span className="font-bold">
                          {services.find(s => s.id === wizardData.service)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Omfattning:</span>
                        <span className="font-bold">
                          {scopes.find(s => s.id === wizardData.scope)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-bold">
                          {timelines.find(t => t.id === wizardData.timeline)?.name}
                        </span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between text-lg">
                        <span>Beräknat pris:</span>
                        <span className="font-bold">{calculateEstimate().estimate}</span>
                      </div>
                      <div className="flex justify-between text-primary">
                        <span>ROT-besparing:</span>
                        <span className="font-bold">-{calculateEstimate().rotSavings}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h4 className="font-bold mb-4">Dina kontaktuppgifter</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Namn</label>
                      <input
                        type="text"
                        value={wizardData.contact.name}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, name: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">E-post</label>
                      <input
                        type="email"
                        value={wizardData.contact.email}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, email: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="din@email.se"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Telefon</label>
                      <input
                        type="tel"
                        value={wizardData.contact.phone}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          contact: {...wizardData.contact, phone: e.target.value}
                        })}
                        className="w-full p-3 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="+46 79 335 02 28"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-border flex-shrink-0">
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
                  (currentStep === 1 && !wizardData.service) ||
                  (currentStep === 2 && !wizardData.scope) ||
                  (currentStep === 3 && !wizardData.timeline) ||
                  (currentStep === 4 && !wizardData.location)
                }
                className="flex items-center space-x-2 gradient-primary text-primary-foreground"
              >
                <span>Nästa</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // Handle form submission
                  alert('Offert skickad! Vi återkommer inom 1 timme.');
                  onClose();
                }}
                disabled={!wizardData.contact.name || !wizardData.contact.email}
                className="flex items-center space-x-2 gradient-primary text-primary-foreground"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Skicka offert</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OfferWizardModal;