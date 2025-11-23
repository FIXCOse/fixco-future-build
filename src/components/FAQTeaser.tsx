import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCopy } from '@/copy/CopyProvider';
import { gsap, CustomEase } from '@/lib/gsap';

const FAQTeaser = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t, locale } = useCopy();
  const sectionRef = useRef<HTMLDivElement>(null);
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  // Initial stagger entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      CustomEase.create("accordionEase", "0.65, 0, 0.35, 1");

      gsap.from(faqItemsRef.current.filter(Boolean), {
        opacity: 0,
        x: -60,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate accordion open/close
  useEffect(() => {
    faqItemsRef.current.forEach((item, index) => {
      if (!item) return;

      const content = item.querySelector('.faq-content') as HTMLElement;
      const arrow = item.querySelector('.faq-arrow') as HTMLElement;

      if (!content || !arrow) return;

      if (openIndex === index) {
        gsap.to(content, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: "accordionEase"
        });

        gsap.to(arrow, {
          rotation: 180,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "accordionEase"
        });

        gsap.to(arrow, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }, [openIndex]);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-primary-subtle relative">
      {/* F Watermark Background Elements - CSS-based for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <div 
          className="absolute top-16 right-16 w-18 h-18 bg-primary/30 rotate-12 animate-pulse rounded-sm"
          style={{ animationDuration: '4s' }}
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-16 left-16 w-14 h-14 bg-primary/25 -rotate-6 animate-pulse rounded-sm"
          style={{ animationDuration: '5s', animationDelay: '1.5s' }}
          aria-hidden="true"
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
                ref={(el) => { faqItemsRef.current[index] = el; }}
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
                    className="faq-arrow h-5 w-5 text-primary shrink-0 will-change-transform"
                  />
                </button>
                
                <div className="faq-content overflow-hidden" style={{ height: 0, opacity: 0 }}>
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
                  {t('faq.no_answer_title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('faq.contact_response')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="cta-primary"
                  size="cta"
                  className="group"
                  onClick={() => window.open('tel:08-123-456-78')}
                >
                  {t('faq.call_us_with_phone')}
                </Button>
                <Button
                  variant="cta-secondary"
                  size="cta"
                  className="group"
                  asChild
                >
                  <Link to={locale === 'en' ? '/en/contact' : '/kontakt'}>
                    {t('faq.tell_project')}
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