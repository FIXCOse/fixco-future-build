import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Eye, Edit, UserPlus, DollarSign, FileText, Trash2, X, Gift, Clock } from 'lucide-react';
import { useJobsData } from '@/hooks/useJobsData';
import { useUsersData } from '@/hooks/useUsersData';
import { createJobFromBooking, createJobFromQuote, assignJobToWorker, updateJobStatus, prepareInvoiceFromJob } from '@/lib/api/jobs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobPricingModal } from '@/components/admin/JobPricingModal';

interface Job {
  id: string;
  title: string;
  status: string;
  customer_id: string;
  assigned_worker_id: string | null;
  pricing_mode: string;
  hourly_rate: number | null;
  fixed_price: number | null;
  admin_set_price?: number;
  bonus_amount?: number;
  address: string;
  created_at: string;
  due_date: string | null;
}

const AdminJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [jobForPricing, setJobForPricing] = useState<Job | null>(null);
  const { jobs, loading } = useJobsData();
  const { users } = useUsersData();
  const { toast } = useToast();

  // Filter workers from users
  const workers = users.filter(u => u.role === 'worker');

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const isNotDeleted = !job.deleted_at;
    return matchesSearch && matchesStatus && isNotDeleted;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pool': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'invoiced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignWorker = async () => {
    if (!selectedJob || !selectedWorker) return;
    
    try {
      await assignJobToWorker(selectedJob.id, selectedWorker);
      toast({ title: "Arbetare tilldelad", description: "Jobbet har tilldelats arbetaren." });
      setIsAssignDialogOpen(false);
      setSelectedWorker('');
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte tilldela arbetare.", variant: "destructive" });
    }
  };

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast({ title: "Status uppdaterad", description: `Jobb status ändrad till ${newStatus}.` });
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte uppdatera status.", variant: "destructive" });
    }
  };

  const handlePrepareInvoice = async (jobId: string) => {
    try {
      const data = await prepareInvoiceFromJob(jobId);
      setInvoiceData(data);
      toast({ title: "Faktura förberedd", description: "Fakturadata har hämtats från jobbet." });
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte förbereda faktura.", variant: "destructive" });
    }
  };

  const handleSoftDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({ title: "Jobb borttaget", description: "Jobbet har flyttats till papperskorgen." });
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte ta bort jobbet.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar jobb...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobb Administration</h1>
          <p className="text-muted-foreground">Hantera alla jobb och tilldelningar</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/admin/jobs/trash'}>
          <Trash2 className="h-4 w-4 mr-2" />
          Papperskorg
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sök jobb..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrera status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla status</SelectItem>
                <SelectItem value="pool">Pool</SelectItem>
                <SelectItem value="assigned">Tilldelad</SelectItem>
                <SelectItem value="in_progress">Pågående</SelectItem>
                <SelectItem value="completed">Slutförd</SelectItem>
                <SelectItem value="invoiced">Fakturerad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{job.title || 'Inget titel'}</CardTitle>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>{job.address}</p>
                <p>Skapad: {new Date(job.created_at).toLocaleDateString('sv-SE')}</p>
                {job.due_date && <p>Förfaller: {new Date(job.due_date).toLocaleDateString('sv-SE')}</p>}
              </div>

              {/* Worker Compensation - Show as EXTRA BONUS */}
              {Number(job.admin_set_price) > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-100 border-2 border-green-500 rounded-lg px-3 py-2">
                  <Gift className="w-6 h-6 text-green-600 animate-pulse flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-800 uppercase">EXTRA BONUS</p>
                    <p className="text-xl font-black text-green-900">+{job.admin_set_price} kr</p>
                  </div>
                </div>
              )}

              {/* Bonus Display */}
              {Number(job.bonus_amount) > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-100 border-2 border-green-500 rounded-lg px-3 py-2">
                  <Gift className="w-6 h-6 text-green-600 animate-pulse flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-800 uppercase">EXTRA BONUS</p>
                    <p className="text-xl font-black text-green-900">+{job.bonus_amount} kr</p>
                  </div>
                </div>
              )}

              <div className="text-sm space-y-1">
                {job.pricing_mode === 'hourly' && Number(job.hourly_rate) > 0 && (
                  <p><strong>Timpris:</strong> {job.hourly_rate} kr/h</p>
                )}
                {job.pricing_mode === 'fixed' && Number(job.fixed_price) > 0 && (
                  <p><strong>Fast pris:</strong> {job.fixed_price} kr</p>
                )}
                {job.assigned_worker_id && (
                  <p><strong>Arbetare:</strong> {workers.find(w => w.id === job.assigned_worker_id)?.first_name || 'Okänd'}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setJobForPricing(job);
                    setPricingModalOpen(true);
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Ersättning & Bonus
                </Button>

                {!job.assigned_worker_id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsAssignDialogOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Tilldela
                  </Button>
                )}

                {job.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrepareInvoice(job.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Faktura
                  </Button>
                )}

                <Select onValueChange={(status) => handleStatusUpdate(job.id, status)}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pool">Pool</SelectItem>
                    <SelectItem value="assigned">Tilldelad</SelectItem>
                    <SelectItem value="in_progress">Pågående</SelectItem>
                    <SelectItem value="completed">Slutförd</SelectItem>
                    <SelectItem value="invoiced">Fakturerad</SelectItem>
                    <SelectItem value="cancelled">Avbruten</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleSoftDeleteJob(job.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Ta bort
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Inga jobb hittades med de valda filtren.</p>
          </CardContent>
        </Card>
      )}

      {/* Assign Worker Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilldela Arbetare</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Välj arbetare</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en arbetare" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.first_name} {worker.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleAssignWorker} disabled={!selectedWorker}>
                Tilldela
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Data Dialog */}
      {invoiceData && (
        <Dialog open={!!invoiceData} onOpenChange={() => setInvoiceData(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Fakturadata</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Timmar:</strong> {invoiceData.hours} h</p>
                <p><strong>Material:</strong> {invoiceData.materials} kr</p>
                <p><strong>Utlägg:</strong> {invoiceData.expenses} kr</p>
                <p><strong>Subtotal:</strong> {invoiceData.subtotal} kr</p>
                <p><strong>Prissättning:</strong> {invoiceData.pricing_mode}</p>
                {invoiceData.pricing_mode === 'hourly' && (
                  <p><strong>Timpris:</strong> {invoiceData.hourly_rate} kr/h</p>
                )}
                {invoiceData.pricing_mode === 'fixed' && (
                  <p><strong>Fast pris:</strong> {invoiceData.fixed_price} kr</p>
                )}
              </div>
              <Button onClick={() => setInvoiceData(null)}>
                Stäng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Job Pricing Modal */}
      <JobPricingModal
        job={jobForPricing}
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        onSuccess={() => {
          // Jobs will auto-refresh via realtime subscription
          setPricingModalOpen(false);
          setJobForPricing(null);
        }}
      />
    </div>
  );
};

export default AdminJobs;