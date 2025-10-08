import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download } from "lucide-react";
import { aiEditImage } from "./lib/ai";
import { useToast } from "@/hooks/use-toast";
import { useCopy } from "@/copy/CopyProvider";

export function ImageEditor() {
  const { t } = useCopy();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [instruction, setInstruction] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 15 * 1024 * 1024) {
        toast({
          title: t('ai.image_file_too_large'),
          description: t('ai.image_max_size'),
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!file || !instruction.trim()) {
      toast({
        title: t('ai.image_missing_info'),
        description: t('ai.image_missing_desc'),
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const url = await aiEditImage(file, instruction);
      setResultUrl(url);
      toast({
        title: t('ai.image_complete'),
        description: t('ai.image_complete_desc')
      });
    } catch (error) {
      console.error("Image edit error:", error);
      const errorMessage = error instanceof Error ? error.message : t('ai.quote_pdf_error_desc');
      toast({
        title: t('ai.image_error'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          {t('ai.image_title')}
        </CardTitle>
        <CardDescription>
          {t('ai.image_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="image-upload" className="block text-sm font-medium">
            {t('ai.image_upload')} ({t('ai.image_max_size')})
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {file ? file.name : t('ai.image_choose')}
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {preview && (
          <div className="rounded-lg overflow-hidden border">
            <img src={preview} alt={t('ai.image_upload')} className="w-full h-48 object-cover" />
          </div>
        )}

        <Textarea
          placeholder={t('ai.image_instruction_placeholder')}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={3}
          className="resize-none"
        />

        <Button 
          onClick={handleProcess}
          disabled={!file || !instruction.trim() || isProcessing}
          className="w-full"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {isProcessing ? t('ai.image_generating') : t('ai.image_generate')}
        </Button>

        {resultUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('ai.image_result')}</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('ai.image_before')}</p>
                <img src={preview} alt={t('ai.image_before')} className="w-full rounded-lg border" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('ai.image_after')}</p>
                <img src={resultUrl} alt={t('ai.image_after')} className="w-full rounded-lg border" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={resultUrl} download="fixco-visualisering.png">
                <Download className="h-4 w-4 mr-2" />
                {t('ai.image_download')}
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              {t('ai.image_disclaimer')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

