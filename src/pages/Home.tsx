import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Lazy load heroes - bara en av dem kommer att laddas!
const HeroUltra = lazy(() => import("@/components/HeroUltra"));
const HeroV3 = lazy(() => import("@/components/v3/HeroV3"));
import TrustBar from "@/components/TrustBar";
import { Button } from "@/components/ui/button";
import { usePriceStore } from "@/stores/priceStore";
import { useCopy } from "@/copy/CopyProvider";
import { EditableSection } from "@/components/EditableSection";
import { ContextualEditor } from "@/components/ContextualEditor";
import { useSEO } from "@/hooks/useSEO";
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { 
  getOrganizationSchema, 
  getWebsiteSchema, 
  getFAQSchema,
  getOfferCatalogSchema,
  getSiteNavigationSchema
} from "@/components/SEOSchemaEnhanced";
import { 
  LazyComparisonUltra, 
  LazyServiceTeaserGrid, 
  LazyProjectShowcase, 
  LazyFAQTeaser
} from "@/components/LazyComponents";

const Home = () => {
  const { t } = useCopy();
  
  // Check which hero to show (HeroUltra vs HeroV3)
  const { data: useNewHero, isLoading: heroLoading } = useFeatureFlag('use_new_hero');
  
  // Initialize pricing store from URL/localStorage
  useEffect(() => {
    usePriceStore.getState().initFromUrlOrStorage();
  }, []);
  
  useEffect(() => {
    console.log('🎨 [Home] useNewHero:', useNewHero, 'isLoading:', heroLoading);
  }, [useNewHero, heroLoading]);

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
    { name: "Målning", price: 680, description: "Målning och tapetsering med ROT-avdrag" },
    { name: "Snickeri", price: 760, description: "Snickeri och byggnadsarbeten med ROT-avdrag" },
    { name: "Städning", price: 480, description: "RUT-berättigad städservice" },
    { name: "Trädgård", price: 520, description: "Trädgårdsarbeten med RUT-avdrag" }
  ]);

  // Navigation schema for Sitelinks
  const navigationSchema = getSiteNavigationSchema();

  // Combined schema
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      faqSchema,
      offerCatalogSchema,
      navigationSchema
    ]
  };

  useSEO({
    title: "Fixco | Privat • BRF • Företag",
    description: "Snabbare, billigare och mer professionellt än konkurrenterna. Start inom 5 dagar, 50% rabatt med ROT-avdrag. Över 15 000 nöjda kunder i Uppsala och Stockholm.",
    keywords: "ROT-avdrag, RUT-avdrag, byggtjänster, renovering, elmontör, VVS, målning, snickare, Uppsala, Stockholm, hemtjänster, hantverkare, byggfirma",
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
          <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
              <div className="animate-pulse text-muted-foreground">Laddar...</div>
            </div>
          }>
            {(useNewHero ?? false) ? <HeroV3 /> : <HeroUltra />}
          </Suspense>
        </ContextualEditor>
      </EditableSection>

      {/* Trust Bar */}
      <EditableSection id="trust-bar" title="Förtroende bar">
        <ContextualEditor contentId="trust-bar-section">
          <TrustBar />
        </ContextualEditor>
      </EditableSection>

      {/* All Services CTA Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Alla Tjänster med ROT & RUT-avdrag
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Utforska hela vårt tjänsteutbud – från elmontör och VVS till målning, snickeri och städning. 
            Alla med 50% rabatt via ROT/RUT-avdrag.
          </p>
          <Button asChild size="lg" className="font-semibold">
            <Link to="/tjanster">
              Se alla tjänster och priser
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Advanced Comparison Section - ULTRA Enhanced */}
      <EditableSection id="comparison" title="Jämförelse sektion">
        <ContextualEditor contentId="comparison-section">
          <LazyComparisonUltra />
        </ContextualEditor>
      </EditableSection>

      {/* Service Teaser Grid */}
      <EditableSection id="services" title="Tjänster översikt">
        <ContextualEditor contentId="services-section">
          <LazyServiceTeaserGrid />
        </ContextualEditor>
      </EditableSection>

      {/* Project Showcase */}
      <EditableSection id="projects" title="Projekt showcase">
        <ContextualEditor contentId="projects-section">
          <LazyProjectShowcase />
        </ContextualEditor>
      </EditableSection>

      {/* FAQ Teaser */}
      <EditableSection id="faq" title="FAQ sektion">
        <ContextualEditor contentId="faq-section">
          <LazyFAQTeaser />
        </ContextualEditor>
      </EditableSection>

    </div>
  );
};

export default Home;