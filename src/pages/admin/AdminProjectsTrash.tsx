import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AdminBack from '@/components/admin/AdminBack';
import { Trash2, RotateCcw, AlertTriangle, FileText, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const AdminProjectsTrash = () => {
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [emptyTrashConfirmOpen, setEmptyTrashConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { data: deletedProjects, isLoading } = useQuery({
    queryKey: ['deleted-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          quote:quotes_new!projects_quote_id_fkey(number, title),
          customer:customers!projects_customer_id_fkey(name, email)
        `)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleRestore = async (project: any) => {
    try {
      const { error } = await supabase.rpc('restore_project', {
        p_project_id: project.id
      });

      if (error) throw error;

      toast.success('Projekt återställt!');
      queryClient.invalidateQueries({ queryKey: ['deleted-projects'] });
    } catch (error: any) {
      console.error('Error restoring project:', error);
      toast.error('Kunde inte återställa projekt');
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase.rpc('permanently_delete_project', {
        p_project_id: selectedProject.id
      });

      if (error) throw error;

      toast.success('Projekt raderat permanent');
      queryClient.invalidateQueries({ queryKey: ['deleted-projects'] });
      setDeleteConfirmOpen(false);
      setSelectedProject(null);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error('Kunde inte radera projekt');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const { data, error } = await supabase.rpc('empty_projects_trash');

      if (error) throw error;

      toast.success(`${data || 0} projekt raderade permanent`);
      queryClient.invalidateQueries({ queryKey: ['deleted-projects'] });
      setEmptyTrashConfirmOpen(false);
    } catch (error: any) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">Väntar</Badge>;
      case 'scheduled': return <Badge variant="default">Schemalagd</Badge>;
      case 'assigned': return <Badge variant="secondary">Tilldelad</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
            Papperskorg - Projekt
          </h1>
          <p className="text-muted-foreground">Raderade projekt kan återställas eller tas bort permanent</p>
        </div>
        {deletedProjects && deletedProjects.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={() => setEmptyTrashConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Töm papperskorgen
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raderade projekt ({deletedProjects?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Laddar...</div>
          ) : deletedProjects && deletedProjects.length > 0 ? (
            <div className="space-y-4">
              {deletedProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{project.title || 'Utan titel'}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      
                      {project.quote && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>Offert: {project.quote.number}</span>
                        </div>
                      )}

                      {project.customer && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{project.customer.name}</span>
                        </div>
                      )}

                      {project.start_date && (
                        <p className="text-sm text-muted-foreground">
                          Startdatum: {format(new Date(project.start_date), 'PPP', { locale: sv })}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Raderat: {format(new Date(project.deleted_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(project)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Återställ
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedProject(project);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Radera permanent
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Papperskorgen är tom</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permanent Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Radera permanent?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att radera projektet permanent. Denna åtgärd kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handlePermanentDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Radera permanent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Trash Confirmation */}
      <AlertDialog open={emptyTrashConfirmOpen} onOpenChange={setEmptyTrashConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Töm papperskorgen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att radera alla {deletedProjects?.length || 0} projekt permanent. Denna åtgärd kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleEmptyTrash} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Töm papperskorgen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProjectsTrash;
