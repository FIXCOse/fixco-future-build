import { Helmet } from "react-helmet-async";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';

export default function Terms() {
  const { t, locale } = useCopy();
  const isEnglish = locale === 'en';

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? "Terms of Service – Fixco" : "Villkor – Fixco"}</title>
        <meta name="description" content={isEnglish ? "Read Fixco's terms of service for home and construction services." : "Läs Fixcos villkor för hem- och byggtjänster."} />
        <link rel="canonical" href={isEnglish ? "/en/terms" : "/terms"} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">
          {isEnglish ? "Terms of Service" : "Allmänna Villkor"}
        </h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "1. Agreement" : "1. Avtal"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish 
                ? "These terms of service govern the relationship between Fixco AB (org.nr 559123-4567) and our customers. By booking our services, you agree to these terms."
                : "Dessa allmänna villkor reglerar förhållandet mellan Fixco AB (org.nr 559123-4567) och våra kunder. Genom att boka våra tjänster godkänner du dessa villkor."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "2. Services" : "2. Tjänster"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish
                ? "Fixco provides professional home and construction services including electrical work, plumbing, carpentry, painting, and maintenance. All work is performed by certified professionals."
                : "Fixco tillhandahåller professionella hem- och byggtjänster inklusive elarbete, VVS, snickeri, målning och underhåll. Allt arbete utförs av certifierade yrkesmän."
              }
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>{isEnglish ? "All technicians are insured and certified" : "Alla tekniker är försäkrade och certifierade"}</li>
              <li>{isEnglish ? "We provide 5-year warranty on major installations" : "Vi ger 5 års garanti på större installationer"}</li>
              <li>{isEnglish ? "Emergency services available 24/7" : "Akuttjänster tillgängliga 24/7"}</li>
              <li>{isEnglish ? "ROT and RUT deductions handled automatically" : "ROT- och RUT-avdrag hanteras automatiskt"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "3. Booking & Quotes" : "3. Bokning & Offerter"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish
                ? "Quotes are free and valid for 30 days. Booking confirmation is required before work begins. Changes to the scope of work may affect pricing."
                : "Offerter är kostnadsfria och giltiga i 30 dagar. Bokningsbekräftelse krävs innan arbetet påbörjas. Ändringar av arbetets omfattning kan påverka priset."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "4. Payment Terms" : "4. Betalningsvillkor"}
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {isEnglish
                  ? "Payment terms vary by project size and type:"
                  : "Betalningsvillkor varierar beroende på projektets storlek och typ:"
                }
              </p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>{isEnglish ? "Small repairs: Payment upon completion" : "Små reparationer: Betalning vid färdigställande"}</li>
                <li>{isEnglish ? "Medium projects: 50% upfront, 50% upon completion" : "Medelstora projekt: 50% förskott, 50% vid färdigställande"}</li>
                <li>{isEnglish ? "Large projects: Scheduled payments according to agreement" : "Stora projekt: Schemalagda betalningar enligt överenskommelse"}</li>
                <li>{isEnglish ? "Late payments incur 2% monthly interest" : "Försenade betalningar medför 2% månadsränta"}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "5. Warranty & Liability" : "5. Garanti & Ansvar"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish
                ? "We provide comprehensive warranties and carry full insurance coverage."
                : "Vi tillhandahåller omfattande garantier och har fullständigt försäkringsskydd."
              }
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>{isEnglish ? "5-year warranty on installations" : "5 års garanti på installationer"}</li>
              <li>{isEnglish ? "2-year warranty on repairs" : "2 års garanti på reparationer"}</li>
              <li>{isEnglish ? "10 million SEK liability insurance" : "10 miljoner SEK ansvarsförsäkring"}</li>
              <li>{isEnglish ? "Construction defect insurance included" : "Byggfelförsäkring ingår"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "6. Cancellation Policy" : "6. Avbokningspolicy"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish
                ? "Cancellations are accepted according to these terms:"
                : "Avbokningar accepteras enligt dessa villkor:"
              }
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>{isEnglish ? "Free cancellation up to 24 hours before appointment" : "Gratis avbokning upp till 24 timmar före avtalad tid"}</li>
              <li>{isEnglish ? "50% fee for cancellations within 24 hours" : "50% avgift för avbokningar inom 24 timmar"}</li>
              <li>{isEnglish ? "Emergency situations evaluated case by case" : "Nödsituationer utvärderas från fall till fall"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "7. Force Majeure" : "7. Force Majeure"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isEnglish
                ? "Fixco is not liable for delays or inability to perform services due to circumstances beyond our control, including but not limited to natural disasters, strikes, or government restrictions."
                : "Fixco är inte ansvarigt för förseningar eller oförmåga att utföra tjänster på grund av omständigheter utanför vår kontroll, inklusive men inte begränsat till naturkatastrofer, strejker eller myndighetsbegränsningar."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "8. Privacy & Data Protection" : "8. Integritet & Dataskydd"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isEnglish
                ? "We handle personal data in accordance with GDPR and Swedish data protection laws. See our Privacy Policy for detailed information about data collection and processing."
                : "Vi hanterar personuppgifter i enlighet med GDPR och svenska dataskyddslagar. Se vår integritetspolicy för detaljerad information om datainsamling och behandling."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "9. Dispute Resolution" : "9. Tvistlösning"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish
                ? "Disputes will first be addressed through direct communication. If unresolved:"
                : "Tvister kommer först att hanteras genom direkt kommunikation. Om de inte löses:"
              }
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>{isEnglish ? "Mediation through construction industry arbitration" : "Medling genom byggindustrins skiljemän"}</li>
              <li>{isEnglish ? "Swedish courts have jurisdiction" : "Svenska domstolar har jurisdiktion"}</li>
              <li>{isEnglish ? "Swedish law applies" : "Svensk lag gäller"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "10. Contact Information" : "10. Kontaktinformation"}
            </h2>
            <div className="bg-muted/20 p-6 rounded-lg">
              <p className="font-semibold mb-2">Fixco AB</p>
              <p className="text-muted-foreground">{isEnglish ? "Org.nr:" : "Organisationsnummer:"} 559123-4567</p>
              <p className="text-muted-foreground">{isEnglish ? "Address:" : "Adress:"} Storgatan 1, 111 22 Stockholm</p>
              <p className="text-muted-foreground">{isEnglish ? "Phone:" : "Telefon:"} 08-123 456 78</p>
              <p className="text-muted-foreground">E-post: support@fixco.se</p>
            </div>
          </section>

          <section className="bg-muted/20 p-6 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? "These terms were last updated on January 1, 2024. We reserve the right to update these terms with 30 days notice to existing customers."
                : "Dessa villkor uppdaterades senast den 1 januari 2024. Vi förbehåller oss rätten att uppdatera dessa villkor med 30 dagars varsel till befintliga kunder."
              }
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}