import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AdminBack from '@/components/admin/AdminBack';
import { Trash2, RotateCcw, AlertTriangle, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const AdminJobRequestsTrash = () => {
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [emptyTrashConfirmOpen, setEmptyTrashConfirmOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: deletedRequests, isLoading } = useQuery({
    queryKey: ['deleted-job-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_requests')
        .select(`
          *,
          staff (
            id,
            name,
            staff_id,
            email
          ),
          jobs (
            id,
            title,
            address,
            city
          )
        `)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleRestore = async (request: any) => {
    try {
      const { error } = await supabase.rpc('restore_job_request', {
        p_request_id: request.id
      });

      if (error) throw error;

      toast.success('Jobbförfrågan återställd!');
      queryClient.invalidateQueries({ queryKey: ['deleted-job-requests'] });
    } catch (error: any) {
      console.error('Error restoring job request:', error);
      toast.error('Kunde inte återställa jobbförfrågan');
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase.rpc('permanently_delete_job_request', {
        p_request_id: selectedRequest.id
      });

      if (error) throw error;

      toast.success('Jobbförfrågan raderad permanent');
      queryClient.invalidateQueries({ queryKey: ['deleted-job-requests'] });
      setDeleteConfirmOpen(false);
      setSelectedRequest(null);
    } catch (error: any) {
      console.error('Error deleting job request:', error);
      toast.error('Kunde inte radera jobbförfrågan');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const { data, error } = await supabase.rpc('empty_job_requests_trash');

      if (error) throw error;

      toast.success(`${data || 0} jobbförfrågningar raderade permanent`);
      queryClient.invalidateQueries({ queryKey: ['deleted-job-requests'] });
      setEmptyTrashConfirmOpen(false);
    } catch (error: any) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Väntande</Badge>;
      case 'accepted': return <Badge className="bg-green-50 text-green-700">Accepterad</Badge>;
      case 'declined': return <Badge variant="destructive">Avböjd</Badge>;
      case 'expired': return <Badge variant="secondary">Utgången</Badge>;
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
            Papperskorg - Jobbförfrågningar
          </h1>
          <p className="text-muted-foreground">Raderade jobbförfrågningar kan återställas eller tas bort permanent</p>
        </div>
        {deletedRequests && deletedRequests.length > 0 && (
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
          <CardTitle>Raderade jobbförfrågningar ({deletedRequests?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Laddar...</div>
          ) : deletedRequests && deletedRequests.length > 0 ? (
            <div className="space-y-4">
              {deletedRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{request.jobs?.title || 'Jobb'}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{request.staff?.name}</span>
                        {request.staff?.staff_id && (
                          <Badge variant="outline" className="text-xs">#{request.staff.staff_id}</Badge>
                        )}
                      </div>

                      {request.jobs?.address && (
                        <p className="text-sm text-muted-foreground">
                          📍 {request.jobs.address}, {request.jobs.city}
                        </p>
                      )}

                      {request.message && (
                        <div className="bg-muted/50 p-2 rounded text-sm">
                          <strong>Meddelande:</strong> {request.message}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Raderat: {format(new Date(request.deleted_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(request)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Återställ
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedRequest(request);
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
              Detta kommer att radera jobbförfrågan permanent. Denna åtgärd kan inte ångras.
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
              Detta kommer att radera alla {deletedRequests?.length || 0} jobbförfrågningar permanent. Denna åtgärd kan inte ångras.
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

export default AdminJobRequestsTrash;
