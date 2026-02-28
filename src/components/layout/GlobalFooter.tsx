import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';
import { useCopy } from '@/copy/CopyProvider';

interface GlobalFooterProps {
  locale?: 'sv' | 'en';
}

export default function GlobalFooter({ locale = 'sv' }: GlobalFooterProps) {
  const { t } = useCopy();
  const isEnglish = locale === 'en';
  const basePath = isEnglish ? '/en' : '';
  
  // Service links - locale-aware
  const serviceLinks = [
    { label: t('footer.electrician'), path: isEnglish ? '/en/services/electrical' : '/tjanster/el' },
    { label: t('footer.plumbing'), path: isEnglish ? '/en/services/plumbing' : '/tjanster/vvs' },
    { label: t('footer.carpentry'), path: isEnglish ? '/en/services/carpentry' : '/tjanster/snickeri' },
    { label: t('footer.painting'), path: isEnglish ? '/en/services/painting' : '/tjanster/malning' },
    { label: t('footer.doorLock'), path: isEnglish ? '/en/services/locks' : '/tjanster/dorrlas' },
  ];

  const servicesByArea = [
    { label: t('footer.electricianLabel'), sv: 'elektriker', en: 'electrician' },
    { label: t('footer.plumbingLabel'), sv: 'vvs', en: 'plumbing' },
    { label: t('footer.carpentryLabel'), sv: 'snickare', en: 'carpenter' },
    { label: t('footer.paintingLabel'), sv: 'malare', en: 'painter' },
    { label: t('footer.assemblyLabel'), sv: 'montering', en: 'assembly' },
    { label: t('footer.gardenLabel'), sv: 'tradgard', en: 'garden' },
    { label: t('footer.cleaningLabel'), sv: 'stad', en: 'cleaning' },
    { label: t('footer.groundworkLabel'), sv: 'markarbeten', en: 'groundwork' },
    { label: t('footer.techInstallLabel'), sv: 'tekniska-installationer', en: 'technical-installations' },
    { label: t('footer.movingLabel'), sv: 'flytt', en: 'moving' },
  ];

  const cities = [
    { label: t('footer.cityUppsala'), slug: 'uppsala' },
    { label: t('footer.cityStockholm'), slug: 'stockholm' },
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Fixco AB",
            "url": "https://fixco.se",
            "telephone": "+46793350228",
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
            
            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.ourServices')}</h3>
              <ul className="space-y-2 text-sm">
                {serviceLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to={isEnglish ? '/en/services' : '/tjanster'} className="text-primary hover:text-primary/80 transition-colors font-bold text-base">
                    {t('footer.allServicesLink')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Areas */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.areas')}</h3>
              <ul className="space-y-2 text-sm">
                {cities.map(city => (
                  <li key={city.slug}>
                    <Link to={isEnglish ? `/en/areas/${city.slug}` : `/omraden/${city.slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
                      {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services per area - Collapsible */}
            <div>
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 font-bold text-lg mb-4 hover:text-primary transition-colors">
                  <span>{t('footer.servicesPerArea')}</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3">
                  {servicesByArea.map(service => (
                    <div key={service.sv} className="text-sm">
                      <div className="font-medium mb-1 text-foreground">{service.label}</div>
                      {cities.map(city => (
                        <Link
                          key={`${service.sv}-${city.slug}`}
                          to={isEnglish
                            ? `/en/services/${service.en}/${city.slug}`
                            : `/tjanster/${service.sv}/${city.slug}`
                          }
                          className="text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {service.label} {city.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.information')}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to={isEnglish ? '/en/rot-info' : '/rot-info'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('footer.rotDeduction')}
                  </Link>
                </li>
                <li>
                  <Link to={isEnglish ? '/en/rut' : '/rut'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('footer.rutDeduction')}
                  </Link>
                </li>
                <li>
                  <Link to={isEnglish ? '/en/faq' : '/faq'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('footer.faq')}
                  </Link>
                </li>
                <li>
                  <Link to={isEnglish ? '/en/about' : '/om-oss'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('footer.aboutUs')}
                  </Link>
                </li>
                <li>
                  <Link to={isEnglish ? '/en/references' : '/referenser'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('footer.references')}
                  </Link>
                </li>
                <li>
                  <Link to={isEnglish ? '/en/blog' : '/blogg'} className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                    {t('footer.blogGuides')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to={isEnglish ? '/en/contact' : '/kontakt'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('footer.contactUs')}
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {t('footer.bookHomeVisit')}
                  </button>
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
            <p>© {new Date().getFullYear()} Fixco AB. {t('footer.rights')}</p>
            <p>{t('footer.registered')} • VAT: SE559123456701</p>
          </div>
        </div>
      </footer>
    </>
  );
}