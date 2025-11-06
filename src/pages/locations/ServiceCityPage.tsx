import React from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/SEO";
import { getBreadcrumbSchema } from "@/components/SEOSchemaEnhanced";
import Breadcrumbs from "@/components/Breadcrumbs";
import { serviceCityData, ServiceKey } from "@/data/serviceCityData";
import { CheckCircle2, Phone, Calendar, MapPin, Zap, FileText } from "lucide-react";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";

// Force rebuild 
interface ServiceCityPageProps {
  service: ServiceKey;
  city: "Uppsala" | "Stockholm";
  slug: string;
  locale?: 'sv' | 'en';
}

// Helper function to get localized text
const t = (text: string | { sv: string; en: string }, locale: 'sv' | 'en' = 'sv'): string => {
  if (typeof text === 'string') return text;
  return text[locale];
};

export const ServiceCityPage: React.FC<ServiceCityPageProps> = ({ service, city, slug, locale = 'sv' }) => {
  const item = serviceCityData.find((i) => {
    const itemSlug = t(i.slug, locale);
    return i.service === service && i.city === city && itemSlug === slug;
  });
  
  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tjänsten hittades inte</h1>
        <Link to="/tjanster" className="text-primary hover:underline">
          ← Tillbaka till tjänster
        </Link>
      </div>
    );
  }

  const itemSlug = t(item.slug, locale);
  const breadcrumbBase = locale === 'en' ? '/en' : '';
  const servicesPath = locale === 'en' ? '/en/services' : '/tjanster';
  
  const breadcrumb = getBreadcrumbSchema([
    { name: locale === 'en' ? "Home" : "Hem", url: `${breadcrumbBase}/` },
    { name: locale === 'en' ? "Services" : "Tjänster", url: servicesPath },
    { name: `${item.service} ${city}`, url: `${servicesPath}/${itemSlug}` },
  ]);

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `https://fixco.se${servicesPath}/${itemSlug}#service`,
    "inLanguage": locale === 'en' ? "en-SE" : "sv-SE",
    "name": `${t(item.h1, locale)} – Fixco`,
    "url": `https://fixco.se${servicesPath}/${itemSlug}`,
    "provider": { "@id": "https://fixco.se/#org" },
    "areaServed": { "@type": "AdministrativeArea", "name": `${city} ${locale === 'en' ? 'municipality' : 'kommun'}` },
    "serviceType": item.service
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": locale === 'en' ? "en-SE" : "sv-SE",
    "mainEntity": item.faqs.map(f => ({
      "@type": "Question",
      "name": t(f.q, locale),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(f.a, locale)
      }
    }))
  };

  return (
    <>
      <Seo
        title={t(item.title, locale)}
        description={t(item.description, locale)}
        canonicalPath={`${servicesPath}/${itemSlug}`}
        schemas={[breadcrumb, localSchema, faqSchema]}
      />
      
      <section className="py-14 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { name: locale === 'en' ? "Home" : "Hem", url: `${breadcrumbBase}/` },
              { name: locale === 'en' ? "Services" : "Tjänster", url: servicesPath },
              { name: `${item.service} ${city}`, url: `${servicesPath}/${itemSlug}` }
            ]}
          />

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(item.h1, locale)}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">{t(item.description, locale)}</p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <Calendar className="w-4 h-4" />
                {locale === 'en' ? 'Start within 24h' : 'Start inom 24h'}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" />
                ROT/RUT 50%
              </span>
              {item.priceHint && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 font-medium text-sm">
                  <Zap className="w-4 h-4" />
                  {t(item.priceHint, locale)}
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  openServiceRequestModal({
                    serviceSlug: itemSlug,
                    prefill: { 
                      service_name: t(item.h1, locale)
                    }
                  });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-5 h-5" />
                {locale === 'en' ? 'Request quote' : 'Begär offert'}
              </button>
              <a 
                href="tel:08-123 456 78" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {locale === 'en' ? 'Call 08-123 456 78' : 'Ring 08-123 456 78'}
              </a>
            </div>
          </div>

          {/* How It Works Section */}
          {item.howItWorks && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">
                  {locale === 'en' ? 'How it works' : 'Så här går det till'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {locale === 'en' 
                    ? 'From first contact to completed job – simple and secure' 
                    : 'Från första kontakt till färdigt jobb – enkelt och tryggt'}
                </p>
              </div>
              <div className="grid md:grid-cols-5 gap-4">
                {item.howItWorks.map((step) => (
                  <div key={step.step} className="relative p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <h3 className="font-bold mb-2 mt-2">{t(step.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground">{t(step.desc, locale)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cases and FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Cases */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-bold mb-4">
                {locale === 'en' ? `Case: ${item.service} in ${city}` : `Case: ${item.service} i ${city}`}
              </h2>
              <ul className="space-y-4">
                {item.cases.map((c, i) => (
                  <li key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <h4 className="font-semibold text-foreground mb-1">{t(c.title, locale)}</h4>
                    <p className="text-sm text-muted-foreground">{t(c.desc, locale)}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* FAQ */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-bold mb-4">
                {locale === 'en' ? 'Frequently asked questions' : 'Vanliga frågor'}
              </h2>
              <div className="space-y-3">
                {item.faqs.map((f, i) => (
                  <details key={i} className="group p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <summary className="font-medium cursor-pointer flex items-center justify-between text-sm">
                      {t(f.q, locale)}
                      <span className="ml-2 transition-transform group-open:rotate-180 text-xs">▼</span>
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(f.a, locale)}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Price Examples Section */}
          {item.priceExamples && (
            <div className="mb-12 p-6 rounded-lg border border-border bg-card">
              <h2 className="text-2xl font-bold mb-4">
                {locale === 'en' 
                  ? `Price examples for ${item.service.toLowerCase()} in ${city}` 
                  : `Prisexempel för ${item.service.toLowerCase()} i ${city}`}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {locale === 'en'
                  ? 'All prices include materials, labor and ROT deduction. You get exact prices in your quote.'
                  : 'Alla priser inkluderar material, arbete och ROT-avdrag. Exakta priser får du i din offert.'}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">
                        {locale === 'en' ? 'Job' : 'Jobb'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        {locale === 'en' ? 'Price (after ROT)' : 'Pris (efter ROT)'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        {locale === 'en' ? 'Time' : 'Tid'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.priceExamples.map((ex, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{t(ex.job, locale)}</td>
                        <td className="py-3 px-4 text-primary font-bold">{ex.price}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{t(ex.duration, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Facts Section */}
          {item.quickFacts && (
            <div className="mb-12 p-6 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                {locale === 'en' 
                  ? `Good to know about ${item.service.toLowerCase()} in ${city}` 
                  : `Bra att veta om ${item.service.toLowerCase()} i ${city}`}
              </h3>
              <ul className="space-y-2">
                {item.quickFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{t(fact, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Services */}
          <div className="p-6 rounded-lg border border-border bg-card mb-12">
            <h2 className="text-xl font-bold mb-4">
              {locale === 'en' ? `Related services in ${city}` : `Relaterade tjänster i ${city}`}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link 
                to={`${breadcrumbBase}/omraden/${city.toLowerCase()}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                {locale === 'en' ? `All services in ${city}` : `Alla tjänster i ${city}`}
              </Link>
              <Link 
                to={servicesPath}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                {locale === 'en' ? 'See all services' : 'Se alla tjänster'}
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center p-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">
              {locale === 'en' 
                ? `Do you need ${item.service.toLowerCase()} in ${city}?` 
                : `Behöver du ${item.service.toLowerCase()} i ${city}?`}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {locale === 'en'
                ? 'Contact us today for a free quote. We will respond within 24 hours.'
                : 'Kontakta oss idag för en kostnadsfri offert. Vi återkommer inom 24 timmar.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="tel:+46701234567" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {locale === 'en' ? 'Call 070-123 45 67' : 'Ring 070-123 45 67'}
              </a>
              <Link 
                to={`${breadcrumbBase}/boka-hembesok`}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary/5 transition-colors"
              >
                {locale === 'en' 
                  ? `Book ${item.service.toLowerCase()} in ${city}` 
                  : `Boka ${item.service.toLowerCase()} i ${city}`}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceCityPage;
