import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Euro, 
  Calendar,
  Play,
  Pause,
  CheckCircle,
  Plus,
  Timer,
  Package,
  Receipt,
  Camera,
  FileSignature
} from 'lucide-react';
import { 
  fetchJobById, 
  updateJobStatus, 
  completeJob,
  createTimeEntry,
  createMaterialEntry,
  createExpenseEntry,
  fetchTimeLogs,
  fetchMaterialLogs,
  fetchExpenseLogs
} from '@/lib/api/jobs';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTimer, setActiveTimer] = useState<{
    startedAt: Date;
    jobId: string;
  } | null>(null);

  const { data: job, refetch } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId!),
    enabled: !!jobId,
  });

  const { data: timeLogs, refetch: refetchTimeLogs } = useQuery({
    queryKey: ['time-logs', jobId],
    queryFn: () => fetchTimeLogs(jobId!),
    enabled: !!jobId,
  });

  const { data: materialLogs, refetch: refetchMaterialLogs } = useQuery({
    queryKey: ['material-logs', jobId],
    queryFn: () => fetchMaterialLogs(jobId!),
    enabled: !!jobId,
  });

  const { data: expenseLogs, refetch: refetchExpenseLogs } = useQuery({
    queryKey: ['expense-logs', jobId],
    queryFn: () => fetchExpenseLogs(jobId!),
    enabled: !!jobId,
  });

  // Real-time updates
  useJobsRealtime(() => {
    refetch();
    refetchTimeLogs();
    refetchMaterialLogs();
    refetchExpenseLogs();
  });

  const statusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: string }) => 
      updateJobStatus(jobId, status),
    onSuccess: () => {
      toast.success('Status uppdaterad');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['worker-my-jobs'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunde inte uppdatera status');
    },
  });

  const completeJobMutation = useMutation({
    mutationFn: completeJob,
    onSuccess: () => {
      toast.success('Jobbet markerat som färdigt');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['worker-my-jobs'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunde inte markera jobbet som färdigt');
    },
  });

  const timeEntryMutation = useMutation({
    mutationFn: createTimeEntry,
    onSuccess: () => {
      toast.success('Tid registrerad');
      refetchTimeLogs();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunde inte registrera tid');
    },
  });

  const materialEntryMutation = useMutation({
    mutationFn: createMaterialEntry,
    onSuccess: () => {
      toast.success('Material registrerat');
      refetchMaterialLogs();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunde inte registrera material');
    },
  });

  const expenseEntryMutation = useMutation({
    mutationFn: createExpenseEntry,
    onSuccess: () => {
      toast.success('Utlägg registrerat');
      refetchExpenseLogs();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunde inte registrera utlägg');
    },
  });

  const handleStartTimer = () => {
    if (!job) return;
    setActiveTimer({
      startedAt: new Date(),
      jobId: job.id
    });
    statusMutation.mutate({ jobId: job.id, status: 'in_progress' });
  };

  const handleStopTimer = () => {
    if (!activeTimer || !job) return;
    
    const endTime = new Date();
    const startTime = activeTimer.startedAt;
    
    timeEntryMutation.mutate({
      job_id: job.id,
      started_at: startTime.toISOString(),
      ended_at: endTime.toISOString(),
      break_min: 0,
      note: 'Automatisk tidrapportering'
    });
    
    setActiveTimer(null);
  };

  const handlePauseJob = () => {
    if (!job) return;
    handleStopTimer();
    statusMutation.mutate({ jobId: job.id, status: 'paused' });
  };

  const handleCompleteJob = () => {
    if (!job) return;
    if (activeTimer) {
      handleStopTimer();
    }
    completeJobMutation.mutate(job.id);
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

  if (!job) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
        
        {/* Action buttons - Mobile optimized */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {job.status === 'assigned' && (
            <Button onClick={handleStartTimer} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Starta jobb
            </Button>
          )}
          
          {job.status === 'in_progress' && (
            <>
              <Button variant="outline" onClick={handlePauseJob} className="w-full sm:w-auto" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pausa
              </Button>
              <Button onClick={handleCompleteJob} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" size="lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Markera färdig
              </Button>
            </>
          )}
          
          {job.status === 'paused' && (
            <Button onClick={handleStartTimer} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Fortsätt
            </Button>
          )}
        </div>
      </div>

      {/* Active Timer Display */}
      {activeTimer && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <span className="font-medium text-green-800">Timer aktiv</span>
                  <div className="text-sm text-green-600">
                    Startad: {format(activeTimer.startedAt, 'HH:mm')}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={handleStopTimer} variant="outline" className="w-full sm:w-auto">
                <Timer className="w-4 h-4 mr-2" />
                Stoppa timer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Info Cards - Mobile optimized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Jobbinfo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Beskrivning</Label>
              <p className="mt-1 text-foreground">
                {job.description || 'Ingen beskrivning'}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prissättning</Label>
              <p className="mt-1 text-lg font-bold text-primary">
                {job.pricing_mode === 'hourly' 
                  ? `${job.hourly_rate} kr/h`
                  : `${job.fixed_price} kr (fast)`
                }
              </p>
            </div>
            {job.start_scheduled_at && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Planerad start</Label>
                <p className="mt-1">
                  {format(new Date(job.start_scheduled_at), 'dd MMM yyyy HH:mm', { locale: sv })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tid & Timmar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totala timmar</Label>
              <p className="text-2xl font-bold text-blue-600 mt-1">{totalHours.toFixed(1)}h</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Uppskattad kostnad</Label>
              <p className="text-lg font-semibold text-green-600 mt-1">
                {job.pricing_mode === 'hourly' 
                  ? `${(totalHours * (job.hourly_rate || 0)).toFixed(0)} kr`
                  : `${job.fixed_price} kr`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kostnader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Material</Label>
              <p className="font-semibold">{totalMaterialCost.toFixed(0)} kr</p>
            </div>
            <div className="flex justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Utlägg</Label>
              <p className="font-semibold">{totalExpenses.toFixed(0)} kr</p>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Totalt extra</Label>
              <p className="text-lg font-bold text-orange-600">
                {(totalMaterialCost + totalExpenses).toFixed(0)} kr
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Time, Materials, Expenses - Mobile optimized */}
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
          <TimeLogsTab 
            jobId={job.id}
            timeLogs={timeLogs || []}
            onAddTime={timeEntryMutation.mutate}
          />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialLogsTab 
            jobId={job.id}
            materialLogs={materialLogs || []}
            onAddMaterial={materialEntryMutation.mutate}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseLogsTab 
            jobId={job.id}
            expenseLogs={expenseLogs || []}
            onAddExpense={expenseEntryMutation.mutate}
          />
        </TabsContent>

        <TabsContent value="photos">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Funktionen för foton kommer snart...</p>
          </div>
        </TabsContent>

        <TabsContent value="signatures">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Funktionen för signaturer kommer snart...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Time Logs Tab Component - Mobile optimized
const TimeLogsTab = ({ jobId, timeLogs, onAddTime }: any) => {
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [timeForm, setTimeForm] = useState({
    manual_hours: '',
    note: ''
  });

  const handleAddTime = () => {
    onAddTime({
      job_id: jobId,
      manual_hours: parseFloat(timeForm.manual_hours),
      note: timeForm.note
    });
    setTimeForm({ manual_hours: '', note: '' });
    setIsAddingTime(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Tidslogg</CardTitle>
        <Dialog open={isAddingTime} onOpenChange={setIsAddingTime}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Lägg till tid</span>
              <span className="sm:hidden">Tid</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lägg till arbetstid</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Antal timmar</Label>
                <Input
                  type="number"
                  step="0.25"
                  value={timeForm.manual_hours}
                  onChange={(e) => setTimeForm({ ...timeForm, manual_hours: e.target.value })}
                  placeholder="t.ex. 2.5"
                  className="text-lg h-12 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Använd 0.25 för 15 min, 0.5 för 30 min</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Vad gjorde du?</Label>
                <Textarea
                  value={timeForm.note}
                  onChange={(e) => setTimeForm({ ...timeForm, note: e.target.value })}
                  placeholder="Beskriv vad du arbetade med..."
                  className="mt-2 min-h-[80px]"
                />
              </div>
              <Button onClick={handleAddTime} className="w-full h-12" disabled={!timeForm.manual_hours}>
                <Plus className="w-4 h-4 mr-2" />
                Lägg till tid
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {timeLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ingen tid registrerad än</p>
            <p className="text-sm mt-1">Tryck på knappen ovan för att lägga till arbetstid</p>
          </div>
        ) : (
          <div className="space-y-3">
            {timeLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-start p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-white">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-lg text-purple-900">
                      {log.hours ? `${log.hours.toFixed(1)}h` : `${log.manual_hours}h`}
                    </span>
                    {!log.hours && (
                      <Badge variant="secondary" className="text-xs">Manuell</Badge>
                    )}
                  </div>
                  {log.note && (
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{log.note}</p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: sv })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Material Logs Tab Component - Mobile optimized
const MaterialLogsTab = ({ jobId, materialLogs, onAddMaterial }: any) => {
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    qty: '',
    unit_price: '',
    supplier: '',
    sku: ''
  });

  const handleAddMaterial = () => {
    onAddMaterial({
      job_id: jobId,
      name: materialForm.name,
      qty: parseFloat(materialForm.qty),
      unit_price: materialForm.unit_price ? parseFloat(materialForm.unit_price) : undefined,
      supplier: materialForm.supplier,
      sku: materialForm.sku
    });
    setMaterialForm({ name: '', qty: '', unit_price: '', supplier: '', sku: '' });
    setIsAddingMaterial(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Material & Delar</CardTitle>
        <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Lägg till</span>
              <span className="sm:hidden">+</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lägg till material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Artikel/Namn *</Label>
                <Input
                  value={materialForm.name}
                  onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                  placeholder="t.ex. Skruv M6x40, Rör 22mm"
                  className="mt-2 h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Antal *</Label>
                  <Input
                    type="number"
                    value={materialForm.qty}
                    onChange={(e) => setMaterialForm({ ...materialForm, qty: e.target.value })}
                    placeholder="1"
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Pris/st (kr)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={materialForm.unit_price}
                    onChange={(e) => setMaterialForm({ ...materialForm, unit_price: e.target.value })}
                    placeholder="12.50"
                    className="mt-2 h-12"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Leverantör</Label>
                <Input
                  value={materialForm.supplier}
                  onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                  placeholder="t.ex. Beijer, XL-BYGG"
                  className="mt-2 h-12"
                />
              </div>
              <Button 
                onClick={handleAddMaterial} 
                className="w-full h-12" 
                disabled={!materialForm.name || !materialForm.qty}
              >
                <Package className="w-4 h-4 mr-2" />
                Lägg till material
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {materialLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Inget material registrerat än</p>
            <p className="text-sm mt-1">Registrera material och delar du använder</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materialLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-start p-4 border rounded-lg bg-gradient-to-r from-green-50 to-white">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">{log.name}</h4>
                      <div className="text-sm text-green-700 mt-1">
                        <span className="font-medium">{log.qty} st</span>
                        {log.unit_price && <span> × {log.unit_price} kr</span>}
                        {log.supplier && <span className="text-muted-foreground"> ({log.supplier})</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: sv })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-800">
                        {log.unit_price ? `${(log.qty * log.unit_price).toFixed(0)} kr` : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Expense Logs Tab Component - Mobile optimized
const ExpenseLogsTab = ({ jobId, expenseLogs, onAddExpense }: any) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: '',
    note: ''
  });

  const categories = ['Resa', 'Parkering', 'Verktyg', 'Konsumtion', 'Övrigt'];

  const handleAddExpense = () => {
    onAddExpense({
      job_id: jobId,
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      note: expenseForm.note
    });
    setExpenseForm({ category: '', amount: '', note: '' });
    setIsAddingExpense(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Utlägg & Kostnader</CardTitle>
        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Lägg till</span>
              <span className="sm:hidden">+</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lägg till utlägg</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Kategori</Label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full mt-2 h-12 px-3 border border-input bg-background rounded-md"
                >
                  <option value="">Välj kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Belopp (kr) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="125.50"
                  className="mt-2 h-12 text-lg"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Beskrivning</Label>
                <Textarea
                  value={expenseForm.note}
                  onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                  placeholder="Vad var utlägget för?"
                  className="mt-2 min-h-[80px]"
                />
              </div>
              <Button onClick={handleAddExpense} className="w-full h-12" disabled={!expenseForm.amount}>
                <Receipt className="w-4 h-4 mr-2" />
                Lägg till utlägg
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {expenseLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Inga utlägg registrerade än</p>
            <p className="text-sm mt-1">Registrera resor, verktyg och andra kostnader</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenseLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-start p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-white">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Receipt className="w-4 h-4 text-orange-600" />
                        <h4 className="font-medium text-orange-900">{log.category || 'Övrigt'}</h4>
                      </div>
                      {log.note && (
                        <p className="text-sm text-orange-700 mb-2">{log.note}</p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: sv })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-orange-800">{log.amount} kr</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobDetail;