import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCreateReferenceProject } from '@/hooks/useReferenceProjects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, Save, RefreshCw, ImagePlus, X, Image } from 'lucide-react';

const CATEGORIES = [
  { value: 'bathroom', label: 'Badrum', sv: 'Badrumsrenovering', en: 'Bathroom Renovation' },
  { value: 'kitchen', label: 'Kök', sv: 'Köksrenovering', en: 'Kitchen Renovation' },
  { value: 'facade', label: 'Fasad', sv: 'Fasadrenovering', en: 'Facade Renovation' },
  { value: 'wardrobe', label: 'Garderob', sv: 'Garderobsinstallation', en: 'Wardrobe Installation' },
  { value: 'flooring', label: 'Golv', sv: 'Golvläggning', en: 'Flooring' },
  { value: 'painting', label: 'Målning', sv: 'Målning', en: 'Painting' },
];

interface GeneratedImage {
  url: string;
  style: 'before' | 'after';
  label: string;
  category: string;
}

const AdminAiImageGenerator = () => {
  const [category, setCategory] = useState('bathroom');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectLocation, setProjectLocation] = useState('Stockholm');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const createProject = useCreateReferenceProject();
  const { toast } = useToast();

  const beforeImages = generatedImages.filter(i => i.style === 'before');
  const afterImages = generatedImages.filter(i => i.style === 'after');

  const generateImage = async (style: 'before' | 'after', sourceImageUrl?: string) => {
    setIsGenerating(true);
    setGeneratingLabel(`Genererar ${style === 'before' ? 'före' : 'efter'}-bild...`);

    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-image', {
        body: { category, style, sourceImageUrl }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const count = generatedImages.filter(i => i.style === style).length + 1;
      const newImage: GeneratedImage = {
        url: data.url,
        style,
        label: `${style === 'before' ? 'Före' : 'Efter'} #${count}`,
        category,
      };

      setGeneratedImages(prev => [...prev, newImage]);
      toast({ title: `${newImage.label} genererad!` });
      return data.url;
    } catch (err: any) {
      console.error('Generation error:', err);
      toast({ title: 'Fel vid bildgenerering', description: err?.message || 'Försök igen.', variant: 'destructive' });
      return null;
    } finally {
      setIsGenerating(false);
      setGeneratingLabel('');
    }
  };

  const generatePair = async () => {
    const beforeUrl = await generateImage('before');
    if (beforeUrl) {
      await generateImage('after', beforeUrl);
    }
  };

  const removeImage = (index: number) => {
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateMoreAfter = async () => {
    const lastBefore = beforeImages[beforeImages.length - 1];
    if (!lastBefore) {
      toast({ title: 'Generera en före-bild först', variant: 'destructive' });
      return;
    }
    await generateImage('after', lastBefore.url);
  };

  const saveAsReferenceProject = async () => {
    if (beforeImages.length === 0 || afterImages.length === 0) {
      toast({ title: 'Du behöver minst 1 före- och 1 efter-bild', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const cat = CATEGORIES.find(c => c.value === category);

    try {
      const allUrls = generatedImages.map(i => i.url);
      await createProject.mutateAsync({
        title: projectTitle || `${cat?.sv || 'Projekt'} — AI-genererat`,
        title_sv: projectTitle || `${cat?.sv || 'Projekt'} — AI-genererat`,
        title_en: projectTitle ? projectTitle : `${cat?.en || 'Project'} — AI Generated`,
        description: projectDescription || `Före/efter-visualisering av ${cat?.sv?.toLowerCase() || 'renovering'}.`,
        description_sv: projectDescription || `Före/efter-visualisering av ${cat?.sv?.toLowerCase() || 'renovering'}.`,
        description_en: null,
        location: projectLocation,
        location_sv: projectLocation,
        location_en: projectLocation,
        category: cat?.sv || 'Renovering',
        category_sv: cat?.sv || 'Renovering',
        category_en: cat?.en || 'Renovation',
        features: [cat?.sv || 'Renovering'],
        features_sv: [cat?.sv || 'Renovering'],
        features_en: [cat?.en || 'Renovation'],
        duration: '2-5 dagar',
        completed_date: new Date().toISOString().split('T')[0],
        price_amount: 0,
        rot_saving_amount: 0,
        rut_saving_amount: 0,
        rating: 5,
        client_initials: 'AI',
        images: allUrls,
        thumbnail_image: afterImages[0]?.url || allUrls[0],
        is_featured: false,
        sort_order: 99,
        is_active: true,
      });

      toast({ title: 'Referensprojekt skapat!', description: `${allUrls.length} bilder sparade.` });
      setGeneratedImages([]);
      setProjectTitle('');
      setProjectDescription('');
    } catch (err: any) {
      toast({ title: 'Fel', description: err?.message || 'Kunde inte spara.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Bildgenerator</h1>
        <p className="text-muted-foreground">Generera realistiska före/efter-bilder. Efter-bilden baseras på före-bilden för konsistens.</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5" /> Generera bilder</CardTitle>
          <CardDescription>Välj kategori och generera bilder. Du kan lägga till flera bilder från olika vinklar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 md:col-span-2 flex-wrap">
              <Button onClick={generatePair} disabled={isGenerating} className="flex-1 min-w-[180px]">
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {generatingLabel}</>
                ) : (
                  <><ImagePlus className="h-4 w-4 mr-2" /> Generera före + efter</>
                )}
              </Button>
              <Button variant="outline" onClick={() => generateImage('before')} disabled={isGenerating}>
                Ny före-bild
              </Button>
              <Button variant="outline" onClick={generateMoreAfter} disabled={isGenerating || beforeImages.length === 0}>
                Ny efter-bild
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image count badges */}
      {generatedImages.length > 0 && (
        <div className="flex gap-2 items-center">
          <Image className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary">{beforeImages.length} före-bilder</Badge>
          <Badge variant="secondary">{afterImages.length} efter-bilder</Badge>
          <span className="text-sm text-muted-foreground">({generatedImages.length} totalt)</span>
        </div>
      )}

      {/* Gallery */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          {beforeImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-3">Före</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {beforeImages.map((img) => {
                  const idx = generatedImages.indexOf(img);
                  return (
                    <Card key={idx} className="relative group overflow-hidden">
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 z-10 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img src={img.url} alt={img.label} className="w-full aspect-[4/3] object-cover" />
                      <div className="p-2 text-sm text-muted-foreground">{img.label}</div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {afterImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Efter</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {afterImages.map((img) => {
                  const idx = generatedImages.indexOf(img);
                  return (
                    <Card key={idx} className="relative group overflow-hidden">
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 z-10 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img src={img.url} alt={img.label} className="w-full aspect-[4/3] object-cover" />
                      <div className="p-2 text-sm text-muted-foreground">{img.label}</div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save as reference project */}
      {beforeImages.length > 0 && afterImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Save className="h-5 w-5" /> Spara som referensprojekt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Projekttitel</Label>
                <Input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder={`${CATEGORIES.find(c => c.value === category)?.sv} — AI-genererat`} />
              </div>
              <div>
                <Label>Plats</Label>
                <Input value={projectLocation} onChange={e => setProjectLocation(e.target.value)} placeholder="Stockholm" />
              </div>
            </div>
            <div>
              <Label>Beskrivning (valfritt)</Label>
              <Textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} placeholder="Beskriv projektet..." rows={3} />
            </div>
            <Button onClick={saveAsReferenceProject} disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sparar...</> : <><Save className="h-4 w-4 mr-2" /> Skapa referensprojekt ({generatedImages.length} bilder)</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reset */}
      {generatedImages.length > 0 && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setGeneratedImages([])}>
            <RefreshCw className="h-4 w-4 mr-2" /> Börja om
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminAiImageGenerator;
