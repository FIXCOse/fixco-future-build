import { Helmet } from "react-helmet-async";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';

export default function Privacy() {
  const { t } = useCopy();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? "Privacy Policy – Fixco" : "Integritetspolicy – Fixco"}</title>
        <meta name="description" content={isEnglish ? "Read how Fixco handles personal data and privacy." : "Läs hur Fixco hanterar personuppgifter och integritet."} />
        <link rel="canonical" href={isEnglish ? "/en/privacy" : "/privacy"} />
      </Helmet>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{t('pages.privacy.title')}</h1>
        <p className="text-muted-foreground max-w-3xl">{t('pages.privacy.description')}</p>
      </main>
    </div>
  );
}