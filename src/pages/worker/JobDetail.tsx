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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/worker/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.address}, {job.city}
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
        
        <div className="flex items-center space-x-2">
          {job.status === 'assigned' && (
            <Button onClick={handleStartTimer}>
              <Play className="w-4 h-4 mr-2" />
              Starta jobb
            </Button>
          )}
          
          {job.status === 'in_progress' && (
            <>
              <Button variant="outline" onClick={handlePauseJob}>
                <Pause className="w-4 h-4 mr-2" />
                Pausa
              </Button>
              <Button onClick={handleCompleteJob}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Markera färdig
              </Button>
            </>
          )}
          
          {job.status === 'paused' && (
            <Button onClick={handleStartTimer}>
              <Play className="w-4 h-4 mr-2" />
              Fortsätt
            </Button>
          )}
        </div>
      </div>

      {/* Active Timer Display */}
      {activeTimer && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-green-600" />
                <span className="font-medium">Timer aktiv</span>
                <span className="text-sm text-muted-foreground">
                  Startad: {format(activeTimer.startedAt, 'HH:mm')}
                </span>
              </div>
              <Button size="sm" onClick={handleStopTimer}>
                Stoppa timer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jobbinfo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Beskrivning</Label>
              <p className="text-sm text-muted-foreground">
                {job.description || 'Ingen beskrivning'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Prissättning</Label>
              <p className="text-sm">
                {job.pricing_mode === 'hourly' 
                  ? `${job.hourly_rate} kr/h`
                  : `${job.fixed_price} kr (fast)`
                }
              </p>
            </div>
            {job.start_scheduled_at && (
              <div>
                <Label className="text-sm font-medium">Planerad start</Label>
                <p className="text-sm">
                  {format(new Date(job.start_scheduled_at), 'dd MMM yyyy HH:mm', { locale: sv })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tidssammanfattning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Totala timmar</Label>
              <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Uppskattad kostnad</Label>
              <p className="text-lg">
                {job.pricing_mode === 'hourly' 
                  ? `${(totalHours * (job.hourly_rate || 0)).toFixed(0)} kr`
                  : `${job.fixed_price} kr`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kostnader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Material</Label>
              <p className="text-lg">{totalMaterialCost.toFixed(0)} kr</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Utlägg</Label>
              <p className="text-lg">{totalExpenses.toFixed(0)} kr</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Totalt extra</Label>
              <p className="text-xl font-bold">
                {(totalMaterialCost + totalExpenses).toFixed(0)} kr
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Time, Materials, Expenses */}
      <Tabs defaultValue="time">
        <TabsList>
          <TabsTrigger value="time">
            Tid ({timeLogs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="materials">
            Material ({materialLogs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="expenses">
            Utlägg ({expenseLogs?.length || 0})
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
      </Tabs>
    </div>
  );
};

// Time Logs Tab Component
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tidslogg</CardTitle>
        <Dialog open={isAddingTime} onOpenChange={setIsAddingTime}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Lägg till tid
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lägg till tid</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Timmar</Label>
                <Input
                  type="number"
                  step="0.25"
                  value={timeForm.manual_hours}
                  onChange={(e) => setTimeForm({ ...timeForm, manual_hours: e.target.value })}
                  placeholder="t.ex. 2.5"
                />
              </div>
              <div>
                <Label>Anteckning</Label>
                <Textarea
                  value={timeForm.note}
                  onChange={(e) => setTimeForm({ ...timeForm, note: e.target.value })}
                  placeholder="Vad gjorde du?"
                />
              </div>
              <Button onClick={handleAddTime} className="w-full">
                Lägg till
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {timeLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Ingen tid registrerad än
          </p>
        ) : (
          <div className="space-y-2">
            {timeLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">
                    {log.hours ? `${log.hours.toFixed(1)}h` : `${log.manual_hours}h (manuell)`}
                  </div>
                  {log.note && (
                    <div className="text-sm text-muted-foreground">{log.note}</div>
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

// Material Logs Tab Component
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Material</CardTitle>
        <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Lägg till material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lägg till material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Artikel/Namn</Label>
                <Input
                  value={materialForm.name}
                  onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                  placeholder="t.ex. Skruv M6x40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Antal</Label>
                  <Input
                    type="number"
                    value={materialForm.qty}
                    onChange={(e) => setMaterialForm({ ...materialForm, qty: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Pris per st (kr)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={materialForm.unit_price}
                    onChange={(e) => setMaterialForm({ ...materialForm, unit_price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Leverantör</Label>
                <Input
                  value={materialForm.supplier}
                  onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                  placeholder="t.ex. Beijer Byggmaterial"
                />
              </div>
              <Button onClick={handleAddMaterial} className="w-full">
                Lägg till
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {materialLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Inget material registrerat än
          </p>
        ) : (
          <div className="space-y-2">
            {materialLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{log.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {log.qty} st × {log.unit_price ? `${log.unit_price} kr` : 'okänt pris'}
                    {log.supplier && ` (${log.supplier})`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: sv })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {log.unit_price ? `${(log.qty * log.unit_price).toFixed(0)} kr` : '-'}
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

// Expense Logs Tab Component
const ExpenseLogsTab = ({ jobId, expenseLogs, onAddExpense }: any) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: '',
    note: ''
  });

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Utlägg</CardTitle>
        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Lägg till utlägg
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lägg till utlägg</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <Input
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  placeholder="t.ex. Resa, Verktyg, Övrigt"
                />
              </div>
              <div>
                <Label>Belopp (kr)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                />
              </div>
              <div>
                <Label>Beskrivning</Label>
                <Textarea
                  value={expenseForm.note}
                  onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                  placeholder="Vad var utlägget för?"
                />
              </div>
              <Button onClick={handleAddExpense} className="w-full">
                Lägg till
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {expenseLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Inga utlägg registrerade än
          </p>
        ) : (
          <div className="space-y-2">
            {expenseLogs.map((log: any) => (
              <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{log.category || 'Övrigt'}</div>
                  {log.note && (
                    <div className="text-sm text-muted-foreground">{log.note}</div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: sv })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{log.amount} kr</div>
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