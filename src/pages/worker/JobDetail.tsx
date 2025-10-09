import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Clock, Play, Pause, CheckCircle, Package, Receipt, Camera, FileSignature } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { fetchJobById, fetchTimeLogs, fetchMaterialLogs, fetchExpenseLogs, updateJobStatus, completeJob } from '@/lib/api/jobs';
import type { Job, TimeLog, MaterialLog, ExpenseLog } from '@/lib/api/jobs';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [materialLogs, setMaterialLogs] = useState<MaterialLog[]>([]);
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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
      } catch (error) {
        console.error('Error loading job:', error);
        toast.error('Kunde inte ladda jobbinformation');
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [jobId]);

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

  const handleCompleteJob = async () => {
    if (!job) return;
    setActionLoading(true);
    try {
      await completeJob(job.id);
      setJob({ ...job, status: 'completed' });
      toast.success('Jobb markerat som färdigt!');
    } catch (error) {
      console.error('Error completing job:', error);
      toast.error('Kunde inte markera jobb som färdigt');
    } finally {
      setActionLoading(false);
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
            <Button onClick={handleStartJob} disabled={actionLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Starta jobb
            </Button>
          )}
          
          {job.status === 'in_progress' && (
            <>
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
            <Button onClick={handleStartJob} disabled={actionLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Fortsätt
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
            <div className="flex justify-between items-center pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Material</p>
              <p className="font-semibold">{totalMaterialCost.toFixed(0)} kr</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Utlägg</p>
              <p className="font-semibold">{totalExpenses.toFixed(0)} kr</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totalt extra</p>
              <p className="text-lg font-bold text-orange-600">
                {(totalMaterialCost + totalExpenses).toFixed(0)} kr
              </p>
            </div>
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
              <CardTitle className="text-lg">Tidslogg</CardTitle>
            </CardHeader>
            <CardContent>
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
              <CardTitle className="text-lg">Material</CardTitle>
            </CardHeader>
            <CardContent>
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
                            {log.qty} {log.sku ? `(${log.sku})` : ''}
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
              <CardTitle className="text-lg">Utlägg</CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardContent className="p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Fotofunktion</h3>
              <p className="text-muted-foreground">
                Funktionen för att ladda upp foton kommer snart.
              </p>
            </CardContent>
          </Card>
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
    </div>
  );
};

export default JobDetail;