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
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [caption, setCaption] = useState('');
  const { toast } = useToast();

  const uploadPhoto = useCallback(async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    
    try {
      setUploadingFiles(prev => new Set(prev).add(fileId));

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${jobId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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

      toast({ 
        title: "Foto uppladdat", 
        description: `${file.name} har laddats upp.` 
      });
      
      onPhotosUpdate();

    } catch (error: any) {
      toast({ 
        title: "Fel vid uppladdning", 
        description: `${file.name}: ${error.message}`, 
        variant: "destructive" 
      });
    } finally {
      setUploadingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  }, [jobId, caption, toast, onPhotosUpdate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Upload all files in parallel
      Array.from(files).forEach(file => {
        uploadPhoto(file);
      });
      // Reset input so same files can be selected again
      event.target.value = '';
      // Clear caption after upload
      setCaption('');
    }
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('job-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const photoCount = photos.length;
  const hasEnoughPhotos = photoCount >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Jobbfoton
          </div>
          <div className="flex items-center gap-2">
            {hasEnoughPhotos ? (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full" />
                {photoCount} foton ✓
              </span>
            ) : (
              <span className="text-sm text-orange-600 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-orange-600 rounded-full" />
                {photoCount}/2 foton
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning if not enough photos */}
        {!hasEnoughPhotos && (
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-2">
            <Camera className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                Minst 2 bilder krävs
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Du måste ladda upp minst 2 bilder för att kunna markera jobbet som färdigt
              </p>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {hasEnoughPhotos && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2">
            <Camera className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 dark:text-green-200">
              ✓ Tillräckligt med bilder uppladdade ({photoCount} st)
            </p>
          </div>
        )}
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
              disabled={uploadingFiles.size > 0}
              onClick={() => document.getElementById('photo-input')?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadingFiles.size > 0 
                ? `Laddar upp ${uploadingFiles.size} fil(er)...` 
                : 'Välj foto(n)'}
            </Button>
          </div>

          <input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
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