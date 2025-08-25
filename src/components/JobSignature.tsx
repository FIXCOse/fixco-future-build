import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, Save, RotateCcw, FileSignature } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobSignature {
  id: string;
  role: string;
  signed_by_name: string;
  file_path: string;
  signed_at: string;
}

interface JobSignatureProps {
  jobId: string;
  signatures: JobSignature[];
  onSignaturesUpdate: () => void;
}

export const JobSignature = ({ jobId, signatures, onSignaturesUpdate }: JobSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signatureRole, setSignatureRole] = useState('customer');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    
    startDrawing(mouseEvent as any);
  }, [startDrawing]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    
    draw(mouseEvent as any);
  }, [draw]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  }, [stopDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const saveSignature = useCallback(async () => {
    if (!signerName.trim()) {
      toast({ 
        title: "Namn krävs", 
        description: "Ange namnet på den som signerar.", 
        variant: "destructive" 
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setSaving(true);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      // Generate unique filename
      const fileName = `${jobId}/${signatureRole}_${Date.now()}.png`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('job-signatures')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Save signature record to database
      const { error: dbError } = await supabase
        .from('job_signatures')
        .insert({
          job_id: jobId,
          role: signatureRole,
          signed_by_name: signerName.trim(),
          file_path: fileName
        });

      if (dbError) throw dbError;

      toast({ title: "Signatur sparad", description: "Signaturen har sparats till jobbet." });
      clearCanvas();
      setSignerName('');
      onSignaturesUpdate();

    } catch (error: any) {
      toast({ 
        title: "Fel vid sparande", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  }, [jobId, signerName, signatureRole, toast, onSignaturesUpdate, clearCanvas]);

  const getSignatureUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('job-signatures')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Signaturer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signature Input */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signer-name">Namn på undertecknare</Label>
              <Input
                id="signer-name"
                placeholder="Ange fullständigt namn"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="signature-role">Roll</Label>
              <select
                id="signature-role"
                value={signatureRole}
                onChange={(e) => setSignatureRole(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md"
              >
                <option value="customer">Kund</option>
                <option value="worker">Arbetare</option>
                <option value="supervisor">Arbetsledare</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Signatur (rita med musen eller fingret)</Label>
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full max-w-lg border border-border rounded bg-white cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="flex-1 md:flex-none"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Rensa
            </Button>
            <Button
              onClick={saveSignature}
              disabled={saving || !signerName.trim()}
              className="flex-1 md:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sparar...' : 'Spara signatur'}
            </Button>
          </div>
        </div>

        {/* Existing Signatures */}
        {signatures.length > 0 && (
          <div className="space-y-4">
            <Label>Sparade signaturer ({signatures.length})</Label>
            <div className="space-y-4">
              {signatures.map((signature) => (
                <div key={signature.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{signature.signed_by_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {signature.role} • {new Date(signature.signed_at).toLocaleString('sv-SE')}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        src={getSignatureUrl(signature.file_path)}
                        alt={`Signatur av ${signature.signed_by_name}`}
                        className="h-16 border rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {signatures.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileSignature className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Inga signaturer sparade än</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
