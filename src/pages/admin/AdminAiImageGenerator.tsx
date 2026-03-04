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
import { Loader2, Wand2, Save, RefreshCw, ImagePlus } from 'lucide-react';

const CATEGORIES = [
  { value: 'bathroom', label: 'Badrum', sv: 'Badrumsrenovering', en: 'Bathroom Renovation' },
  { value: 'kitchen', label: 'Kök', sv: 'Köksrenovering', en: 'Kitchen Renovation' },
  { value: 'facade', label: 'Fasad', sv: 'Fasadrenovering', en: 'Facade Renovation' },
  { value: 'wardrobe', label: 'Garderob', sv: 'Garderobsinstallation', en: 'Wardrobe Installation' },
  { value: 'flooring', label: 'Golv', sv: 'Golvläggning', en: 'Flooring' },
  { value: 'painting', label: 'Målning', sv: 'Målning', en: 'Painting' },
];

interface GeneratedPair {
  beforeUrl: string | null;
  afterUrl: string | null;
  category: string;
}

const AdminAiImageGenerator = () => {
  const [category, setCategory] = useState('bathroom');
  const [isGeneratingBefore, setIsGeneratingBefore] = useState(false);
  const [isGeneratingAfter, setIsGeneratingAfter] = useState(false);
  const [generatedPair, setGeneratedPair] = useState<GeneratedPair>({ beforeUrl: null, afterUrl: null, category: 'bathroom' });
  const [projectTitle, setProjectTitle] = useState('');
  const [projectLocation, setProjectLocation] = useState('Stockholm');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const createProject = useCreateReferenceProject();
  const { toast } = useToast();

  const generateImage = async (style: 'before' | 'after') => {
    const setLoading = style === 'before' ? setIsGeneratingBefore : setIsGeneratingAfter;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-image', {
        body: { category, style }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGeneratedPair(prev => ({
        ...prev,
        [style === 'before' ? 'beforeUrl' : 'afterUrl']: data.url,
        category
      }));

      toast({
        title: `${style === 'before' ? 'Före' : 'Efter'}-bild genererad!`,
        description: 'Bilden har sparats i Supabase Storage.',
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      toast({
        title: 'Fel vid bildgenerering',
        description: err?.message || 'Kunde inte generera bild. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBoth = async () => {
    await generateImage('before');
    await generateImage('after');
  };

  const saveAsReferenceProject = async () => {
    if (!generatedPair.beforeUrl || !generatedPair.afterUrl) {
      toast({ title: 'Generera båda bilderna först', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const cat = CATEGORIES.find(c => c.value === generatedPair.category);

    try {
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
        images: [generatedPair.beforeUrl, generatedPair.afterUrl],
        thumbnail_image: generatedPair.afterUrl,
        is_featured: false,
        sort_order: 99,
        is_active: true,
      });

      toast({ title: 'Referensprojekt skapat!', description: 'Projektet finns nu i referenslistan.' });
      setGeneratedPair({ beforeUrl: null, afterUrl: null, category: 'bathroom' });
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
        <p className="text-muted-foreground">Generera realistiska före/efter-bilder för referensprojekt med AI.</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5" /> Generera bildpar</CardTitle>
          <CardDescription>Välj kategori och generera ett före/efter-par. Pro-modellen ger bäst resultat men tar ~30s per bild.</CardDescription>
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
            <div className="flex items-end gap-2 md:col-span-2">
              <Button onClick={generateBoth} disabled={isGeneratingBefore || isGeneratingAfter} className="flex-1">
                {(isGeneratingBefore || isGeneratingAfter) ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Genererar...</>
                ) : (
                  <><ImagePlus className="h-4 w-4 mr-2" /> Generera före + efter</>
                )}
              </Button>
              <Button variant="outline" onClick={() => generateImage('before')} disabled={isGeneratingBefore || isGeneratingAfter}>
                {isGeneratingBefore ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Före'}
              </Button>
              <Button variant="outline" onClick={() => generateImage('after')} disabled={isGeneratingBefore || isGeneratingAfter}>
                {isGeneratingAfter ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Efter'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-destructive">Före</CardTitle></CardHeader>
          <CardContent>
            {isGeneratingBefore ? (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Genererar före-bild...</p>
                </div>
              </div>
            ) : generatedPair.beforeUrl ? (
              <img src={generatedPair.beforeUrl} alt="Före" className="w-full rounded-lg aspect-[4/3] object-cover" />
            ) : (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Ingen bild genererad ännu</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-primary">Efter</CardTitle></CardHeader>
          <CardContent>
            {isGeneratingAfter ? (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Genererar efter-bild...</p>
                </div>
              </div>
            ) : generatedPair.afterUrl ? (
              <img src={generatedPair.afterUrl} alt="Efter" className="w-full rounded-lg aspect-[4/3] object-cover" />
            ) : (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Ingen bild genererad ännu</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save as reference project */}
      {generatedPair.beforeUrl && generatedPair.afterUrl && (
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
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sparar...</> : <><Save className="h-4 w-4 mr-2" /> Skapa referensprojekt</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Regenerate */}
      {(generatedPair.beforeUrl || generatedPair.afterUrl) && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setGeneratedPair({ beforeUrl: null, afterUrl: null, category: 'bathroom' })}>
            <RefreshCw className="h-4 w-4 mr-2" /> Börja om
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminAiImageGenerator;
