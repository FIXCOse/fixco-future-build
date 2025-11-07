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
import { CareerScrollProgress } from "@/components/careers/CareerScrollProgress";
import { motion, useScroll, useTransform } from "framer-motion";

const Careers = () => {
  const { scrollYProgress } = useScroll();
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const blob1Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blob2Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  return (
    <>
      <SEO
        title="Karriär - Jobba hos Fixco | Snickare, Elektriker, VVS"
        description="Bli en del av Fixco-familjen! Vi söker skickliga hantverkare inom snickeri, el, VVS, måleri och mer. Kollektivavtal, konkurrenskraftig lön och flexibla arbetstider."
      />
      
      <CareerScrollProgress />

      <motion.div style={{ y: blob1Y, opacity: blob1Opacity }} className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <motion.div style={{ y: blob2Y, opacity: blob2Opacity }} className="fixed bottom-20 right-10 w-[32rem] h-[32rem] bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <main className="min-h-screen overflow-x-hidden">
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
