import { Helmet } from 'react-helmet-async';
import { useCopy } from '@/copy/CopyProvider';
import { AILabInterface } from '@/features/ailab/AILabInterface';

export default function AI() {
  const { t } = useCopy();

  return (
    <>
      <Helmet>
        <title>{t('ailab.title')} - Fixco</title>
        <meta name="description" content={t('ailab.subtitle')} />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              {t('ailab.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('ailab.subtitle')}
            </p>
          </div>

          <AILabInterface />

          <div className="mt-12 text-center text-sm text-muted-foreground space-y-2 max-w-3xl mx-auto">
            <p>{t('ailab.disclaimer')}</p>
            <p className="font-medium">{t('ailab.policy')}</p>
          </div>
        </div>
      </main>
    </>
  );
}
