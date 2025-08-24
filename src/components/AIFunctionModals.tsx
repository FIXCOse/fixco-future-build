import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home,
  Calculator,
  Camera,
  Eye,
  Palette,
  PiggyBank,
  Clock,
  Building,
  Gauge,
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Zap,
  Download,
  Share,
  BookOpen
} from "lucide-react";
import { AIProjectAssistant } from "@/components/AIProjectAssistant";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Project3DVisualizer } from "@/components/Project3DVisualizer";
import ROTCalculator from "@/components/ROTCalculator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AIFunctionModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onRequestQuote: (data: any) => void;
}

export function AIFunctionModals({ activeModal, onClose, onRequestQuote }: AIFunctionModalsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const navigate = useNavigate();

  const handleAnalysis = async (type: string, formData: any) => {
    setIsLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = {
      homeAnalysis: {
        efficiency: 85,
        security: 92,
        comfort: 78,
        valueIncrease: 15,
        recommendations: [
          "Byt till energieffektiva fönster",
          "Installera smart ventilation", 
          "Uppgradera isolering",
          "Lägg till solpaneler"
        ],
        potentialSavings: 45000,
        roiPeriod: "3-5 år"
      },
      costPrediction: {
        accuracy: 97.2,
        currentPrice: formData.estimatedBudget || 50000,
        priceRange: { min: 45000, max: 65000 },
        seasonalVariation: "+12% vinter, -8% sommar",
        regionalAdjustment: "+5% för Stockholm",
        materialCosts: 35000,
        laborCosts: 25000
      },
      visualization: {
        beforeImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        afterImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
        renderingTime: "2.3 sekunder",
        accuracy: "98.5%"
      }
    };
    
    setAnalysisData(mockResults);
    setIsLoading(false);
    toast.success("AI-analys slutförd!");
  };

  const handleRequestQuote = (projectData: any) => {
    const quoteData = {
      service_name: projectData.title || "AI-genererat projekt",
      description: projectData.description || "Projekt baserat på AI-analys",
      estimated_cost: projectData.cost || 50000,
      ai_generated: true,
      ...projectData
    };
    
    onRequestQuote(quoteData);
    navigate('/offert/ai-projekt');
    onClose();
  };

  const renderSmartHomeAnalysis = () => (
    <Dialog open={activeModal === 'homeAnalysis'} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Smart Hem Analys
          </DialogTitle>
          <DialogDescription>
            AI analyserar ditt hem och föreslår optimala förbättringar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!analysisData ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="homeType">Bostadstyp</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj bostadstyp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="apartment">Lägenhet</SelectItem>
                      <SelectItem value="townhouse">Radhus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="homeSize">Storlek (kvm)</Label>
                  <Input type="number" placeholder="120" />
                </div>
                
                <div>
                  <Label htmlFor="buildYear">Byggår</Label>
                  <Input type="number" placeholder="1985" />
                </div>
                
                <div>
                  <Label htmlFor="budget">Budget (kr)</Label>
                  <Input type="number" placeholder="100000" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="priorities">Prioriteringar</Label>
                  <Textarea placeholder="Beskriv vad som är viktigast för dig: energibesparing, komfort, säkerhet, värdeökning..." />
                </div>
                
                <div>
                  <Label htmlFor="currentIssues">Nuvarande problem</Label>
                  <Textarea placeholder="Finns det några specifika problem du vill lösa? (drag, fukt, ljud, etc.)" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{analysisData.homeAnalysis.efficiency}%</div>
                      <div className="text-sm text-muted-foreground">Energieffektivitet</div>
                      <Progress value={analysisData.homeAnalysis.efficiency} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{analysisData.homeAnalysis.security}%</div>
                      <div className="text-sm text-muted-foreground">Säkerhet</div>
                      <Progress value={analysisData.homeAnalysis.security} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{analysisData.homeAnalysis.comfort}%</div>
                      <div className="text-sm text-muted-foreground">Komfort</div>
                      <Progress value={analysisData.homeAnalysis.comfort} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">+{analysisData.homeAnalysis.valueIncrease}%</div>
                      <div className="text-sm text-muted-foreground">Värdeökning</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">AI Rekommendationer</h3>
                  <div className="space-y-3">
                    {analysisData.homeAnalysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{rec}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRequestQuote({ 
                            title: rec, 
                            description: "AI-rekommenderad förbättring",
                            cost: 25000 + (index * 15000)
                          })}
                        >
                          Begär offert
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex gap-3">
            {!analysisData && (
              <Button 
                onClick={() => handleAnalysis('homeAnalysis', {})} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analyserar...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Starta AI Analys
                  </>
                )}
              </Button>
            )}
            
            {analysisData && (
              <Button 
                onClick={() => handleRequestQuote({ 
                  title: "Komplett hemförbättring", 
                  description: "Baserat på AI-analys",
                  cost: analysisData.homeAnalysis.potentialSavings
                })}
                className="flex-1"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Begär offert för alla förbättringar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderCostPrediction = () => (
    <Dialog open={activeModal === 'costPrediction'} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Kostnadsprediktering
          </DialogTitle>
          <DialogDescription>
            Realtidsanalys av materialpriser och arbetskostnader
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="embedded-component">
            <ROTCalculator />
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => navigate('/offert/kostnadskalkyl')} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Begär detaljerad offert
            </Button>
            <Button variant="outline" onClick={() => navigate('/rot-info')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Läs mer om ROT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderVisualization = () => (
    <Dialog open={activeModal === 'visualization'} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            3D Projektvisualiserare
          </DialogTitle>
          <DialogDescription>
            Se ditt projekt i realtid innan bygget börjar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Project3DVisualizer projectType="bathroom" />
            <BeforeAfterSlider projectType="bathroom" />
          </div>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Välj projekttyp för visualisering</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['bathroom', 'kitchen', 'livingroom', 'exterior'].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => toast.success(`Laddar ${type} visualisering...`)}
                  className="capitalize"
                >
                  {type === 'bathroom' ? 'Badrum' : 
                   type === 'kitchen' ? 'Kök' :
                   type === 'livingroom' ? 'Vardagsrum' : 'Fasad'}
                </Button>
              ))}
            </div>
          </Card>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => handleRequestQuote({ 
                title: "3D-visualiserat projekt", 
                description: "Projekt med 3D-förhandsvisning",
                cost: 75000
              })}
              className="flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Begär offert för detta projekt
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Ladda ner bilder
            </Button>
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Dela
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderProjectAssistant = () => (
    <Dialog open={activeModal === 'projectAssistant'} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Projektassistent
          </DialogTitle>
          <DialogDescription>
            Få personliga rekommendationer för ditt hem
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <AIProjectAssistant />
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {renderSmartHomeAnalysis()}
      {renderCostPrediction()}
      {renderVisualization()}
      {renderProjectAssistant()}
    </>
  );
}