import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Lightbulb, 
  Calculator, 
  Leaf,
  Send,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { EcoScoreDisplay } from '@/components/EcoScoreDisplay';
import { toast } from 'sonner';

interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  rotSavings: number;
  ecoScore: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export const AIProjectAssistant = () => {
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [homeDetails, setHomeDetails] = useState({
    type: '',
    size: '',
    age: '',
    budget: ''
  });

  // Mock AI analysis function
  const analyzePriorities = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSuggestions: ProjectSuggestion[] = [
      {
        id: '1',
        title: 'Energieffektiva fönster',
        description: 'Byt till triple-glas fönster för bättre isolering och miljöpåverkan',
        estimatedCost: 85000,
        rotSavings: 29750,
        ecoScore: 92,
        priority: 'high',
        category: 'Energioptimering'
      },
      {
        id: '2', 
        title: 'Badrumrenovering',
        description: 'Modernisera med vattenbesparande armaturer och LED-belysning',
        estimatedCost: 120000,
        rotSavings: 42000,
        ecoScore: 78,
        priority: 'high',
        category: 'Renovering'
      },
      {
        id: '3',
        title: 'Smart hemautomation',
        description: 'Installera smarta termostater och belysningsstyrning',
        estimatedCost: 35000,
        rotSavings: 12250,
        ecoScore: 85,
        priority: 'medium',
        category: 'Teknik'
      },
      {
        id: '4',
        title: 'Takisolering',
        description: 'Förbättra takets isolering för minskad energiförbrukning',
        estimatedCost: 45000,
        rotSavings: 15750,
        ecoScore: 88,
        priority: 'medium',
        category: 'Isolering'
      }
    ];
    
    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
    toast.success('AI-analys slutförd! Här är dina personliga rekommendationer.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Hög prioritet';
      case 'medium': return 'Medium prioritet';
      case 'low': return 'Låg prioritet';
      default: return priority;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Projektassistent
        </h2>
        <p className="text-muted-foreground">
          Få personliga rekommendationer för att optimera ditt hem med ROT-avdrag och miljötänk.
        </p>
      </div>

      {/* Home Details Input */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Bostadstyp (Villa, lägenhet...)"
          value={homeDetails.type}
          onChange={(e) => setHomeDetails(prev => ({ ...prev, type: e.target.value }))}
        />
        <Input
          placeholder="Storlek (kvm)"
          value={homeDetails.size}
          onChange={(e) => setHomeDetails(prev => ({ ...prev, size: e.target.value }))}
        />
        <Input
          placeholder="Byggår"
          value={homeDetails.age}
          onChange={(e) => setHomeDetails(prev => ({ ...prev, age: e.target.value }))}
        />
        <Input
          placeholder="Budget (kr)"
          value={homeDetails.budget}
          onChange={(e) => setHomeDetails(prev => ({ ...prev, budget: e.target.value }))}
        />
      </div>

      {/* User Input */}
      <div className="mb-6">
        <Textarea
          placeholder="Beskriv dina behov och önskemål för hemförbättring... (t.ex. 'Vill spara energi och förbättra komforten i vardagsrummet')"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="min-h-20"
        />
        
        <Button 
          onClick={analyzePriorities} 
          disabled={isAnalyzing || !userInput.trim()}
          className="mt-3 w-full md:w-auto"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analyserar med AI...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Få AI-rekommendationer
            </>
          )}
        </Button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Dina personliga rekommendationer
          </h3>
          
          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      <Badge 
                        variant="outline"
                        className={`${getPriorityColor(suggestion.priority)} text-white border-0`}
                      >
                        {getPriorityText(suggestion.priority)}
                      </Badge>
                      <Badge variant="secondary">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                  <EcoScoreDisplay score={suggestion.ecoScore} />
                </div>
                
                <h4 className="font-semibold mb-2">{suggestion.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  {suggestion.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {suggestion.estimatedCost.toLocaleString()} kr
                    </div>
                    <div className="text-xs text-muted-foreground">Uppskattat pris</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      -{suggestion.rotSavings.toLocaleString()} kr
                    </div>
                    <div className="text-xs text-muted-foreground">ROT-besparing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round((suggestion.rotSavings / suggestion.estimatedCost) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">ROI med ROT</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Få detaljerad kalkyl
                  </Button>
                  <Button variant="cta-primary" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Begär offert
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <Card className="p-4 bg-primary/5">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sammanfattning av rekommendationer
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total investering:</span>
                <div className="font-bold">
                  {suggestions.reduce((sum, s) => sum + s.estimatedCost, 0).toLocaleString()} kr
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total ROT-besparing:</span>
                <div className="font-bold text-green-600">
                  -{suggestions.reduce((sum, s) => sum + s.rotSavings, 0).toLocaleString()} kr
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Genomsnittlig Eco Score:</span>
                <div className="font-bold text-blue-600">
                  {Math.round(suggestions.reduce((sum, s) => sum + s.ecoScore, 0) / suggestions.length)}/100
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};