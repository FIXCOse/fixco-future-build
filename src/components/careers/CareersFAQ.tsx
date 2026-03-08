import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, Clock } from "lucide-react";

const faqs = [
  { question: "Hur lång tid tar rekryteringsprocessen?", answer: "Vanligtvis hör du från oss inom 5-7 arbetsdagar efter att du skickat in din ansökan. Vi granskar alla ansökningar noggrant och kontaktar dig för en intervju om din profil matchar våra behov." },
  { question: "Vilka kollektivavtal följer Fixco?", answer: "Vi följer Byggnads för snickare, Elektrikerförbundet för elektriker, VVS-förbundet för VVS-installatörer och andra relevanta kollektivavtal beroende på yrkeskategori. Detta garanterar marknadsmässiga löner och goda arbetsvillkor." },
  { question: "Behöver jag F-skatt eller kan jag vara anställd?", answer: "Du kan jobba hos oss både som anställd och som underentreprenör med F-skatt. Vi erbjuder båda alternativen och anpassar oss efter din situation." },
  { question: "Hur ser lönesystemet ut?", answer: "Vi erbjuder konkurrenskraftig timlön enligt kollektivavtal plus bonussystem baserat på prestationer, kundnöjdhet och effektivitet. Dessutom ingår avtalspension och försäkringar." },
  { question: "Vilken utrustning behöver jag ha?", answer: "Det beror på din roll och om du har F-skatt eller är anställd. Generellt förväntas du ha grundläggande verktyg för ditt yrke. För större projekt tillhandahåller vi specialverktyg och utrustning." },
  { question: "Får jag betalt för utbildningar?", answer: "Ja! Vi erbjuder kontinuerlig kompetensutveckling och betalar för relevanta utbildningar och certifieringar som förbättrar din yrkeskompetens." },
  { question: "Kan jag välja vilka projekt jag vill jobba med?", answer: "Ja, vi har ett flexibelt system där du kan se tillgängliga projekt och välja de som passar din kompetens och ditt schema. Vi matchar även projekt till dig baserat på din profil." },
  { question: "Vad händer efter att jag skickat in min ansökan?", answer: "Efter att du skickat in ansökan granskar vårt rekryteringsteam din bakgrund och kompetens. Om vi är intresserade kontaktar vi dig för en intervju. Vid positiv intervju påbörjar vi onboarding-processen." },
];

export const CareersFAQ = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Vanliga frågor
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12">
          Svar på de vanligaste frågorna om att jobba hos Fixco
        </p>

        <Accordion type="single" collapsible className="space-y-3 mb-12">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border px-6 rounded-xl shadow-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Integrated contact banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-foreground font-medium text-center sm:text-left">
            Har du fler frågor? Kontakta oss!
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="tel:+46793350228" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Phone className="w-4 h-4" />
              +46 79 335 02 28
            </a>
            <a href="mailto:karriar@fixco.se" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Mail className="w-4 h-4" />
              karriar@fixco.se
            </a>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Mån-Fre: 08-17
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
