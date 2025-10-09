import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobPricingModalProps {
  job: {
    id: string;
    title?: string;
    admin_set_price?: number;
    bonus_amount?: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const JobPricingModal = ({ job, open, onOpenChange, onSuccess }: JobPricingModalProps) => {
  const { toast } = useToast();
  const [adminSetPrice, setAdminSetPrice] = useState<string>(job?.admin_set_price?.toString() || '');
  const [bonusAmount, setBonusAmount] = useState<string>(job?.bonus_amount?.toString() || '0');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!job) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          admin_set_price: adminSetPrice ? parseFloat(adminSetPrice) : null,
          bonus_amount: bonusAmount ? parseFloat(bonusAmount) : 0,
        })
        .eq('id', job.id);

      if (error) throw error;

      toast({
        title: 'Uppdaterat',
        description: 'Ersättning och bonus har uppdaterats',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating job pricing:', error);
      toast({
        title: 'Fel',
        description: error.message || 'Kunde inte uppdatera ersättning',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sätt ersättning & bonus</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{job.title || 'Jobb'}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin_set_price">Fast ersättning (kr)</Label>
            <Input
              id="admin_set_price"
              type="number"
              step="0.01"
              value={adminSetPrice}
              onChange={(e) => setAdminSetPrice(e.target.value)}
              placeholder="Lämna tomt för ingen fast ersättning"
            />
            <p className="text-xs text-muted-foreground">
              Detta är det belopp som workers kommer att se för jobbet
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonus_amount">Bonus (kr)</Label>
            <Input
              id="bonus_amount"
              type="number"
              step="0.01"
              value={bonusAmount}
              onChange={(e) => setBonusAmount(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Extra bonus för att locka workers till detta jobb
            </p>
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Sammanfattning:</p>
            {adminSetPrice ? (
              <p>Fast ersättning: {adminSetPrice} kr</p>
            ) : (
              <p className="text-muted-foreground">Ingen fast ersättning (workers ser inget pris)</p>
            )}
            {bonusAmount && parseFloat(bonusAmount) > 0 && (
              <p className="text-yellow-600">Bonus: +{bonusAmount} kr 🎁</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Sparar...' : 'Spara'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
