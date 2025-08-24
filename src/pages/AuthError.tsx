import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AuthError() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Okänt fel uppstod';

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
            <h1 className="text-2xl font-semibold text-foreground">Inloggning misslyckades</h1>
            <p className="text-muted-foreground">{reason}</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/auth">
                <RotateCcw className="mr-2 h-4 w-4" />
                Försök igen
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Tillbaka till startsidan
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Behöver du hjälp? <Link to="/kontakt" className="text-primary hover:underline">Kontakta oss</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}