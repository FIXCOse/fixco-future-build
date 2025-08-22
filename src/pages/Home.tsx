import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ComparisonAnimation from "@/components/ComparisonAnimation";
import ServicesOverview from "@/components/ServicesOverview";
import { Button } from "@/components/ui/button-premium";
import { ArrowRight, CheckCircle, Star, Quote } from "lucide-react";
import finishedProject from "@/assets/finished-project.jpg";
import toolsImage from "@/assets/tools-professional.jpg";

const Home = () => {
  const usps = [
    {
      icon: CheckCircle,
      title: "Snabb service",
      description: "Start inom 24h för de flesta projekt. Vi förstår att tid är pengar."
    },
    {
      icon: CheckCircle,
      title: "Lägre pris",
      description: "480 kr/h med ROT-avdrag. 50% rabatt på arbetskostnaden."
    },
    {
      icon: CheckCircle,
      title: "Helhetslösning",
      description: "Allt inom bygg, mark, montering & service från en leverantör."
    },
    {
      icon: CheckCircle,
      title: "Nationell räckvidd",
      description: "Stora projekt i hela Sverige. Lokala team med nationell styrka."
    }
  ];

  const testimonials = [
    {
      name: "Anna Lindström",
      company: "Lindström Bygg AB",
      text: "Fixco levererade vårt kontorsprojekt 3 veckor före deadline. Otrolig kvalitet och professionalism!",
      rating: 5,
      project: "Kontorsrenovering 800m²"
    },
    {
      name: "Lars Eriksson", 
      company: "Privatperson",
      text: "Fantastisk service från start till mål. ROT-avdraget gjorde det mycket prisvärt. Rekommenderar starkt!",
      rating: 5,
      project: "Kök & badrumsrenovering"
    },
    {
      name: "Maria Johansson",
      company: "Johansson Fastigheter",
      text: "Fixco har varit vår partner i 3 år. Pålitliga, kompetenta och alltid levererar i tid.",
      rating: 5,
      project: "Löpande fastighetsunderhåll"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Comparison Animation */}
      <ComparisonAnimation />
      
      {/* Services Overview */}
      <ServicesOverview />
      
      {/* Why Choose Fixco */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-card/50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Varför välja <span className="gradient-text">Fixco</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Vi kombinerar snabb service, konkurrenskraftiga priser och professionell kvalitet 
                för att leverera Sveriges bästa byggtjänster.
              </p>
              
              <div className="space-y-8">
                {usps.map((usp, index) => {
                  const IconComponent = usp.icon;
                  return (
                    <div 
                      key={usp.title}
                      className="flex items-start space-x-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="w-12 h-12 gradient-primary-subtle rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{usp.title}</h3>
                        <p className="text-muted-foreground">{usp.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-premium">
                <img 
                  src={toolsImage} 
                  alt="Professional construction tools"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 gradient-primary-glow opacity-20" />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-8 -right-8 card-premium p-6 animate-float">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">24h</div>
                  <div className="text-sm text-muted-foreground">Snabb start</div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 card-premium p-6 animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">480kr</div>
                  <div className="text-sm text-muted-foreground">Med ROT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Våra <span className="gradient-text">kunder</span> säger
            </h2>
            <p className="text-xl text-muted-foreground">
              Hundratals nöjda kunder i hela Sverige litar på Fixco
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="card-premium p-8 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t border-border pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  <div className="text-sm text-primary mt-1">{testimonial.project}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Redo att starta ditt <span className="gradient-text">projekt</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Få en kostnadsfri offert inom 24 timmar. Vi hjälper dig från idé till färdigt resultat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button variant="cta" size="xl" className="group">
                Boka nu
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost-premium" size="xl">
                Ring 08-123 456 78
              </Button>
            </div>
            
            <div className="mt-12 p-8 card-premium max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                ROT-avdrag - Spara 50%
              </h3>
              <p className="text-muted-foreground">
                Utnyttja ROT-avdraget och få 50% rabatt på arbetskostnaden. 
                Vi hjälper dig med alla papper och ansökningar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;