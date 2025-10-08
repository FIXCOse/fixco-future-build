import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopy } from '@/copy/CopyProvider';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadZoneProps {
  onImageUpload: (file: File, preview: string) => void;
}

export function ImageUploadZone({ onImageUpload }: ImageUploadZoneProps) {
  const { t } = useCopy();
  const { toast } = useToast();

  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: t('ailab.error_file_type'),
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: t('ailab.error_file_size'),
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageUpload(file, preview);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, t, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{t('ailab.upload_title')}</CardTitle>
        <CardDescription>{t('ailab.upload_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-foreground">
              <span className="font-semibold">{t('ailab.drag_drop')}</span>
            </p>
            <p className="text-xs text-muted-foreground">{t('ailab.or_click')}</p>
            <p className="text-xs text-muted-foreground mt-2">JPEG, PNG, WEBP (max 15 MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
          />
        </label>
      </CardContent>
    </Card>
  );
}
