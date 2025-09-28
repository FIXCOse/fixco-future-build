import { Helmet } from "react-helmet-async";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';
import { Shield, CheckCircle, Phone, Mail, FileText } from 'lucide-react';

export default function Privacy() {
  const { t } = useCopy();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? "Privacy Policy – Fixco" : "Integritetspolicy – Fixco"}</title>
        <meta name="description" content={isEnglish ? "Read how Fixco handles personal data and privacy in accordance with GDPR." : "Läs hur Fixco hanterar personuppgifter och integritet enligt GDPR."} />
        <link rel="canonical" href={isEnglish ? "/en/privacy" : "/privacy"} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              {isEnglish ? "Privacy Policy" : "Integritetspolicy"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isEnglish 
                ? "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
                : "Din integritet är viktig för oss. Denna policy förklarar hur vi samlar in, använder och skyddar dina personuppgifter."
              }
            </p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "1. Data Controller" : "1. Personuppgiftsansvarig"}
              </h2>
              <div className="bg-muted/20 p-6 rounded-lg">
                <p className="font-semibold mb-2">Fixco AB</p>
                <p className="text-muted-foreground">{isEnglish ? "Org. number:" : "Organisationsnummer:"} 559123-4567</p>
                <p className="text-muted-foreground">{isEnglish ? "Address:" : "Adress:"} Storgatan 1, 111 22 Stockholm</p>
                <p className="text-muted-foreground">{isEnglish ? "Phone:" : "Telefon:"} 08-123 456 78</p>
                <p className="text-muted-foreground">E-post: privacy@fixco.se</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "2. What Personal Data We Collect" : "2. Vilka Personuppgifter Vi Samlar In"}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {isEnglish ? "Contact Information" : "Kontaktinformation"}
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {isEnglish ? "Name and address" : "Namn och adress"}</li>
                    <li>• {isEnglish ? "Phone number and email" : "Telefonnummer och e-post"}</li>
                    <li>• {isEnglish ? "Property information" : "Fastighetsinformation"}</li>
                    <li>• {isEnglish ? "Communication preferences" : "Kommunikationspreferenser"}</li>
                  </ul>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {isEnglish ? "Service Information" : "Tjänsteinformation"}
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {isEnglish ? "Service requests and history" : "Tjänsteförfrågningar och historik"}</li>
                    <li>• {isEnglish ? "Project documentation" : "Projektdokumentation"}</li>
                    <li>• {isEnglish ? "Photos of work areas" : "Foton av arbetsområden"}</li>
                    <li>• {isEnglish ? "ROT/RUT deduction data" : "ROT/RUT-avdragsdata"}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "3. How We Use Your Personal Data" : "3. Hur Vi Använder Dina Personuppgifter"}
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Service Delivery" : "Tjänsteleverans"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? "We use your information to provide, schedule, and complete the services you request, including ROT/RUT deduction processing."
                      : "Vi använder din information för att tillhandahålla, schemalägga och slutföra de tjänster du begär, inklusive ROT/RUT-avdragshantering."
                    }
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Communication" : "Kommunikation"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? "We contact you regarding appointments, project updates, warranty issues, and service improvements."
                      : "Vi kontaktar dig angående bokningar, projektuppdateringar, garantiärenden och tjänsteförbättringar."
                    }
                  </p>
                </div>

                <div className="p-4 border-l-4 border-primary bg-primary/5">
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Legal Compliance" : "Rättslig Efterlevnad"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isEnglish
                      ? "We process data to comply with tax regulations, insurance requirements, and construction industry standards."
                      : "Vi behandlar data för att följa skatteregler, försäkringskrav och byggindustrins standarder."
                    }
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "4. Legal Basis for Processing" : "4. Rättslig Grund för Behandling"}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-primary">
                    {isEnglish ? "Contract Performance" : "Avtalsuppfyllelse"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish
                      ? "Processing necessary to fulfill our service agreements with you"
                      : "Behandling som är nödvändig för att uppfylla våra serviceavtal med dig"
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-primary">
                    {isEnglish ? "Legal Obligation" : "Rättslig Skyldighet"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish
                      ? "Compliance with tax laws, insurance requirements, and safety regulations"
                      : "Efterlevnad av skattelagar, försäkringskrav och säkerhetsföreskrifter"
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-primary">
                    {isEnglish ? "Legitimate Interest" : "Berättigat Intresse"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish
                      ? "Quality assurance, service improvement, and warranty management"
                      : "Kvalitetssäkring, tjänsteförbättring och garantihantering"
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-primary">
                    {isEnglish ? "Consent" : "Samtycke"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish
                      ? "Marketing communications and newsletter subscriptions (opt-in only)"
                      : "Marknadsföringskommunikation och nyhetsbrevsprenumerationer (endast opt-in)"
                    }
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "5. Data Sharing" : "5. Datadelning"}
              </h2>
              
              <p className="text-muted-foreground mb-4">
                {isEnglish
                  ? "We only share your personal data when necessary and with appropriate safeguards:"
                  : "Vi delar endast dina personuppgifter när det är nödvändigt och med lämpliga skyddsåtgärder:"
                }
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">
                      {isEnglish ? "Tax Authorities:" : "Skatteverket:"}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {isEnglish ? "ROT/RUT deduction processing" : "ROT/RUT-avdragshantering"}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">
                      {isEnglish ? "Insurance Companies:" : "Försäkringsbolag:"}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {isEnglish ? "Claims processing and coverage verification" : "Skadehantering och täckningsverifiering"}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">
                      {isEnglish ? "Subcontractors:" : "Underleverantörer:"}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {isEnglish ? "Only information necessary for service delivery" : "Endast information som är nödvändig för tjänsteleverans"}
                    </span>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "6. Your Rights" : "6. Dina Rättigheter"}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h3 className="font-medium text-primary">
                      {isEnglish ? "Access" : "Tillgång"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Request a copy of your personal data" : "Begär en kopia av dina personuppgifter"}
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <h3 className="font-medium text-primary">
                      {isEnglish ? "Rectification" : "Rättelse"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Correct inaccurate personal data" : "Korrigera felaktiga personuppgifter"}
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <h3 className="font-medium text-primary">
                      {isEnglish ? "Erasure" : "Radering"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Request deletion of your data" : "Begär radering av dina uppgifter"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h3 className="font-medium text-primary">
                      {isEnglish ? "Portability" : "Portabilitet"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Receive your data in a structured format" : "Ta emot dina data i ett strukturerat format"}
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <h3 className="font-medium text-primary">
                      {isEnglish ? "Objection" : "Invändning"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Object to certain processing activities" : "Invända mot vissa behandlingsaktiviteter"}
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <h3 className="font-medium text-primary">
                      {isEnglish ? "Restriction" : "Begränsning"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Limit how we process your data" : "Begränsa hur vi behandlar dina data"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "7. Data Retention" : "7. Datalagring"}
              </h2>
              
              <p className="text-muted-foreground mb-4">
                {isEnglish
                  ? "We retain personal data only as long as necessary for the purposes outlined in this policy:"
                  : "Vi behåller personuppgifter endast så länge som är nödvändigt för ändamålen som anges i denna policy:"
                }
              </p>
              
              <ul className="space-y-2 text-muted-foreground">
                <li>• {isEnglish ? "Service records: 7 years (tax and warranty requirements)" : "Tjänsteregister: 7 år (skatte- och garantikrav)"}</li>
                <li>• {isEnglish ? "Contact information: Until you withdraw consent or object" : "Kontaktinformation: Tills du återkallar samtycke eller invänder"}</li>
                <li>• {isEnglish ? "Project documentation: 10 years (construction regulations)" : "Projektdokumentation: 10 år (byggregler)"}</li>
                <li>• {isEnglish ? "Marketing data: Until consent is withdrawn" : "Marknadsföringsdata: Tills samtycke återkallas"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "8. Data Security" : "8. Datasäkerhet"}
              </h2>
              
              <p className="text-muted-foreground mb-4">
                {isEnglish
                  ? "We implement appropriate technical and organizational measures to protect your personal data:"
                  : "Vi implementerar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter:"
                }
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Technical Measures" : "Tekniska Åtgärder"}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {isEnglish ? "Encrypted data transmission (SSL)" : "Krypterad dataöverföring (SSL)"}</li>
                    <li>• {isEnglish ? "Secure data storage" : "Säker datalagring"}</li>
                    <li>• {isEnglish ? "Regular security updates" : "Regelbundna säkerhetsuppdateringar"}</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Organizational Measures" : "Organisatoriska Åtgärder"}
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {isEnglish ? "Staff training on data protection" : "Personalutbildning om dataskydd"}</li>
                    <li>• {isEnglish ? "Access controls and monitoring" : "Åtkomstkontroller och övervakning"}</li>
                    <li>• {isEnglish ? "Regular security audits" : "Regelbundna säkerhetsrevisioner"}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                {isEnglish ? "Contact Our Privacy Team" : "Kontakta Vårt Integritetsteam"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isEnglish
                  ? "If you have questions about this privacy policy or want to exercise your rights, please contact us:"
                  : "Om du har frågor om denna integritetspolicy eller vill utöva dina rättigheter, kontakta oss:"
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:privacy@fixco.se" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                  <Mail className="w-4 h-4" />
                  privacy@fixco.se
                </a>
                <a href="tel:+46812345678" className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                  <Phone className="w-4 h-4" />
                  08-123 456 78
                </a>
              </div>
            </section>

            <section className="bg-muted/20 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? "This privacy policy was last updated on January 1, 2024. We will notify you of any material changes to this policy via email or through our website."
                  : "Denna integritetspolicy uppdaterades senast den 1 januari 2024. Vi kommer att meddela dig om eventuella väsentliga ändringar av denna policy via e-post eller genom vår webbplats."
                }
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}