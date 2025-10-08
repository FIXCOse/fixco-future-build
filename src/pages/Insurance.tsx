import { Helmet } from "react-helmet-async";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';
import { Shield, CheckCircle, Phone, Mail } from 'lucide-react';

export default function Insurance() {
  const { t, locale } = useCopy();
  const isEnglish = locale === 'en';

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? "Insurance & Liability – Fixco" : "Ansvar & Försäkring – Fixco"}</title>
        <meta name="description" content={isEnglish ? "Learn about Fixco's insurance coverage and liability protection for all projects." : "Lär dig om Fixcos försäkringsskydd och ansvarsgaranti för alla projekt."} />
        <link rel="canonical" href={isEnglish ? "/en/insurance" : "/ansvar-forsakring"} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              {isEnglish ? "Insurance & Liability" : "Ansvar & Försäkring"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isEnglish 
                ? "Your security and peace of mind are our top priorities"
                : "Din trygghet och sinnesro är våra högsta prioriteringar"
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                {isEnglish ? "Comprehensive Insurance" : "Omfattande Försäkring"}
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "Professional liability insurance up to 10 million SEK"
                      : "Yrkesansvarsförsäkring upp till 10 miljoner SEK"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "General liability insurance for property damage"
                      : "Allmän ansvarsförsäkring för egendomsskador"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "Work equipment and tools insurance"
                      : "Försäkring för arbetsutrustning och verktyg"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "Construction defect insurance"
                      : "Byggfelförsäkring"
                    }
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                {isEnglish ? "Quality Guarantee" : "Kvalitetsgaranti"}
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "5-year warranty on all major installations"
                      : "5 års garanti på alla större installationer"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "2-year warranty on repairs and maintenance"
                      : "2 års garanti på reparationer och underhåll"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "24/7 emergency support for warranty issues"
                      : "24/7 akuthjälp för garantiärenden"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {isEnglish 
                      ? "Free annual maintenance check"
                      : "Gratis årlig underhållskontroll"
                    }
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {isEnglish ? "Our Certifications & Memberships" : "Våra Certifieringar & Medlemskap"}
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">
                  {isEnglish ? "RTK Certified" : "RTK Certifierad"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish ? "Electrical installation" : "Elinstallation"}
                </p>
              </div>

              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">
                  {isEnglish ? "BYR Member" : "BYR Medlem"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish ? "Construction industry" : "Byggindustrin"}
                </p>
              </div>

              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">ISO 9001</h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish ? "Quality management" : "Kvalitetsledning"}
                </p>
              </div>

              <div className="p-4 border rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">
                  {isEnglish ? "Green Building" : "Miljöbyggnad"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish ? "Sustainability" : "Hållbarhet"}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {isEnglish ? "Insurance Details" : "Försäkringsdetaljer"}
            </h2>
            
            <div className="bg-muted/20 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Insurance Provider:" : "Försäkringsbolag:"}
                  </h3>
                  <p className="text-muted-foreground">If Skadeförsäkring AB</p>
                  
                  <h3 className="font-semibold mb-2 mt-4">
                    {isEnglish ? "Policy Number:" : "Försäkringsnummer:"}
                  </h3>
                  <p className="text-muted-foreground">12345-67890-FIXCO</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">
                    {isEnglish ? "Coverage Amount:" : "Täckningsbelopp:"}
                  </h3>
                  <p className="text-muted-foreground">10,000,000 SEK</p>
                  
                  <h3 className="font-semibold mb-2 mt-4">
                    {isEnglish ? "Valid Until:" : "Giltigt till:"}
                  </h3>
                  <p className="text-muted-foreground">{isEnglish ? "December 31, 2024" : "31 december 2024"}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {isEnglish ? "Claims Process" : "Skadeprocess"}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
                <h3 className="font-semibold mb-2">
                  {isEnglish ? "Report Issue" : "Rapportera Problem"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish 
                    ? "Contact us immediately when you discover any issue"
                    : "Kontakta oss omedelbart när du upptäcker något problem"
                  }
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
                <h3 className="font-semibold mb-2">
                  {isEnglish ? "Investigation" : "Utredning"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish 
                    ? "We investigate the issue and determine the best solution"
                    : "Vi utreder problemet och fastställer den bästa lösningen"
                  }
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
                <h3 className="font-semibold mb-2">
                  {isEnglish ? "Resolution" : "Lösning"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEnglish 
                    ? "We fix the issue at no cost to you, covered by insurance"
                    : "Vi åtgärdar problemet utan kostnad för dig, täckt av försäkring"
                  }
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              {isEnglish ? "Questions About Insurance?" : "Frågor om Försäkring?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isEnglish
                ? "Our team is here to help explain our insurance coverage and answer any questions you may have."
                : "Vårt team finns här för att hjälpa till att förklara vårt försäkringsskydd och svara på eventuella frågor du har."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+46812345678" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                <Phone className="w-4 h-4" />
                08-123 456 78
              </a>
              <a href="mailto:support@fixco.se" className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                <Mail className="w-4 h-4" />
                support@fixco.se
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}