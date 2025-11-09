import React from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/SEO";
import { getBreadcrumbSchema } from "@/components/SEOSchemaEnhanced";
import Breadcrumbs from "@/components/Breadcrumbs";
import { serviceCityData, ServiceKey } from "@/data/serviceCityData";
import { CheckCircle2, Phone, Calendar, MapPin, Zap, FileText } from "lucide-react";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import { useCopy } from "@/copy/CopyProvider";

// Force rebuild 
interface ServiceCityPageProps {
  service: ServiceKey;
  city: "Uppsala" | "Stockholm";
  slug: string;
}

export const ServiceCityPage: React.FC<ServiceCityPageProps> = ({ service, city, slug }) => {
  const { locale } = useCopy();
  const item = serviceCityData.find((i) => i.service === service && i.city === city && i.slug === slug);
  
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

  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem", url: "/" },
    { name: "Tjänster", url: "/tjanster" },
    { name: `${item.service} ${city}`, url: `/tjanster/${item.slug}` },
  ]);

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `https://fixco.se/tjanster/${item.slug}#service`,
    "inLanguage": "sv-SE",
    "name": `${item.h1} – Fixco`,
    "url": `https://fixco.se/tjanster/${item.slug}`,
    "provider": { "@id": "https://fixco.se/#org" },
    "areaServed": { "@type": "AdministrativeArea", "name": `${city} kommun` },
    "serviceType": item.service
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "sv-SE",
    "mainEntity": item.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <Seo
        title={item.title}
        description={item.description}
        canonicalPath={`/tjanster/${item.slug}`}
        schemas={[breadcrumb, localSchema, faqSchema]}
      />
      
      <section className="py-14 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { name: "Hem", url: "/" },
              { name: "Tjänster", url: "/tjanster" },
              { name: `${item.service} ${city}`, url: `/tjanster/${item.slug}` }
            ]}
          />

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.h1}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">{item.description}</p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <Calendar className="w-4 h-4" />
                Start inom 24h
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" />
                ROT/RUT 50%
              </span>
              {item.priceHint && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 font-medium text-sm">
                  <Zap className="w-4 h-4" />
                  {item.priceHint}
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to={locale === 'en' ? '/en/services' : '/tjanster'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/90 transition-colors shadow-sm"
              >
                {locale === 'en' ? 'VIEW SERVICES' : 'VISA TJÄNSTER'}
              </Link>
              <button
                onClick={() => {
                  openServiceRequestModal({
                    serviceSlug: item.slug,
                    prefill: { 
                      service_name: item.h1 
                    }
                  });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Begär offert
              </button>
              <a 
                href="tel:08-123 456 78" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Ring 08-123 456 78
              </a>
            </div>
          </div>

          {/* How It Works Section */}
          {item.howItWorks && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">Så här går det till</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Från första kontakt till färdigt jobb – enkelt och tryggt
                </p>
              </div>
              <div className="grid md:grid-cols-5 gap-4">
                {item.howItWorks.map((step) => (
                  <div key={step.step} className="relative p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <h3 className="font-bold mb-2 mt-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cases and FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Cases */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-bold mb-4">Case: {item.service} i {city}</h2>
              <ul className="space-y-4">
                {item.cases.map((c, i) => (
                  <li key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <h4 className="font-semibold text-foreground mb-1">{c.title}</h4>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* FAQ */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-bold mb-4">Vanliga frågor</h2>
              <div className="space-y-3">
                {item.faqs.map((f, i) => (
                  <details key={i} className="group p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <summary className="font-medium cursor-pointer flex items-center justify-between text-sm">
                      {f.q}
                      <span className="ml-2 transition-transform group-open:rotate-180 text-xs">▼</span>
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Price Examples Section */}
          {item.priceExamples && (
            <div className="mb-12 p-6 rounded-lg border border-border bg-card">
              <h2 className="text-2xl font-bold mb-4">Prisexempel för {item.service.toLowerCase()} i {city}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Alla priser inkluderar material, arbete och ROT-avdrag. Exakta priser får du i din offert.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Jobb</th>
                      <th className="text-left py-3 px-4 font-semibold">Pris (efter ROT)</th>
                      <th className="text-left py-3 px-4 font-semibold">Tid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.priceExamples.map((ex, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{ex.job}</td>
                        <td className="py-3 px-4 text-primary font-bold">{ex.price}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{ex.duration}</td>
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
                Bra att veta om {item.service.toLowerCase()} i {city}
              </h3>
              <ul className="space-y-2">
                {item.quickFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Services */}
          <div className="p-6 rounded-lg border border-border bg-card mb-12">
            <h2 className="text-xl font-bold mb-4">Relaterade tjänster i {city}</h2>
            <div className="flex flex-wrap gap-3">
              <Link 
                to={`/omraden/${city.toLowerCase()}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Alla tjänster i {city}
              </Link>
              <Link 
                to="/tjanster"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                Se alla tjänster
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center p-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Behöver du {item.service.toLowerCase()} i {city}?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Kontakta oss idag för en kostnadsfri offert. Vi återkommer inom 24 timmar.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="tel:+46701234567" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Ring 070-123 45 67
              </a>
              <Link 
                to="/boka-hembesok" 
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary/5 transition-colors"
              >
                Boka {item.service.toLowerCase()} i {city}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceCityPage;
