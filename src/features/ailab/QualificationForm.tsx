import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GradientText } from '@/components/v2/GradientText';

interface QualificationFormProps {
  serviceCategory?: string;
  onSubmit: (data: QualificationData) => void;
  isSubmitting?: boolean;
}

export interface QualificationData {
  serviceCategory: string;
  projectScope: string;
  size: string;
  timeline: string;
  budget: string;
  additionalDetails: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function QualificationForm({ 
  serviceCategory = '', 
  onSubmit, 
  isSubmitting = false 
}: QualificationFormProps) {
  const [formData, setFormData] = useState<QualificationData>({
    serviceCategory,
    projectScope: '',
    size: '',
    timeline: '',
    budget: '',
    additionalDetails: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [completionScore, setCompletionScore] = useState(0);

  const updateField = (field: keyof QualificationData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Calculate completion score
    let score = 0;
    if (newData.name) score += 15;
    if (newData.email) score += 15;
    if (newData.phone) score += 10;
    if (newData.address) score += 10;
    if (newData.projectScope) score += 15;
    if (newData.size) score += 10;
    if (newData.timeline) score += 10;
    if (newData.budget) score += 15;
    setCompletionScore(score);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.name && formData.email && formData.serviceCategory;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          <GradientText gradient="rainbow">
            Begär offert
          </GradientText>
        </h3>
        <p className="text-sm text-muted-foreground">
          Fyll i information så återkommer vi inom 48h med en offert
        </p>
        
        {/* Completion indicator */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <span className="text-xs font-medium">{completionScore}%</span>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          📋 Detta ersätter inte en bindande offert. Vi återkommer med exakt pris efter platsbesiktning.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-3 pb-3 border-b">
          <Label className="text-xs font-semibold text-muted-foreground">
            KONTAKTINFORMATION *
          </Label>
          
          <div>
            <Label htmlFor="name">Namn *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ditt namn"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="din@email.se"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="070-123 45 67"
            />
          </div>

          <div>
            <Label htmlFor="address">Projektadress</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Gatuadress, Stad"
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground">
            PROJEKTDETALJER
          </Label>

          <div>
            <Label htmlFor="projectScope">Vad ska göras?</Label>
            <Textarea
              id="projectScope"
              value={formData.projectScope}
              onChange={(e) => updateField('projectScope', e.target.value)}
              placeholder="Beskriv kort vad du vill ha hjälp med"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="size">Storlek</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => updateField('size', e.target.value)}
                placeholder="T.ex. 15 m²"
              />
            </div>

            <div>
              <Label htmlFor="timeline">Tidplan</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => updateField('timeline', e.target.value)}
                placeholder="T.ex. inom 3 mån"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="budget">Ungefärlig budget</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => updateField('budget', e.target.value)}
              placeholder="T.ex. 50 000 - 100 000 kr"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Endast som riktlinje, inte bindande
            </p>
          </div>

          <div>
            <Label htmlFor="additionalDetails">Övriga detaljer</Label>
            <Textarea
              id="additionalDetails"
              value={formData.additionalDetails}
              onChange={(e) => updateField('additionalDetails', e.target.value)}
              placeholder="Något vi bör veta?"
              rows={2}
            />
          </div>
        </div>

        {/* Priority Badge */}
        {completionScore >= 70 && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-xs text-green-800">
              <strong>Hög prioritet!</strong> Din förfrågan är välformulerad och får snabbt svar.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Skickar...' : 'Skicka förfrågan'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Vi återkommer inom <strong>48 timmar</strong> med en offert
        </p>
      </form>
    </Card>
  );
}
