import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface GlobalFooterProps {
  locale?: 'sv' | 'en';
}

export default function GlobalFooter({ locale = 'sv' }: GlobalFooterProps) {
  const isEnglish = locale === 'en';
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      sv: {
        tagline: "Din helhetslösning inom hem & byggnad",
        org: "Org.nr",
        address: "Adress",
        phone: "Telefon",
        email: "E-post",
        linksTitle: "Snabblänkar",
        services: "Tjänster",
        references: "Referenser",
        contact: "Kontakt",
        about: "Om oss",
        legalTitle: "Juridiskt",
        privacy: "Integritetspolicy",
        terms: "Villkor",
        cookies: "Cookies",
        rot: "ROT & RUT",
        ctaTitle: "Kom igång",
        ctaText: "Få offert inom 24 timmar.",
        ctaContact: "Kontakta oss",
        ctaQuote: "Begär offert",
        rights: "Alla rättigheter förbehålls",
        reg: "Registrerad i Sverige"
      },
      en: {
        tagline: "Your complete solution for home & construction",
        org: "Org. No.",
        address: "Address",
        phone: "Phone",
        email: "Email",
        linksTitle: "Quick links",
        services: "Services",
        references: "References",
        contact: "Contact",
        about: "About us",
        legalTitle: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        cookies: "Cookies",
        rot: "ROT & RUT",
        ctaTitle: "Get started",
        ctaText: "Get a quote within 24 hours.",
        ctaContact: "Contact us",
        ctaQuote: "Request a quote",
        rights: "All rights reserved",
        reg: "Registered in Sweden"
      }
    };
    
    return translations[locale][key as keyof typeof translations.sv] || key;
  };

  const basePath = isEnglish ? '/en' : '';
  
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Fixco AB",
            "url": "https://fixco.se",
            "telephone": "+46812345678",
            "email": "support@fixco.se",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Storgatan 1",
              "addressLocality": "Stockholm",
              "postalCode": "111 22",
              "addressCountry": "SE"
            }
          })}
        </script>
      </Helmet>
      
      <footer className="bg-background border-t border-border text-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Våra Tjänster */}
            <div>
              <h3 className="font-bold text-lg mb-4">Våra Tjänster</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/tjanster/el" className="text-muted-foreground hover:text-foreground transition-colors">
                    Elmontör
                  </Link>
                </li>
                <li>
                  <Link to="/tjanster/vvs" className="text-muted-foreground hover:text-foreground transition-colors">
                    VVS
                  </Link>
                </li>
                <li>
                  <Link to="/tjanster/snickeri" className="text-muted-foreground hover:text-foreground transition-colors">
                    Snickeri
                  </Link>
                </li>
                <li>
                  <Link to="/tjanster/maleri" className="text-muted-foreground hover:text-foreground transition-colors">
                    Måleri
                  </Link>
                </li>
                <li>
                  <Link to="/tjanster" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Alla tjänster →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Områden */}
            <div>
              <h3 className="font-bold text-lg mb-4">Områden</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/omraden/uppsala" className="text-muted-foreground hover:text-foreground transition-colors">
                    Uppsala
                  </Link>
                </li>
                <li>
                  <Link to="/omraden/stockholm" className="text-muted-foreground hover:text-foreground transition-colors">
                    Stockholm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-bold text-lg mb-4">Information</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/rot-info" className="text-muted-foreground hover:text-foreground transition-colors">
                    ROT-avdrag
                  </Link>
                </li>
                <li>
                  <Link to="/rut" className="text-muted-foreground hover:text-foreground transition-colors">
                    RUT-avdrag
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    Vanliga frågor
                  </Link>
                </li>
                <li>
                  <Link to="/om-oss" className="text-muted-foreground hover:text-foreground transition-colors">
                    Om oss
                  </Link>
                </li>
                <li>
                  <Link to="/referenser" className="text-muted-foreground hover:text-foreground transition-colors">
                    Referenser
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontakt */}
            <div>
              <h3 className="font-bold text-lg mb-4">Kontakt</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors">
                    Kontakta oss
                  </Link>
                </li>
                <li>
                  <Link to="/boka-hembesok" className="text-muted-foreground hover:text-foreground transition-colors">
                    Boka hembesök
                  </Link>
                </li>
                <li>
                  <a href="tel:08-123 456 78" className="text-muted-foreground hover:text-foreground transition-colors">
                    08-123 456 78
                  </a>
                </li>
                <li>
                  <a href="mailto:support@fixco.se" className="text-muted-foreground hover:text-foreground transition-colors">
                    support@fixco.se
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Fixco AB. {t('rights')}</p>
            <p>{t('reg')} • VAT: SE559123456701</p>
          </div>
        </div>
      </footer>
    </>
  );
}