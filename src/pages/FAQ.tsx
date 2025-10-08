import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Clock, DollarSign, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';
import { EditableSection } from "@/components/EditableSection";
import { EditableText } from "@/components/EditableText";

const FAQ = () => {
  const { t, locale } = useCopy();
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const isEnglish = locale === 'en';

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: t('pages.faq.rotPrices'),
      icon: DollarSign,
      questions: [
        {
          question: isEnglish ? "What is ROT deduction and how does it work?" : "Vad är ROT-avdrag och hur funkar det?",
          answer: isEnglish ? 
            "ROT deduction is a tax deduction that gives you 50% discount on labor costs for repair, renovation and extension of your home. You can get a maximum of 50,000 SEK per person per year. We help you with all applications and you only pay half the labor cost directly to us." :
            "ROT-avdrag är ett skatteavdrag som ger dig 50% rabatt på arbetskostnaden för reparation, ombyggnad och tillbyggnad av din bostad. Du kan få maximalt 50 000 kr per person och år. Vi hjälper dig med alla ansökningar och du betalar endast hälften av arbetskostnaden direkt till oss."
        },
        {
          question: isEnglish ? "What do your services cost?" : "Vad kostar era tjänster?",
          answer: isEnglish ? 
            "Our hourly rate is 959 SEK/h, but with ROT deduction you only pay 480 SEK/h. Some services have fixed prices, like toilet replacement (1,750 SEK with ROT) or sink (1,250 SEK with ROT). We always provide a free quote before work begins." :
            "Vårt timpris är 959 kr/h, men med ROT-avdrag betalar du endast 480 kr/h. Vissa tjänster har fast pris, som byte av toalettstol (1 750 kr med ROT) eller handfat (1 250 kr med ROT). Vi ger alltid kostnadsfri offert innan arbetet påbörjas."
        }
      ]
    },
    {
      title: t('pages.faq.bookingTime'), 
      icon: Clock,
      questions: [
        {
          question: isEnglish ? "How quickly can you come?" : "Hur snabbt kan ni komma?",
          answer: isEnglish ? 
            "We offer project start within 24 hours for most assignments. For urgent matters such as leaks or electrical faults, we can often come the same day. Contact us as soon as possible and we'll find a solution that suits you." :
            "Vi erbjuder projektstart inom 24 timmar för de flesta uppdrag. För akuta ärenden som läckage eller elfel kan vi ofta komma samma dag. Kontakta oss så snart som möjligt så hittar vi en lösning som passar dig."
        }
      ]
    },
    {
      title: t('pages.faq.qualityGuarantee'),
      icon: Shield, 
      questions: [
        {
          question: isEnglish ? "What guarantee do you provide on your work?" : "Vilken garanti ger ni på era arbeten?",
          answer: isEnglish ? 
            "We provide 2 years guarantee on all our work and installations. For materials we supply, we provide the manufacturer's warranty. Should something go wrong within the warranty period, we fix it free of charge." :
            "Vi ger 2 års garanti på alla våra arbeten och installationer. För material som vi levererar ger vi tillverkarens garanti. Skulle något gå fel inom garantitiden åtgärdar vi det kostnadsfritt."
        }
      ]
    },
    {
      title: t('pages.faq.practicalQuestions'),
      icon: HelpCircle,
      questions: [
        {
          question: isEnglish ? "Do I need to be home during the work?" : "Behöver jag vara hemma under arbetet?",
          answer: isEnglish ? 
            "It depends on the type of work. For smaller jobs you can leave keys, but for larger projects or where choices need to be made, we recommend that you are present at least at the start and end. We discuss this when we book." :
            "Det beror på typen av arbete. För mindre jobb kan du lämna nycklar, men för större projekt eller där val behöver göras rekommenderar vi att du är närvarande åtminstone vid start och avslut. Vi diskuterar detta när vi bokar."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <EditableSection id="faq-hero" title="FAQ Hero">
          <section className="pt-32 pb-20 hero-background relative">
            {/* F Watermark Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              <img 
                src="/assets/fixco-f-icon-new.png"
                alt="" 
                className="absolute top-20 right-20 w-24 h-24 object-contain rotate-12 opacity-30 animate-pulse"
                style={{ animationDuration: '5s' }}
              />
              <img 
                src="/assets/fixco-f-icon-new.png"
                alt="" 
                className="absolute bottom-20 left-20 w-20 h-20 object-contain -rotate-6 opacity-25 animate-pulse"
                style={{ animationDuration: '4s', animationDelay: '2s' }}
              />
            </div>

            <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <EditableText 
                id="faq-title"
                initialContent={t('pages.faq.title')}
                type="heading"
                as="h1"
                className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              />
              <EditableText 
                id="faq-subtitle"
                initialContent={t('pages.faq.subtitle')}
                as="p"
                className="text-xl md:text-2xl text-muted-foreground mb-8"
              />
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={isEnglish ? "/en/contact" : "/kontakt"}>
                  <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                    <EditableText 
                      id="faq-ask-question"
                      initialContent={t('pages.faq.askQuestion')}
                    >
                      {t('pages.faq.askQuestion')}
                    </EditableText>
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                  <EditableText 
                    id="faq-call-us"
                    initialContent={t('pages.faq.callUs')}
                  >
                    {t('pages.faq.callUs')}
                  </EditableText>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* FAQ Categories */}
      <EditableSection id="faq-categories" title="FAQ kategorier">
        <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            
            return (
              <div key={categoryIndex} className="mb-12">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle mr-4 relative">
                      {/* F Brand Badge on Category Headers */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center z-10">
                        <img 
                          src="/assets/fixco-f-icon-new.png"
                          alt="Fixco" 
                          className="h-6 w-6 object-contain opacity-90"
                        />
                      </div>
                      <CategoryIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>
                
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <div key={faqIndex} className="card-premium overflow-hidden">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
                        >
                          <span className="font-semibold text-lg pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4 border-t border-border">
                            <div className="pt-4 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        </section>
      </EditableSection>

        {/* Contact CTA */}
        <section className="py-20 gradient-primary-subtle relative">
          {/* F Watermark Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
            <img 
              src="/assets/fixco-f-icon-new.png"
              alt="" 
              className="absolute top-10 left-10 w-20 h-20 object-contain rotate-12 opacity-30 animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <img 
              src="/assets/fixco-f-icon-new.png"
              alt="" 
              className="absolute bottom-10 right-10 w-16 h-16 object-contain -rotate-6 opacity-25 animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '1.5s' }}
            />
          </div>

          <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              {t('pages.faq.noAnswer')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('pages.faq.contactUs')}
            </p>
            
              <div className="grid md:grid-cols-2 gap-6">
                <Link to={isEnglish ? "/en/contact" : "/kontakt"}>
                  <div className="relative">
                    {/* F Brand Badge on CTA Buttons */}
                    <div className="absolute -top-2 -right-2 w-9 h-9 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                      <img 
                        src="/assets/fixco-f-icon-new.png"
                        alt="Fixco" 
                        className="h-6 w-6 object-contain opacity-90"
                      />
                    </div>
                    <Button size="lg" className="w-full gradient-primary text-primary-foreground font-bold">
                      {t('pages.faq.sendMessage')}
                    </Button>
                  </div>
                </Link>
                <a href="tel:08-123456789">
                  <div className="relative">
                    {/* F Brand Badge on CTA Buttons */}
                    <div className="absolute -top-2 -right-2 w-9 h-9 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                      <img 
                        src="/assets/fixco-f-icon-new.png" 
                        alt="Fixco" 
                        className="h-6 w-6 object-contain opacity-90"
                      />
                    </div>
                    <Button size="lg" variant="outline" className="w-full border-primary/30 hover:bg-primary/10 font-bold">
                      {t('pages.faq.callUs')}
                    </Button>
                  </div>
                </a>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;