import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCopy } from '@/copy/CopyProvider';
import { getLanguageFromPath } from '@/utils/routeMapping';

export default function AuthError() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locale = getLanguageFromPath(location.pathname);
  const { t } = useCopy();
  
  const reason = searchParams.get('reason') || t('pages.auth.unknownError');
  const contactPath = locale === 'en' ? '/en/contact' : '/kontakt';

  return (
    <>
      <Helmet>
        <title>Inloggningsfel | Fixco</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">{t('pages.auth.loginFailed')}</h1>
            <p className="text-muted-foreground">{reason}</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/auth">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('pages.auth.tryAgain')}
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to={locale === 'en' ? '/en' : '/'}>
                <Home className="mr-2 h-4 w-4" />
                {t('pages.auth.backHome')}
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{t('pages.auth.needHelp')} <Link to={contactPath} className="text-primary hover:underline">{t('pages.auth.contactUs')}</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}