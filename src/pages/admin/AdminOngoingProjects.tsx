import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Play, FileText, User, Send } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminOngoingProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchStrategy, setDispatchStrategy] = useState<'pool' | 'manual'>('pool');
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [dispatchNotes, setDispatchNotes] = useState('');

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['ongoing-projects', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          quote:quotes_new!projects_quote_id_fkey(number, title),
          customer:customers!projects_customer_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: workers } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const startProject = async (project: any) => {
    try {
      const { error } = await supabase.functions.invoke('project-start', {
        body: { projectId: project.id }
      });

      if (error) throw error;
      toast.success('Projekt startat!');
      refetch();
    } catch (error: any) {
      console.error('Error starting project:', error);
      toast.error(error.message || 'Kunde inte starta projekt');
    }
  };

  const openDispatchModal = (project: any) => {
    setSelectedProject(project);
    setDispatchModalOpen(true);
  };

  const handleDispatch = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase.functions.invoke('project-dispatch', {
        body: {
          projectId: selectedProject.id,
          strategy: dispatchStrategy,
          workerId: dispatchStrategy === 'manual' ? selectedWorker : undefined,
          notes: dispatchNotes
        }
      });

      if (error) throw error;
      
      toast.success(
        dispatchStrategy === 'manual' 
          ? 'Projekt tilldelat arbetare!' 
          : 'Projekt skickat till pool!'
      );
      setDispatchModalOpen(false);
      setDispatchStrategy('pool');
      setSelectedWorker('');
      setDispatchNotes('');
      refetch();
    } catch (error: any) {
      console.error('Error dispatching project:', error);
      toast.error(error.message || 'Kunde inte dispatcha projekt');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default' as const;
      case 'assigned': return 'secondary' as const;
      case 'pending': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending': return 'Väntar';
      case 'scheduled': return 'Schemalagd';
      case 'assigned': return 'Tilldelad';
      default: return status;
    }
  };

  const statusCounts = projects?.reduce((acc, project) => {
    const status = project.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pågående uppdrag</h1>
          <p className="text-muted-foreground">Hantera alla projekt</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('all')}
        >
          Alla ({projects?.length || 0})
        </Button>
        <Button 
          variant={statusFilter === 'pending' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('pending')}
        >
          Väntar ({statusCounts.pending || 0})
        </Button>
        <Button 
          variant={statusFilter === 'scheduled' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('scheduled')}
        >
          Schemalagda ({statusCounts.scheduled || 0})
        </Button>
        <Button 
          variant={statusFilter === 'assigned' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('assigned')}
        >
          Tilldelade ({statusCounts.assigned || 0})
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projekt
            </CardTitle>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök projekt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Laddar...</div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{project.title}</h3>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusDisplayName(project.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      {project.quote && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {project.quote.number}
                        </div>
                      )}
                      {project.customer && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {project.customer.name}
                        </div>
                      )}
                      {project.start_date && (
                        <div className="text-xs">
                          Start: {format(new Date(project.start_date), 'PPP', { locale: sv })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => startProject(project)}>
                          <Play className="h-4 w-4 mr-1" />
                          Starta
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDispatchModal(project)}>
                          <Send className="h-4 w-4 mr-1" />
                          Dispatcha
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Inga projekt hittades
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispatch Modal */}
      <Dialog open={dispatchModalOpen} onOpenChange={setDispatchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatcha projekt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Strategi</Label>
              <Select 
                value={dispatchStrategy} 
                onValueChange={(v) => setDispatchStrategy(v as 'pool' | 'manual')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pool">Skicka till pool</SelectItem>
                  <SelectItem value="manual">Tilldela manuellt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dispatchStrategy === 'manual' && (
              <div>
                <Label>Välj arbetare</Label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj arbetare" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers?.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Anteckningar (valfritt)</Label>
              <Textarea
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                placeholder="Interna anteckningar..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDispatchModalOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleDispatch}>
                {dispatchStrategy === 'manual' ? 'Tilldela' : 'Skicka till pool'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOngoingProjects;
