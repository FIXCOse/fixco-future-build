import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { useCopy } from '@/copy/CopyProvider';

interface ActionCardsProps {
  selectedAction: string;
  onSelectAction: (action: string) => void;
  customInstruction: string;
  onCustomInstructionChange: (value: string) => void;
  onVisualize: () => void;
  isProcessing: boolean;
}

const actions = [
  { id: 'acoustic', icon: '🔊' },
  { id: 'deck', icon: '🏡' },
  { id: 'floor', icon: '🪵' },
  { id: 'bookshelf', icon: '📚' },
  { id: 'wardrobe', icon: '👔' },
  { id: 'led', icon: '💡' }
];

export function ActionCards({
  selectedAction,
  onSelectAction,
  customInstruction,
  onCustomInstructionChange,
  onVisualize,
  isProcessing
}: ActionCardsProps) {
  const { t } = useCopy();

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{t('ailab.action_cards_title')}</CardTitle>
        <CardDescription>Beskriv vad du vill se</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('ailab.custom_instruction')}</label>
          <Textarea
            value={customInstruction}
            onChange={(e) => onCustomInstructionChange(e.target.value)}
            placeholder={t('ailab.custom_placeholder')}
            rows={6}
            className="resize-none"
          />
        </div>

        <Button
          onClick={onVisualize}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {isProcessing ? t('ailab.visualizing') : t('ailab.visualize_btn')}
        </Button>
      </CardContent>
    </Card>
  );
}
