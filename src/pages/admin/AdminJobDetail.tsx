import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Clock, Package, Receipt, Camera, Image as ImageIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { fetchJobById, fetchTimeLogs, fetchMaterialLogs, fetchExpenseLogs } from '@/lib/api/jobs';
import type { Job, TimeLog, MaterialLog, ExpenseLog } from '@/lib/api/jobs';
import { supabase } from '@/integrations/supabase/client';
import InvoicePreviewDialog from '@/components/admin/InvoicePreviewDialog';

interface JobPhoto {
  id: string;
  file_path: string;
  caption: string | null;
  created_at: string;
}

const AdminJobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [jobImages, setJobImages] = useState<string[]>([]);
  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [materialLogs, setMaterialLogs] = useState<MaterialLog[]>([]);
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    
    const loadJobData = async () => {
      try {
        setLoading(true);
        const [jobData, timeData, materialData, expenseData] = await Promise.all([
          fetchJobById(jobId),
          fetchTimeLogs(jobId),
          fetchMaterialLogs(jobId),
          fetchExpenseLogs(jobId)
        ]);
        
        setJob(jobData);
        setTimeLogs(timeData);
        setMaterialLogs(materialData);
        setExpenseLogs(expenseData);
        
        // Fetch images from source booking if job comes from booking
        if (jobData.source_type === 'booking' && jobData.source_id) {
          const { data: booking } = await supabase
            .from('bookings')
            .select('file_urls')
            .eq('id', jobData.source_id)
            .maybeSingle();
          
          if (booking && booking.file_urls) {
            setJobImages(booking.file_urls);
          }
        }
        
        // Fetch job photos uploaded by worker
        await loadJobPhotos();
      } catch (error) {
        console.error('Error loading job:', error);
        toast.error('Kunde inte ladda jobbinformation');
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [jobId]);

  const loadJobPhotos = async () => {
    if (!jobId) return;
    try {
      const { data, error } = await supabase
        .from('job_photos')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobPhotos(data || []);
    } catch (error) {
      console.error('Error loading job photos:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      case 'invoiced': return 'bg-pink-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Pågår';
      case 'assigned': return 'Tilldelad';
      case 'paused': return 'Pausad';
      case 'completed': return 'Färdig';
      case 'invoiced': return 'Fakturerad';
      default: return status;
    }
  };

  const totalHours = timeLogs?.reduce((sum, log) => sum + (log.hours || log.manual_hours || 0), 0) || 0;
  const totalMaterialCost = materialLogs?.reduce((sum, log) => sum + ((log.qty * (log.unit_price || 0))), 0) || 0;
  const totalExpenses = expenseLogs?.reduce((sum, log) => sum + log.amount, 0) || 0;
  
  // Calculate labor cost based on pricing mode
  const laborCost = job?.pricing_mode === 'hourly' 
    ? totalHours * (job.hourly_rate || 0) 
    : (job?.fixed_price || 0);
  
  const totalCost = laborCost + totalMaterialCost + totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar jobbinformation...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Jobb ej hittat</h2>
          <p className="text-muted-foreground mb-4">Det begärda jobbet kunde inte hittas.</p>
          <Button onClick={() => navigate('/admin/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till jobb
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/jobs')} className="mt-0.5">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold truncate">{job.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground text-sm mt-1">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.address}, {job.city}</span>
              </span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(job.status)}`} />
                <Badge variant="outline">
                  {getStatusLabel(job.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {job.status === 'completed' && (
            <Button 
              onClick={() => setShowInvoiceDialog(true)} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" 
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Skapa faktura
            </Button>
          )}
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kundinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {job.customer && (
              <>
                <div>
                  <p className="text-muted-foreground">Namn</p>
                  <p className="font-medium">{job.customer.name || 'Ej angivet'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefon</p>
                  <p className="font-medium">{job.customer.phone || 'Ej angivet'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">E-post</p>
                  <p className="font-medium">{job.customer.email || 'Ej angivet'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Tidsinformation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Skapad</p>
              <p className="font-medium">{format(new Date(job.created_at), 'PPP', { locale: sv })}</p>
            </div>
            {job.due_date && (
              <div>
                <p className="text-muted-foreground">Förfaller</p>
                <p className="font-medium">{format(new Date(job.due_date), 'PPP', { locale: sv })}</p>
              </div>
            )}
            {job.start_scheduled_at && (
              <div>
                <p className="text-muted-foreground">Schemalagd start</p>
                <p className="font-medium">{format(new Date(job.start_scheduled_at), 'PPP', { locale: sv })}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Prissättning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {job.pricing_mode === 'hourly' ? (
              <div>
                <p className="text-muted-foreground">Timkostnad</p>
                <p className="font-medium text-lg">{job.hourly_rate} kr/h</p>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">Fast pris</p>
                <p className="font-medium text-lg">{job.fixed_price} kr</p>
              </div>
            )}
            {job.bonus_amount > 0 && (
              <div>
                <p className="text-muted-foreground">Bonus</p>
                <p className="font-medium text-green-600">{job.bonus_amount} kr</p>
              </div>
            )}
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">Beräknad totalkostnad</p>
              <p className="font-bold text-xl">{totalCost.toFixed(2)} kr</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="time">Tid ({timeLogs?.length || 0})</TabsTrigger>
          <TabsTrigger value="material">Material ({materialLogs?.length || 0})</TabsTrigger>
          <TabsTrigger value="expenses">Utlägg ({expenseLogs?.length || 0})</TabsTrigger>
          <TabsTrigger value="customer-images">Kundbilder ({jobImages.length})</TabsTrigger>
          <TabsTrigger value="job-photos">Jobbfoton ({jobPhotos.length})</TabsTrigger>
        </TabsList>

        {/* Time Logs Tab */}
        <TabsContent value="time" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Tidsregistreringar
                </span>
                <span className="text-lg font-bold">{totalHours.toFixed(2)} timmar totalt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeLogs && timeLogs.length > 0 ? (
                <div className="space-y-2">
                  {timeLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.hours || log.manual_hours} timmar</p>
                          {log.note && <p className="text-sm text-muted-foreground mt-1">{log.note}</p>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'PPP', { locale: sv })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga tidsregistreringar ännu</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Material Logs Tab */}
        <TabsContent value="material" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Material
                </span>
                <span className="text-lg font-bold">{totalMaterialCost.toFixed(2)} kr totalt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materialLogs && materialLogs.length > 0 ? (
                <div className="space-y-2">
                  {materialLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Antal: {log.qty} × {log.unit_price || 0} kr = {(log.qty * (log.unit_price || 0)).toFixed(2)} kr
                          </p>
                          {log.supplier && <p className="text-sm text-muted-foreground">Leverantör: {log.supplier}</p>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'PPP', { locale: sv })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga materialregistreringar ännu</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Logs Tab */}
        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Utlägg
                </span>
                <span className="text-lg font-bold">{totalExpenses.toFixed(2)} kr totalt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expenseLogs && expenseLogs.length > 0 ? (
                <div className="space-y-2">
                  {expenseLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.category}</p>
                          <p className="text-lg font-semibold">{log.amount.toFixed(2)} kr</p>
                          {log.note && <p className="text-sm text-muted-foreground mt-1">{log.note}</p>}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'PPP', { locale: sv })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga utlägg registrerade ännu</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Images Tab */}
        <TabsContent value="customer-images" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Bilder från kunden
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {jobImages.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={url} 
                        alt={`Kundbild ${index + 1}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(url, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga bilder från kunden</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Photos Tab */}
        <TabsContent value="job-photos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Foton uppladdade av arbetare
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {jobPhotos.map((photo) => {
                    const photoUrl = `https://fnzjgohubvaxwpmnvwdq.supabase.co/storage/v1/object/public/${photo.file_path}`;
                    return (
                      <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img 
                          src={photoUrl} 
                          alt={photo.caption || `Jobbfoto`}
                          className="object-cover w-full h-full hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(photoUrl, '_blank')}
                        />
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga jobbfoton uppladdade ännu</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Preview Dialog */}
      {job && (
        <InvoicePreviewDialog
          open={showInvoiceDialog}
          onOpenChange={setShowInvoiceDialog}
          job={job}
          timeLogs={timeLogs}
          materialLogs={materialLogs}
          expenseLogs={expenseLogs}
          onInvoiceCreated={() => {
            toast.success('Faktura skapad!');
            navigate('/admin/invoices');
          }}
        />
      )}
    </div>
  );
};

export default AdminJobDetail;
