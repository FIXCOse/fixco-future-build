import { Seo as SEO } from "@/components/SEO";
import { CareersHero } from "@/components/careers/CareersHero";
import { WhyFixco } from "@/components/careers/WhyFixco";
import { ProfessionGrid } from "@/components/careers/ProfessionGrid";
import { CareersStats } from "@/components/careers/CareersStats";
import { CareerQuiz } from "@/components/careers/CareerQuiz";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { CareersFAQ } from "@/components/careers/CareersFAQ";

const Careers = () => {
  return (
    <>
      <SEO
        title="Karriär - Jobba hos Fixco | Snickare, Elektriker, VVS"
        description="Bli en del av Fixco-familjen! Vi söker skickliga hantverkare inom snickeri, el, VVS, måleri och mer. Kollektivavtal, konkurrenskraftig lön och flexibla arbetstider."
      />
      
      <main className="min-h-screen">
        <CareersHero />
        <CareersStats />
        <WhyFixco />
        <ProfessionGrid />
        <CareerQuiz />
        <ApplicationForm />
        <CareersFAQ />
      </main>
    </>
  );
};

export default Careers;
