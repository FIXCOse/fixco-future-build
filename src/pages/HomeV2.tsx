import { useSEO } from "@/hooks/useSEO";
import { HeroV2 } from "@/components/v2/HeroV2";
import { StatisticsBar } from "@/components/v2/StatisticsBar";
import { BentoGrid } from "@/components/v2/BentoGrid";
import { FeatureSplit } from "@/components/v2/FeatureSplit";
import { TestimonialsV2 } from "@/components/v2/TestimonialsV2";
import { CTAV2 } from "@/components/v2/CTAV2";
import finishedProject from "@/assets/finished-project.jpg";
import toolsProfessional from "@/assets/tools-professional.jpg";
import { useCopy } from "@/copy/CopyProvider";

const HomeV2 = () => {
  const { t } = useCopy();

  useSEO({
    title: t('v2.seo.title'),
    description: t('v2.seo.description'),
    keywords: "renovering, byggtjänster, ROT-avdrag, RUT-avdrag, elmontör, VVS, målare, snickare, Stockholm",
    type: "website"
  });

  const whyFixcoFeatures = [
    { title: t('v2.whyFixco.f1.title'), description: t('v2.whyFixco.f1.desc') },
    { title: t('v2.whyFixco.f2.title'), description: t('v2.whyFixco.f2.desc') },
    { title: t('v2.whyFixco.f3.title'), description: t('v2.whyFixco.f3.desc') },
    { title: t('v2.whyFixco.f4.title'), description: t('v2.whyFixco.f4.desc') },
  ];

  const rotRutFeatures = [
    { title: t('v2.rotRut.f1.title'), description: t('v2.rotRut.f1.desc') },
    { title: t('v2.rotRut.f2.title'), description: t('v2.rotRut.f2.desc') },
    { title: t('v2.rotRut.f3.title'), description: t('v2.rotRut.f3.desc') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroV2 />
      <div data-speed="0.95">
        <StatisticsBar />
      </div>
      <div data-speed="0.9">
        <BentoGrid />
      </div>
      <div data-speed="0.95">
        <FeatureSplit
          title={t('v2.whyFixco.title')}
          subtitle={t('v2.whyFixco.subtitle')}
          features={whyFixcoFeatures}
          imageSrc={finishedProject}
          imageAlt="Färdigt renoveringsprojekt av Fixco"
          reverse={false}
        />
      </div>
      <div data-speed="0.9">
        <FeatureSplit
          title={t('v2.rotRut.title')}
          subtitle={t('v2.rotRut.subtitle')}
          features={rotRutFeatures}
          imageSrc={toolsProfessional}
          imageAlt="Professionella verktyg och hantverkare"
          reverse={true}
        />
      </div>
      <div data-speed="0.95">
        <TestimonialsV2 />
      </div>
      <div data-speed="0.9">
        <CTAV2 />
      </div>
    </div>
  );
};

export default HomeV2;
