import React from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/SEO";
import { getBreadcrumbSchema } from "@/components/SEOSchemaEnhanced";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cityData, CityKey } from "@/data/cityData";
import { CheckCircle2, MapPin, Phone, Calendar } from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";

interface LocationCityPageProps {
  city: CityKey;
}

export const LocationCityPage: React.FC<LocationCityPageProps> = ({ city }) => {
  const { locale } = useCopy();
  const data = cityData[city];

  const breadcrumb = getBreadcrumbSchema([
    { name: "Hem", url: "/" },
    { name: "Områden", url: "/" },
    { name: city, url: `/omraden/${city.toLowerCase()}` },
  ]);

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `https://fixco.se/omraden/${city.toLowerCase()}#service`,
    "inLanguage": "sv-SE",
    "name": `Fixco – ${city}`,
    "url": `https://fixco.se/omraden/${city.toLowerCase()}`,
    "provider": { "@id": "https://fixco.se/#org" },
    "areaServed": { "@type": "AdministrativeArea", "name": `${city} kommun` },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.coordinates.lat,
      "longitude": data.coordinates.lng
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "sv-SE",
    "mainEntity": data.faqs.map(f => ({
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
        title={`Byggfirma ${city} – Fixco | ROT 50% & Start inom 24h`}
        description={data.description}
        canonicalPath={`/omraden/${city.toLowerCase()}`}
        schemas={[breadcrumb, localSchema, faqSchema]}
        image={data.heroImage}
      />
      
      <section className="py-14 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { name: "Hem", url: "/" },
              { name: "Områden", url: "/" },
              { name: city, url: `/omraden/${city.toLowerCase()}` }
            ]}
          />

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">{data.description}</p>
            
            {/* View Services CTA */}
            <div className="mb-6">
              <Link
                to={locale === 'en' ? '/en/services' : '/tjanster'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/90 transition-colors shadow-sm"
              >
                {locale === 'en' ? 'VIEW SERVICES' : 'VISA TJÄNSTER'}
              </Link>
            </div>

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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 font-medium text-sm">
                <MapPin className="w-4 h-4" />
                Resa: {data.travelFee}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="tel:+46701234567" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Ring 070-123 45 67
              </a>
              <Link 
                to="/boka-hembesok" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                Boka gratis hembesök
              </Link>
            </div>
          </div>

          {/* Districts */}
          {data.districts?.length > 0 && (
            <div className="mb-12 p-6 rounded-lg border border-border bg-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Vi arbetar i hela {city}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.districts.map((d) => (
                  <span key={d} className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cases and Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-xl font-bold mb-4">Senaste Case från {city}</h3>
              <ul className="space-y-4">
                {data.cases.map((c, i) => (
                  <li key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <h4 className="font-semibold text-foreground mb-1">{c.title}</h4>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-xl font-bold mb-4">Kundomdömen från {city}</h3>
              <ul className="space-y-4">
                {data.testimonials.map((t, i) => (
                  <li key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <p className="text-sm text-muted-foreground italic mb-2">"{t.text}"</p>
                    <p className="text-sm font-medium">
                      – {t.author}
                      {t.date && <span className="text-muted-foreground ml-1">({t.date})</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-8 rounded-lg border border-border bg-card mb-12">
            <h2 className="text-2xl font-bold mb-6">Vanliga frågor om Fixco i {city}</h2>
            <div className="space-y-4">
              {data.faqs.map((f, i) => (
                <details key={i} className="group p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    {f.q}
                    <span className="ml-2 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center p-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Redo att komma igång?</h2>
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
                Boka gratis hembesök
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationCityPage;
