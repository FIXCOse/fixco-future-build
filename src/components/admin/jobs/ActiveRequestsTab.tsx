import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useJobRequestsRealtime } from '@/hooks/useJobRequestsRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Send, Clock, User, MapPin, Filter, Trash2, MoreVertical 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const ActiveRequestsTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<any>(null);

  const { data: jobRequests = [], isLoading: requestsLoading, refetch } = useQuery({
    queryKey: ['job-requests', statusFilter, searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_job_requests' as any, {
        p_status_filter: statusFilter,
        p_search_term: searchTerm
      });

      if (error) throw error;
      
      const results = (data as any[]) || [];
      return results.map((row: any) => ({
        ...row,
        staff: row.staff_data,
        jobs: row.job_data
      }));
    }
  });

  useJobRequestsRealtime(() => {
    refetch();
  });

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', requestToDelete.id);

      if (error) throw error;

      toast({
        title: "Jobbförfrågan raderad",
        description: "Flyttat till papperskorgen",
      });
      refetch();
      setDeleteConfirmOpen(false);
      setRequestToDelete(null);
    } catch (error: any) {
      console.error('Error deleting job request:', error);
      toast({
        title: "Fel",
        description: "Kunde inte radera jobbförfrågan",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Väntande</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Accepterad</Badge>;
      case 'declined':
        return <Badge variant="destructive">Avböjd</Badge>;
      case 'expired':
        return <Badge variant="secondary">Utgången</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'pool':
        return <Badge variant="default">I pool</Badge>;
      case 'assigned':
        return <Badge variant="secondary">Tilldelat</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Pågående</Badge>;
      case 'completed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Slutfört</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Jobbförfrågningar
          </CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök förfrågningar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla status</SelectItem>
                <SelectItem value="pending">Väntande</SelectItem>
                <SelectItem value="accepted">Accepterade</SelectItem>
                <SelectItem value="declined">Avböjda</SelectItem>
                <SelectItem value="expired">Utgångna</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobRequests.length > 0 ? (
            <div className="space-y-4">
              {jobRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{request.jobs?.title}</h3>
                        {getJobStatusBadge(request.jobs?.status)}
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{request.jobs?.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm text-muted-foreground">
                        {new Date(request.requested_at).toLocaleDateString('sv-SE')}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setRequestToDelete(request);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Radera
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Personal:</span>
                        <span>{request.staff?.name}</span>
                        <Badge variant="outline">#{request.staff?.staff_id}</Badge>
                      </div>
                      {request.staff?.email && (
                        <div className="text-sm text-muted-foreground ml-6">
                          {request.staff.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{request.jobs?.address}, {request.jobs?.city}</span>
                      </div>
                      {request.jobs?.pricing_mode === 'hourly' && request.jobs?.hourly_rate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{request.jobs.hourly_rate} SEK/tim</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.message && (
                    <div className="bg-muted/50 p-3 rounded text-sm mb-3">
                      <p className="font-medium mb-1">Meddelande:</p>
                      <p className="text-muted-foreground">{request.message}</p>
                    </div>
                  )}

                  {request.status === 'pending' && request.expires_at && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        Utgår: {new Date(request.expires_at).toLocaleString('sv-SE')}
                      </span>
                    </div>
                  )}

                  {request.responded_at && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Besvarad: {new Date(request.responded_at).toLocaleString('sv-SE')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Inga jobbförfrågningar hittades</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera jobbförfrågan?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att flytta förfrågan till papperskorgen. Du kan återställa den senare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest}>Radera</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
