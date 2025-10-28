import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, User, Phone, Mail, MapPin, Clock, Award } from 'lucide-react';
import { useUsersData } from '@/hooks/useUsersData';
import { useJobsData } from '@/hooks/useJobsData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Worker {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

const AdminWorkers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [workerStats, setWorkerStats] = useState<any>({});
  const { users, loading } = useUsersData();
  const { jobs } = useJobsData();
  const { toast } = useToast();

  // Filter workers from users (users now have role from user_roles table)
  const workers = users.filter(u => u.role === 'worker' || u.role === 'technician');

  // Filter workers based on search
  const filteredWorkers = workers.filter(worker => {
    const fullName = `${worker.first_name} ${worker.last_name}`.toLowerCase();
    const email = worker.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  // Calculate worker statistics
  useEffect(() => {
    const stats: any = {};
    workers.forEach(worker => {
      const workerJobs = jobs.filter(job => job.assigned_worker_id === worker.id);
      stats[worker.id] = {
        totalJobs: workerJobs.length,
        completedJobs: workerJobs.filter(job => job.status === 'completed').length,
        activeJobs: workerJobs.filter(job => job.status === 'in_progress').length,
        assignedJobs: workerJobs.filter(job => job.status === 'assigned').length,
      };
    });
    setWorkerStats(stats);
  }, [workers, jobs]);

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast({ 
        title: "Roll uppdaterad", 
        description: `Användarens roll har ändrats till ${newRole}.` 
      });
    } catch (error) {
      toast({ 
        title: "Fel", 
        description: "Kunde inte uppdatera användarens roll.", 
        variant: "destructive" 
      });
    }
  };

  const showWorkerDetails = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsDetailsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar arbetare...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Arbetare</h1>
          <p className="text-muted-foreground">Hantera arbetare och deras tilldelningar</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök arbetare..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => {
          const stats = workerStats[worker.id] || {};
          return (
            <Card key={worker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {worker.first_name?.[0]}{worker.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {worker.first_name} {worker.last_name}
                    </CardTitle>
                    <Badge variant="secondary">Arbetare</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{worker.email}</span>
                  </div>
                  {worker.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{worker.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Medlem sedan {new Date(worker.created_at).toLocaleDateString('sv-SE')}</span>
                  </div>
                </div>

                {/* Job Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalJobs || 0}</div>
                    <div className="text-xs text-muted-foreground">Totalt jobb</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completedJobs || 0}</div>
                    <div className="text-xs text-muted-foreground">Slutförda</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.activeJobs || 0}</div>
                    <div className="text-xs text-muted-foreground">Pågående</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.assignedJobs || 0}</div>
                    <div className="text-xs text-muted-foreground">Tilldelade</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => showWorkerDetails(worker)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Detaljer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredWorkers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Inga arbetare hittades.</p>
          </CardContent>
        </Card>
      )}

      {/* Worker Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Arbetardetaljer</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">
                    {selectedWorker.first_name?.[0]}{selectedWorker.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedWorker.first_name} {selectedWorker.last_name}
                  </h3>
                  <p className="text-muted-foreground">{selectedWorker.email}</p>
                  {selectedWorker.phone && (
                    <p className="text-muted-foreground">{selectedWorker.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Användar-ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedWorker.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Roll</Label>
                  <Select 
                    value={selectedWorker.role} 
                    onValueChange={(value) => handleUpdateUserRole(selectedWorker.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Kund</SelectItem>
                      <SelectItem value="worker">Arbetare</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Jobbstatistik</Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {workerStats[selectedWorker.id]?.totalJobs || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Totalt</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {workerStats[selectedWorker.id]?.completedJobs || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Slutförda</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {workerStats[selectedWorker.id]?.activeJobs || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Pågående</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {workerStats[selectedWorker.id]?.assignedJobs || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Tilldelade</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsDetailsDialogOpen(false)}>
                  Stäng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkers;