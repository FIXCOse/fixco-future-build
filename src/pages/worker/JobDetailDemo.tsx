import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const JobDetailDemo = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [activeTimer, setActiveTimer] = useState<{
    startedAt: Date;
    jobId: string;
  } | null>(null);

  // Mock job data based on jobId
  const mockJobs = {
    '1': {
      id: '1',
      title: 'Elinstallation villa',
      description: 'Installation av ny elcentral och uttag i villa på 120 kvm',
      address: 'Storgatan 12',
      city: 'Stockholm',
      postal_code: '11122',
      pricing_mode: 'hourly',
      hourly_rate: 650,
      estimated_hours: 8,
      status: 'in_progress',
      created_at: '2024-01-15T08:00:00Z',
      start_scheduled_at: '2024-01-15T08:00:00Z'
    },
    '2': {
      id: '2',
      title: 'Lampinstallation kontor',
      description: 'Byte av taklampor i kontorslokal, 15 st LED-armaturer',
      address: 'Kungsgatan 45',
      city: 'Stockholm',
      postal_code: '11143',
      pricing_mode: 'fixed',
      fixed_price: 4500,
      status: 'assigned',
      created_at: '2024-01-14T14:30:00Z',
      start_scheduled_at: '2024-01-15T09:00:00Z'
    },
    '3': {
      id: '3',
      title: 'Elfel felsökning',
      description: 'Felsökning av elfel i kök, troligen kortslutning',
      address: 'Vasagatan 8',
      city: 'Stockholm',
      postal_code: '11120',
      pricing_mode: 'hourly',
      hourly_rate: 750,
      estimated_hours: 3,
      status: 'paused',
      created_at: '2024-01-13T09:15:00Z'
    },
    '4': {
      id: '4',
      title: 'Värmepump installation',
      description: 'Installation av bergvärmepump för villa, inkl. elarbete',
      address: 'Östermalms torg 1',
      city: 'Stockholm',
      postal_code: '11442',
      pricing_mode: 'fixed',
      fixed_price: 12000,
      status: 'completed',
      created_at: '2024-01-12T16:20:00Z'
    }
  };

  const job = mockJobs[jobId as keyof typeof mockJobs];

  // Mock time logs
  const timeLogs = [
    {
      id: '1',
      job_id: jobId,
      started_at: '2024-01-15T08:00:00Z',
      ended_at: '2024-01-15T12:00:00Z',
      hours: 4,
      note: 'Installation av elcentral'
    },
    {
      id: '2',
      job_id: jobId,
      manual_hours: 2.5,
      note: 'Kabeldraging och uttag'
    }
  ];

  // Mock material logs
  const materialLogs = [
    {
      id: '1',
      job_id: jobId,
      description: 'Elcentral 400A',
      qty: 1,
      unit: 'st',
      unit_price: 1200,
      note: 'Huvudcentral'
    },
    {
      id: '2',
      job_id: jobId,
      description: 'Kabel 5x2.5mm',
      qty: 50,
      unit: 'm',
      unit_price: 15,
      note: 'Matarkabel'
    }
  ];

  // Mock expense logs
  const expenseLogs = [
    {
      id: '1',
      job_id: jobId,
      description: 'Parkering',
      amount: 50,
      receipt_url: null
    },
    {
      id: '2',
      job_id: jobId,
      description: 'Fika för kund',
      amount: 120,
      receipt_url: null
    }
  ];

  const handleStartTimer = () => {
    if (!job) return;
    setActiveTimer({
      startedAt: new Date(),
      jobId: job.id
    });
    toast.success('Timer startad!');
  };

  const handleStopTimer = () => {
    if (!activeTimer) return;
    setActiveTimer(null);
    toast.success('Timer stoppad och tid registrerad!');
  };

  const handlePauseJob = () => {
    if (activeTimer) {
      handleStopTimer();
    }
    toast.success('Jobb pausat!');
  };

  const handleCompleteJob = () => {
    if (activeTimer) {
      handleStopTimer();
    }
    toast.success('Jobb markerat som färdigt!');
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Jobb ej hittat</h2>
          <p className="text-muted-foreground mb-4">Det begärda jobbet finns inte i demon.</p>
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
                  ? `${(job as any).hourly_rate} kr/h`
                  : `${(job as any).fixed_price} kr (fast)`
                }
              </p>
            </div>
            {(job as any).start_scheduled_at && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Planerad start</Label>
                <p className="mt-1">
                  {format(new Date((job as any).start_scheduled_at), 'dd MMM yyyy HH:mm', { locale: sv })}
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
                  ? `${(totalHours * ((job as any).hourly_rate || 0)).toFixed(0)} kr`
                  : `${(job as any).fixed_price} kr`
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
          <TimeLogsTab timeLogs={timeLogs} />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialLogsTab materialLogs={materialLogs} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseLogsTab expenseLogs={expenseLogs} />
        </TabsContent>

        <TabsContent value="photos">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Fotofunktion</h3>
                <p className="text-muted-foreground">
                  I fullversionen kan du ladda upp foton från jobbet här.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signatures">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <FileSignature className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Signaturfunktion</h3>
                <p className="text-muted-foreground">
                  I fullversionen kan kunden signera här när jobbet är klart.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Time Logs Tab Component - Mobile optimized
const TimeLogsTab = ({ timeLogs }: any) => {
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [timeForm, setTimeForm] = useState({
    manual_hours: '',
    note: ''
  });

  const handleAddTime = () => {
    toast.success('Tid tillagd! (Demo mode)');
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
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setIsAddingTime(false)} variant="outline" className="flex-1">
                  Avbryt
                </Button>
                <Button onClick={handleAddTime} className="flex-1" disabled={!timeForm.manual_hours}>
                  Lägg till
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {timeLogs.map((log: any, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-accent/20 rounded-lg gap-2">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">
                    {log.hours ? `${log.hours}h` : `${log.manual_hours}h`}
                  </span>
                  {log.started_at && log.ended_at && (
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.started_at), 'HH:mm', { locale: sv })} - 
                      {format(new Date(log.ended_at), 'HH:mm', { locale: sv })}
                    </span>
                  )}
                </div>
                {log.note && (
                  <p className="text-sm text-muted-foreground mt-1 ml-7">{log.note}</p>
                )}
              </div>
            </div>
          ))}
          {timeLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ingen tid registrerad än</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Material Logs Tab Component - Mobile optimized
const MaterialLogsTab = ({ materialLogs }: any) => {
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    description: '',
    qty: '',
    unit: 'st',
    unit_price: '',
    note: ''
  });

  const handleAddMaterial = () => {
    toast.success('Material tillagt! (Demo mode)');
    setMaterialForm({ description: '', qty: '', unit: 'st', unit_price: '', note: '' });
    setIsAddingMaterial(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Materiallogg</CardTitle>
        <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Lägg till material</span>
              <span className="sm:hidden">Material</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lägg till material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Beskrivning</Label>
                <Input
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  placeholder="t.ex. Kabel 2.5mm"
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Antal</Label>
                  <Input
                    type="number"
                    value={materialForm.qty}
                    onChange={(e) => setMaterialForm({ ...materialForm, qty: e.target.value })}
                    placeholder="10"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Enhet</Label>
                  <Input
                    value={materialForm.unit}
                    onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })}
                    placeholder="st, m, kg"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Pris per enhet (kr)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={materialForm.unit_price}
                  onChange={(e) => setMaterialForm({ ...materialForm, unit_price: e.target.value })}
                  placeholder="25.50"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Anteckning (valfritt)</Label>
                <Textarea
                  value={materialForm.note}
                  onChange={(e) => setMaterialForm({ ...materialForm, note: e.target.value })}
                  placeholder="Extra information..."
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setIsAddingMaterial(false)} variant="outline" className="flex-1">
                  Avbryt
                </Button>
                <Button onClick={handleAddMaterial} className="flex-1" disabled={!materialForm.description || !materialForm.qty}>
                  Lägg till
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {materialLogs.map((log: any, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-accent/20 rounded-lg gap-2">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">{log.description}</span>
                </div>
                <div className="flex items-center space-x-4 mt-1 ml-7 text-sm text-muted-foreground">
                  <span>{log.qty} {log.unit}</span>
                  <span>×</span>
                  <span>{log.unit_price || 0} kr</span>
                  <span>=</span>
                  <span className="font-medium text-orange-600">
                    {((log.qty || 0) * (log.unit_price || 0)).toFixed(0)} kr
                  </span>
                </div>
                {log.note && (
                  <p className="text-sm text-muted-foreground mt-1 ml-7">{log.note}</p>
                )}
              </div>
            </div>
          ))}
          {materialLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Inget material registrerat än</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Expense Logs Tab Component - Mobile optimized
const ExpenseLogsTab = ({ expenseLogs }: any) => {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: ''
  });

  const handleAddExpense = () => {
    toast.success('Utlägg tillagt! (Demo mode)');
    setExpenseForm({ description: '', amount: '' });
    setIsAddingExpense(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Utläggslogg</CardTitle>
        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Lägg till utlägg</span>
              <span className="sm:hidden">Utlägg</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lägg till utlägg</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Beskrivning</Label>
                <Input
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="t.ex. Parkering, bensin, fika"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Belopp (kr)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="150.00"
                  className="text-lg h-12 mt-2"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setIsAddingExpense(false)} variant="outline" className="flex-1">
                  Avbryt
                </Button>
                <Button onClick={handleAddExpense} className="flex-1" disabled={!expenseForm.description || !expenseForm.amount}>
                  Lägg till
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenseLogs.map((log: any, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-accent/20 rounded-lg gap-2">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Receipt className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{log.description}</span>
                </div>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-lg font-bold text-green-600">{log.amount} kr</span>
              </div>
            </div>
          ))}
          {expenseLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Inga utlägg registrerade än</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailDemo;