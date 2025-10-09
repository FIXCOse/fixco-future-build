import { useCallback, useState, useEffect } from "react";
import { useJobsRealtime } from "@/hooks/useJobsRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, RotateCcw } from "lucide-react";

interface Job {
  id: string;
  title: string;
  status: string;
  address: string;
  created_at: string;
  deleted_at?: string;
  pricing_mode: string;
  hourly_rate?: number;
  fixed_price?: number;
}

export default function AdminJobsTrash() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadDeletedJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded deleted jobs:', data?.length || 0, 'jobs');
      setJobs(data as any);
    } catch (error) {
      console.error("Error loading deleted jobs:", error);
      toast.error('Kunde inte ladda papperskorgen');
    } finally {
      setLoading(false);
    }
  }, []);

  useJobsRealtime(loadDeletedJobs);
  
  useEffect(() => {
    loadDeletedJobs();
  }, [loadDeletedJobs]);

  const handleRestoreJob = async (id: string) => {
    try {
      const { error } = await supabase.rpc('restore_job', { p_job_id: id });

      if (error) throw error;
      
      toast.success('Jobb återställt');
      loadDeletedJobs();
    } catch (error) {
      console.error('Error restoring job:', error);
      toast.error('Kunde inte återställa jobb');
    }
  };

  const handlePermanentlyDeleteJob = async (id: string) => {
    try {
      const { error } = await supabase.rpc('permanently_delete_job', { p_job_id: id });

      if (error) throw error;
      
      toast.success('Jobb permanent raderat');
      loadDeletedJobs();
    } catch (error) {
      console.error('Error permanently deleting job:', error);
      toast.error('Kunde inte ta bort jobb permanent');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const { data, error } = await supabase.rpc('empty_jobs_trash');

      if (error) throw error;
      
      toast.success(`${data || 0} arbetsordrar permanent raderade`);
      loadDeletedJobs();
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(searchLower) ||
      job.address?.toLowerCase().includes(searchLower)
    );
  });

  const getDaysUntilDeletion = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const deletionDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deletionDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return daysLeft;
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Papperskorg - Arbetsordrar</h1>
            <p className="text-muted-foreground mt-2">
              Raderade arbetsordrar tas bort permanent efter 30 dagar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/jobs')}>
              Tillbaka
            </Button>
            {jobs.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Töm papperskorg
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Detta kommer att permanent radera alla arbetsordrar i papperskorgen. Denna åtgärd kan inte ångras.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEmptyTrash}>
                      Töm papperskorg
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <Input
          placeholder="Sök arbetsordrar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "Inga arbetsordrar hittades" : "Papperskorgen är tom"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => {
            const daysLeft = getDaysUntilDeletion(job.deleted_at!);
            return (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {job.title || 'Inget titel'}
                      </CardTitle>
                      <CardDescription>
                        Adress: {job.address || 'Ej angivet'}
                      </CardDescription>
                      <CardDescription className="text-xs mt-2">
                        Raderad {formatDistanceToNow(new Date(job.deleted_at!), { addSuffix: true, locale: sv })}
                        {daysLeft > 0 && (
                          <span className="ml-2 text-orange-600 font-medium">
                            • Raderas permanent om {daysLeft} dag{daysLeft !== 1 ? 'ar' : ''}
                          </span>
                        )}
                        {daysLeft <= 0 && (
                          <span className="ml-2 text-red-600 font-medium">
                            • Kommer att raderas inom kort
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-muted-foreground capitalize">{job.status}</p>
                    </div>
                    <div>
                      <p className="font-medium">Prismodell</p>
                      <p className="text-muted-foreground">
                        {job.pricing_mode === 'hourly' ? 'Timpris' : 'Fast pris'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Skapad</p>
                      <p className="text-muted-foreground">
                        {format(new Date(job.created_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="default" onClick={() => handleRestoreJob(job.id)}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Återställ
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Radera permanent
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Detta kommer att permanent radera arbetsorderna. Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handlePermanentlyDeleteJob(job.id)}>
                            Radera permanent
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
