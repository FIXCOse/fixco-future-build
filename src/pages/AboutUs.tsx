import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button-premium";
import { CheckCircle, Star, Users, Award, Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Om <span className="gradient-text">Fixco</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Sveriges mest avancerade helhetsentreprenör inom bygg, mark och service. 
              Vi levererar professionella lösningar med AI-optimerad effektivitet.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Vår <span className="gradient-text">historia</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Fixco grundades med visionen att revolutionera byggbranschen genom att kombinera 
                traditionell hantverkskunskap med modern teknik och AI-optimerade processer.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Vi har utvecklat Sveriges mest effektiva system för projektledning, kvalitetskontroll 
                och kundservice, vilket gör att vi kan leverera snabbare, billigare och med högre kvalitet 
                än våra konkurrenter.
              </p>
              <p className="text-lg text-muted-foreground">
                Idag är vi Sveriges ledande helhetsentreprenör med över 98% nöjda kunder och 
                projektstart inom 24 timmar.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Nöjda kunder</div>
              </div>
              <div className="card-premium p-6">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">{'< 5 dagar'}</div>
                <div className="text-sm text-muted-foreground">Projektstart</div>
              </div>
              <div className="card-premium p-6">
                <Award className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Kundnöjdhet</div>
              </div>
              <div className="card-premium p-6">
                <Star className="h-8 w-8 text-primary mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">5 år</div>
                <div className="text-sm text-muted-foreground">Garanti</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Våra <span className="gradient-text">värderingar</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Snabbhet",
                description: "Vi förstår att tiden är värdefull. Därför erbjuder vi projektstart inom 24 timmar och effektiva arbetsprocesser.",
                icon: Clock
              },
              {
                title: "Kvalitet", 
                description: "Vi använder endast högkvalitativa material och certifierade hantverkare. 5 års garanti på alla våra arbeten.",
                icon: Award
              },
              {
                title: "Transparens",
                description: "Inga dolda kostnader eller överraskningar. Du får alltid en tydlig offert och vet exakt vad du betalar.",
                icon: CheckCircle
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={value.title} className="card-premium p-8 text-center animate-fade-in-up" 
                     style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-16 h-16 gradient-primary-subtle rounded-xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-8">
            <span className="gradient-text">Täckningsområde</span>
          </h2>
          <div className="card-premium p-8 mb-8">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Uppsala & Stockholms län</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Vi arbetar främst i Uppsala och Stockholms län där vi kan garantera 
              snabb service och lokal närvaro.
            </p>
            <p className="text-muted-foreground">
              <strong>Större projekt:</strong> För projekt över 50 000 kr åtar vi oss uppdrag i hela Sverige 
              med samma höga kvalitet och service.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Redo att starta ditt <span className="gradient-text">projekt</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Kontakta oss idag för en kostnadsfri konsultation och offert.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  Begär offert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:08-123456789">
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-bold">
                  <Phone className="mr-2 h-5 w-5" />
                  Ring: 08-123 456 78
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;