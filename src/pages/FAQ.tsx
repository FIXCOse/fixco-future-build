import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Clock, DollarSign, Shield, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "ROT-avdrag & Priser",
      icon: DollarSign,
      questions: [
        {
          question: "Vad är ROT-avdrag och hur funkar det?",
          answer: "ROT-avdrag är ett skatteavdrag som ger dig 50% rabatt på arbetskostnaden för reparation, ombyggnad och tillbyggnad av din bostad. Du kan få maximalt 50 000 kr per person och år. Vi hjälper dig med alla ansökningar och du betalar endast hälften av arbetskostnaden direkt till oss."
        },
        {
          question: "Vad kostar era tjänster?",
          answer: "Vårt timpris är 959 kr/h, men med ROT-avdrag betalar du endast 480 kr/h. Vissa tjänster har fast pris, som byte av toalettstol (1 750 kr med ROT) eller handfat (1 250 kr med ROT). Vi ger alltid kostnadsfri offert innan arbetet påbörjas."
        },
        {
          question: "Tillkommer det extra kostnader?",
          answer: "Nej, vi har inga dolda kostnader. Alla avgifter som res-, miljö- och materialkostnader diskuteras och godkänns innan arbetet påbörjas. Vår offert är bindande och du betalar aldrig mer än vad vi kommit överens om."
        },
        {
          question: "Kan jag få ROT-avdrag på alla tjänster?",
          answer: "ROT-avdrag gäller för de flesta av våra tjänster inom reparation, ombyggnad och tillbyggnad av permanentbostäder. Undantag är rena städtjänster och vissa tekniska installationer. Vi informerar alltid om ROT-avdrag gäller för ditt specifika projekt."
        }
      ]
    },
    {
      title: "Bokning & Tidsramar", 
      icon: Clock,
      questions: [
        {
          question: "Hur snabbt kan ni komma?",
          answer: "Vi erbjuder projektstart inom 24 timmar för de flesta uppdrag. För akuta ärenden som läckage eller elfel kan vi ofta komma samma dag. Kontakta oss så snart som möjligt så hittar vi en lösning som passar dig."
        },
        {
          question: "Hur bokar jag era tjänster?",
          answer: "Du kan boka genom att fylla i vårt kontaktformulär på hemsidan, ringa 08-123 456 78 eller skicka mail till info@fixco.se. Vi återkommer inom 2 timmar med en kostnadsfri offert och förslag på tidsplan."
        },
        {
          question: "Kan jag avboka eller ändra min bokning?",
          answer: "Ja, du kan avboka kostnadsfritt fram till 24 timmar före avtalad tid. För avbokningar inom 24 timmar debiteras 50% av det beräknade timpriset. Ändringar av tid eller datum gör vi gärna om det är möjligt."
        },
        {
          question: "Arbetar ni på helger och kvällar?",
          answer: "Våra tider är måndag-fredag 07:00-18:00 och lördag 08:00-16:00. För akuta ärenden och större projekt kan vi arbeta kvällar och helger mot extra kostnad. Kontakta oss så diskuterar vi möjligheterna."
        }
      ]
    },
    {
      title: "Kvalitet & Garanti",
      icon: Shield, 
      questions: [
        {
          question: "Vilken garanti ger ni på era arbeten?",
          answer: "Vi ger 2 års garanti på alla våra arbeten och installationer. För material som vi levererar ger vi tillverkarens garanti. Skulle något gå fel inom garantitiden åtgärdar vi det kostnadsfritt."
        },
        {
          question: "Vad händer om jag inte är nöjd?",
          answer: "Din nöjdhet är vår högsta prioritet. Är du inte helt nöjd med resultatet åtgärdar vi det kostnadsfritt tills du är nöjd. Vi har 98% nöjda kunder och strävar alltid efter 100%."
        },
        {
          question: "Är era hantverkare certifierade?",
          answer: "Ja, alla våra hantverkare är auktoriserade och certifierade inom sina områden. Våra elektriker är behöriga och VVS-installatörer är auktoriserade. Vi har också fullständiga försäkringar som skyddar både oss och dig som kund."
        },
        {
          question: "Vad händer om något går sönder under arbetet?",
          answer: "Vi har en omfattande ansvarsförsäkring som täcker eventuella skador som kan uppstå under arbetet. Du behöver aldrig oroa dig för ekonomiska konsekvenser - vi tar fullt ansvar för våra arbeten."
        }
      ]
    },
    {
      title: "Praktiska frågor",
      icon: HelpCircle,
      questions: [
        {
          question: "Behöver jag vara hemma under arbetet?",
          answer: "Det beror på typen av arbete. För mindre jobb kan du lämna nycklar, men för större projekt eller där val behöver göras rekommenderar vi att du är närvarande åtminstone vid start och avslut. Vi diskuterar detta när vi bokar."
        },
        {
          question: "Tar ni hand om städning efter arbetet?",
          answer: "Ja, grundlig städning efter arbetet ingår alltid. Vi lämnar alltid rent och snyggt efter oss. För större renoveringar kan vi även erbjuda professionell byggstädning som extra tjänst."
        },
        {
          question: "Vilka områden täcker ni?",
          answer: "Vi arbetar främst i Uppsala och Stockholms län. För större projekt (över 50 000 kr) åtar vi oss även uppdrag i hela Sverige. Kontakta oss så berättar vi om vi kan hjälpa dig i ditt område."
        },
        {
          question: "Kan ni hjälpa med bygglov och tillstånd?",
          answer: "Ja, vi hjälper gärna till med bygglovsansökningar och andra tillstånd som kan behövas för ditt projekt. Detta ingår i vår projektledning och konsulttjänst. Vi har lång erfarenhet av bygglovsprocesser."
        },
        {
          question: "Erbjuder ni finansiering?",
          answer: "Vi erbjuder inte direkt finansiering, men vi kan hjälpa dig att hitta lämpliga finansieringslösningar genom våra partners. Många av våra kunder använder bolån eller blancolån för sina projekt."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
        {/* Hero Section */}
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
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              {t('faq.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('faq.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  {t('faq.askQuestion')}
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                {t('common.callUs')}: {t('common.phone')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
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
              {t('faq.noAnswerTitle')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('faq.noAnswerSubtitle')}
            </p>
            
              <div className="grid md:grid-cols-2 gap-6">
                <Link to="/kontakt">
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
                      {t('faq.sendMessage')}
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
                      {t('common.callUs')}: {t('common.phone')}
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