import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'private' as 'private' | 'company' | 'brf',
    companyName: '',
    orgNumber: '',
    brfName: '',
    acceptTerms: false,
    marketingConsent: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/', { replace: true });
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Fel",
        description: "Alla fält är obligatoriska",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Inloggning misslyckades",
            description: "Felaktig e-post eller lösenord",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Fel",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Välkommen tillbaka!",
          description: "Du är nu inloggad"
        });
      }
    } catch (error) {
      toast({
        title: "Ett fel uppstod",
        description: "Försök igen senare",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast({
        title: "Fel",
        description: "Alla obligatoriska fält måste fyllas i",
        variant: "destructive"
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Fel",
        description: "Du måste acceptera användarvillkoren",
        variant: "destructive"
      });
      return;
    }

    if (formData.userType === 'company' && !formData.companyName) {
      toast({
        title: "Fel",
        description: "Företagsnamn är obligatoriskt för företagskonton",
        variant: "destructive"
      });
      return;
    }

    if (formData.userType === 'brf' && !formData.brfName) {
      toast({
        title: "Fel",
        description: "BRF-namn är obligatoriskt för BRF-konton",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            user_type: formData.userType,
            company_name: formData.companyName,
            org_number: formData.orgNumber,
            brf_name: formData.brfName,
            marketing_consent: formData.marketingConsent
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Kontot finns redan",
            description: "Ett konto med denna e-post finns redan. Försök logga in istället.",
            variant: "destructive"
          });
        } else if (error.message.includes('Signup not allowed')) {
          toast({
            title: "Registrering blockerad",
            description: "Kontakta support för att aktivera ditt konto",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registrering misslyckades",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast({
            title: "Kontrollera din e-post! 📧",
            description: "Klicka på verifieringslänken i e-posten för att aktivera ditt konto"
          });
        } else if (data.session) {
          toast({
            title: "Välkommen till Fixco! 🎉",
            description: "Ditt konto är nu aktivt"
          });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Ett oväntat fel uppstod",
        description: "Försök igen senare eller kontakta support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'consent'
          }
        }
      });

      if (error) {
        toast({
          title: "Google-inloggning misslyckades",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
      }
      // Note: Don't set loading to false here since user will be redirected
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Ett oväntat fel uppstod",
        description: "Försök igen senare eller kontakta support",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page, or home if no history
  };

  // Handle ESC key and outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent body scroll

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scroll
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Logga in | Fixco</title>
        <meta name="description" content="Logga in på ditt Fixco-konto eller skapa ett nytt konto för att komma igång med våra tjänster." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="shadow-xl border-border/20 bg-background/95 backdrop-blur">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 rounded-full p-2 hover:bg-muted/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Stäng"
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Välkommen till Fixco
              </CardTitle>
              <CardDescription>
                Hantera dina fastigheter och bokningar
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Logga in</TabsTrigger>
                  <TabsTrigger value="signup">Skapa konto</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">E-post</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="din@email.se"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Lösenord</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Ditt lösenord"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Logga in
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Eller</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                    >
                      Fortsätt med Google
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-type">Kontotyp</Label>
                      <Select
                        value={formData.userType}
                        onValueChange={(value: 'private' | 'company' | 'brf') => handleInputChange('userType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj kontotyp" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Privatkund</SelectItem>
                          <SelectItem value="company">Företag</SelectItem>
                          <SelectItem value="brf">BRF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Förnamn *</Label>
                        <Input
                          id="first-name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Förnamn"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Efternamn *</Label>
                        <Input
                          id="last-name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Efternamn"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">E-post *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="din@email.se"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="070-123 45 67"
                      />
                    </div>

                    {formData.userType === 'company' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Företagsnamn *</Label>
                          <Input
                            id="company-name"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            placeholder="Företagets namn"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-number">Organisationsnummer</Label>
                          <Input
                            id="org-number"
                            value={formData.orgNumber}
                            onChange={(e) => handleInputChange('orgNumber', e.target.value)}
                            placeholder="556123-4567"
                          />
                        </div>
                      </>
                    )}

                    {formData.userType === 'brf' && (
                      <div className="space-y-2">
                        <Label htmlFor="brf-name">BRF-namn *</Label>
                        <Input
                          id="brf-name"
                          value={formData.brfName}
                          onChange={(e) => handleInputChange('brfName', e.target.value)}
                          placeholder="BRF:ens namn"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Lösenord *</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Minst 8 tecken"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accept-terms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                          required
                        />
                        <Label htmlFor="accept-terms" className="text-sm leading-relaxed">
                          Jag accepterar{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            användarvillkoren
                          </Link>{' '}
                          och{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            integritetspolicyn
                          </Link>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="marketing-consent"
                          checked={formData.marketingConsent}
                          onCheckedChange={(checked) => handleInputChange('marketingConsent', checked)}
                        />
                        <Label htmlFor="marketing-consent" className="text-sm">
                          Jag vill ta emot nyhetsbrev och erbjudanden
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Skapa konto
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Eller</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                    >
                      Fortsätt med Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Auth;