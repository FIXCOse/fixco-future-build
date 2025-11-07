import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Hur lång tid tar rekryteringsprocessen?",
    answer: "Vanligtvis hör du från oss inom 5-7 arbetsdagar efter att du skickat in din ansökan. Vi granskar alla ansökningar noggrant och kontaktar dig för en intervju om din profil matchar våra behov."
  },
  {
    question: "Vilka kollektivavtal följer Fixco?",
    answer: "Vi följer Byggnads för snickare, Elektrikerförbundet för elektriker, VVS-förbundet för VVS-installatörer och andra relevanta kollektivavtal beroende på yrkeskategori. Detta garanterar marknadsmässiga löner och goda arbetsvillkor."
  },
  {
    question: "Behöver jag F-skatt eller kan jag vara anställd?",
    answer: "Du kan jobba hos oss både som anställd och som underentreprenör med F-skatt. Vi erbjuder båda alternativen och anpassar oss efter din situation."
  },
  {
    question: "Hur ser lönesystemet ut?",
    answer: "Vi erbjuder konkurrenskraftig timlön enligt kollektivavtal plus bonussystem baserat på prestationer, kundnöjdhet och effektivitet. Dessutom ingår avtalspension och försäkringar."
  },
  {
    question: "Vilken utrustning behöver jag ha?",
    answer: "Det beror på din roll och om du har F-skatt eller är anställd. Generellt förväntas du ha grundläggande verktyg för ditt yrke. För större projekt tillhandahåller vi specialverktyg och utrustning."
  },
  {
    question: "Får jag betalt för utbildningar?",
    answer: "Ja! Vi erbjuder kontinuerlig kompetensutveckling och betalar för relevanta utbildningar och certifieringar som förbättrar din yrkeskompetens."
  },
  {
    question: "Kan jag välja vilka projekt jag vill jobba med?",
    answer: "Ja, vi har ett flexibelt system där du kan se tillgängliga projekt och välja de som passar din kompetens och ditt schema. Vi matchar även projekt till dig baserat på din profil."
  },
  {
    question: "Vad händer efter att jag skickat in min ansökan?",
    answer: "Efter att du skickat in ansökan granskar vårt rekryteringsteam din bakgrund och kompetens. Om vi är intresserade kontaktar vi dig för en intervju. Vid positiv intervju påbörjar vi onboarding-processen där du får tillgång till våra system och introduktion till hur vi arbetar."
  }
];

export const CareersFAQ = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vanliga frågor
            </h2>
            <p className="text-lg text-muted-foreground">
              Här hittar du svar på de vanligaste frågorna om att jobba hos Fixco
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background px-6 rounded-lg border">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
