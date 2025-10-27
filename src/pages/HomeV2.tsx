import { useSEO } from "@/hooks/useSEO";
import { HeroV2 } from "@/components/v2/HeroV2";
import { StatisticsBar } from "@/components/v2/StatisticsBar";
import { BentoGrid } from "@/components/v2/BentoGrid";
import { FeatureSplit } from "@/components/v2/FeatureSplit";
import { TestimonialsV2 } from "@/components/v2/TestimonialsV2";
import { CTAV2 } from "@/components/v2/CTAV2";
import finishedProject from "@/assets/finished-project.jpg";
import toolsProfessional from "@/assets/tools-professional.jpg";

const HomeV2 = () => {
  useSEO({
    title: "Fixco - Bygg & fastighetstjänster för hem & företag",
    description: "Professionella renoverings- och byggtjänster med garanterat ROT & RUT-avdrag. Från elmontörer till målare – vi hanterar allt. Över 15 000 nöjda kunder.",
    keywords: "renovering, byggtjänster, ROT-avdrag, RUT-avdrag, elmontör, VVS, målare, snickare, Stockholm",
    type: "website"
  });

  const whyFixcoFeatures = [
    {
      title: "Erfarna hantverkare",
      description: "Alla våra hantverkare är certifierade med F-skattsedel och lång erfarenhet inom sina respektive områden."
    },
    {
      title: "Transparent prissättning",
      description: "Få en kostnadsfri offert inom 24 timmar. Inga dolda avgifter eller överraskningar."
    },
    {
      title: "Kvalitetsgaranti",
      description: "Vi står bakom vårt arbete med garanti och är försäkrade för din trygghet."
    },
    {
      title: "Snabb service",
      description: "Genomsnittlig starttid inom 5 dagar. Vi värdesätter din tid och arbetar effektivt."
    }
  ];

  const rotRutFeatures = [
    {
      title: "50% ROT-avdrag direkt",
      description: "Vi hanterar all administration med Skatteverket så att du får ditt avdrag automatiskt."
    },
    {
      title: "Maximera ditt skattetillägg",
      description: "Våra experter hjälper dig att få ut maximalt avdrag på dina renoverings- och reparationsprojekt."
    },
    {
      title: "Allt från A till Ö",
      description: "Vi sköter dokumentation, fakturering och rapportering till Skatteverket - helt problemfritt för dig."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroV2 />

      {/* Statistics Bar */}
      <StatisticsBar />

      {/* Services Bento Grid */}
      <BentoGrid />

      {/* Why Fixco Feature Split */}
      <FeatureSplit
        title="Varför välja Fixco?"
        subtitle="Vi kombinerar kvalitet, snabbhet och transparens för att ge dig den bästa upplevelsen"
        features={whyFixcoFeatures}
        imageSrc={finishedProject}
        imageAlt="Färdigt renoveringsprojekt av Fixco"
        reverse={false}
      />

      {/* ROT & RUT Feature Split */}
      <FeatureSplit
        title="ROT & RUT-avdrag – Vi sköter allt"
        subtitle="Få upp till 50% rabatt på arbetskostnaden med skattesubventioner"
        features={rotRutFeatures}
        imageSrc={toolsProfessional}
        imageAlt="Professionella verktyg och hantverkare"
        reverse={true}
      />

      {/* Testimonials */}
      <TestimonialsV2 />

      {/* Final CTA */}
      <CTAV2 />
    </div>
  );
};

export default HomeV2;
