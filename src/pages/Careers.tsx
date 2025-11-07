import { Seo as SEO } from "@/components/SEO";
import { CareersHero } from "@/components/careers/CareersHero";
import { WhyFixco } from "@/components/careers/WhyFixco";
import { ProfessionGrid } from "@/components/careers/ProfessionGrid";
import { CareersStats } from "@/components/careers/CareersStats";
import { CareersTeam } from "@/components/careers/CareersTeam";
import { CareerQuiz } from "@/components/careers/CareerQuiz";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { CareersFAQ } from "@/components/careers/CareersFAQ";
import { CareersContact } from "@/components/careers/CareersContact";

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
        <CareersTeam />
        <CareerQuiz />
        <ApplicationForm />
        <CareersFAQ />
        <CareersContact />
      </main>
    </>
  );
};

export default Careers;
