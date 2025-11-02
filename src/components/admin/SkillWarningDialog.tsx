import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface SkillWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerName: string;
  jobTitle: string;
  matchingSkills: string[];
  missingSkills: string[];
  onConfirm: (justification: string) => void;
  loading?: boolean;
}

export function SkillWarningDialog({
  open,
  onOpenChange,
  workerName,
  jobTitle,
  matchingSkills,
  missingSkills,
  onConfirm,
  loading
}: SkillWarningDialogProps) {
  const [justification, setJustification] = useState('');

  const handleConfirm = () => {
    onConfirm(justification);
    setJustification('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setJustification('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Varning: Skills matchar inte helt
          </DialogTitle>
          <DialogDescription>
            <strong>{workerName}</strong> saknar vissa kompetenser som krävs för <strong>{jobTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Matching Skills */}
          {matchingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <Label className="text-sm font-medium">Matchande kompetenser</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchingSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <Label className="text-sm font-medium">Saknade kompetenser</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Justification */}
          <div>
            <Label htmlFor="justification" className="text-sm font-medium">
              Motivering (valfritt men rekommenderat)
            </Label>
            <Textarea
              id="justification"
              placeholder="T.ex. 'Akut jobb, har erfarenhet från liknande projekt' eller 'Kommer jobba tillsammans med erfaren kollega'"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Din motivering loggas i audit-loggen för transparens och spårbarhet.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Avbryt
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Tilldelar...' : 'Tilldela ändå'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
