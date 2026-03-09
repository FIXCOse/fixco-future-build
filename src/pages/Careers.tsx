import { CareersHero } from "@/components/careers/CareersHero";
import { WhyFixco } from "@/components/careers/WhyFixco";
import { ProfessionGrid } from "@/components/careers/ProfessionGrid";
import { CareersStats } from "@/components/careers/CareersStats";
import { CareerQuiz } from "@/components/careers/CareerQuiz";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { CareersFAQ } from "@/components/careers/CareersFAQ";
import { Helmet } from 'react-helmet-async';
import { getBreadcrumbSchema } from '@/components/SEOSchemaEnhanced';

const jobPostings = [
  { title: 'Snickare', description: 'Vi söker erfarna snickare för kök, badrum och inredningsprojekt i Uppsala och Stockholm.' },
  { title: 'Elektriker', description: 'Vi söker behöriga elektriker för installationer, felsökning och laddboxar.' },
  { title: 'VVS-montör', description: 'Vi söker VVS-montörer för rör, badrum och värmesystem.' },
  { title: 'Målare', description: 'Vi söker målare för in- och utvändig målning.' },
  { title: 'Montör', description: 'Vi söker montörer för möbler, vitvaror och teknisk utrustning.' },
];

const getJobPostingSchemas = () => jobPostings.map(job => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": job.title,
  "description": job.description,
  "datePosted": "2026-01-01",
  "validThrough": "2026-12-31",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Fixco",
    "sameAs": "https://fixco.se",
    "logo": "https://fixco.se/assets/fixco-logo-black.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Uppsala",
      "addressRegion": "Uppsala län",
      "addressCountry": "SE"
    }
  },
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "SE"
  }
}));

const Careers = () => {
  const pageTitle = 'Karriär - Jobba hos Fixco | Snickare, Elektriker, VVS';
  const pageDesc = 'Bli en del av Fixco-familjen! Vi söker skickliga hantverkare inom snickeri, el, VVS, måleri och mer. Kollektivavtal, konkurrenskraftig lön och flexibla arbetstider.';
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Hem', url: '/' },
    { name: 'Karriär', url: '/karriar' }
  ]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href="https://fixco.se/karriar" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content="https://fixco.se/karriar" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sv_SE" />
        <meta property="og:site_name" content="Fixco" />
        <meta property="og:image" content="https://fixco.se/assets/fixco-logo-black.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        {getJobPostingSchemas().map((schema, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      
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
