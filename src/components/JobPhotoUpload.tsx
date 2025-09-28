import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobPhoto {
  id: string;
  file_path: string;
  caption: string | null;
  created_at: string;
}

interface JobPhotoUploadProps {
  jobId: string;
  photos: JobPhoto[];
  onPhotosUpdate: () => void;
}

export const JobPhotoUpload = ({ jobId, photos, onPhotosUpdate }: JobPhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const { toast } = useToast();

  const uploadPhoto = useCallback(async (file: File) => {
    try {
      setUploading(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${jobId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('job-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save photo record to database
      const { error: dbError } = await supabase
        .from('job_photos')
        .insert({
          job_id: jobId,
          worker_id: (await supabase.auth.getUser()).data.user?.id,
          file_path: fileName,
          caption: caption || null
        });

      if (dbError) throw dbError;

      toast({ title: "Foto uppladdat", description: "Fotot har sparats till jobbet." });
      setCaption('');
      onPhotosUpdate();

    } catch (error: any) {
      toast({ 
        title: "Fel vid uppladdning", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  }, [jobId, caption, toast, onPhotosUpdate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('job-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Jobbfoton
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="photo-caption">Bildtext (valfritt)</Label>
            <Textarea
              id="photo-caption"
              placeholder="Beskriv vad som visas på bilden..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById('photo-input')?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Laddar upp...' : 'Välj foto'}
            </Button>
          </div>

          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <Label>Uppladda foton ({photos.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={getPhotoUrl(photo.file_path)}
                    alt={photo.caption || 'Jobbfoto'}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm text-foreground text-xs p-2 rounded-b-lg">
                      {photo.caption}
                    </div>
                  )}
                  <div className="absolute top-0 right-0 left-0 bg-background/80 backdrop-blur-sm text-foreground text-xs p-1 rounded-t-lg">
                    {new Date(photo.created_at).toLocaleDateString('sv-SE')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Inga foton uppladdade än</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};