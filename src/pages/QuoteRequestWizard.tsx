import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createQuoteRequest } from "@/lib/api/quote-requests";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function QuoteRequestWizard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [rotRut, setRotRut] = useState<"none" | "ROT" | "RUT">("none");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log('QuoteRequestWizard mounted, user:', user);
    console.log('URL params - slug:', slug);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth', { state: { returnTo: `/offert/${slug}` } });
      return;
    }

    // Pre-fill with user profile data if available
    if (user) {
      console.log('Setting user email:', user.email);
      setEmail(user.email || "");
    }
  }, [user, slug, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Quote request form submitted');
    console.log('User ID:', user?.id);
    console.log('Service slug:', slug);
    
    if (!user || !slug) {
      console.error('Missing user or slug:', { user: !!user, slug });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Creating quote request with data:', {
        service_id: slug,
        customer_id: user.id,
        name,
        message: message || undefined
      });
      
      const result = await createQuoteRequest({
        service_id: slug,
        customer_id: user.id,
        message: message || undefined,
        rot_rut_type: rotRut === "none" ? "" : rotRut,
        name,
        phone,
        email,
        address,
        postal_code: postalCode,
        city,
      });

      console.log('Quote request created successfully:', result);
      toast.success("Offertförfrågan skickad!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error creating quote request:', error);
      toast.error("Kunde inte skapa offertförfrågan: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container max-w-3xl py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka
        </Button>
        <h1 className="text-3xl font-bold">Begär offert</h1>
        <p className="text-muted-foreground mt-2">
          Beskriv ditt projekt och få en kostnadsfri offert för: {slug}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Kontaktuppgifter</CardTitle>
            <CardDescription>
              Vi använder dessa uppgifter för att kontakta dig med offerten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Namn *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projektadress</CardTitle>
            <CardDescription>
              Var ska arbetet utföras?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Gatuadress</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postnummer</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">Stad</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projektbeskrivning</CardTitle>
            <CardDescription>
              Beskriv ditt projekt så detaljerat som möjligt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message">Beskrivning av arbetet *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Beskriv vad du vill ha gjort, storlek på projektet, material önskemål, tidsram etc..."
                rows={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="rotRut">ROT/RUT-avdrag</Label>
              <Select value={rotRut} onValueChange={(value: "none" | "ROT" | "RUT") => setRotRut(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ av avdrag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Inget avdrag</SelectItem>
                  <SelectItem value="ROT">ROT (Reparation, Underhåll, Tillbyggnad)</SelectItem>
                  <SelectItem value="RUT">RUT (Rengöring, Underhåll, Tvätt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full"
          size="lg"
        >
          {loading ? "Skickar förfrågan..." : "Skicka offertförfrågan"}
        </Button>
      </form>
    </main>
  );
}