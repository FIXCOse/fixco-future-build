import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Award, Users, MapPin, Star, ChevronRight } from "lucide-react";
import StickyNavigation from "@/components/StickyNavigation";
import ParticleCanvas from "@/components/ParticleCanvas";
import MagneticButton from "@/components/MagneticButton";
import TrustBar from "@/components/TrustBar";
import AdvancedComparisonV2 from "@/components/AdvancedComparisonV2";
import ServiceTeaserGrid from "@/components/ServiceTeaserGrid";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ROTCalculator from "@/components/ROTCalculator";
import FAQTeaser from "@/components/FAQTeaser";
import GlobalStickyCTA from "@/components/GlobalStickyCTA";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    whyChoose: false
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


  const whyChooseUs = [
    { icon: ArrowRight, title: "Start inom 24h", description: "Vi påbörjar ditt projekt redan nästa dag" },
    { icon: Award, title: "Lägst pris (ROT)", description: "480 kr/h efter ROT-avdrag - ingen kan matcha" },
    { icon: Users, title: "Helhetslösning", description: "En kontakt för alla dina projekt" },
    { icon: MapPin, title: "Lokalt + Nationellt", description: "Uppsala & Stockholm, nationellt vid större projekt" }
  ];


  return (
    <div className="min-h-screen">
      <StickyNavigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-section="hero">
        {/* Particle Animation Background */}
        <ParticleCanvas />
        
        {/* Animated gradient background */}
        <div className="absolute inset-0 hero-background">
          <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-gradient" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`animate-fade-in-up transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="gradient-text">Stora</span> eller{" "}
                <span className="gradient-text">små</span> projekt –{" "}
                <br />
                <span className="text-foreground">Fixco hanterar</span>{" "}
                <span className="gradient-text animate-float">allt</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Snabbare, billigare och mer professionellt än våra konkurrenter. 
                <span className="text-primary font-semibold"> Start inom 24h.</span>
              </p>

              {/* Magnetic CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                <Link to="/kontakt">
                  <MagneticButton
                    className="gradient-primary text-primary-foreground text-lg px-8 py-4 shadow-premium hover:shadow-glow"
                  >
                    Begär offert
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MagneticButton>
                </Link>
                <Link to="/tjanster">
                  <MagneticButton
                    variant="outline"
                    className="text-lg px-8 py-4 border-primary/30 hover:bg-primary/10"
                  >
                    Se våra tjänster
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </MagneticButton>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row gap-8 text-sm text-muted-foreground justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
                  <span>ROT-avdrag: <span className="text-primary font-semibold">50% rabatt</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
                  <span>Täckning: <span className="text-primary font-semibold">Uppsala & Stockholm</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-glow" />
                  <span>Start: <span className="text-primary font-semibold">Inom 24h</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Advanced Comparison Section */}
      <AdvancedComparisonV2 />

      {/* Service Teaser Grid */}
      <ServiceTeaserGrid />

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

      {/* Testimonials Carousel */}
      <TestimonialCarousel />

      {/* ROT Calculator */}
      <ROTCalculator />

      {/* FAQ Teaser */}
      <FAQTeaser />

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
                <MagneticButton
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 shadow-xl"
                >
                  Boka nu - gratis offert <ArrowRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
              <MagneticButton
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-4"
                onClick={() => window.open('tel:08-123-456-78')}
              >
                Ring: 08-123 456 78
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Global Sticky CTA */}
      <GlobalStickyCTA />
    </div>
  );
};

export default Home;