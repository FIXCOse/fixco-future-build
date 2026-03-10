import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuoteImage {
  id: string;
  file_path: string;
  file_name: string | null;
  created_at: string;
}

interface QuoteImageUploadProps {
  quoteId: string;
  imagesRequested?: boolean;
  locale: 'sv' | 'en';
}

const copy = {
  sv: {
    title: 'Ladda upp bilder',
    requestedTitle: '📸 Vi önskar bilder från dig',
    requestedDesc: 'Vi behöver bilder för att kunna ge dig bästa möjliga service. Ladda upp nedan.',
    uploadBtn: 'Välj bilder att ladda upp',
    uploading: 'Laddar upp...',
    noImages: 'Inga bilder uppladdade än',
    dragDrop: 'Dra och släpp eller klicka för att ladda upp',
    uploadSuccess: 'Bild uppladdad',
    uploadFail: 'Kunde inte ladda upp bild',
    deleteSuccess: 'Bild borttagen',
    deleteFail: 'Kunde inte ta bort bild',
    uploaded: 'Uppladdade bilder',
  },
  en: {
    title: 'Upload images',
    requestedTitle: '📸 We would like photos from you',
    requestedDesc: 'We need images to provide you with the best possible service. Upload below.',
    uploadBtn: 'Choose images to upload',
    uploading: 'Uploading...',
    noImages: 'No images uploaded yet',
    dragDrop: 'Drag and drop or click to upload',
    uploadSuccess: 'Image uploaded',
    uploadFail: 'Could not upload image',
    deleteSuccess: 'Image removed',
    deleteFail: 'Could not remove image',
    uploaded: 'Uploaded images',
  },
};

export function QuoteImageUpload({ quoteId, imagesRequested, locale }: QuoteImageUploadProps) {
  const { toast } = useToast();
  const t = copy[locale] || copy.sv;
  const [images, setImages] = useState<QuoteImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchImages = useCallback(async () => {
    const { data } = await supabase
      .from('quote_images')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });
    if (data) setImages(data as QuoteImage[]);
  }, [quoteId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const fileName = `${quoteId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('quote-customer-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('quote_images')
          .insert({
            quote_id: quoteId,
            file_path: fileName,
            file_name: file.name,
            uploaded_by: 'customer',
          });

        if (dbError) throw dbError;
      }
      toast({ title: t.uploadSuccess });
      fetchImages();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ title: t.uploadFail, description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (image: QuoteImage) => {
    try {
      await supabase.storage.from('quote-customer-images').remove([image.file_path]);
      await supabase.from('quote_images').delete().eq('id', image.id);
      toast({ title: t.deleteSuccess });
      fetchImages();
    } catch (err: any) {
      toast({ title: t.deleteFail, description: err.message, variant: 'destructive' });
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage.from('quote-customer-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <Card className={`border-border ${imagesRequested ? 'border-primary/50 bg-primary/5' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Camera className="h-4 w-4" />
          {imagesRequested ? t.requestedTitle : t.title}
        </CardTitle>
        {imagesRequested && (
          <p className="text-sm text-muted-foreground">{t.requestedDesc}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('quote-image-input')?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t.dragDrop}</p>
          <Button variant="outline" size="sm" className="mt-3" disabled={uploading}>
            {uploading ? t.uploading : t.uploadBtn}
          </Button>
        </div>

        <input
          id="quote-image-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Uploaded images grid */}
        {images.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t.uploaded} ({images.length})</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
                  <img
                    src={getImageUrl(img.file_path)}
                    alt={img.file_name || 'Uploaded image'}
                    className="w-full h-28 object-cover"
                  />
                  <button
                    onClick={() => handleDelete(img)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {img.file_name && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-foreground text-[10px] px-2 py-1 truncate">
                      {img.file_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && !imagesRequested && (
          <div className="text-center py-4 text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-40" />
            <p className="text-xs">{t.noImages}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
