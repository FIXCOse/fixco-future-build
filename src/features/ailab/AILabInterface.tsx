import { useState, useCallback } from 'react';
import { useCopy } from '@/copy/CopyProvider';
import { ImageUploadZone } from './ImageUploadZone';
import { ActionCards } from './ActionCards';
import { BeforeAfterView } from './BeforeAfterView';
import { QualificationForm, QualificationData } from './QualificationForm';
import { useToast } from '@/hooks/use-toast';
import { aiEditImage } from '../ai/lib/ai';
import { supabase } from '@/integrations/supabase/client';

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
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleImageUpload = useCallback((file: File, preview: string) => {
    setOriginalFile(file);
    setOriginalImage(preview);
    setGeneratedImage('');
    setVariants([]);
    setShowDisclaimer(false);
  }, []);

  const handleVisualize = useCallback(async () => {
    if (!originalFile) {
      toast({
        title: t('ailab.error_missing_image'),
        variant: 'destructive'
      });
      return;
    }

    if (!customInstruction.trim()) {
      toast({
        title: 'Saknar instruktion',
        description: 'Skriv en instruktion för vad du vill se',
        variant: 'destructive'
      });
      return;
    }

    // Show disclaimer before generating
    setShowDisclaimer(true);

    setIsProcessing(true);
    try {
      const instruction = customInstruction.trim();
      
      toast({
        title: '⚠️ Observera',
        description: 'Genererade bilder är endast illustrativa koncept. Slutresultatet beror på platsens förutsättningar.',
        duration: 5000
      });

      const resultUrl = await aiEditImage(originalFile, instruction);
      setGeneratedImage(resultUrl);
      
      // Generate 2 additional variants with slight variations
      const variant1 = await aiEditImage(originalFile, instruction + ' - variant med ljusare toner');
      const variant2 = await aiEditImage(originalFile, instruction + ' - variant med mörkare toner');
      setVariants([resultUrl, variant1, variant2]);

      toast({
        title: 'Inspiration-bilder skapade!',
        description: 'Välj mellan olika stilar. Begär offert för exakt pris.'
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
  }, [originalFile, customInstruction, t, toast]);

  const handleQualificationSubmit = useCallback(async (data: QualificationData) => {
    setIsSubmittingLead(true);
    
    try {
      // Calculate lead score
      let leadScore = 0;
      if (data.size) leadScore += 20;
      if (data.timeline) leadScore += 20;
      if (data.budget) leadScore += 20;
      if (data.phone) leadScore += 20;
      if (data.address) leadScore += 20;
      
      const leadPriority = leadScore >= 80 ? 'high' : leadScore >= 50 ? 'medium' : 'low';
      
      const qualificationData = {
        serviceCategory: data.serviceCategory,
        projectScope: data.projectScope,
        size: data.size,
        timeline: data.timeline,
        budget: data.budget,
        additionalDetails: data.additionalDetails,
        leadScore,
        leadPriority,
        generatedImages: [originalImage, generatedImage, ...variants].filter(Boolean)
      };

      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          service_interest: data.serviceCategory || selectedAction || 'AI Generated',
          message: JSON.stringify(qualificationData),
          status: 'new',
          source: 'ai_lab_qualification',
          images: [originalImage, generatedImage, ...variants].filter(Boolean)
        });

      if (error) throw error;

      toast({
        title: '✅ Tack för din förfrågan!',
        description: 'Vi återkommer inom 48h med en offert efter platsbesiktning.',
        duration: 5000
      });

      // Reset form data
      setOriginalImage('');
      setOriginalFile(null);
      setGeneratedImage('');
      setVariants([]);
      setCustomInstruction('');
      
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        title: 'Kunde inte skicka förfrågan',
        description: 'Försök igen eller kontakta oss direkt',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingLead(false);
    }
  }, [originalImage, generatedImage, variants, selectedAction, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Upload & Actions */}
      <div className="lg:col-span-3 space-y-6">
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

      {/* Middle: Before/After View - LARGER */}
      <div className="lg:col-span-6">
        <BeforeAfterView
          beforeImage={originalImage}
          afterImage={generatedImage}
          variants={variants}
          onSelectVariant={(url) => setGeneratedImage(url)}
        />
      </div>

      {/* Right: Qualification Form */}
      <div className="lg:col-span-3">
        <QualificationForm
          serviceCategory={selectedAction}
          onSubmit={handleQualificationSubmit}
          isSubmitting={isSubmittingLead}
        />
      </div>
    </div>
  );
}

