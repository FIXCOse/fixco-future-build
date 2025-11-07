import { Card, CardContent } from "@/components/ui/card";
import { Hammer, Zap, Droplet, Paintbrush, TreePine, SparklesIcon, Wrench, Mountain, Truck } from "lucide-react";

const professions = [
  { icon: Hammer, title: "Snickare", description: "Bygg, renovering, kök & badrum" },
  { icon: Zap, title: "Elektriker", description: "Elinstallationer, larm, fiber" },
  { icon: Droplet, title: "VVS-installatörer", description: "Rörmokeri, värme, ventilation" },
  { icon: Paintbrush, title: "Målare", description: "Målning inomhus & utomhus" },
  { icon: TreePine, title: "Trädgårdsmästare", description: "Trädgårdsanläggning & skötsel" },
  { icon: SparklesIcon, title: "Städpersonal", description: "Städning & fastighetsservice" },
  { icon: Wrench, title: "Monteringstekniker", description: "Möbel- & vitvarumontering" },
  { icon: Mountain, title: "Markarbetare", description: "Markarbeten & utomhusjobb" },
  { icon: Truck, title: "Flyttpersonal", description: "Flytt & transport" }
];

export const ProfessionGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vilka vi söker
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi söker kompetenta hantverkare inom flera olika områden
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professions.map((profession, index) => {
              const Icon = profession.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{profession.title}</h3>
                    <p className="text-sm text-muted-foreground">{profession.description}</p>
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
