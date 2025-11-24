import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const LogoUploadButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [logoExists, setLogoExists] = useState<boolean | null>(null);

  useEffect(() => {
    checkLogoExists();
  }, []);

  const checkLogoExists = async () => {
    const { data, error } = await supabase.storage
      .from('assets')
      .list('', {
        search: 'fixco-logo-white.png'
      });
    
    if (!error && data) {
      setLogoExists(data.length > 0);
    }
  };

  const handleLogoUpload = async () => {
    setIsUploading(true);
    try {
      // Fetch logo från public folder
      const response = await fetch('/fixco-logo-white.png');
      if (!response.ok) {
        throw new Error('Kunde inte läsa logotypfilen');
      }
      
      const blob = await response.blob();
      
      // Ladda upp till Supabase Storage
      const { error } = await supabase.storage
        .from('assets')
        .upload('fixco-logo-white.png', blob, {
          contentType: 'image/png',
          upsert: true,
          cacheControl: '3600'
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logotyp uppladdad!",
        description: "Nu kan du generera PDF:er med den nya designen.",
      });
      
      setLogoExists(true);
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({
        title: "Uppladdning misslyckades",
        description: error instanceof Error ? error.message : "Kunde inte ladda upp logotyp",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Dölj knappen om logotypen redan finns
  if (logoExists === true) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span>Logotyp uppladdad</span>
      </div>
    );
  }

  // Visa inte knappen förrän vi vet status
  if (logoExists === null) {
    return null;
  }

  return (
    <Button 
      onClick={handleLogoUpload} 
      disabled={isUploading}
      variant="outline"
      size="sm"
    >
      <Upload className="h-4 w-4 mr-2" />
      {isUploading ? 'Laddar upp...' : 'Ladda upp Fixco-logotyp'}
    </Button>
  );
};
