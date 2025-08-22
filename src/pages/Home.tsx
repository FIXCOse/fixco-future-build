import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ComparisonAnimation from "@/components/ComparisonAnimation";
import ServicesOverview from "@/components/ServicesOverview";
import { Button } from "@/components/ui/button-premium";
import { ArrowRight, CheckCircle, Star, Quote } from "lucide-react";
import finishedProject from "@/assets/finished-project.jpg";
import toolsImage from "@/assets/tools-professional.jpg";

const Home = () => {
  console.log("Home component is loading...");
  
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
      
      {/* Simple Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Stora</span> eller{" "}
              <span className="gradient-text">små</span> projekt –{" "}
              <br />
              <span className="text-foreground">Fixco hanterar</span>{" "}
              <span className="gradient-text">allt</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Snabbare, billigare och mer professionellt än våra konkurrenter. 
              <span className="text-primary font-semibold"> Start inom 24h.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-lg">
                Begär offert
              </button>
              <button className="border border-primary/20 text-foreground px-8 py-4 rounded-lg hover:bg-primary/5">
                Se våra tjänster
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Våra <span className="gradient-text">tjänster</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Från små reparationer till stora byggnationer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-4">Snickeri</h3>
              <p className="text-muted-foreground mb-4">Kök, badrum och inredning</p>
              <div className="text-2xl font-bold gradient-text">480 kr/h</div>
              <div className="text-sm text-muted-foreground">Med ROT-avdrag</div>
            </div>
            
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-4">VVS</h3>
              <p className="text-muted-foreground mb-4">Rör, värme och sanitär</p>
              <div className="text-2xl font-bold gradient-text">480 kr/h</div>
              <div className="text-sm text-muted-foreground">Med ROT-avdrag</div>
            </div>
            
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-4">El</h3>
              <p className="text-muted-foreground mb-4">Installation och reparation</p>
              <div className="text-2xl font-bold gradient-text">530 kr/h</div>
              <div className="text-sm text-muted-foreground">Med ROT-avdrag</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8">
              Redo att starta ditt <span className="gradient-text">projekt</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Få en kostnadsfri offert inom 24 timmar
            </p>
            <button className="gradient-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-lg">
              Begär offert nu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;