import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
        reg: "Registrerad i Sverige",
        servicesPerArea: "Tjänster per område"
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
        reg: "Registered in Sweden",
        servicesPerArea: "Services by Area"
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
                  <Link to="/tjanster/malning" className="text-muted-foreground hover:text-foreground transition-colors">
                    Målning
                  </Link>
                </li>
                <li>
                  <Link to="/tjanster" className="text-primary hover:text-primary/80 transition-colors font-bold text-base">
                    🔧 Alla tjänster och priser →
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

            {/* Tjänster per område - Collapsible */}
            <div>
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 font-bold text-lg mb-4 hover:text-primary transition-colors">
                  <span>{t('servicesPerArea')}</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3">
                  
                  {/* Elektriker */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Elektriker</div>
                    <Link to="/tjanster/elektriker/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Elektriker Uppsala
                    </Link>
                    <Link to="/tjanster/elektriker/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Elektriker Stockholm
                    </Link>
                  </div>

                  {/* VVS */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">VVS</div>
                    <Link to="/tjanster/vvs/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      VVS Uppsala
                    </Link>
                    <Link to="/tjanster/vvs/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      VVS Stockholm
                    </Link>
                  </div>

                  {/* Snickare */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Snickare</div>
                    <Link to="/tjanster/snickare/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Snickare Uppsala
                    </Link>
                    <Link to="/tjanster/snickare/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Snickare Stockholm
                    </Link>
                  </div>

                  {/* Målare */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Målare</div>
                    <Link to="/tjanster/malare/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Målare Uppsala
                    </Link>
                    <Link to="/tjanster/malare/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Målare Stockholm
                    </Link>
                  </div>

                  {/* Montering */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Montering</div>
                    <Link to="/tjanster/montering/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Montering Uppsala
                    </Link>
                    <Link to="/tjanster/montering/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Montering Stockholm
                    </Link>
                  </div>

                  {/* Trädgård */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Trädgård</div>
                    <Link to="/tjanster/tradgard/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Trädgård Uppsala
                    </Link>
                    <Link to="/tjanster/tradgard/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Trädgård Stockholm
                    </Link>
                  </div>

                  {/* Städning */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Städning</div>
                    <Link to="/tjanster/stad/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Städning Uppsala
                    </Link>
                    <Link to="/tjanster/stad/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Städning Stockholm
                    </Link>
                  </div>

                  {/* Markarbeten */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Markarbeten</div>
                    <Link to="/tjanster/markarbeten/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Markarbeten Uppsala
                    </Link>
                    <Link to="/tjanster/markarbeten/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Markarbeten Stockholm
                    </Link>
                  </div>

                  {/* Tekniska installationer */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Tekniska installationer</div>
                    <Link to="/tjanster/tekniska-installationer/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Tekniska installationer Uppsala
                    </Link>
                    <Link to="/tjanster/tekniska-installationer/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Tekniska installationer Stockholm
                    </Link>
                  </div>

                  {/* Flytt */}
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-foreground">Flytthjälp</div>
                    <Link to="/tjanster/flytt/uppsala" className="text-muted-foreground hover:text-primary transition-colors block">
                      Flytthjälp Uppsala
                    </Link>
                    <Link to="/tjanster/flytt/stockholm" className="text-muted-foreground hover:text-primary transition-colors block">
                      Flytthjälp Stockholm
                    </Link>
                  </div>

                </CollapsibleContent>
              </Collapsible>
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
                  <a href="tel:+46793350228" className="text-muted-foreground hover:text-foreground transition-colors">
                    +46 79 335 02 28
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