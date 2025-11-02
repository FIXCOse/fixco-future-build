import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { returnJobToPool } from '@/lib/api/jobs';
import { toast } from 'sonner';

interface ReturnJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  onReturn: () => void;
}

export function ReturnJobDialog({ open, onOpenChange, jobId, jobTitle, onReturn }: ReturnJobDialogProps) {
  const [reason, setReason] = useState<string>('');
  const [reasonText, setReasonText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleReturn = async () => {
    if (!reason) {
      toast.error('Välj en anledning');
      return;
    }
    
    setLoading(true);
    try {
      await returnJobToPool(jobId, reason as any, reasonText);
      toast.success('Jobb returnerat till poolen');
      onReturn();
      onOpenChange(false);
      // Reset form
      setReason('');
      setReasonText('');
    } catch (error) {
      console.error('Error returning job:', error);
      toast.error('Kunde inte returnera jobb');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Returnera jobb till pool</DialogTitle>
          <DialogDescription>
            Du kommer att släppa "{jobTitle}" tillbaka till poolen så att andra workers kan ta jobbet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Varför vill du returnera jobbet?</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Välj anledning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="too_difficult">För svårt/komplicerat</SelectItem>
                <SelectItem value="time_conflict">Tidsbrist/schemakonflikt</SelectItem>
                <SelectItem value="equipment_missing">Saknar utrustning/material</SelectItem>
                <SelectItem value="customer_request">Kunden önskar annan tekniker</SelectItem>
                <SelectItem value="other">Annat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Detaljer (valfritt)</Label>
            <Textarea 
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Beskriv situationen..."
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Avbryt
          </Button>
          <Button onClick={handleReturn} disabled={loading || !reason} variant="destructive">
            {loading ? 'Returnerar...' : 'Returnera till pool'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
