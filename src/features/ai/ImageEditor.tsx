import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download } from "lucide-react";
import { aiEditImage } from "./lib/ai";
import { useToast } from "@/hooks/use-toast";

export function ImageEditor() {
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
          title: "Filen är för stor",
          description: "Max 15 MB tillåtet",
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
        title: "Saknas information",
        description: "Ladda upp en bild och beskriv önskad förändring",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const url = await aiEditImage(file, instruction);
      setResultUrl(url);
      toast({
        title: "Visualisering klar!",
        description: "Din efter-bild har genererats"
      });
    } catch (error) {
      console.error("Image edit error:", error);
      const errorMessage = error instanceof Error ? error.message : "Försök igen eller kontakta support";
      toast({
        title: "Fel vid bildbearbetning",
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
          Bild & Förslag
        </CardTitle>
        <CardDescription>
          Ladda upp en bild av ditt rum eller utrymme och beskriv vad du vill se
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="image-upload" className="block text-sm font-medium">
            Välj bild (max 15 MB)
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {file ? file.name : "Välj bild"}
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
            <img src={preview} alt="Uppladdad bild" className="w-full h-48 object-cover" />
          </div>
        )}

        <Textarea
          placeholder='Ex: "Lägg akustikpanel i mörk ek på väggen bakom TV:n, vertikala ribbor"'
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
          {isProcessing ? "Genererar..." : "Generera efter-bild"}
        </Button>

        {resultUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Resultat:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Före</p>
                <img src={preview} alt="Före" className="w-full rounded-lg border" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Efter</p>
                <img src={resultUrl} alt="Efter" className="w-full rounded-lg border" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={resultUrl} download="fixco-visualisering.png">
                <Download className="h-4 w-4 mr-2" />
                Ladda ner
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              OBS: Visualisering är indikativ - färg och struktur kan avvika från verkligt material.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
