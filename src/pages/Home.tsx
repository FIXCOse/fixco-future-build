import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import HeroUltra from "@/components/HeroUltra";
import TrustBar from "@/components/TrustBar";
import ComparisonUltra from "@/components/ComparisonUltra";
import ServiceTeaserGrid from "@/components/ServiceTeaserGrid";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ROTCalculator from "@/components/ROTCalculator";
import FAQTeaser from "@/components/FAQTeaser";
import GlobalStickyCTA from "@/components/GlobalStickyCTA";
import { Button } from "@/components/ui/button";
import { usePriceStore } from "@/stores/priceStore";
import { useTranslation } from 'react-i18next';

const Home = () => {
  console.log("Home component rendering...");
  const { t } = useTranslation();
  
  // Initialize pricing store from URL/localStorage
  useEffect(() => {
    usePriceStore.getState().initFromUrlOrStorage();
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section - ULTRA Enhanced */}
      <HeroUltra />

      {/* Trust Bar */}
      <TrustBar />

      {/* Advanced Comparison Section - ULTRA Enhanced */}
      <ComparisonUltra />

      {/* Service Teaser Grid */}
      <ServiceTeaserGrid />

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
              {t('cta.title')} <span className="text-yellow-300">{t('cta.titleHighlight')}</span>?
            </h2>
            <p className="text-xl text-white/90 mb-12">
              {t('cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/kontakt">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 shadow-xl">
                  {t('cta.button1')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-4"
                onClick={() => window.open('tel:08-123-456-78')}
              >
                {t('cta.button2')}
              </Button>
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