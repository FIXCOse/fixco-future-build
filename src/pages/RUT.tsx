import { Button } from "@/components/ui/button-premium";
import { CheckCircle, Calculator, DollarSign, FileText, ArrowRight, Percent, Home, Clipboard, CreditCard, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const RUT = () => {
  const { t } = useCopy();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  
  const bookingPath = isEnglish ? '/en/book-visit' : '/boka-hembesok';
  const contactPath = isEnglish ? '/en/contact' : '/kontakt';

  const examples = [
    {
      service: t('pages.rut.examples.service1'),
      work: t('pages.rut.examples.work1'),
      normalPrice: "2 040 kr",
      rutPrice: "1 020 kr",
      savings: "1 020 kr"
    },
    {
      service: t('pages.rut.examples.service2'), 
      work: t('pages.rut.examples.work2'),
      normalPrice: "1 020 kr",
      rutPrice: "510 kr", 
      savings: "510 kr"
    },
    {
      service: t('pages.rut.examples.service3'),
      work: t('pages.rut.examples.work3'),
      normalPrice: "4 080 kr",
      rutPrice: "2 040 kr",
      savings: "2 040 kr"
    }
  ];

  const qualifyingServices = isEnglish ? [
    "Regular home cleaning",
    "Window cleaning (inside and outside)",
    "Deep cleaning of kitchen and bathroom",
    "Construction cleaning after renovation",
    "Move-out cleaning",
    "Laundry and ironing services",
    "Carpet and upholstery cleaning",
    "Cleaning of balconies and patios",
    "Small maintenance tasks"
  ] : [
    "Regelbunden hemstädning",
    "Fönsterputs (in- och utvändigt)",
    "Djuprengöring av kök och badrum",
    "Byggstäd efter renovering",
    "Flyttstäd",
    "Tvätt- och stryktjänster",
    "Matta- och möbelrengöring",
    "Städning av balkonger och uteplatser",
    "Mindre underhållsarbeten"
  ];

  const nonQualifyingServices = isEnglish ? [
    "Construction and renovation work",
    "New installations (covered by ROT)",
    "Garden work and landscaping",
    "Exterior maintenance of building facades",
    "Electrical and plumbing installations",
    "Material costs (only labor qualifies)",
    "Business premises cleaning",
    "Industrial cleaning services",
    "Repairs requiring permits"
  ] : [
    "Bygg- och renoveringsarbeten",
    "Nyinstallationer (täcks av ROT)",
    "Trädgårdsarbeten och anläggning",
    "Yttre underhåll av byggnadsfasader",
    "El- och VVS-installationer",
    "Materialkostnader (endast arbetskostnad berättigar)",
    "Städning av affärslokaler",
    "Industriell rengöring",
    "Reparationer som kräver bygglov"
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? 'RUT Tax Deduction - Save 50% on Home Services | Fixco' : 'RUT-avdrag - Spara 50% på hemservice | Fixco'}</title>
        <meta name="description" content={isEnglish ? 'Save 50% on home service costs with RUT tax deduction in Sweden. We handle all paperwork and applications for you. Book a free consultation today.' : 'Spara 50% på hemservice med RUT-avdrag. Vi sköter alla ansökningar och pappersarbete åt dig. Boka gratis konsultation idag.'} />
        <meta name="keywords" content={isEnglish ? 'RUT tax deduction, home cleaning, Sweden tax benefits, labor cost savings, home services' : 'RUT-avdrag, hemstäd, skatteavdrag, hemservice, besparingar'} />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">{t('pages.rut.hero.title')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('pages.rut.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={bookingPath}>
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {t('pages.rut.hero.bookVisit')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                <Phone className="mr-2 h-5 w-5" />
                {t('pages.rut.hero.phone')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is RUT */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">{t('pages.rut.what.title')}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('pages.rut.what.description1')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t('pages.rut.what.description2')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rut.what.benefit1')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rut.what.benefit2')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rut.what.benefit3')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rut.what.benefit4')}</span>
                </div>
              </div>
            </div>
            
            <div className="card-premium p-8">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-center mb-4 gradient-text">{t('pages.rut.what.discount')}</h3>
              <p className="text-center text-muted-foreground mb-6">
                {t('pages.rut.what.discountDescription')}
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">{isEnglish ? 'Example: Price' : 'Exempel: Pris'}</div>
                  <div className="text-2xl font-bold line-through text-muted-foreground mb-2">510 kr/h</div>
                  <div className="text-sm text-primary mb-2">{isEnglish ? 'With RUT deduction' : 'Med RUT-avdrag'}</div>
                  <div className="text-3xl font-bold gradient-text">255 kr/h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">{t('pages.rut.examples.title')}</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <div key={example.service} className="card-premium p-6 animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.2}s` }}>
                <h3 className="text-xl font-bold mb-4">{example.service}</h3>
                <p className="text-sm text-muted-foreground mb-4">{example.work}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.rut.examples.price')}</span>
                    <span className="font-semibold line-through text-muted-foreground">{example.normalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary">{t('pages.rut.examples.withRut')}</span>
                    <span className="font-bold text-primary">{example.rutPrice}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{t('pages.rut.examples.savings')}</span>
                      <span className="text-xl font-bold gradient-text">{example.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Process Visualization */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">{t('pages.rut.process.title')}</span>
          </h2>
          
          {/* Modern Process Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
            </div>
            
            <div className="relative grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: t('pages.rut.process.step1.title'),
                  description: t('pages.rut.process.step1.description'),
                  icon: Sparkles,
                  color: "from-pink-500 to-pink-600"
                },
                {
                  step: "2", 
                  title: t('pages.rut.process.step2.title'),
                  description: t('pages.rut.process.step2.description'),
                  icon: Clipboard,
                  color: "from-green-500 to-green-600"
                },
                {
                  step: "3",
                  title: t('pages.rut.process.step3.title'),
                  description: t('pages.rut.process.step3.description'),
                  icon: CreditCard,
                  color: "from-purple-500 to-purple-600"
                }
              ].map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.step} className="relative animate-fade-in-up"
                       style={{ animationDelay: `${index * 0.3}s` }}>
                    {/* Step Circle with modern gradient */}
                    <div className="relative z-10 mx-auto w-24 h-24 mb-6">
                      <div className={`w-full h-full bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300`}>
                        <span className="text-white font-bold text-xl">{step.step}</span>
                      </div>
                      
                      {/* Icon overlay */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary/20">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    
                    {/* Content Card */}
                    <div className="card-premium p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <h3 className="text-xl font-bold mb-3 gradient-text">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Process Benefits */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="card-premium p-6">
              <h4 className="text-lg font-bold mb-4 text-primary">{isEnglish ? '🧹 Perfect for Home Services' : '🧹 Perfekt för Hemservice'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Professional cleaning services' : 'Professionell städservice'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Flexible scheduling' : 'Flexibel schemaläggning'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Trusted and insured staff' : 'Pålitlig och försäkrad personal'}</li>
              </ul>
            </div>
            <div className="card-premium p-6">
              <h4 className="text-lg font-bold mb-4 text-primary">{isEnglish ? '💰 Maximum Savings' : '💰 Maximal Besparing'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? '50% on all RUT services' : '50% på alla RUT-tjänster'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'No waiting for tax return' : 'Ingen väntan på skatteåterbäring'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Immediate discount' : 'Omedelbar rabatt'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What qualifies */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">{t('pages.rut.qualifies.title')}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">{t('pages.rut.qualifies.yes.title')}</h3>
              <div className="space-y-3">
                {qualifyingServices.map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-6 text-muted-foreground">{t('pages.rut.qualifies.no.title')}</h3>
              <div className="space-y-3">
                {nonQualifyingServices.map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center flex-shrink-0">
                      <span className="text-background text-xs">✕</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              <span className="gradient-text">{t('pages.rut.cta.title')}</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('pages.rut.cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={bookingPath}>
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {t('pages.rut.cta.bookNow')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={contactPath}>
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-bold">
                  {t('pages.rut.cta.requestQuote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RUT;