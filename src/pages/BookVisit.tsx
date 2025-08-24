import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button-premium";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Phone, Mail, MapPin, Star, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingAutofill } from "@/components/BookingAutofill";
import { User as SupabaseUser } from "@supabase/supabase-js";

const BookVisit = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service: "",
    description: "",
    timePreference: ""
  });

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Tack för din bokning!",
      description: "Vi kontaktar dig inom 2 timmar för att bekräfta tiden.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertySelect = (property: any) => {
    setFormData(prev => ({ 
      ...prev, 
      address: `${property.address}, ${property.postal_code} ${property.city}`
    }));
  };

  const handleContactInfo = (info: { name: string; email: string; phone: string }) => {
    setFormData(prev => ({ 
      ...prev, 
      name: info.name,
      email: info.email,
      phone: info.phone
    }));
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Boka <span className="gradient-text">hembesök</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Kostnadsfri konsultation och offert direkt hemma hos dig. 
              Vi kommer inom 24 timmar och ger dig en detaljerad genomgång.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card-premium p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Snabbt besök</h3>
              <p className="text-muted-foreground text-sm">Vi kommer inom 24 timmar</p>
            </div>
            <div className="card-premium p-6 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Kostnadsfritt</h3>
              <p className="text-muted-foreground text-sm">Ingen kostnad för besök eller offert</p>
            </div>
            <div className="card-premium p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Professionellt</h3>
              <p className="text-muted-foreground text-sm">Certifierade experter</p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Fyll i dina <span className="gradient-text">uppgifter</span>
              </h2>
              
              {/* User autofill section */}
              {user && (
                <div className="mb-6">
                  <BookingAutofill 
                    user={user}
                    onPropertySelect={handlePropertySelect}
                    onContactInfo={handleContactInfo}
                  />
                </div>
              )}

              {!user && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-dashed">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Inte inloggad?</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Logga in för att spara dina adresser och förenkla framtida bokningar.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Namn *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ditt namn"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="08-123 456 78"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="din@email.se"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adress *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Gatuadress, postnummer, ort"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="service">Typ av projekt *</Label>
                  <Select onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj typ av projekt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="snickeri">Snickeri</SelectItem>
                      <SelectItem value="vvs">VVS</SelectItem>
                      <SelectItem value="el">El</SelectItem>
                      <SelectItem value="montering">Montering</SelectItem>
                      <SelectItem value="tradgard">Trädgård</SelectItem>
                      <SelectItem value="stadning">Städning</SelectItem>
                      <SelectItem value="markarbeten">Markarbeten</SelectItem>
                      <SelectItem value="projektledning">Projektledning</SelectItem>
                      <SelectItem value="tekniska">Tekniska installationer</SelectItem>
                      <SelectItem value="fastighet">Fastighetsskötsel</SelectItem>
                      <SelectItem value="annat">Annat/Osäker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timePreference">Önskad tid</Label>
                  <Select onValueChange={(value) => handleInputChange("timePreference", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj tid som passar dig" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">Så snart som möjligt</SelectItem>
                      <SelectItem value="morning">Förmiddag (08-12)</SelectItem>
                      <SelectItem value="afternoon">Eftermiddag (12-17)</SelectItem>
                      <SelectItem value="evening">Kväll (17-20)</SelectItem>
                      <SelectItem value="weekend">Helg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Beskriv ditt projekt</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Berätta kort om vad du vill göra..."
                    rows={4}
                  />
                </div>

                <Button type="submit" variant="cta" size="lg" className="w-full">
                  Boka hembesök
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Vad händer sedan?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">1</div>
                    <div>
                      <p className="font-semibold">Vi kontaktar dig</p>
                      <p className="text-sm text-muted-foreground">Inom 2 timmar bekräftar vi tiden</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">2</div>
                    <div>
                      <p className="font-semibold">Hembesök</p>
                      <p className="text-sm text-muted-foreground">Vi gör en noggrann genomgång</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">3</div>
                    <div>
                      <p className="font-semibold">Offert</p>
                      <p className="text-sm text-muted-foreground">Du får en detaljerad offert direkt</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-8">
                <h3 className="text-xl font-bold mb-4">Kontakta oss direkt</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:08-123456789" className="hover:text-primary transition-colors">
                      08-123 456 78
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:info@fixco.se" className="hover:text-primary transition-colors">
                      info@fixco.se
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Uppsala & Stockholms län</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookVisit;