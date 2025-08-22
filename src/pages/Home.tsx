import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Award, Users, MapPin, Star, ChevronRight, 
         Hammer, Droplets, Wrench, TreePine, Sparkles, ClipboardList, 
         Shovel, Cpu, Zap, Building } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import AdvancedComparison from "@/components/AdvancedComparison";

const Home = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    services: false,
    whyChoose: false,
    testimonials: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section');
            if (section) {
              setIsVisible(prev => ({ ...prev, [section]: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const services = [
    { name: "Snickeri", icon: Hammer, price: "480 kr/h", description: "Inredning, kök, badrum", slug: "snickeri" },
    { name: "VVS", icon: Droplets, price: "480 kr/h", description: "Rör, värme, sanitär", slug: "vvs" },
    { name: "Montering", icon: Wrench, price: "480 kr/h", description: "Möbler, vitvaror, fästen", slug: "montering" },
    { name: "Trädgård", icon: TreePine, price: "480 kr/h", description: "Trädgårdsskötsel, plantering", slug: "tradgard" },
    { name: "Städning", icon: Sparkles, price: "480 kr/h", description: "Hem, byggstäd, kontor", slug: "stadning" },
    { name: "El", icon: Zap, price: "480 kr/h", description: "Installation, belysning", slug: "el" }
  ];

  const whyChooseUs = [
    { icon: Clock, title: "Start inom 24h", description: "Vi påbörjar ditt projekt redan nästa dag" },
    { icon: Award, title: "Lägst pris (ROT)", description: "480 kr/h efter ROT-avdrag - ingen kan matcha" },
    { icon: Users, title: "Helhetslösning", description: "En kontakt för alla dina projekt" },
    { icon: MapPin, title: "Lokalt + Nationellt", description: "Uppsala & Stockholm, nationellt vid större projekt" }
  ];

  const testimonials = [
    {
      name: "Maria Andersson", location: "Stockholm", project: "Kök & badrumsrenovering", rating: 5,
      quote: "Otroligt professionella och snabba. Började redan dagen efter offerten och levererade exakt vad som lovades. Rekommenderar starkt!"
    },
    {
      name: "Johan Eriksson", location: "Uppsala", project: "Komplett takbyte", rating: 5,
      quote: "Fixco hanterade allt från A till Ö. Fantastisk kvalitet till oslagbart pris med ROT-avdrag. Kommer definitivt använda dem igen."
    },
    {
      name: "Anna Nilsson", location: "Västerås", project: "Trädgård & altan", rating: 5,
      quote: "Förvandlade vår trädgård till en oas på rekordtid. Personalen var kunnig och hjälpsam genom hela processen."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background relative overflow-hidden" data-section="hero">
        <div className="container mx-auto px-4">
          <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="gradient-text">Fixco</span> –<br />
              Din helhetsentreprenör<br />
              inom <span className="gradient-text">bygg, mark & service</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto">
              Snabbare, mer prisvärt och professionellare än våra konkurrenter.<br />
              <span className="text-primary font-semibold">Start inom 24h • ROT-avdrag 480 kr/h</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/kontakt">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold text-lg px-8 py-4 shadow-premium hover:shadow-glow transition-all duration-300">
                  Begär offert <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tjanster">
                <Button variant="outline" size="lg" className="font-bold text-lg px-8 py-4 border-primary/30 hover:bg-primary/10">
                  Se våra tjänster <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-float" style={{ animationDelay: '0s' }}>
                <div className="text-3xl font-bold gradient-text">24h</div>
                <div className="text-sm text-muted-foreground">Projektstart</div>
              </div>
              <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="text-3xl font-bold gradient-text">480kr</div>
                <div className="text-sm text-muted-foreground">Med ROT-avdrag</div>
              </div>
              <div className="animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-3xl font-bold gradient-text">98%</div>
                <div className="text-sm text-muted-foreground">Nöjda kunder</div>
              </div>
              <div className="animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground">Avklarade projekt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Comparison Section */}
      <AdvancedComparison />

      {/* Main Services Overview */}
      <section className="py-24" data-section="services">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Våra <span className="gradient-text">huvudtjänster</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Från små reparationer till stora byggnationer – vi hanterar allt med professionalism och kvalitet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Link key={service.name} to={`/tjanster/${service.slug}`} className={`card-service group transition-all duration-500 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">{service.price}</div>
                      <div className="text-sm text-muted-foreground">Med ROT-avdrag</div>
                    </div>
                    <div className="text-sm gradient-text font-semibold">Se alla tjänster →</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/tjanster">
              <Button size="lg" variant="outline" className="font-bold border-primary/30 hover:bg-primary/10">
                Se alla våra tjänster <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Fixco */}
      <section className="py-24 gradient-primary-subtle" data-section="whyChoose">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.whyChoose ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Varför välja <span className="gradient-text">Fixco</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Vi erbjuder den perfekta kombinationen av hastighet, kvalitet och pris
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={item.title} className={`card-premium p-8 text-center group hover:scale-105 transition-all duration-500 ${isVisible.whyChoose ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                  <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-br gradient-primary-subtle w-fit">
                    <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:gradient-text transition-all">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" data-section="testimonials">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Våra kunder <span className="gradient-text">älskar oss</span>
            </h2>
            <p className="text-xl text-muted-foreground">Se vad våra nöjda kunder säger om Fixco</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className={`card-premium p-8 transition-all duration-700 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg mb-6 italic">"{testimonial.quote}"</blockquote>
                
                <div>
                  <div className="font-semibold text-primary">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location} • {testimonial.project}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Redo att starta ditt <span className="text-yellow-300">projekt</span>?
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Få en kostnadsfri offert inom 24 timmar och se varför tusentals kunder väljer Fixco
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/kontakt">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 shadow-xl">
                  Boka nu - gratis offert <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-4">
                Ring: 08-123 456 78
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;