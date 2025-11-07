import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Wallet, Clock, Shield, GraduationCap, Smartphone, Banknote, Calendar } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle,
    title: "Kollektivavtal",
    description: "Vi följer Byggnads, Elektrikerförbundet och andra relevanta kollektivavtal"
  },
  {
    icon: Wallet,
    title: "Konkurrenskraftig lön",
    description: "Marknadsmässig timlön med bonussystem baserat på prestationer"
  },
  {
    icon: Clock,
    title: "Flexibla arbetstider",
    description: "Välj projekt som passar din livssituation och schema"
  },
  {
    icon: Shield,
    title: "Försäkringar",
    description: "TFA, Arbetsskadeförsäkring och trygghet enligt kollektivavtal"
  },
  {
    icon: Banknote,
    title: "Avtalspension",
    description: "Pensionsavsättning enligt kollektivavtal för din framtid"
  },
  {
    icon: GraduationCap,
    title: "Kompetensutveckling",
    description: "Kontinuerliga utbildningar och certifieringar"
  },
  {
    icon: Smartphone,
    title: "Modern teknik",
    description: "Digitala verktyg för schemaläggning, tidrapportering och kommunikation"
  },
  {
    icon: Calendar,
    title: "Säker betalning",
    description: "Alltid lön i tid, varje månad"
  }
];

export const WhyFixco = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Varför jobba hos Fixco?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi värdesätter våra medarbetare och erbjuder en trygg och stimulerande arbetsmiljö
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
