import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroUltra from "@/components/HeroUltra";
import TrustBar from "@/components/TrustBar";
import ComparisonUltra from "@/components/ComparisonUltra";
import ServiceTeaserGrid from "@/components/ServiceTeaserGrid";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ROTCalculator from "@/components/ROTCalculator";
import FAQTeaser from "@/components/FAQTeaser";
import { Button } from "@/components/ui/button";
import { usePriceStore } from "@/stores/priceStore";
import { useCopy } from "@/copy/CopyProvider";

const Home = () => {
  console.log("Home component rendering...");
  const { t } = useCopy();
  
  // Initialize pricing store from URL/localStorage
  useEffect(() => {
    usePriceStore.getState().initFromUrlOrStorage();
  }, []);
  
  return (
    <div className="min-h-screen">
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

    </div>
  );
};

export default Home;