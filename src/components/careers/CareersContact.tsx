import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, HelpCircle } from "lucide-react";

export const CareersContact = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Har du frågor?
            </h2>
            <p className="text-lg text-muted-foreground">
              Kontakta vår HR-avdelning så hjälper vi dig gärna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">E-post</h3>
                <a href="mailto:karriar@fixco.se" className="text-primary hover:underline">
                  karriar@fixco.se
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Telefon</h3>
                <a href="tel:+46793350228" className="text-primary hover:underline">
                  +46 79 335 02 28
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Öppettider</h3>
                <p className="text-muted-foreground text-sm">
                  Mån-Fre: 08:00 - 17:00
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
