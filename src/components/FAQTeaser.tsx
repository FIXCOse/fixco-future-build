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
      answer: "Med ROT-avdrag betalar du endast 480 kr/h för el, VVS och snickeri (ordinarie 959 kr/h). Montering kostar 350 kr/h (ordinarie 699 kr/h). ROT-avdraget ger dig 50% rabatt på arbetskostnaden, max 50,000 kr per person och år."
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
    <section className="py-24 bg-gradient-primary-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vanliga <span className="gradient-text">frågor</span>
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
                className="card-premium overflow-hidden transition-all duration-300 hover:shadow-glow"
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
            <Link to="/faq">
              <Button
                size="lg"
                variant="outline"
                className="font-bold border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              >
                Se alla frågor & svar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick Contact */}
          <div className="mt-16 text-center">
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-4">
                Hittar du inte svar på din fråga?
              </h3>
              <p className="text-muted-foreground mb-6">
                Kontakta oss direkt så svarar vi inom 30 minuter
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground"
                  onClick={() => window.open('tel:08-123-456-78')}
                >
                  Ring: 08-123 456 78
                </Button>
                <Link to="/kontakt">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    Skicka meddelande
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQTeaser;