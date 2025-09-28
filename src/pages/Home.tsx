import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroUltra from "@/components/HeroUltra";
import TrustBar from "@/components/TrustBar";
import ComparisonUltra from "@/components/ComparisonUltra";
import ServiceTeaserGrid from "@/components/ServiceTeaserGrid";
import ProjectShowcase from "@/components/ProjectShowcase";
import FAQTeaser from "@/components/FAQTeaser";
import { Button } from "@/components/ui/button";
import { usePriceStore } from "@/stores/priceStore";
import { useCopy } from "@/copy/CopyProvider";
import { EditableSection } from "@/components/EditableSection";

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
      <EditableSection id="hero" title="Hero sektion">
        <HeroUltra />
      </EditableSection>

      {/* Trust Bar */}
      <EditableSection id="trust-bar" title="Förtroende bar">
        <TrustBar />
      </EditableSection>

      {/* Advanced Comparison Section - ULTRA Enhanced */}
      <EditableSection id="comparison" title="Jämförelse sektion">
        <ComparisonUltra />
      </EditableSection>

      {/* Service Teaser Grid */}
      <EditableSection id="services" title="Tjänster översikt">
        <ServiceTeaserGrid />
      </EditableSection>

      {/* Project Showcase */}
      <EditableSection id="projects" title="Projekt showcase">
        <ProjectShowcase />
      </EditableSection>

      {/* FAQ Teaser */}
      <EditableSection id="faq" title="FAQ sektion">
        <FAQTeaser />
      </EditableSection>

    </div>
  );
};

export default Home;