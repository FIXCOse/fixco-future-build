import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopy } from '@/copy/CopyProvider';
import { Loader2 } from 'lucide-react';

interface BeforeAfterViewProps {
  beforeImage: string;
  afterImage: string;
  variants: string[];
  onSelectVariant: (url: string) => void;
}

export function BeforeAfterView({
  beforeImage,
  afterImage,
  variants,
  onSelectVariant
}: BeforeAfterViewProps) {
  const { t } = useCopy();

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{beforeImage ? t('ailab.before_title') : 'Väntar på bild'}</CardTitle>
        </CardHeader>
        <CardContent>
          {beforeImage ? (
            <img
              src={beforeImage}
              alt={t('ailab.before_title')}
              className="w-full h-64 object-cover rounded-lg border border-border"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border border-border">
              <p className="text-muted-foreground">Ladda upp en bild för att börja</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{t('ailab.after_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {afterImage ? (
            <img
              src={afterImage}
              alt={t('ailab.after_title')}
              className="w-full h-64 object-cover rounded-lg border border-border"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border border-border">
              {beforeImage ? (
                <p className="text-muted-foreground">Välj en åtgärd och klicka på Visualisera</p>
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {variants.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t('ailab.variants_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {variants.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectVariant(url)}
                  className={`
                    rounded-lg overflow-hidden border-2 transition-all
                    ${afterImage === url ? 'border-primary' : 'border-border hover:border-primary/50'}
                  `}
                >
                  <img
                    src={url}
                    alt={`Variant ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
