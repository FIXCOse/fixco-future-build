import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const FAQTeaser = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Hur snabbt kan ni starta mitt projekt?",
      answer: "Vi kan starta de flesta projekt inom 24 timmar. För akuta ärenden erbjuder vi samma dag-service (inom 4 timmar) mot ett mindre tillägg. Vi har alltid hantverkare tillgängliga i Uppsala och Stockholm."
    },
    {
      question: "Vad kostar era tjänster med ROT-avdrag?",
      answer: "Med ROT-avdrag betalar du endast 480 kr/h för el, VVS och snickeri (normalt 959 kr/h). Montering kostar 350 kr/h (normalt 699 kr/h). ROT-avdraget ger dig 50% rabatt på arbetskostnaden, max 50,000 kr per person och år."
    },
    {
      question: "Vilka områden arbetar ni i?",
      answer: "Vi arbetar främst i Uppsala län och Stockholms län. För större projekt (över 100,000 kr) åker vi även till andra delar av Sverige. Vi har kontor i både Uppsala och Stockholm för snabb service."
    },
    {
      question: "Är ni försäkrade och certifierade?",
      answer: "Ja, vi har fullständig ansvarsförsäkring och är ROT-certifierade. Alla våra hantverkare är utbildade och erfarna. Vi ger även garanti på allt arbete vi utför."
    },
    {
      question: "Hur fungerar offertprocessen?",
      answer: "Du kan begära offert via vår hemsida, telefon eller genom vår 2-minuters offertguide. Vi återkommer inom 1 timme med en preliminär kostnad och bokar hembesök samma dag om önskat. Alla offerter är kostnadsfria."
    }
  ];

  return (
    <section className="py-24 bg-gradient-primary-subtle relative">
      {/* F Watermark Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <img 
          src="/assets/fixco-f-icon-new.png"
          alt="" 
          className="absolute top-16 right-16 w-18 h-18 object-contain rotate-12 opacity-30 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <img 
          src="/assets/fixco-f-icon-new.png" 
          alt="" 
          className="absolute bottom-16 left-16 w-14 h-14 object-contain -rotate-6 opacity-25 animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1.5s' }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vanliga frågor
            </h2>
            <p className="text-xl text-muted-foreground">
              Svar på de vanligaste frågorna om våra tjänster
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card-premium overflow-hidden transition-all duration-300 hover:shadow-glow relative"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-primary transition-transform duration-300 shrink-0",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA to full FAQ */}
          <div className="text-center">
            <Button
              variant="cta-primary"
              size="cta"
              className="group"
              asChild
            >
              <Link to="/faq">
                Se alla frågor &amp; svar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

            {/* Quick Contact */}
            <div className="mt-16 text-center">
              <div className="card-premium p-8 relative">
                <h3 className="text-2xl font-bold mb-4">
                Hittar du inte svar på din fråga?
              </h3>
              <p className="text-muted-foreground mb-6">
                Kontakta oss direkt så svarar vi inom 30 minuter
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="cta-primary"
                  size="cta"
                  className="group"
                  onClick={() => window.open('tel:08-123-456-78')}
                >
                  Ring oss: 08-123 456 78
                </Button>
                <Button
                  variant="cta-secondary"
                  size="cta"
                  className="group"
                  asChild
                >
                  <Link to="/kontakt">
                    Berätta om ditt projekt
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQTeaser;