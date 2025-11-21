import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { JobRequestModal } from '@/components/admin/JobRequestModal';
import { 
  Search, Send, MapPin, Briefcase, Trash2, MoreVertical, Building2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const SendRequestsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isJobRequestModalOpen, setIsJobRequestModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any>(null);

  const { data: allJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['all-jobs-for-requests', searchTerm],
    queryFn: async () => {
      let jobsQuery = supabase
        .from('jobs')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      const allJobsForQuoteCheck = await supabase
        .from('jobs')
        .select('id, source_type, source_id')
        .eq('source_type', 'quote');

      let quotesQuery = supabase
        .from('quotes')
        .select(`
          *,
          customer:profiles!quotes_customer_id_fkey(first_name, last_name, email, phone),
          property:properties(name, address, city, postal_code)
        `)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        jobsQuery = jobsQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
        quotesQuery = quotesQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const [jobsResult, quotesResult] = await Promise.all([
        jobsQuery,
        quotesQuery
      ]);

      if (jobsResult.error) throw jobsResult.error;
      if (quotesResult.error) throw quotesResult.error;

      const jobs = jobsResult.data || [];
      const quotes = quotesResult.data || [];

      const jobsWithDetails = await Promise.all(
        jobs.map(async (job) => {
          let bookings: any[] = [];
          let quotes: any[] = [];
          
          if (job.source_type === 'booking') {
            const { data: booking } = await supabase
              .from('bookings')
              .select('service_name, contact_name, contact_email, contact_phone')
              .eq('id', job.source_id)
              .maybeSingle();
            if (booking) bookings = [booking];
          } else if (job.source_type === 'quote') {
            const { data: quote } = await supabase
              .from('quotes')
              .select('title, customer_name, customer_email, customer_phone')
              .eq('id', job.source_id)
              .maybeSingle();
            if (quote) quotes = [quote];
          }
          
          return { 
            ...job, 
            bookings,
            quotes
          };
        })
      );

      const existingJobQuoteIds = allJobsForQuoteCheck.data
        ?.filter(job => job.source_type === 'quote')
        .map(job => job.source_id) || [];

      const quotesAsJobs = quotes
        .filter(quote => !existingJobQuoteIds.includes(quote.id))
        .map(quote => ({
          id: `quote-${quote.id}`,
          title: quote.title,
          description: quote.description,
          address: quote.property?.address || quote.customer_address,
          city: quote.property?.city || quote.customer_city,
          postal_code: quote.property?.postal_code || quote.customer_postal_code,
          status: 'accepted-quote',
          pricing_mode: 'fixed',
          fixed_price: quote.total_amount,
          created_at: quote.created_at,
          source_type: 'quote',
          source_id: quote.id,
          quoteData: quote,
          assigned_worker_id: null,
          hourly_rate: null,
          bookings: [],
          quotes: [{
            title: quote.title,
            customer_name: quote.customer?.first_name && quote.customer?.last_name 
              ? `${quote.customer.first_name} ${quote.customer.last_name}`
              : quote.customer_name,
            customer_email: quote.customer?.email || quote.customer_email,
            customer_phone: quote.customer?.phone || quote.customer_phone
          }]
        }));

      return [...jobsWithDetails, ...quotesAsJobs];
    }
  });

  const handleJobAssignment = (job: any) => {
    setSelectedJob(job);
    setIsJobRequestModalOpen(true);
  };

  const handleCreateJobFromQuote = async (job: any) => {
    try {
      const { data, error } = await supabase.rpc('create_job_from_quote', {
        p_quote_id: job.source_id
      });

      if (error) throw error;

      toast({
        title: "Jobb skapat",
        description: "Ett nytt jobb har skapats från offerten",
      });

      queryClient.invalidateQueries({ queryKey: ['all-jobs-for-requests'] });
    } catch (error: any) {
      console.error('Error creating job from quote:', error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skapa jobb från offert",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', jobToDelete.id);

      if (error) throw error;

      toast({
        title: "Jobb raderat",
        description: "Flyttat till papperskorgen",
      });
      queryClient.invalidateQueries({ queryKey: ['all-jobs-for-requests'] });
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast({
        title: "Fel",
        description: "Kunde inte radera jobbet",
        variant: "destructive",
      });
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
      case 'accepted-quote':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Godkänd Offert</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Tillgängliga Jobb
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sök jobb..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : allJobs.length > 0 ? (
            <div className="space-y-4">
              {allJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{job.title || 'Inget namn'}</h3>
                        {getJobStatusBadge(job.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'accepted-quote' ? (
                        <Button
                          size="sm"
                          onClick={() => handleCreateJobFromQuote(job)}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Skapa Jobb
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleJobAssignment(job)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Skicka Förfrågan
                        </Button>
                      )}
                      {job.status !== 'accepted-quote' && (
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
                                setJobToDelete(job);
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Radera
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{job.address}, {job.city}</span>
                    </div>
                    {job.pricing_mode === 'hourly' && job.hourly_rate && (
                      <div className="text-sm">
                        <span className="font-medium">{job.hourly_rate} SEK/tim</span>
                      </div>
                    )}
                    {job.pricing_mode === 'fixed' && job.fixed_price && (
                      <div className="text-sm">
                        <span className="font-medium">{job.fixed_price} SEK</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Inga tillgängliga jobb</p>
            </div>
          )}
        </CardContent>
      </Card>

      <JobRequestModal
        open={isJobRequestModalOpen}
        onOpenChange={setIsJobRequestModalOpen}
        job={selectedJob}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera jobb?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att flytta jobbet till papperskorgen. Du kan återställa det senare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob}>Radera</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
