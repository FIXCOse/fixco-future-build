import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroUltra from "@/components/HeroUltra";
import TrustBar from "@/components/TrustBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceStore } from "@/stores/priceStore";
import { useCopy } from "@/copy/CopyProvider";
import { EditableSection } from "@/components/EditableSection";
import { ContextualEditor } from "@/components/ContextualEditor";
import { useSEO } from "@/hooks/useSEO";
import { 
  getOrganizationSchema, 
  getWebsiteSchema, 
  getFAQSchema,
  getOfferCatalogSchema 
} from "@/components/SEOSchemaEnhanced";

// Lazy load non-critical components for better initial load
const ComparisonUltra = lazy(() => import("@/components/ComparisonUltra"));
const ServiceTeaserGrid = lazy(() => import("@/components/ServiceTeaserGrid"));
const ProjectShowcase = lazy(() => import("@/components/ProjectShowcase"));
const FAQTeaser = lazy(() => import("@/components/FAQTeaser"));

// Loading component
const SectionSkeleton = () => (
  <div className="py-24">
    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
    <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
    </div>
  </div>
);

const Home = () => {
  const { t } = useCopy();
  
  // Initialize pricing store from URL/localStorage
  useEffect(() => {
    usePriceStore.getState().initFromUrlOrStorage();
  }, []);

  // Comprehensive SEO setup
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const faqSchema = getFAQSchema([
    {
      question: "Vad kostar era tjänster?",
      answer: "Våra priser varierar från 480 kr/h med ROT-avdrag till 1300 kr/h för specialiserade tjänster. Med ROT-avdrag får du 50% rabatt på arbetskostnaden."
    },
    {
      question: "Vilka områden täcker ni?",
      answer: "Vi verkar främst i Uppsala och Stockholm län, men tar även större projekt i hela Sverige. Kontakta oss för att höra om vi kan hjälpa dig."
    },
    {
      question: "Hur snabbt kan ni starta?",
      answer: "Vi kan starta de flesta projekt inom 5 arbetsdagar efter godkänd offert. För akuta ärenden kan vi ofta komma ut samma dag."
    },
    {
      question: "Hur fungerar ROT-avdraget?",
      answer: "ROT-avdrag ger 50% rabatt på arbetskostnaden upp till 75 000 kr per person och år. Vi sköter hela administrationen åt dig så du får rabatten direkt på fakturan."
    },
    {
      question: "Är ni försäkrade och F-skattsedel?",
      answer: "Ja, vi har full ansvarsförsäkring och F-skattsedel. Alla våra hantverkare är erfarna och certifierade inom sina områden."
    }
  ]);
  
  const offerCatalogSchema = getOfferCatalogSchema([
    { name: "Elmontörtjänster", price: 880, description: "Professionella eltjänster med ROT-avdrag" },
    { name: "VVS-tjänster", price: 920, description: "Alla typer av VVS-arbeten med ROT-avdrag" },
    { name: "Måleri", price: 680, description: "Målning och tapetsering med ROT-avdrag" },
    { name: "Snickeri", price: 760, description: "Snickeri och byggnadsarbeten med ROT-avdrag" },
    { name: "Städning", price: 480, description: "RUT-berättigad städservice" },
    { name: "Trädgård", price: 520, description: "Trädgårdsarbeten med RUT-avdrag" }
  ]);

  // Combined schema
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      faqSchema,
      offerCatalogSchema
    ]
  };

  useSEO({
    title: "Fixco - Professionella Bygg- & Renoveringstjänster | ROT & RUT-avdrag 50%",
    description: "Snabbare, billigare och mer professionellt än konkurrenterna. Start inom 5 dagar, 50% rabatt med ROT-avdrag. Över 15 000 nöjda kunder i Uppsala och Stockholm.",
    keywords: "ROT-avdrag, RUT-avdrag, byggtjänster, renovering, elmontör, VVS, måleri, snickare, Uppsala, Stockholm, hemtjänster, hantverkare, byggfirma",
    image: "https://fixco.se/assets/hero-construction.jpg",
    type: "website",
    schema: combinedSchema,
    canonicalPath: "/",
    alternateLanguages: [
      { locale: "sv", url: "https://fixco.se/" },
      { locale: "en", url: "https://fixco.se/en/" }
    ]
  });
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - ULTRA Enhanced */}
      <EditableSection id="hero" title="Hero sektion">
        <ContextualEditor contentId="hero-section" type="heading">
          <HeroUltra />
        </ContextualEditor>
      </EditableSection>

      {/* Trust Bar */}
      <EditableSection id="trust-bar" title="Förtroende bar">
        <ContextualEditor contentId="trust-bar-section">
          <TrustBar />
        </ContextualEditor>
      </EditableSection>

      {/* Geographic Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vi Arbetar i Uppsala & Stockholm</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Samma höga kvalitet, snabba service och ROT-avdrag 50% överallt
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Link to="/omraden/uppsala" className="p-8 rounded-lg border border-border hover:border-primary transition-all hover:shadow-lg bg-card">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-2xl font-bold mb-2">Uppsala</h3>
              <p className="text-muted-foreground mb-4">Alla stadsdelar i Uppsala kommun</p>
              <span className="text-sm text-primary font-bold">✓ Fri resa</span>
            </Link>
            <Link to="/omraden/stockholm" className="p-8 rounded-lg border border-border hover:border-primary transition-all hover:shadow-lg bg-card">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-2xl font-bold mb-2">Stockholm</h3>
              <p className="text-muted-foreground mb-4">Stockholm stad och närförort</p>
              <span className="text-sm text-primary font-bold">✓ Resekostnad 299 kr</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Comparison Section - ULTRA Enhanced */}
      <EditableSection id="comparison" title="Jämförelse sektion">
        <ContextualEditor contentId="comparison-section">
          <Suspense fallback={<SectionSkeleton />}>
            <ComparisonUltra />
          </Suspense>
        </ContextualEditor>
      </EditableSection>

      {/* Service Teaser Grid */}
      <EditableSection id="services" title="Tjänster översikt">
        <ContextualEditor contentId="services-section">
          <Suspense fallback={<SectionSkeleton />}>
            <ServiceTeaserGrid />
          </Suspense>
        </ContextualEditor>
      </EditableSection>

      {/* Project Showcase */}
      <EditableSection id="projects" title="Projekt showcase">
        <ContextualEditor contentId="projects-section">
          <Suspense fallback={<SectionSkeleton />}>
            <ProjectShowcase />
          </Suspense>
        </ContextualEditor>
      </EditableSection>

      {/* FAQ Teaser */}
      <EditableSection id="faq" title="FAQ sektion">
        <ContextualEditor contentId="faq-section">
          <Suspense fallback={<SectionSkeleton />}>
            <FAQTeaser />
          </Suspense>
        </ContextualEditor>
      </EditableSection>

    </div>
  );
};

export default Home;