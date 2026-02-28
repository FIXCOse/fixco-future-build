import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopy } from '@/copy/CopyProvider';

interface MicroFAQProps {
  service?: string;
  className?: string;
}

const MicroFAQ = ({ service, className = "" }: MicroFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useCopy();

  const getFAQs = () => {
    return [
      { question: t('microfaq.whatsIncluded'), answer: t('microfaq.whatsIncluded.answer') },
      { question: t('microfaq.howRot'), answer: t('microfaq.howRot.answer') },
      { question: t('microfaq.areas'), answer: t('microfaq.areas.answer') },
      { question: t('microfaq.insured'), answer: t('microfaq.insured.answer') },
      { question: t('microfaq.warranty'), answer: t('microfaq.warranty.answer') },
    ];
  };

  const faqs = getFAQs();

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{t('microfaq.title')}</h3>
      
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium text-sm pr-2">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 pt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default MicroFAQ;
