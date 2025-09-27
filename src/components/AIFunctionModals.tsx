import { useState, useCallback } from "react";
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
  BookOpen,
  Brain,
  Target,
  Lightbulb,
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";
import { AIProjectAssistant } from "@/components/AIProjectAssistant";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Project3DVisualizer } from "@/components/Project3DVisualizer";
import ROTCalculator from "@/components/ROTCalculator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AIFunctionModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onRequestQuote: (data: any) => void;
}

export function AIFunctionModals({ activeModal, onClose, onRequestQuote }: AIFunctionModalsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const navigate = useNavigate();

  const callAIAnalysis = useCallback(async (type: string, input: any) => {
    setIsLoading(true);
    
    try {
      console.log('Calling AI analysis with:', { type, input });
      
      const { data: userData } = await supabase.auth.getUser();
      
      const response = await supabase.functions.invoke('ai-smart-analysis', {
        body: {
          type,
          userInput: input,
          sessionId,
          userId: userData.user?.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'AI analysis failed');
      }

      console.log('AI analysis response:', response.data);
      
      if (response.data?.success) {
        setAnalysisData(response.data.data);
        toast.success(`AI-analys slutförd! Träffsäkerhet: ${response.data.data.confidence}%`);
      } else {
        throw new Error('AI analysis returned no data');
      }
      
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error(`AI-analys misslyckades: ${error.message}`);
      
      // Show fallback data
      setAnalysisData({
        analysis: { message: "Kunde inte ansluta till AI-tjänsten. Visar grundläggande analys." },
        recommendations: [
          { title: "Grundläggande renovering", description: "Baserat på vanliga svenska standarder", estimatedCost: 100000 },
          { title: "Energieffektivisering", description: "Förbättra isolering och ventilation", estimatedCost: 75000 }
        ],
        insights: ["Kontakta oss för en detaljerad analys"],
        confidence: 50,
        nextSteps: ["Boka konsultation", "Begär offert"]
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAnalysis = async (type: string) => {
    if (Object.keys(formData).length === 0) {
      toast.error("Vänligen fyll i minst ett fält innan du startar analysen");
      return;
    }
    
    await callAIAnalysis(type, formData);
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
                  <Select onValueChange={(value) => handleInputChange('homeType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj bostadstyp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="lägenhet">Lägenhet</SelectItem>
                      <SelectItem value="radhus">Radhus</SelectItem>
                      <SelectItem value="bostadsrätt">Bostadsrätt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="homeSize">Storlek (kvm)</Label>
                  <Input 
                    type="number" 
                    placeholder="120" 
                    onChange={(e) => handleInputChange('homeSize', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="buildYear">Byggår</Label>
                  <Input 
                    type="number" 
                    placeholder="1985" 
                    onChange={(e) => handleInputChange('buildYear', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget">Budget (kr)</Label>
                  <Input 
                    type="number" 
                    placeholder="100000" 
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="priorities">Prioriteringar</Label>
                  <Textarea 
                    placeholder="Beskriv vad som är viktigast för dig: energibesparing, komfort, säkerhet, värdeökning..." 
                    onChange={(e) => handleInputChange('priorities', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentIssues">Nuvarande problem</Label>
                  <Textarea 
                    placeholder="Finns det några specifika problem du vill lösa? (drag, fukt, ljud, etc.)" 
                    onChange={(e) => handleInputChange('currentIssues', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Ytterligare önskemål</Label>
                  <Textarea 
                    placeholder="Berätta mer om dina specifika önskemål och mål..." 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Analysis Results */}
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">AI-Analys Resultat</h3>
                    <Badge variant="secondary">
                      Träffsäkerhet: {analysisData.confidence}%
                    </Badge>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground mb-4">
                      {analysisData.analysis?.message || JSON.stringify(analysisData.analysis)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Personliga Rekommendationer
                    </h3>
                    <div className="space-y-3">
                      {analysisData.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{rec.title}</h4>
                            {rec.estimatedCost && (
                              <Badge variant="outline">
                                {rec.estimatedCost.toLocaleString()} kr
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestQuote({ 
                              title: rec.title, 
                              description: rec.description,
                              cost: rec.estimatedCost
                            })}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Begär offert
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Insights */}
              {analysisData.insights && analysisData.insights.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">AI Insikter</h3>
                    <ul className="space-y-2">
                      {analysisData.insights.map((insight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              {analysisData.nextSteps && analysisData.nextSteps.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Nästa Steg</h3>
                    <div className="space-y-2">
                      {analysisData.nextSteps.map((step: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {index + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          <div className="flex gap-3">
            {!analysisData && (
              <Button 
                onClick={() => handleAnalysis('home_analysis')} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI analyserar...
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
                onClick={() => {
                  setAnalysisData(null);
                  setFormData({});
                }}
                variant="outline"
                className="flex-1"
              >
                Ny Analys
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
            <Button variant="outline" onClick={() => {
              const isEnglish = window.location.pathname.startsWith('/en');
              navigate(isEnglish ? '/en/rot' : '/rot');
            }}>
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