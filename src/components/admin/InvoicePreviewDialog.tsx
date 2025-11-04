import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { createInvoiceFromJob } from '@/lib/api/invoices';
import type { Job, TimeLog, MaterialLog, ExpenseLog } from '@/lib/api/jobs';
import { Loader2 } from 'lucide-react';

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  timeLogs: TimeLog[];
  materialLogs: MaterialLog[];
  expenseLogs: ExpenseLog[];
  onInvoiceCreated: () => void;
}

const InvoicePreviewDialog = ({
  open,
  onOpenChange,
  job,
  timeLogs,
  materialLogs,
  expenseLogs,
  onInvoiceCreated
}: InvoicePreviewDialogProps) => {
  const [creating, setCreating] = useState(false);

  const totalHours = timeLogs?.reduce((sum, log) => sum + (log.hours || log.manual_hours || 0), 0) || 0;
  const totalMaterialCost = materialLogs?.reduce((sum, log) => sum + ((log.qty * (log.unit_price || 0))), 0) || 0;
  const totalExpenses = expenseLogs?.reduce((sum, log) => sum + log.amount, 0) || 0;
  
  // Calculate labor cost based on pricing mode
  const laborCost = job.pricing_mode === 'hourly' 
    ? totalHours * (job.hourly_rate || 0) 
    : (job.fixed_price || 0);
  
  const subtotal = laborCost + totalMaterialCost + totalExpenses;
  const vat = subtotal * 0.25;
  const total = subtotal + vat;

  const handleCreateInvoice = async () => {
    if (!job.customer_id) {
      toast.error('Jobb saknar kund-ID');
      return;
    }

    setCreating(true);
    try {
      await createInvoiceFromJob(job.id, job.customer_id);
      toast.success('Faktura skapad!');
      onOpenChange(false);
      onInvoiceCreated();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Kunde inte skapa faktura');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Förhandsgranska faktura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kundinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Namn</p>
                <p className="font-medium">{job.customer?.name || 'Ej angivet'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">E-post</p>
                <p className="font-medium">{job.customer?.email || 'Ej angivet'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Telefon</p>
                <p className="font-medium">{job.customer?.phone || 'Ej angivet'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jobbinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Titel</p>
                <p className="font-medium">{job.title}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Adress</p>
                <p className="font-medium">{job.address}, {job.postal_code} {job.city}</p>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fakturarader</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Labor */}
              <div className="space-y-2">
                <h4 className="font-semibold">Arbete</h4>
                {job.pricing_mode === 'hourly' ? (
                  <div className="flex justify-between text-sm">
                    <span>{totalHours.toFixed(2)} timmar × {job.hourly_rate} kr/h</span>
                    <span className="font-medium">{laborCost.toFixed(2)} kr</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span>Fast pris för {job.title}</span>
                    <span className="font-medium">{laborCost.toFixed(2)} kr</span>
                  </div>
                )}
              </div>

              {/* Materials */}
              {materialLogs && materialLogs.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Material</h4>
                    {materialLogs.map((log) => (
                      <div key={log.id} className="flex justify-between text-sm">
                        <span>{log.name} ({log.qty} × {log.unit_price || 0} kr)</span>
                        <span className="font-medium">{(log.qty * (log.unit_price || 0)).toFixed(2)} kr</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Expenses */}
              {expenseLogs && expenseLogs.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Utlägg</h4>
                    {expenseLogs.map((log) => (
                      <div key={log.id} className="flex justify-between text-sm">
                        <span>{log.category}</span>
                        <span className="font-medium">{log.amount.toFixed(2)} kr</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Totals */}
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{subtotal.toFixed(2)} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Moms (25%)</span>
                  <span className="font-medium">{vat.toFixed(2)} kr</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Totalt att betala</span>
                  <span>{total.toFixed(2)} kr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Avbryt
            </Button>
            <Button 
              onClick={handleCreateInvoice}
              disabled={creating}
            >
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Skapa faktura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewDialog;
