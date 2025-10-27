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
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-rainbow rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold gradient-rainbow">Fixco</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('tagline')}
              </p>
              <div className="text-sm space-y-1">
                <p className="font-medium">Fixco AB</p>
                <p className="text-muted-foreground">{t('org')}: 559123-4567</p>
                <p className="text-muted-foreground">{t('address')}: Storgatan 1, 111 22 Stockholm</p>
                <p className="text-muted-foreground">{t('phone')}: 08-123 456 78</p>
                <p className="text-muted-foreground">{t('email')}: support@fixco.se</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-4">{t('linksTitle')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    to={`${basePath}/${isEnglish ? 'services' : 'tjanster'}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('services')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/${isEnglish ? 'references' : 'referenser'}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('references')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/faq`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/${isEnglish ? 'contact' : 'kontakt'}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('contact')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/${isEnglish ? 'about' : 'om-oss'}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('about')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold mb-4">{t('legalTitle')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    to={`${basePath}/privacy`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('privacy')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/terms`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('terms')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/cookies`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('cookies')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/${isEnglish ? 'insurance' : 'ansvar-forsakring'}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isEnglish ? "Insurance" : "Ansvar & Försäkring"}
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/rot`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ROT
                  </Link>
                </li>
                <li>
                  <Link 
                    to={`${basePath}/rut`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    RUT
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">{t('ctaTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('ctaText')}</p>
              <div className="flex flex-col gap-2">
                <Link 
                  to={`${basePath}/${isEnglish ? 'contact' : 'kontakt'}`} 
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm bg-gradient-rainbow text-white hover:opacity-90 transition-opacity"
                >
                  {t('ctaContact')}
                </Link>
                <Link 
                  to={`${basePath}/${isEnglish ? 'contact' : 'kontakt'}`} 
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                  {t('ctaQuote')}
                </Link>
              </div>
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