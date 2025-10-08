import { useState, useCallback } from 'react';
import { useCopy } from '@/copy/CopyProvider';
import { ImageUploadZone } from './ImageUploadZone';
import { ActionCards } from './ActionCards';
import { BeforeAfterView } from './BeforeAfterView';
import { EstimatePanel } from './EstimatePanel';
import { useToast } from '@/hooks/use-toast';
import { aiEditImage, createLead } from '@/features/ai/lib/ai';
import { estimateQuote, EstimateResult } from '@/features/ai/tools/estimateQuote';

export function AILabInterface() {
  const { t } = useCopy();
  const { toast } = useToast();
  
  const [originalImage, setOriginalImage] = useState<string>('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [customInstruction, setCustomInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleImageUpload = useCallback((file: File, preview: string) => {
    setOriginalFile(file);
    setOriginalImage(preview);
    setGeneratedImage('');
    setVariants([]);
    setEstimate(null);
  }, []);

  const handleVisualize = useCallback(async () => {
    if (!originalFile) {
      toast({
        title: t('ailab.error_missing_image'),
        variant: 'destructive'
      });
      return;
    }

    if (!selectedAction && !customInstruction.trim()) {
      toast({
        title: t('ailab.error_missing_image'),
        description: 'Välj en åtgärd eller skriv en instruktion',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const instruction = customInstruction.trim() || getActionInstruction(selectedAction);
      const resultUrl = await aiEditImage(originalFile, instruction);
      setGeneratedImage(resultUrl);
      
      // Generate 2 additional variants with slight variations
      const variant1 = await aiEditImage(originalFile, instruction + ' - variant med ljusare toner');
      const variant2 = await aiEditImage(originalFile, instruction + ' - variant med mörkare toner');
      setVariants([resultUrl, variant1, variant2]);

      // Generate estimate based on selected action
      const estimateData = generateEstimate(selectedAction, instruction);
      setEstimate(estimateData);

      toast({
        title: 'Visualisering skapad!',
        description: 'Välj mellan olika stilar nedan'
      });
    } catch (error) {
      console.error('Visualization error:', error);
      toast({
        title: t('ailab.error_visualization'),
        description: error instanceof Error ? error.message : 'Försök igen',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, selectedAction, customInstruction, t, toast]);

  const handleSaveLead = useCallback(async () => {
    if (!contactInfo.email || !contactInfo.name) {
      toast({
        title: t('ailab.error_missing_contact'),
        variant: 'destructive'
      });
      return;
    }

    try {
      await createLead({
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        serviceInterest: selectedAction || 'Custom',
        message: customInstruction,
        estimatedQuote: estimate,
        images: [originalImage, generatedImage, ...variants].filter(Boolean)
      });

      toast({
        title: t('ailab.lead_saved'),
        description: 'Vi kontaktar dig inom 24 timmar'
      });
    } catch (error) {
      console.error('Lead save error:', error);
      toast({
        title: 'Kunde inte spara projekt',
        description: 'Försök igen',
        variant: 'destructive'
      });
    }
  }, [contactInfo, selectedAction, customInstruction, estimate, originalImage, generatedImage, variants, t, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Upload & Actions */}
      <div className="lg:col-span-4 space-y-6">
        <ImageUploadZone onImageUpload={handleImageUpload} />
        <ActionCards
          selectedAction={selectedAction}
          onSelectAction={setSelectedAction}
          customInstruction={customInstruction}
          onCustomInstructionChange={setCustomInstruction}
          onVisualize={handleVisualize}
          isProcessing={isProcessing}
        />
      </div>

      {/* Middle: Before/After View */}
      <div className="lg:col-span-5">
        <BeforeAfterView
          beforeImage={originalImage}
          afterImage={generatedImage}
          variants={variants}
          onSelectVariant={(url) => setGeneratedImage(url)}
        />
      </div>

      {/* Right: Estimate & Contact */}
      <div className="lg:col-span-3">
        <EstimatePanel
          estimate={estimate}
          contactInfo={contactInfo}
          onContactInfoChange={setContactInfo}
          onSaveLead={handleSaveLead}
          generatedImage={generatedImage}
        />
      </div>
    </div>
  );
}

function getActionInstruction(action: string): string {
  const instructions: Record<string, string> = {
    acoustic: 'Installera moderna akustikpaneler på väggen med skandinavisk design',
    deck: 'Bygg en snygg altan i trä med räcke och trappor',
    floor: 'Byt till moderna trägolv i ljus ek',
    bookshelf: 'Lägg till en platsbyggd bokhylla som täcker hela väggen',
    wardrobe: 'Installera moderna garderober med skjutdörrar',
    led: 'Lägg till diskret LED-belysning som lyfter rummet'
  };
  return instructions[action] || action;
}

function generateEstimate(action: string, instruction: string): EstimateResult {
  // Simplified estimates per action type
  const estimates: Record<string, { hours: number; material: number }> = {
    acoustic: { hours: 8, material: 5000 },
    deck: { hours: 40, material: 25000 },
    floor: { hours: 16, material: 15000 },
    bookshelf: { hours: 20, material: 8000 },
    wardrobe: { hours: 12, material: 12000 },
    led: { hours: 6, material: 3000 }
  };

  const data = estimates[action] || { hours: 10, material: 5000 };

  return estimateQuote({
    serviceName: instruction.substring(0, 50),
    quantity: data.hours,
    unit: 'timme',
    materialSek: data.material,
    hourlySek: 950,
    rotEligible: true
  }, 950);
}
