import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Calculator, FileText, Phone, Percent, Receipt } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const RUT = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Boka tjänst",
      description: "Välj RUT när du beställer",
      icon: Calculator,
      details: "Markera att du vill använda RUT-avdrag när du bokar. Vi hanterar resten."
    },
    {
      title: "Vi utför arbetet", 
      description: "Endast arbetskostnaden omfattas",
      icon: Home,
      details: "Vi utför tjänsten enligt överenskommelse. RUT gäller bara arbetskostnad, inte material."
    },
    {
      title: "Avdrag på fakturan",
      description: "Vi administrerar ansökan",
      icon: Receipt,
      details: "Du betalar direkt det reducerade priset. Vi sköter all administration mot Skatteverket."
    }
  ];

  const rutServices = [
    {
      category: "Städning i hemmet",
      services: ["Hemstädning", "Veckostäd", "Storstädning", "Flyttstädning", "Fönsterputs"]
    },
    {
      category: "Trädgård",
      services: ["Gräsklippning", "Häckklippning", "Ogräsrensning", "Lövkrattning", "Snöskottning/sandning"]
    },
    {
      category: "Flytt",
      services: ["Bärhjälp", "Lastning/lossning", "Enklare packning/uppackning"]
    }
  ];

  const faqs = [
    {
      question: "Vad gäller för RUT?",
      answer: "50% avdrag på arbetskostnaden för hushållsnära tjänster. Vi sköter ansökan och drar av direkt på fakturan."
    },
    {
      question: "Vilka tjänster omfattas av RUT hos Fixco?",
      answer: "Städning, flytt och enklare trädgårdsarbete som gräsklippning, häckklippning och snöskottning."
    },
    {
      question: "Kan jag kombinera ROT och RUT?",
      answer: "Beror på tjänstetyp. ROT för renovering/bygg/el/VVS; RUT för hushållsnära som städ/flytt/trädgård."
    },
    {
      question: "Gäller material och resor?",
      answer: "Nej, avdraget gäller endast arbetskostnaden. Material och resor betalas till ordinarie pris."
    },
    {
      question: "Hur väljer jag RUT hos er?",
      answer: "Markera RUT i beställningsflödet eller säg till vid kontakt; vi löser resten."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background relative">
        {/* F Watermark Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute top-20 right-20 w-24 h-24 object-contain rotate-12 opacity-30 animate-pulse"
            style={{ animationDuration: '5s' }}
          />
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute bottom-20 left-20 w-20 h-20 object-contain -rotate-6 opacity-25 animate-pulse"
            style={{ animationDuration: '4s', animationDelay: '2s' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 gradient-primary-subtle rounded-xl flex items-center justify-center mr-6 relative">
                {/* F Brand Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center opacity-70 hover:opacity-90 transition-opacity">
                  <img 
                    src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                    alt="Fixco" 
                    className="h-3 w-3 object-contain"
                  />
                </div>
                <Percent className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="gradient-text">RUT-avdrag</span> – spara 50%
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  på hushållsnära tjänster
                </p>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Som privatperson kan du få RUT-avdrag på arbetskostnaden för t.ex. städning, flytt och trädgård. 
              Vi sköter allt mot Skatteverket – avdraget görs direkt på fakturan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  Begär RUT-offert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                Ring: 08-123 456 78
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Så funkar <span className="gradient-text">RUT-avdraget</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Enkelt i 3 steg – vi sköter allt administrativt
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeStep === index;
                
                return (
                  <Card
                    key={index}
                    className={`p-6 cursor-pointer transition-all duration-300 relative ${isActive ? 'border-primary shadow-glow' : 'hover:shadow-card'}`}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* F Brand Badge */}
                    <div className="absolute bottom-3 right-3 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 z-10">
                      <img 
                        src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                        alt="Fixco" 
                        className="h-3 w-3 object-contain opacity-90"
                      />
                    </div>

                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <p className="text-sm text-muted-foreground">{step.details}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* RUT Services */}
      <section className="py-20 bg-gradient-primary-subtle relative">
        {/* F Watermark Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute top-16 right-16 w-18 h-18 object-contain rotate-12 opacity-30 animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute bottom-16 left-16 w-14 h-14 object-contain -rotate-6 opacity-25 animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1.5s' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                RUT-tjänster vi <span className="gradient-text">erbjuder</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Alla dessa tjänster berättigar till 50% RUT-avdrag
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {rutServices.map((category, index) => (
                <Card key={index} className="p-6 relative">
                  {/* F Brand Badge */}
                  <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 z-10">
                    <img 
                      src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                      alt="Fixco" 
                      className="h-3 w-3 object-contain opacity-90"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-primary">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-blue-50/50 border border-blue-200/50 rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Obs:</strong> RUT gäller hushållsnära arbete i eller i anslutning till bostaden. 
                Avdrag gäller arbetskostnad (inte material/resor). Gäller enligt Skatteverkets regler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Vanliga frågor om <span className="gradient-text">RUT</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Svar på de vanligaste frågorna om RUT-avdrag
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6 relative">
                  {/* F Brand Badge */}
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 z-10">
                    <img 
                      src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                      alt="Fixco" 
                      className="h-3 w-3 object-contain opacity-90"
                    />
                  </div>

                  <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Redo att spara 50% med <span className="gradient-text">RUT</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Kontakta oss så hjälper vi dig komma igång med RUT-avdrag direkt
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/kontakt">
                <div className="relative">
                  {/* F Brand Badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                    <img 
                      src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                      alt="Fixco" 
                      className="h-3.5 w-3.5 object-contain opacity-90"
                    />
                  </div>
                  <Button size="lg" className="w-full gradient-primary text-primary-foreground font-bold">
                    Begär RUT-offert
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Link>
              <a href="tel:08-123456789">
                <div className="relative">
                  {/* F Brand Badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                    <img 
                      src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                      alt="Fixco" 
                      className="h-3.5 w-3.5 object-contain opacity-90"
                    />
                  </div>
                  <Button size="lg" variant="outline" className="w-full border-primary/30 hover:bg-primary/10 font-bold">
                    <Phone className="mr-2 h-5 w-5" />
                    Ring nu: 08-123 456 78
                  </Button>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RUT;