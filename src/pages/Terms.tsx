import { Helmet } from "react-helmet-async";
import { useCopy } from '@/copy/CopyProvider';
import { useLocation } from 'react-router-dom';

export default function Terms() {
  const { t } = useCopy();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{isEnglish ? "Terms of Service – Fixco" : "Villkor – Fixco"}</title>
        <meta name="description" content={isEnglish ? "Read Fixco's terms of service." : "Läs Fixcos användarvillkor."} />
        <link rel="canonical" href={isEnglish ? "/en/terms" : "/terms"} />
      </Helmet>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{t('pages.terms.title')}</h1>
        <p className="text-muted-foreground max-w-3xl">{t('pages.terms.description')}</p>
      </main>
    </div>
  );
}