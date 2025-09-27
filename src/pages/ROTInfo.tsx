import { Button } from "@/components/ui/button-premium";
import { CheckCircle, Calculator, DollarSign, FileText, ArrowRight, Percent, Home, Clipboard, CreditCard, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ROTInfo = () => {
  const { t } = useCopy();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  
  const bookingPath = isEnglish ? '/en/book-visit' : '/boka-hembesok';
  const contactPath = isEnglish ? '/en/contact' : '/kontakt';

  const examples = [
    {
      service: t('pages.rot.examples.service1'),
      work: t('pages.rot.examples.work1'),
      normalPrice: "1 918 kr",
      rotPrice: "960 kr",
      savings: "958 kr"
    },
    {
      service: t('pages.rot.examples.service2'), 
      work: t('pages.rot.examples.work2'),
      normalPrice: "3 500 kr",
      rotPrice: "1 750 kr", 
      savings: "1 750 kr"
    },
    {
      service: t('pages.rot.examples.service3'),
      work: t('pages.rot.examples.work3'),
      normalPrice: "38 360 kr",
      rotPrice: "19 200 kr",
      savings: "19 160 kr"
    }
  ];

  const qualifyingServices = isEnglish ? [
    "Carpentry work (kitchen, bathroom, interior)",
    "Plumbing installations and repairs", 
    "Electrical installations and lighting",
    "Painting and wallpapering",
    "Floor laying and tiling work",
    "Garden work and landscaping",
    "Facade work and roofing",
    "Assembly of furniture and equipment",
    "Ground work and drainage"
  ] : [
    "Snickeriarbeten (kök, badrum, inredning)",
    "VVS-installationer och reparationer", 
    "Elinstallationer och belysning",
    "Målning och tapetsering",
    "Golvläggning och kakelarbeten",
    "Trädgårdsarbeten och anläggning",
    "Fasadarbeten och takarbeten",
    "Montering av möbler och utrustning",
    "Markarbeten och dränering"
  ];

  const nonQualifyingServices = isEnglish ? [
    "Cleaning only (without construction work)",
    "New construction of entire houses",
    "Work on holiday homes that are not permanent residences", 
    "Outdoor work not related to the residence",
    "Pure consulting services without physical work",
    "Materials (only labor costs qualify)",
    "Moving costs",
    "Insurance matters",
    "Work on commercial properties"
  ] : [
    "Enbart städning (utan byggarbete)",
    "Nybyggnation av hela hus",
    "Arbete på fritidshus som inte är permanentbostad", 
    "Arbete utomhus som inte hör till bostaden",
    "Rena konsulttjänster utan fysiskt arbete",
    "Material (endast arbetskostnaden berättigar)",
    "Flyttkostnader",
    "Försäkringsärenden",
    "Arbete på kommersiella fastigheter"
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? 'ROT Tax Deduction - Save 50% on Home Improvements | Fixco' : 'ROT-avdrag - Spara 50% på hemförbättringar | Fixco'}</title>
        <meta name="description" content={isEnglish ? 'Save 50% on labor costs with ROT tax deduction in Sweden. We handle all paperwork and applications for you. Book a free consultation today.' : 'Spara 50% på arbetskostnaden med ROT-avdrag. Vi sköter alla ansökningar och pappersarbete åt dig. Boka gratis konsultation idag.'} />
        <meta name="keywords" content={isEnglish ? 'ROT tax deduction, home renovation, Sweden tax benefits, labor cost savings' : 'ROT-avdrag, hemrenovering, skatteavdrag, arbetskostnad, besparingar'} />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">{t('pages.rot.hero.title')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('pages.rot.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={bookingPath}>
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {t('pages.rot.hero.bookVisit')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                <Phone className="mr-2 h-5 w-5" />
                {t('pages.rot.hero.phone')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is ROT */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">{t('pages.rot.what.title')}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('pages.rot.what.description1')}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t('pages.rot.what.description2')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rot.what.benefit1')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rot.what.benefit2')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rot.what.benefit3')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{t('pages.rot.what.benefit4')}</span>
                </div>
              </div>
            </div>
            
            <div className="card-premium p-8">
              <Percent className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-center mb-4 gradient-text">{t('pages.rot.what.discount')}</h3>
              <p className="text-center text-muted-foreground mb-6">
                {t('pages.rot.what.discountDescription')}
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">{isEnglish ? 'Example: Price' : 'Exempel: Pris'}</div>
                  <div className="text-2xl font-bold line-through text-muted-foreground mb-2">959 kr/h</div>
                  <div className="text-sm text-primary mb-2">{isEnglish ? 'With ROT deduction' : 'Med ROT-avdrag'}</div>
                  <div className="text-3xl font-bold gradient-text">480 kr/h</div>
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
            <span className="gradient-text">{t('pages.rot.examples.title')}</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <div key={example.service} className="card-premium p-6 animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.2}s` }}>
                <h3 className="text-xl font-bold mb-4">{example.service}</h3>
                <p className="text-sm text-muted-foreground mb-4">{example.work}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.rot.examples.price')}</span>
                    <span className="font-semibold line-through text-muted-foreground">{example.normalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary">{t('pages.rot.examples.withRot')}</span>
                    <span className="font-bold text-primary">{example.rotPrice}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{t('pages.rot.examples.savings')}</span>
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
            <span className="gradient-text">{t('pages.rot.process.title')}</span>
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
                  title: t('pages.rot.process.step1.title'),
                  description: t('pages.rot.process.step1.description'),
                  icon: Home,
                  color: "from-blue-500 to-blue-600"
                },
                {
                  step: "2", 
                  title: t('pages.rot.process.step2.title'),
                  description: t('pages.rot.process.step2.description'),
                  icon: Clipboard,
                  color: "from-green-500 to-green-600"
                },
                {
                  step: "3",
                  title: t('pages.rot.process.step3.title'),
                  description: t('pages.rot.process.step3.description'),
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
              <h4 className="text-lg font-bold mb-4 text-primary">{isEnglish ? '🚀 Fast & Easy' : '🚀 Snabbt & Enkelt'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'No waiting for approval' : 'Ingen väntan på godkännande'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Direct discount at payment' : 'Direkt rabatt vid betalning'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'We handle all paperwork' : 'Vi sköter allt pappersarbete'}</li>
              </ul>
            </div>
            <div className="card-premium p-6">
              <h4 className="text-lg font-bold mb-4 text-primary">{isEnglish ? '💰 Guaranteed Savings' : '💰 Garanterad Besparing'}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? '50% on all qualified work' : '50% på alla kvalificerade arbeten'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Maximize your annual deduction' : 'Maximera ditt årliga avdrag'}</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-primary mr-2" />{isEnglish ? 'Professional advice' : 'Professionell rådgivning'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What qualifies */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">{t('pages.rot.qualifies.title')}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">{t('pages.rot.qualifies.yes.title')}</h3>
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
              <h3 className="text-2xl font-bold mb-6 text-muted-foreground">{t('pages.rot.qualifies.no.title')}</h3>
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
              <span className="gradient-text">{t('pages.rot.cta.title')}</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('pages.rot.cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={bookingPath}>
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {t('pages.rot.cta.bookNow')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={contactPath}>
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-bold">
                  {t('pages.rot.cta.requestQuote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ROTInfo;