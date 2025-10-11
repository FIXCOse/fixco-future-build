import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Clock, Play, Pause, CheckCircle, Package, Receipt, Camera, FileSignature, Image as ImageIcon, Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { fetchJobById, fetchTimeLogs, fetchMaterialLogs, fetchExpenseLogs, updateJobStatus, completeJob, createTimeEntry, createMaterialEntry, createExpenseEntry } from '@/lib/api/jobs';
import type { Job, TimeLog, MaterialLog, ExpenseLog } from '@/lib/api/jobs';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { JobPhotoUpload } from '@/components/JobPhotoUpload';

interface JobPhoto {
  id: string;
  file_path: string;
  caption: string | null;
  created_at: string;
}

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [jobImages, setJobImages] = useState<string[]>([]);
  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [materialLogs, setMaterialLogs] = useState<MaterialLog[]>([]);
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showOnWayDialog, setShowOnWayDialog] = useState(false);
  
  // Form visibility states
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  
  // Form data states
  const [timeFormData, setTimeFormData] = useState({ hours: '', note: '' });
  const [materialFormData, setMaterialFormData] = useState({ name: '', qty: '', unit_price: '', supplier: '' });
  const [expenseFormData, setExpenseFormData] = useState({ category: '', amount: '', note: '', km: '' });
  
  // Constants
  const MILEAGE_RATE = 18.50; // kr per 10 km (mil)

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

  const handleStartJob = async () => {
    if (!job) return;
    setActionLoading(true);
    try {
      await updateJobStatus(job.id, 'in_progress');
      setJob({ ...job, status: 'in_progress' });
      toast.success('Jobb startat!');
    } catch (error) {
      console.error('Error starting job:', error);
      toast.error('Kunde inte starta jobb');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePauseJob = async () => {
    if (!job) return;
    setActionLoading(true);
    try {
      await updateJobStatus(job.id, 'paused');
      setJob({ ...job, status: 'paused' });
      toast.success('Jobb pausat!');
    } catch (error) {
      console.error('Error pausing job:', error);
      toast.error('Kunde inte pausa jobb');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOnWayConfirm = async () => {
    if (!job) return;
    setShowOnWayDialog(false);
    setActionLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('notify-job-status', {
        body: { jobId: job.id, eventType: 'on_way' }
      });
      
      if (error) throw error;
      toast.success('Kunden har informerats att du är på väg!');
    } catch (error) {
      console.error('Error sending on-way notification:', error);
      toast.error('Kunde inte skicka notis till kund');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!job) return;
    
    // Validate that at least 2 photos are uploaded
    const { count, error: countError } = await supabase
      .from('job_photos')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', job.id);
    
    if (countError) {
      console.error('Error checking photo count:', countError);
      toast.error('Kunde inte verifiera foton');
      return;
    }
    
    if ((count || 0) < 2) {
      toast.error('Du måste ladda upp minst 2 bilder innan du kan markera jobbet som färdigt', {
        duration: 5000,
        icon: <AlertCircle className="h-5 w-5" />
      });
      return;
    }
    
    setActionLoading(true);
    try {
      // Mark job as complete
      await completeJob(job.id);
      setJob({ ...job, status: 'completed' });
      
      // Send completion email to customer
      const { error: emailError } = await supabase.functions.invoke('notify-job-status', {
        body: { jobId: job.id, eventType: 'completed' }
      });
      
      if (emailError) {
        console.error('Error sending completion email:', emailError);
        toast.warning('Jobbet markerat som färdigt men kunde inte skicka mail till kund');
      } else {
        toast.success('Jobbet markerat som färdigt och kunden har informerats!');
      }
    } catch (error) {
      console.error('Error completing job:', error);
      toast.error('Kunde inte markera jobb som färdigt');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTimeLog = async () => {
    if (!job || !timeFormData.hours) {
      toast.error('Ange antal timmar');
      return;
    }
    
    try {
      await createTimeEntry({
        job_id: job.id,
        manual_hours: parseFloat(timeFormData.hours),
        note: timeFormData.note
      });
      
      // Refresh time logs
      const updatedLogs = await fetchTimeLogs(job.id);
      setTimeLogs(updatedLogs);
      
      // Reset form
      setTimeFormData({ hours: '', note: '' });
      setShowTimeForm(false);
      toast.success('Tid registrerad!');
    } catch (error) {
      console.error('Error adding time log:', error);
      toast.error('Kunde inte registrera tid');
    }
  };

  const handleAddMaterialLog = async () => {
    if (!job || !materialFormData.name || !materialFormData.qty) {
      toast.error('Ange materialnamn och antal');
      return;
    }
    
    try {
      await createMaterialEntry({
        job_id: job.id,
        name: materialFormData.name,
        qty: parseFloat(materialFormData.qty),
        unit_price: materialFormData.unit_price ? parseFloat(materialFormData.unit_price) : 0,
        supplier: materialFormData.supplier
      });
      
      // Refresh material logs
      const updatedLogs = await fetchMaterialLogs(job.id);
      setMaterialLogs(updatedLogs);
      
      // Reset form
      setMaterialFormData({ name: '', qty: '', unit_price: '', supplier: '' });
      setShowMaterialForm(false);
      toast.success('Material registrerat!');
    } catch (error) {
      console.error('Error adding material log:', error);
      toast.error('Kunde inte registrera material');
    }
  };

  const handleAddExpenseLog = async () => {
    if (!job || !expenseFormData.category) {
      toast.error('Ange kategori');
      return;
    }
    
    // For mileage, calculate from km, otherwise use amount
    const isMileage = expenseFormData.category.toLowerCase() === 'milersättning';
    let finalAmount = 0;
    
    if (isMileage) {
      if (!expenseFormData.km) {
        toast.error('Ange antal mil');
        return;
      }
      finalAmount = parseFloat(expenseFormData.km) * MILEAGE_RATE;
    } else {
      if (!expenseFormData.amount) {
        toast.error('Ange belopp');
        return;
      }
      finalAmount = parseFloat(expenseFormData.amount);
    }
    
    try {
      const note = isMileage 
        ? `${expenseFormData.km} mil @ ${MILEAGE_RATE} kr/mil${expenseFormData.note ? ` - ${expenseFormData.note}` : ''}`
        : expenseFormData.note;
        
      await createExpenseEntry({
        job_id: job.id,
        category: expenseFormData.category,
        amount: finalAmount,
        note: note
      });
      
      // Refresh expense logs
      const updatedLogs = await fetchExpenseLogs(job.id);
      setExpenseLogs(updatedLogs);
      
      // Reset form
      setExpenseFormData({ category: '', amount: '', note: '', km: '' });
      setShowExpenseForm(false);
      toast.success('Utlägg registrerat!');
    } catch (error) {
      console.error('Error adding expense log:', error);
      toast.error('Kunde inte registrera utlägg');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Pågår';
      case 'assigned': return 'Tilldelad';
      case 'paused': return 'Pausad';
      case 'completed': return 'Färdig';
      default: return status;
    }
  };

  const totalHours = timeLogs?.reduce((sum, log) => sum + (log.hours || log.manual_hours || 0), 0) || 0;
  const totalMaterialCost = materialLogs?.reduce((sum, log) => sum + ((log.qty * (log.unit_price || 0))), 0) || 0;
  const totalExpenses = expenseLogs?.reduce((sum, log) => sum + log.amount, 0) || 0;

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
          <Button onClick={() => navigate('/worker/jobs')}>
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/worker/jobs')} className="mt-0.5">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Tillbaka</span>
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
          {job.status === 'assigned' && (
            <>
              <Button onClick={handleStartJob} disabled={actionLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Starta jobb
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowOnWayDialog(true)} 
                disabled={actionLoading} 
                className="w-full sm:w-auto" 
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Jag är på väg
              </Button>
            </>
          )}
          
          {job.status === 'in_progress' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowOnWayDialog(true)} 
                disabled={actionLoading} 
                className="w-full sm:w-auto" 
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Jag är på väg
              </Button>
              <Button variant="outline" onClick={handlePauseJob} disabled={actionLoading} className="w-full sm:w-auto" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pausa
              </Button>
              <Button onClick={handleCompleteJob} disabled={actionLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" size="lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Markera färdig
              </Button>
            </>
          )}
          
          {job.status === 'paused' && (
            <>
              <Button onClick={handleStartJob} disabled={actionLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Fortsätt
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowOnWayDialog(true)} 
                disabled={actionLoading} 
                className="w-full sm:w-auto" 
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Jag är på väg
              </Button>
            </>
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
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Namn</p>
                  <p className="mt-1 text-foreground font-medium">
                    {job.customer.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Telefon</p>
                  <p className="mt-1 text-foreground">
                    <a href={`tel:${job.customer.phone}`} className="text-primary hover:underline">
                      {job.customer.phone || 'Ej angivet'}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">E-post</p>
                  <p className="mt-1 text-foreground">
                    <a href={`mailto:${job.customer.email}`} className="text-primary hover:underline truncate block">
                      {job.customer.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adress</p>
                  <p className="mt-1 text-foreground">
                    {job.address || 'Ej angivet'}
                  </p>
                  <p className="text-foreground">
                    {job.postal_code && job.city ? `${job.postal_code} ${job.city}` : ''}
                  </p>
                </div>
              </>
            )}
            {!job.customer && (
              <p className="text-muted-foreground">Kundinformation saknas</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Jobbinfo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Beskrivning</p>
              <p className="mt-1 text-foreground">
                {job.description || 'Ingen beskrivning'}
              </p>
            </div>
            {job.start_scheduled_at && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Planerad start</p>
                <p className="mt-1">
                  {format(new Date(job.start_scheduled_at), 'dd MMM yyyy HH:mm', { locale: sv })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Registrerat arbete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timmar</p>
              <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</p>
            </div>
            {totalMaterialCost > 0 && (
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Material</p>
                <p className="font-semibold">{totalMaterialCost.toFixed(0)} kr</p>
              </div>
            )}
            {totalExpenses > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Utlägg</p>
                <p className="font-semibold">{totalExpenses.toFixed(0)} kr</p>
              </div>
            )}
            {(totalMaterialCost > 0 || totalExpenses > 0) && (
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totalt extra</p>
                <p className="text-lg font-bold text-orange-600">
                  {(totalMaterialCost + totalExpenses).toFixed(0)} kr
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-12">
          <TabsTrigger value="time" className="text-xs sm:text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Tid ({timeLogs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="materials" className="text-xs sm:text-sm">
            <Package className="w-4 h-4 mr-1" />
            Material ({materialLogs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm">
            <Receipt className="w-4 h-4 mr-1" />
            Utlägg ({expenseLogs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="photos" className="text-xs sm:text-sm">
            <Camera className="w-4 h-4 mr-1" />
            Foton
          </TabsTrigger>
          <TabsTrigger value="signatures" className="text-xs sm:text-sm">
            <FileSignature className="w-4 h-4 mr-1" />
            Signatur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Tidslogg</CardTitle>
                <Button onClick={() => setShowTimeForm(!showTimeForm)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Lägg till tid
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showTimeForm && (
                <div className="border rounded-lg p-4 mb-4 space-y-4 bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Antal timmar *</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      placeholder="Ex: 4.5"
                      value={timeFormData.hours}
                      onChange={(e) => setTimeFormData({ ...timeFormData, hours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Notering</Label>
                    <Textarea
                      id="note"
                      placeholder="Beskriv arbetet..."
                      value={timeFormData.note}
                      onChange={(e) => setTimeFormData({ ...timeFormData, note: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddTimeLog} className="flex-1">Spara</Button>
                    <Button variant="outline" onClick={() => setShowTimeForm(false)}>Avbryt</Button>
                  </div>
                </div>
              )}
              
              {timeLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Ingen tid registrerad ännu</p>
              ) : (
                <div className="space-y-2">
                  {timeLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{(log.hours || log.manual_hours || 0).toFixed(1)} timmar</p>
                          {log.note && <p className="text-sm text-muted-foreground">{log.note}</p>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'dd MMM yyyy', { locale: sv })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Material</CardTitle>
                <Button onClick={() => setShowMaterialForm(!showMaterialForm)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Lägg till material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showMaterialForm && (
                <div className="border rounded-lg p-4 mb-4 space-y-4 bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="material-name">Materialnamn *</Label>
                    <Input
                      id="material-name"
                      placeholder="Ex: Kakel 30x60"
                      value={materialFormData.name}
                      onChange={(e) => setMaterialFormData({ ...materialFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qty">Antal *</Label>
                      <Input
                        id="qty"
                        type="number"
                        step="1"
                        placeholder="Ex: 15"
                        value={materialFormData.qty}
                        onChange={(e) => setMaterialFormData({ ...materialFormData, qty: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit-price">Pris/st (kr)</Label>
                      <Input
                        id="unit-price"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 125.50"
                        value={materialFormData.unit_price}
                        onChange={(e) => setMaterialFormData({ ...materialFormData, unit_price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Leverantör</Label>
                    <Input
                      id="supplier"
                      placeholder="Ex: Beijer"
                      value={materialFormData.supplier}
                      onChange={(e) => setMaterialFormData({ ...materialFormData, supplier: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddMaterialLog} className="flex-1">Spara</Button>
                    <Button variant="outline" onClick={() => setShowMaterialForm(false)}>Avbryt</Button>
                  </div>
                </div>
              )}
              
              {materialLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Inget material registrerat ännu</p>
              ) : (
                <div className="space-y-2">
                  {materialLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.qty} st {log.supplier ? `- ${log.supplier}` : ''}
                          </p>
                        </div>
                        <p className="font-semibold">{((log.qty * (log.unit_price || 0))).toFixed(0)} kr</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Utlägg</CardTitle>
                <Button onClick={() => setShowExpenseForm(!showExpenseForm)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Lägg till utlägg
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showExpenseForm && (
                <div className="border rounded-lg p-4 mb-4 space-y-4 bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <select
                      id="category"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={expenseFormData.category}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
                    >
                      <option value="">Välj kategori...</option>
                      <option value="Milersättning">Milersättning</option>
                      <option value="Bensin">Bensin</option>
                      <option value="Parkering">Parkering</option>
                      <option value="Material">Material</option>
                      <option value="Övrigt">Övrigt</option>
                    </select>
                  </div>
                  
                  {expenseFormData.category.toLowerCase() === 'milersättning' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="km">Antal mil *</Label>
                        <Input
                          id="km"
                          type="number"
                          step="1"
                          placeholder="Ex: 25"
                          value={expenseFormData.km}
                          onChange={(e) => setExpenseFormData({ ...expenseFormData, km: e.target.value })}
                        />
                        {expenseFormData.km && (
                          <p className="text-sm text-muted-foreground">
                            = {(parseFloat(expenseFormData.km) * MILEAGE_RATE).toFixed(2)} kr ({MILEAGE_RATE} kr/mil)
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Belopp (kr) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 250"
                        value={expenseFormData.amount}
                        onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="expense-note">Notering</Label>
                    <Textarea
                      id="expense-note"
                      placeholder="Beskriv utlägget..."
                      value={expenseFormData.note}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, note: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddExpenseLog} className="flex-1">Spara</Button>
                    <Button variant="outline" onClick={() => setShowExpenseForm(false)}>Avbryt</Button>
                  </div>
                </div>
              )}
              
              {expenseLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Inga utlägg registrerade ännu</p>
              ) : (
                <div className="space-y-2">
                  {expenseLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.category || 'Övrigt'}</p>
                          {log.note && <p className="text-sm text-muted-foreground">{log.note}</p>}
                        </div>
                        <p className="font-semibold">{log.amount.toFixed(0)} kr</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <div className="space-y-4">
            {/* Worker photos - uploaded after job completion */}
            <JobPhotoUpload 
              jobId={job.id} 
              photos={jobPhotos} 
              onPhotosUpdate={loadJobPhotos}
            />
            
            {/* Customer photos - from booking */}
            {jobImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Bilder från bokning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {jobImages.map((imageUrl: string, index: number) => (
                      <a
                        key={index}
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:border-primary transition-colors"
                      >
                        <img
                          src={imageUrl}
                          alt={`Jobbild ${index + 1}`}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="signatures">
          <Card>
            <CardContent className="p-8 text-center">
              <FileSignature className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Signaturfunktion</h3>
              <p className="text-muted-foreground">
                Funktionen för kundsignatur kommer snart.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* On Way Confirmation Dialog */}
      <AlertDialog open={showOnWayDialog} onOpenChange={setShowOnWayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skicka notis till kund?</AlertDialogTitle>
            <AlertDialogDescription>
              Kunden kommer att få ett mail som informerar att du är på väg till adressen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleOnWayConfirm} disabled={actionLoading}>
              Skicka notis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobDetail;