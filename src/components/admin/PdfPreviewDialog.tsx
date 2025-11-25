import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

type PdfPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  title?: string;
};

export function PdfPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  title = "PDF Preview",
}: PdfPreviewDialogProps) {
  if (!pdfUrl) return null;

  const handleDownload = async () => {
    try {
      // Fetcha PDF som blob för att kringgå cross-origin restriktioner
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Skapa nedladdningslänk
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: öppna i ny flik om nedladdning misslyckas
      window.open(pdfUrl, '_blank');
    }
  };

  const handleOpenNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Förhandsgranska och ladda ner PDF
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 rounded-lg border overflow-hidden bg-muted/20">
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            className="w-full h-full"
            title="PDF Preview"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
              <p className="text-muted-foreground text-center">
                Din webbläsare stödjer inte PDF-visning direkt.
              </p>
              <Button onClick={() => window.open(pdfUrl, '_blank')} variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Öppna PDF i ny flik
              </Button>
            </div>
          </object>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleOpenNewTab}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Öppna i ny flik
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Ladda ner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
