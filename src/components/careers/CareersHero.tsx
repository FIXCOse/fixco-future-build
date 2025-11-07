import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export const CareersHero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Briefcase className="w-5 h-5" />
            <span className="text-sm font-medium">Vi söker nya medarbetare</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bli en del av Fixco-familjen
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vi söker skickliga hantverkare som delar vår passion för kvalitet, service och professionalism.
            Hos Fixco erbjuder vi kollektivavtal, konkurrenskraftig lön och flexibla arbetstider.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={scrollToForm} className="text-lg">
              Ansök nu
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToForm}>
              Läs mer om fördelarna
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
