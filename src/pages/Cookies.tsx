import { Helmet } from "react-helmet-async";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';

export default function Cookies() {
  const { t, locale } = useCopy();
  const isEnglish = locale === 'en';

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? "Cookie Policy – Fixco" : "Cookiepolicy – Fixco"}</title>
        <meta name="description" content={isEnglish ? "Learn how Fixco uses cookies on our website." : "Lär dig hur Fixco använder cookies på vår webbplats."} />
        <link rel="canonical" href={isEnglish ? "/en/cookies" : "/cookies"} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">
          {isEnglish ? "Cookie Policy" : "Cookiepolicy"}
        </h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "What are cookies?" : "Vad är cookies?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish 
                ? "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience and allow certain features to function properly."
                : "Cookies är små textfiler som lagras på din enhet när du besöker vår webbplats. De hjälper oss att ge dig en bättre upplevelse och gör att vissa funktioner fungerar korrekt."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "How we use cookies" : "Hur vi använder cookies"}
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">
                  {isEnglish ? "Essential Cookies" : "Nödvändiga cookies"}
                </h3>
                <p className="text-muted-foreground">
                  {isEnglish
                    ? "These cookies are necessary for the website to function properly. They enable basic functionality such as page navigation, form submissions, and security features."
                    : "Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. De möjliggör grundläggande funktioner som sidnavigering, formulärinlämningar och säkerhetsfunktioner."
                  }
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">
                  {isEnglish ? "Analytics Cookies" : "Analyscookies"}
                </h3>
                <p className="text-muted-foreground">
                  {isEnglish
                    ? "We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. All data is anonymized."
                    : "Vi använder analyscookies för att förstå hur besökare interagerar med vår webbplats. Detta hjälper oss att förbättra våra tjänster och användarupplevelse. All data är anonymiserad."
                  }
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">
                  {isEnglish ? "Functional Cookies" : "Funktionella cookies"}
                </h3>
                <p className="text-muted-foreground">
                  {isEnglish
                    ? "These cookies remember your preferences and settings to provide a more personalized experience, such as language selection and contact form information."
                    : "Dessa cookies kommer ihåg dina preferenser och inställningar för att ge en mer personlig upplevelse, såsom språkval och kontaktformulärsinformation."
                  }
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "Managing cookies" : "Hantera cookies"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {isEnglish
                ? "You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website."
                : "Du kan kontrollera och hantera cookies genom dina webbläsarinställningar. Observera att inaktivering av cookies kan påverka funktionaliteten på vår webbplats."
              }
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {isEnglish
                ? "For more information about managing cookies in different browsers, please visit the browser manufacturer's help pages."
                : "För mer information om att hantera cookies i olika webbläsare, besök webbläsartillverkarens hjälpsidor."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "Contact us" : "Kontakta oss"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isEnglish
                ? "If you have any questions about our use of cookies, please contact us at support@fixco.se or call 08-123 456 78."
                : "Om du har några frågor om vår användning av cookies, kontakta oss på support@fixco.se eller ring 08-123 456 78."
              }
            </p>
          </section>

          <section className="bg-muted/20 p-6 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? "This cookie policy was last updated on January 1, 2024. We may update this policy from time to time to reflect changes in technology or legislation."
                : "Denna cookiepolicy uppdaterades senast den 1 januari 2024. Vi kan uppdatera denna policy från tid till annan för att återspegla ändringar i teknik eller lagstiftning."
              }
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}