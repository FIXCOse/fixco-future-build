import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBooking } from "@/lib/api/bookings";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function BookingWizard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [priceType, setPriceType] = useState<"hourly" | "fixed">("hourly");
  const [hours, setHours] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("500");
  const [materials, setMaterials] = useState<string>("0");
  const [rotRut, setRotRut] = useState<"" | "ROT" | "RUT">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/boka/${slug}` } });
      return;
    }

    // Pre-fill with user profile data if available
    if (user) {
      setEmail(user.email || "");
    }
  }, [user, slug, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !slug) return;
    
    setLoading(true);
    
    try {
      await createBooking({
        service_id: slug,
        customer_id: user.id,
        price_type: priceType,
        hours_estimated: hours ? parseFloat(hours) : undefined,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        materials: materials ? parseFloat(materials) : undefined,
        rot_rut_type: rotRut || undefined,
        name,
        phone,
        email,
        address,
        postal_code: postalCode,
        city,
        notes: notes || undefined,
      });

      toast.success("Bokning skickad!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Kunde inte skapa bokning");
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
        <h1 className="text-3xl font-bold">Skapa bokning</h1>
        <p className="text-muted-foreground mt-2">
          Fyll i dina uppgifter för att boka tjänsten: {slug}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Kontaktuppgifter</CardTitle>
            <CardDescription>
              Vi använder dessa uppgifter för att kontakta dig
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
            <CardTitle>Adress</CardTitle>
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
            <CardTitle>Prisuppgifter</CardTitle>
            <CardDescription>
              Beskriv hur du vill att tjänsten ska prissättas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="priceType">Pristyp</Label>
              <Select value={priceType} onValueChange={(value: "hourly" | "fixed") => setPriceType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Per timme</SelectItem>
                  <SelectItem value="fixed">Fast pris</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {priceType === "hourly" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Beräknade timmar</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Timpris (kr)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="materials">Material/omkostnader (kr)</Label>
              <Input
                id="materials"
                type="number"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="rotRut">ROT/RUT-avdrag</Label>
              <Select value={rotRut} onValueChange={(value: "" | "ROT" | "RUT") => setRotRut(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ av avdrag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Inget avdrag</SelectItem>
                  <SelectItem value="ROT">ROT (Reparation, Underhåll, Tillbyggnad)</SelectItem>
                  <SelectItem value="RUT">RUT (Rengöring, Underhåll, Tvätt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Övrig information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Anteckningar/önskemål</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Beskriv ditt projekt eller special önskemål..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full"
          size="lg"
        >
          {loading ? "Skickar bokning..." : "Bekräfta bokning"}
        </Button>
      </form>
    </main>
  );
}