import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FollowUpEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  customerName: string;
  onSuccess?: () => void;
}

export function FollowUpEmailDialog({ open, onOpenChange, quoteId, customerName, onSuccess }: FollowUpEmailDialogProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [generatingSubject, setGeneratingSubject] = useState(false);
  const [generatingBody, setGeneratingBody] = useState(false);
  const [sending, setSending] = useState(false);

  const handleGenerateText = async (type: 'subject' | 'body') => {
    const setLoading = type === 'subject' ? setGeneratingSubject : setGeneratingBody;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-followup-text', {
        body: { quoteId, type }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'AI-generering misslyckades');

      if (type === 'subject') {
        setSubject(data.text.trim());
      } else {
        setBody(data.text.trim());
      }

      toast.success(type === 'subject' ? 'Ämnesrad genererad!' : 'Mailtext genererad!');
    } catch (error: any) {
      console.error('Error generating text:', error);
      toast.error(error.message || 'Kunde inte generera text');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (testEmail?: string) => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Fyll i både ämnesrad och mailtext');
      return;
    }

    setSending(true);
    try {
      const payload: any = { quoteId, subject: subject.trim(), body: body.trim() };
      if (testEmail) payload.testEmail = testEmail;

      const { data, error } = await supabase.functions.invoke('send-followup-email', {
        body: payload
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Kunde inte skicka');

      toast.success(testEmail ? `Testmail skickat till ${testEmail}! 🧪` : 'Uppföljningsmail skickat! 🎉');
      onOpenChange(false);
      setSubject("");
      setBody("");
      onSuccess?.();
    } catch (error: any) {
      console.error('Error sending followup:', error);
      toast.error(error.message || 'Kunde inte skicka uppföljningsmail');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📩 Uppföljningsmail till {customerName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label>Ämnesrad</Label>
            <div className="flex gap-2">
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Skriv ämnesrad eller generera med AI..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleGenerateText('subject')}
                disabled={generatingSubject}
                title="AI-generera ämnesrad"
              >
                {generatingSubject ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-500" />}
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Mailtext</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateText('body')}
                disabled={generatingBody}
              >
                {generatingBody ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 text-amber-500 mr-2" />}
                AI-generera text
              </Button>
            </div>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Skriv din mailtext här eller generera med AI..."
              className="min-h-[250px] resize-y"
            />
          </div>

          {/* Preview hint */}
          {body && (
            <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">ℹ️ Mailet skickas från info@fixco.se</p>
              <p>Kunden får en brandad Fixco-mall med din text och en knapp till offertsidan.</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSend('imedashviliomar@gmail.com')}
            disabled={sending || !subject.trim() || !body.trim()}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            🧪 Testmail
          </Button>
          <Button onClick={() => handleSend()} disabled={sending || !subject.trim() || !body.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Skicka mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
