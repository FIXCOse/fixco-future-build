import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface MicroFAQProps {
  service?: string;
  className?: string;
}

const MicroFAQ = ({ service, className = "" }: MicroFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Dynamic FAQ based on service or default general FAQs
  const getFAQs = (service?: string): FAQItem[] => {
    if (service?.includes('elektrik')) {
      return [
        {
          question: "Är era elektriker behöriga?",
          answer: "Ja, alla våra elektriker är behöriga och certifierade enligt Elinstallationsreglerna (SER)."
        },
        {
          question: "Ingår ROT-avdrag i priset?",
          answer: "Ja, vårt pris på 480 kr/h är efter ROT-avdrag. Ordinarie pris är 960 kr/h."
        },
        {
          question: "Hur snabbt kan ni komma?",
          answer: "Vi startar vanligtvis inom 3-5 dagar, akuta ärenden samma dag eller nästa dag."
        }
      ];
    }

    // Default general FAQs
    return [
      {
        question: "Vad ingår i priset?",
        answer: "Priset inkluderar arbetskostnad, resor inom vårt verksamhetsområde och moms. Material tillkommer."
      },
      {
        question: "Hur fungerar ROT-avdraget?",
        answer: "Du får 50% avdrag på arbetskostnaden. Vi sköter hela ROT-processen åt dig."
      },
      {
        question: "Vilka områden täcker ni?",
        answer: "Vi verkar främst i Uppsala och Stockholm län, men tar även större projekt nationellt."
      },
      {
        question: "Är ni försäkrade?",
        answer: "Ja, vi har full yrkesansvarighet och alla nödvändiga försäkringar."
      },
      {
        question: "Ger ni garanti på arbetet?",
        answer: "Ja, vi ger 5 års garanti på allt arbete och 2 års garanti på material."
      }
    ];
  };

  const faqs = getFAQs(service);

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Vanliga frågor</h3>
      
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