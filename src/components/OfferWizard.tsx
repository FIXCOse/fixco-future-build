import { useState } from "react";
import { Button } from "@/components/ui/button-premium";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  CheckCircle2, 
  Home, 
  Clock, 
  Euro,
  FileText
} from "lucide-react";

interface WizardData {
  serviceType: string;
  projectSize: string;
  timeline: string;
  details: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const OfferWizard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    serviceType: '',
    projectSize: '',
    timeline: '',
    details: '',
    contact: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  const [rotEnabled, setRotEnabled] = useState(true);

  const services = [
    { id: 'snickeri', name: 'Snickeri', hourlyRate: 959, icon: '🔨' },
    { id: 'vvs', name: 'VVS', hourlyRate: 959, icon: '🔧' },
    { id: 'montering', name: 'Montering', hourlyRate: 959, icon: '📦' },
    { id: 'tradgard', name: 'Trädgård', hourlyRate: 959, icon: '🌱' },
    { id: 'stadning', name: 'Städning', hourlyRate: 459, icon: '✨' },
    { id: 'el', name: 'El', hourlyRate: 1059, icon: '⚡' },
    { id: 'projektledning', name: 'Projektledning', hourlyRate: 1159, icon: '📋' }
  ];

  const projectSizes = [
    { id: 'small', name: 'Mindre projekt', hours: '2-8 timmar', description: 'Enklare reparationer och monteringar' },
    { id: 'medium', name: 'Medelstort projekt', hours: '1-3 dagar', description: 'Renovering av rum eller större installationer' },
    { id: 'large', name: 'Stort projekt', hours: '1-2 veckor', description: 'Omfattande om- och tillbyggnader' },
    { id: 'custom', name: 'Anpassat', hours: 'Vi diskuterar', description: 'Berätta mer om ditt projekt' }
  ];

  const timelines = [
    { id: 'urgent', name: 'Akut (inom 5 dagar)', icon: '🚨' },
    { id: 'week', name: 'Inom en vecka', icon: '⚡' },
    { id: 'month', name: 'Inom en månad', icon: '📅' },
    { id: 'flexible', name: 'Flexibel', icon: '🤝' }
  ];

  // Calculate estimated price
  const getEstimatedPrice = () => {
    const selectedService = services.find(s => s.id === data.serviceType);
    if (!selectedService) return null;

    let hours = 4; // Default estimate
    if (data.projectSize === 'small') hours = 5;
    if (data.projectSize === 'medium') hours = 20;
    if (data.projectSize === 'large') hours = 60;

    const totalCost = selectedService.hourlyRate * hours;
    const rotDiscount = rotEnabled ? totalCost * 0.5 : 0;
    const finalCost = totalCost - rotDiscount;

    return {
      hours,
      hourlyRate: selectedService.hourlyRate,
      totalCost,
      rotDiscount,
      finalCost
    };
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Wizard data:', data);
    onClose();
    // Here you would send the data to your backend/CRM
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text">Begär offert</h2>
              <p className="text-muted-foreground">Steg {currentStep} av 5</p>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Step 1: Service Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Vilken tjänst behöver du?</h3>
                <p className="text-muted-foreground">Välj den huvudsakliga tjänst du behöver hjälp med</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                  <div 
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                      data.serviceType === service.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, serviceType: service.id }))}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <h4 className="font-semibold">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.hourlyRate} kr/h</p>
                    {rotEnabled && (
                      <p className="text-sm text-primary font-medium">
                        ROT: {service.hourlyRate / 2} kr/h
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Project Size */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Hur stort är projektet?</h3>
                <p className="text-muted-foreground">Detta hjälper oss att ge en mer exakt offert</p>
              </div>
              
              <div className="space-y-4">
                {projectSizes.map(size => (
                  <div 
                    key={size.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                      data.projectSize === size.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, projectSize: size.id }))}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{size.name}</h4>
                        <p className="text-sm text-muted-foreground">{size.description}</p>
                      </div>
                      <span className="text-sm text-primary font-medium">{size.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Timeline */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">När vill du starta?</h3>
                <p className="text-muted-foreground">Vi kan ofta starta redan inom 24 timmar</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {timelines.map(timeline => (
                  <div 
                    key={timeline.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                      data.timeline === timeline.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setData(prev => ({ ...prev, timeline: timeline.id }))}
                  >
                    <div className="text-2xl mb-2">{timeline.icon}</div>
                    <h4 className="font-semibold">{timeline.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Beskriv ditt projekt</h3>
                <p className="text-muted-foreground">Ju mer detaljer desto bättre offert kan vi ge</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="details">Projektbeskrivning</Label>
                  <Textarea 
                    id="details"
                    placeholder="Beskriv vad som ska göras, vilka material som behövs, särskilda önskemål, etc."
                    rows={6}
                    value={data.details}
                    onChange={(e) => setData(prev => ({ ...prev, details: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Contact & Summary */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Kontaktuppgifter</h3>
                <p className="text-muted-foreground">Vi kontaktar dig för att bekräfta detaljer</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Namn *</Label>
                    <Input 
                      id="name"
                      value={data.contact.name}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, name: e.target.value } 
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-post *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={data.contact.email}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, email: e.target.value } 
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input 
                      id="phone"
                      value={data.contact.phone}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, phone: e.target.value } 
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adress</Label>
                    <Input 
                      id="address"
                      value={data.contact.address}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, address: e.target.value } 
                      }))}
                    />
                  </div>
                </div>

                {/* Price Estimate */}
                <div className="card-premium p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    Preliminär kostnadsuppskattning
                  </h4>
                  
                  {/* ROT Toggle */}
                  <div className="mb-4 p-3 border border-primary/20 rounded-lg">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rotEnabled}
                        onChange={(e) => setRotEnabled(e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-medium text-primary">Använd ROT-avdrag</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Spara 50% på arbetskostnaden
                    </p>
                  </div>

                  {getEstimatedPrice() && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Beräknade timmar:</span>
                        <span>{getEstimatedPrice()!.hours}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Timpris:</span>
                        <span>{getEstimatedPrice()!.hourlyRate} kr</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Totalkostnad:</span>
                        <span>{getEstimatedPrice()!.totalCost.toLocaleString()} kr</span>
                      </div>
                      {rotEnabled && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>ROT-avdrag (50%):</span>
                          <span>-{getEstimatedPrice()!.rotDiscount.toLocaleString()} kr</span>
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between font-bold text-lg">
                        <span>Slutkostnad:</span>
                        <span className="gradient-text">
                          {getEstimatedPrice()!.finalCost.toLocaleString()} kr
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-4">
                    * Detta är en preliminär uppskattning. Exakt pris ges efter besök.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>

            {currentStep < 5 ? (
              <Button 
                variant="cta"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !data.serviceType) ||
                  (currentStep === 2 && !data.projectSize) ||
                  (currentStep === 3 && !data.timeline)
                }
              >
                Nästa
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                variant="cta"
                onClick={handleSubmit}
                disabled={!data.contact.name || !data.contact.email || !data.contact.phone}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Skicka förfrågan
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OfferWizard;