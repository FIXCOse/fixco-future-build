import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
const Contact = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Fält saknas",
        description: "Vänligen fyll i alla obligatoriska fält.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Tack för din förfrågan!",
        description: "Vi återkommer inom 24 timmar med en kostnadsfri offert.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        address: ""
      });
    } catch (error) {
      toast({
        title: "Något gick fel",
        description: "Vänligen försök igen eller ring oss direkt.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const services = [
    "Snickeri", "VVS", "Montering", "Trädgård", "Städning", 
    "Projektledning", "Markarbeten", "Tekniska installationer", 
    "El", "Fastighetsskötsel", "Övrigt"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Kontakta <span className="gradient-text">Fixco</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Få en kostnadsfri offert inom 24 timmar. Vi arbetar i Uppsala & Stockholms län 
              (nationellt vid större projekt).
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="card-premium p-6">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="font-bold">Snabb respons</div>
                <div className="text-sm text-muted-foreground">Svar inom 2 timmar</div>
              </div>
              <div className="card-premium p-6">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-4" />
                <div className="font-bold">Kostnadsfri offert</div>
                <div className="text-sm text-muted-foreground">Inga dolda kostnader</div>
              </div>
              <div className="card-premium p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="font-bold">Lokal service</div>
                <div className="text-sm text-muted-foreground">Uppsala & Stockholm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div className="card-premium p-8">
              <h2 className="text-3xl font-bold mb-6">
                Begär <span className="gradient-text">offert</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Fyll i formuläret så återkommer vi inom 24 timmar med en kostnadsfri och detaljerad offert.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Namn <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ditt fullständiga namn"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telefon <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="070-123 45 67"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-post <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="din@email.se"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adress för projektet
                  </label>
                  <Input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Gatuadress, ort"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Typ av tjänst
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Välj tjänst</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Beskrivning av projekt <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Beskriv ditt projekt så detaljerat som möjligt. Vilka arbeten behöver utföras? Ungefär vilken tidsram? Finns det speciella önskemål?"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary text-primary-foreground font-bold text-lg py-3"
                >
                  {isSubmitting ? (
                    <>Skickar...</>
                  ) : (
                    <>
                      Skicka förfrågan
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Genom att skicka formuläret godkänner du att vi kontaktar dig angående din förfrågan.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-6">Kontaktinformation</h3>
                
                <div className="space-y-6">
                  <a href="tel:08-123456789" className="flex items-center space-x-4 hover:text-primary transition-colors">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Telefon</div>
                      <div className="text-muted-foreground">08-123 456 78</div>
                      <div className="text-sm text-green-400">Ring nu för akuta ärenden</div>
                    </div>
                  </a>

                  <a href="mailto:info@fixco.se" className="flex items-center space-x-4 hover:text-primary transition-colors">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">E-post</div>
                      <div className="text-muted-foreground">info@fixco.se</div>
                      <div className="text-sm text-primary">Svar inom 2 timmar</div>
                    </div>
                  </a>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Verksamhetsområde</div>
                      <div className="text-muted-foreground">Uppsala & Stockholms län</div>
                      <div className="text-sm text-muted-foreground">Nationellt vid större projekt</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4">
                  <span className="gradient-text">Öppettider</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Måndag - Fredag</span>
                    <span className="text-primary font-semibold">07:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lördag</span>
                    <span className="text-primary font-semibold">08:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Söndag</span>
                    <span className="text-muted-foreground">Stängt</span>
                  </div>
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-sm">
                      <AlertCircle className="h-4 w-4 text-orange-400 inline mr-2" />
                      <strong>Akutservice:</strong> Ring för akuta läckage och elfärder
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-8 gradient-primary-subtle border-primary/20">
                <h3 className="text-xl font-bold mb-4">Varför välja Fixco?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>Start inom 24 timmar</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>ROT-avdrag - endast 480 kr/h</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>Garanterad kvalitet</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>Kostnadsfria offerter</span>
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

export default Contact;