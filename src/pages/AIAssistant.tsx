import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  Users, 
  Calendar, 
  Camera,
  Calculator,
  Home,
  Lightbulb,
  Shield,
  Globe,
  Smartphone,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  Palette,
  Wrench,
  PiggyBank,
  Leaf,
  Award,
  Building,
  MapPin,
  Heart,
  Gauge,
  Rocket,
  Cpu,
  ChartLine
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIFunctionModals } from "@/components/AIFunctionModals";
import SEOSchema from "@/components/SEOSchema";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AIAssistant() {
  const [selectedCategory, setSelectedCategory] = useState("analys");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleQuoteRequest = (data: any) => {
    toast.success("Navigerar till offertformulär...");
    // Data will be passed to quote form
  };
  
  const aiFeatures = {
    analys: [
      {
        title: "Smart Hem Analys",
        description: "AI analyserar ditt hem och föreslår optimala ROT/RUT-projekt",
        icon: Home,
        features: ["Energieffektivitet", "Säkerhet", "Komfort", "Värdeökning"],
        savings: "15-30%",
        color: "from-blue-500 to-purple-600",
        modal: 'homeAnalysis'
      },
      {
        title: "Kostnadsprediktering",
        description: "Realtidsanalys av materialpriser och arbetskostnader",
        icon: Calculator,
        features: ["Live prisuppdateringar", "Säsongsvariationer", "Regional prissättning"],
        accuracy: "97%",
        color: "from-green-500 to-blue-500",
        modal: 'costPrediction'
      },
      {
        title: "Trendanalys",
        description: "Identifiera kommande trender inom renovering och byggande",
        icon: TrendingUp,
        features: ["Designtrender", "Tekniska innovationer", "Marknadsförändringar"],
        growth: "+45%",
        color: "from-purple-500 to-pink-500",
        modal: 'projectAssistant'
      },
      {
        title: "Miljöpåverkan Scanner",
        description: "Beräkna CO2-avtryck och miljöbesparingar för varje projekt",
        icon: Leaf,
        features: ["Carbon footprint", "Återvinningsgrad", "Energibesparing"],
        impact: "2.3 ton CO2",
        color: "from-green-400 to-emerald-500",
        modal: 'projectAssistant'
      }
    ],
    visualisering: [
      {
        title: "3D Projektvisualiserare",
        description: "Se ditt projekt i realtid innan bygget börjar",
        icon: Eye,
        features: ["AR-integration", "Fotorealistisk rendering", "Interaktiv design"],
        demos: "10K+",
        color: "from-orange-500 to-red-500",
        modal: 'visualization'
      },
      {
        title: "Före/Efter Generator",
        description: "AI skapar realistiska före/efter bilder av ditt projekt",
        icon: Camera,
        features: ["Maskinlärning", "Stilöverföring", "Högkvalitetsbilder"],
        quality: "4K Ultra",
        color: "from-pink-500 to-rose-500",
        modal: 'visualization'
      },
      {
        title: "Färgharmoni AI",
        description: "Optimal färgkombination baserat på dina preferenser",
        icon: Palette,
        features: ["Psykologi-baserat", "Ljusanalys", "Personliga profiler"],
        combinations: "1M+",
        color: "from-violet-500 to-purple-500",
        modal: 'visualization'
      },
      {
        title: "Material Matcher",
        description: "AI hittar perfekta material för ditt projekt och budget",
        icon: Wrench,
        features: ["Hållbarhetsindex", "Prisoptimering", "Kvalitetsbedömning"],
        matches: "99.2%",
        color: "from-indigo-500 to-blue-500",
        modal: 'projectAssistant'
      }
    ],
    optimering: [
      {
        title: "ROT/RUT Maximizer",
        description: "Optimera dina avdrag och få max värde för pengarna",
        icon: PiggyBank,
        features: ["Automatisk beräkning", "Juridisk compliance", "Max avdrag"],
        savings: "50%",
        color: "from-amber-500 to-orange-500",
        modal: 'costPrediction'
      },
      {
        title: "Tidschema AI",
        description: "Optimal projektplanering för snabbaste genomförande",
        icon: Clock,
        features: ["Väderprediktion", "Leverantörskoordinering", "Resursoptimering"],
        efficiency: "+35%",
        color: "from-cyan-500 to-blue-500",
        modal: 'projectAssistant'
      },
      {
        title: "Kvalitetsprediktor",
        description: "Förutse potentiella problem innan de uppstår",
        icon: Shield,
        features: ["Riskanalys", "Materialkompatibilitet", "Säkerhetsbedömning"],
        accuracy: "94%",
        color: "from-red-500 to-pink-500",
        modal: 'projectAssistant'
      },
      {
        title: "Budget Optimizer",
        description: "AI hittar besparingsmöjligheter utan kvalitetsförlust",
        icon: Target,
        features: ["Kostnadsjämförelse", "Alternativa lösningar", "Värdeanalys"],
        savings: "20-40%",
        color: "from-emerald-500 to-green-500",
        modal: 'costPrediction'
      }
    ],
    prediktioner: [
      {
        title: "Värdeökning Kalkylator",
        description: "Förutse hur mycket ditt projekt ökar fastighetsvärdet",
        icon: Building,
        features: ["Marknadsanalys", "Jämförbara objekt", "ROI-beräkning"],
        increase: "+12%",
        color: "from-teal-500 to-cyan-500",
        modal: 'projectAssistant'
      },
      {
        title: "Underhåll Prediktor",
        description: "AI förutser när renovering och underhåll behövs",
        icon: Gauge,
        features: ["Slitageanalys", "Materiallivslängd", "Kostnadsplanering"],
        accuracy: "91%",
        color: "from-blue-600 to-indigo-600",
        modal: 'projectAssistant'
      },
      {
        title: "Säsong Optimizer",
        description: "Bästa tid att genomföra olika typer av projekt",
        icon: Calendar,
        features: ["Vädermönster", "Prisfluktuationer", "Tillgänglighet"],
        optimization: "85%",
        color: "from-purple-600 to-violet-600",
        modal: 'projectAssistant'
      },
      {
        title: "Trend Forecaster",
        description: "Förutse framtida designtrender och teknologier",
        icon: Rocket,
        features: ["Data från globala marknader", "Konsumentbeteende", "Innovation tracking"],
        predictions: "2-5 år",
        color: "from-orange-600 to-red-600",
        modal: 'projectAssistant'
      }
    ]
  };

  const stats = [
    { label: "AI Analyser", value: "50,000+", icon: Brain, growth: "+127%" },
    { label: "Nöjda Kunder", value: "15,432", icon: Users, growth: "+89%" },
    { label: "Genomförda Projekt", value: "8,934", icon: CheckCircle, growth: "+156%" },
    { label: "Besparingar", value: "234M kr", icon: PiggyBank, growth: "+203%" },
    { label: "AI Träffsäkerhet", value: "97.3%", icon: Target, growth: "+12%" },
    { label: "Miljöbesparing", value: "1,250 ton CO2", icon: Leaf, growth: "+87%" }
  ];

  const competitorAnalysis = [
    { metric: "AI Träffsäkerhet", fixco: 97, competitor: 73, unit: "%" },
    { metric: "Projektgenomföring", fixco: 94, competitor: 68, unit: "%" },
    { metric: "Kostnadsprecision", fixco: 96, competitor: 71, unit: "%" },
    { metric: "Kundnöjdhet", fixco: 98, competitor: 79, unit: "%" },
    { metric: "Tidsbesparingar", fixco: 35, competitor: 12, unit: "%" },
    { metric: "ROT/RUT Optimering", fixco: 89, competitor: 45, unit: "%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <SEOSchema
        type="homepage"
        title="AI Assistent - Fixco"
        description="Sveriges mest avancerade AI-assistent för hem och renovering. Få personliga rekommendationer, kostnadsanalyser och projektoptimering."
      />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Powered by Advanced AI
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              AI Assistent
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Sveriges mest avancerade AI-assistent för hem och renovering. 
              Få personliga rekommendationer, exakta kostnadsanalyser och optimal projektplanering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" onClick={() => setActiveModal('projectAssistant')}>
                <Brain className="h-5 w-5 mr-2" />
                Starta AI Analys
              </Button>
              <Button size="lg" variant="outline" onClick={() => setActiveModal('visualization')}>
                <Eye className="h-5 w-5 mr-2" />
                Se Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-background to-secondary/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-2">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.growth}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Tabs */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Funktioner</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upptäck alla våra AI-funktioner som revolutionerar hur du renoverar och förbättrar ditt hem
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="analys" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analys
              </TabsTrigger>
              <TabsTrigger value="visualisering" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visualisering
              </TabsTrigger>
              <TabsTrigger value="optimering" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Optimering
              </TabsTrigger>
              <TabsTrigger value="prediktioner" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Prediktioner
              </TabsTrigger>
            </TabsList>

            {Object.entries(aiFeatures).map(([category, features]) => (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 overflow-hidden group">
                        <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                              <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                              <CardDescription className="text-base">
                                {feature.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                              {feature.features.map((feat) => (
                                <div key={feat} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                  {feature.savings || feature.accuracy || feature.growth || feature.demos || feature.quality || feature.combinations || feature.matches || feature.efficiency || feature.increase || feature.optimization || feature.predictions || "99%"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {feature.savings ? "Besparing" : 
                                   feature.accuracy ? "Träffsäkerhet" :
                                   feature.growth ? "Tillväxt" :
                                   feature.demos ? "Demos skapade" :
                                   feature.quality ? "Kvalitet" :
                                   feature.combinations ? "Kombinationer" :
                                   feature.matches ? "Matchning" :
                                   feature.efficiency ? "Effektivitet" :
                                   feature.increase ? "Värdeökning" :
                                   feature.optimization ? "Optimering" :
                                   feature.predictions ? "Prognos" : "Prestanda"}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="group-hover:bg-primary/10"
                                onClick={() => setActiveModal((feature as any).modal)}
                              >
                                Testa nu
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Competitor Analysis */}
      <section className="py-20 bg-gradient-to-r from-secondary/10 to-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Fixco AI vs Konkurrenter</h2>
            <p className="text-xl text-muted-foreground">
              Se varför våra AI-lösningar är branschledande
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {competitorAnalysis.map((item, index) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{item.metric}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Fixco</span>
                        <span>Konkurrent</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-right font-semibold text-primary">
                          {item.fixco}{item.unit}
                        </div>
                        <div className="flex-1">
                          <Progress value={item.fixco} className="h-3" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-right font-semibold text-muted-foreground">
                          {item.competitor}{item.unit}
                        </div>
                        <div className="flex-1">
                          <Progress value={item.competitor} className="h-3 opacity-50" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-right">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        +{item.fixco - item.competitor}{item.unit} bättre
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Redo att uppleva AI-revolutionen?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Låt våra AI-algoritmer skapa den perfekta renoveringsplanen för ditt hem. 
              Få exakta kostnader, optimala tidsplaner och maximala ROT/RUT-avdrag.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" onClick={() => setActiveModal('homeAnalysis')}>
                <Cpu className="h-5 w-5 mr-2" />
                Starta AI-Analys Nu
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/boka-hembesok')}>
                <MessageSquare className="h-5 w-5 mr-2" />
                Boka Konsultation
              </Button>
            </div>

            <div className="mt-8 flex justify-center gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Gratis AI-analys
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ingen bindningstid
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Garanterad kvalitet
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Function Modals */}
      <AIFunctionModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onRequestQuote={handleQuoteRequest}
      />
    </div>
  );
}