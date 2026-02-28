import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCopy } from '@/copy/CopyProvider';

const FAQTeaser = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t, locale } = useCopy();

  const faqs = [
    { question: t('faqteaser.q1'), answer: t('faqteaser.a1') },
    { question: t('faqteaser.q2'), answer: t('faqteaser.a2') },
    { question: t('faqteaser.q3'), answer: t('faqteaser.a3') },
    { question: t('faqteaser.q4'), answer: t('faqteaser.a4') },
    { question: t('faqteaser.q5'), answer: t('faqteaser.a5') },
  ];

  return (
    <section className="py-24 bg-gradient-primary-subtle relative">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('faqteaser.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('faqteaser.subtitle')}
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card-premium overflow-hidden transition-all duration-300 hover:shadow-glow relative animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
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
                      "h-5 w-5 text-primary shrink-0 transition-transform duration-300",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="overflow-hidden animate-accordion-down">
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="cta-primary"
              size="cta"
              className="group"
              asChild
            >
              <Link to={locale === 'en' ? '/en/faq' : '/faq'}>
                {t('faqteaser.seeAll')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

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
                  onClick={() => window.open('tel:+46793350228')}
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
