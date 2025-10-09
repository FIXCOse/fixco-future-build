import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback by exchanging code for session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('Auth callback error:', error);
          
          // Handle specific error types
          let errorMessage = 'Något gick fel vid inloggningen';
          let description = 'Försök igen eller kontakta support';
          
          if (error.message.includes('invalid_request')) {
            errorMessage = 'Länken har gått ut';
            description = 'Begär en ny verifieringslänk eller försök logga in igen';
          } else if (error.message.includes('access_denied')) {
            errorMessage = 'Åtkomst nekad';
            description = 'Du avbröt inloggningen eller nekade tillgång';
          } else if (error.message.includes('server_error')) {
            errorMessage = 'Serverfel';
            description = 'Domän/redirect mismatch - kontakta support';
          }
          
          toast({
            title: errorMessage,
            description: description,
            variant: "destructive"
          });
          
          // Redirect to auth page after error
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
          
          return;
        }

        // Check if user has a session now
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile to determine role
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          toast({
            title: "Välkommen!",
            description: "Du är nu inloggad"
          });
          
          // Redirect based on role
          if (profileData?.role === 'worker') {
            navigate('/worker', { replace: true });
          } else if (profileData?.role === 'admin' || profileData?.role === 'owner') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/mitt-fixco', { replace: true });
          }
        } else {
          // No session after callback - redirect to auth
          navigate('/auth', { replace: true });
        }
        
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        
        toast({
          title: "Ett oväntat fel uppstod",
          description: "Försök igen senare eller kontakta support",
          variant: "destructive"
        });
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <>
      <Helmet>
        <title>Loggar in... | Fixco</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Loggar in...</h1>
            <p className="text-muted-foreground mt-2">Du kommer att omdirigeras inom kort</p>
          </div>
        </div>
      </div>
    </>
  );
}