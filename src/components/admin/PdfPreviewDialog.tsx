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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <div className="flex-1 min-h-0 rounded-lg border overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="PDF Preview"
          />
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
