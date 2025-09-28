import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sparkles, RefreshCw } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  projectType?: string;
  className?: string;
}

const generateAIImage = async (projectType: string, isAfter: boolean) => {
  // Simulate AI image generation with placeholder images
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const imagePrompts = {
    bathroom: {
      before: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
      after: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop'
    },
    kitchen: {
      before: 'https://images.unsplash.com/photo-1556185781-a47769abb7aa?w=400&h=300&fit=crop',
      after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
    },
    exterior: {
      before: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      after: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
    }
  };
  
  const images = imagePrompts[projectType as keyof typeof imagePrompts] || imagePrompts.bathroom;
  return isAfter ? images.after : images.before;
};

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage, 
  projectType = 'bathroom',
  className = ""
}) => {
  const [sliderValue, setSliderValue] = useState([50]);
  const [generatedBefore, setGeneratedBefore] = useState<string | null>(null);
  const [generatedAfter, setGeneratedAfter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const beforeSrc = beforeImage || generatedBefore;
  const afterSrc = afterImage || generatedAfter;

  const generateImages = async () => {
    setIsGenerating(true);
    try {
      const [before, after] = await Promise.all([
        generateAIImage(projectType, false),
        generateAIImage(projectType, true)
      ]);
      setGeneratedBefore(before);
      setGeneratedAfter(after);
    } catch (error) {
      console.error('Failed to generate images:', error);
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    if (!beforeImage && !afterImage) {
      generateImages();
    }
  }, [projectType]);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Före & Efter
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={generateImages}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
            Generera nya
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          AI-genererade resultat visar hur ditt projekt kan se ut efter renovering.
        </p>
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Genererar AI-bilder...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Before Image */}
            {beforeSrc && (
              <img
                src={beforeSrc}
                alt="Före renovering"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: `polygon(0 0, ${sliderValue[0]}% 0, ${sliderValue[0]}% 100%, 0 100%)`
                }}
              />
            )}
            
            {/* After Image */}
            {afterSrc && (
              <img
                src={afterSrc}
                alt="Efter renovering"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: `polygon(${sliderValue[0]}% 0, 100% 0, 100% 100%, ${sliderValue[0]}% 100%)`
                }}
              />
            )}
            
            {/* Slider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-foreground shadow-lg z-10"
              style={{ left: `${sliderValue[0]}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-card border border-border rounded-full shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm text-foreground px-3 py-1 rounded text-sm">
              Före
            </div>
            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm text-foreground px-3 py-1 rounded text-sm">
              Efter
            </div>
          </>
        )}
      </div>
      
      {/* Slider Control */}
      <div className="mt-4">
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
          className="w-full"
          disabled={isGenerating}
        />
      </div>
      
      {/* AI Info */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 inline mr-1" />
          Bilderna är AI-genererade för att visa möjliga resultat. Faktiska resultat kan variera.
        </p>
      </div>
    </Card>
  );
};