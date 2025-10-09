import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AdminBack from '@/components/admin/AdminBack';
import { JobRequestModal } from '@/components/admin/JobRequestModal';
import { 
  Search, Send, Clock, CheckCircle, XCircle, 
  User, MapPin, Briefcase, Filter, Trash2, MoreVertical 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const AdminJobRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isJobRequestModalOpen, setIsJobRequestModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<any>(null);

  // Fetch all jobs and accepted quotes for manual assignment
  const { data: allJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['all-jobs-for-requests', searchTerm],
    queryFn: async () => {
      // Fetch existing jobs
      let jobsQuery = supabase
        .from('jobs')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      // Fetch accepted quotes that aren't jobs yet
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

      // Get additional data for jobs by manually fetching bookings and quotes
      const jobsWithDetails = await Promise.all(
        jobs.map(async (job) => {
          let bookings: any[] = [];
          let quotes: any[] = [];
          
          if (job.source_type === 'booking') {
            const { data: booking } = await supabase
              .from('bookings')
              .select('service_name, contact_name, contact_email, contact_phone')
              .eq('id', job.source_id)
              .single();
            if (booking) bookings = [booking];
          } else if (job.source_type === 'quote') {
            const { data: quote } = await supabase
              .from('quotes')
              .select('title, customer_name, customer_email, customer_phone')
              .eq('id', job.source_id)
              .single();
            if (quote) quotes = [quote];
          }
          
          return { 
            ...job, 
            bookings,
            quotes
          };
        })
      );

      // Convert quotes to job-like format and filter out quotes that already have jobs
      const existingJobQuoteIds = jobsWithDetails
        .filter(job => job.source_type === 'quote')
        .map(job => job.source_id);

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
          // Add quote-specific data
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

  // Fetch job requests with staff and job details
  const { data: jobRequests, isLoading: requestsLoading, refetch } = useQuery({
    queryKey: ['job-requests', statusFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('job_requests')
        .select(`
          *,
          staff (
            id,
            name,
            staff_id,
            email,
            phone,
            role
          ),
          jobs (
            id,
            title,
            description,
            address,
            city,
            status,
            pricing_mode,
            hourly_rate,
            fixed_price
          )
        `)
        .is('deleted_at', null)
        .order('requested_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`message.ilike.%${searchTerm}%,response_message.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch staff for assignment
  const { data: staff = [] } = useQuery({
    queryKey: ['active-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_skills (
            skill_id,
            level,
            skills (name, category)
          )
        `)
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
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
      case 'accepted-quote':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Godkänd Offert</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobbförfrågningar</h1>
          <p className="text-muted-foreground">Skicka och hantera jobbförfrågningar till personal</p>
        </div>
        <Link to="/admin/job-requests-trash">
          <Button variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Papperskorg
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Aktiva Förfrågningar</TabsTrigger>
          <TabsTrigger value="available">Tillgängliga Jobb</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
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
              ) : jobRequests && jobRequests.length > 0 ? (
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
                          <strong>Meddelande:</strong> {request.message}
                        </div>
                      )}

                      {request.response_message && (
                        <div className="bg-blue-50 p-3 rounded text-sm">
                          <strong>Svar från personal:</strong> {request.response_message}
                        </div>
                      )}

                      {request.expires_at && new Date(request.expires_at) > new Date() && request.status === 'pending' && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Förfaller: {new Date(request.expires_at).toLocaleString('sv-SE')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' ? 'Inga förfrågningar hittades' : 'Inga jobbförfrågningar skickade än'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Tillgängliga Jobb för Tilldelning
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
                      <div className="w-32 h-8 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : allJobs && allJobs.length > 0 ? (
                <div className="space-y-4">
                  {allJobs.map((job) => {
                    const bookingInfo = job.bookings && job.bookings.length > 0 ? job.bookings[0] : null;
                    const quoteInfo = job.quotes && job.quotes.length > 0 ? job.quotes[0] : null;
                    const contactInfo = bookingInfo || quoteInfo;
                    
                    return (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{job.title}</h3>
                            {getJobStatusBadge(job.status)}
                            {job.assigned_worker_id && (
                              <Badge variant="outline">Tilldelat</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{job.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.address}, {job.city}
                            </div>
                            
                            {job.pricing_mode === 'hourly' && job.hourly_rate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.hourly_rate} SEK/tim
                              </div>
                            )}
                            
                            {job.pricing_mode === 'fixed' && job.fixed_price && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.fixed_price?.toLocaleString()} SEK fast pris
                              </div>
                            )}
                          </div>

                          {contactInfo && (
                            <div className="text-sm text-muted-foreground">
                              Kund: {(contactInfo as any).contact_name || (contactInfo as any).customer_name}
                              {((contactInfo as any).contact_email || (contactInfo as any).customer_email) && 
                                ` • ${(contactInfo as any).contact_email || (contactInfo as any).customer_email}`}
                            </div>
                          )}
                        </div>
                        
                        {job.status === 'accepted-quote' ? (
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              onClick={() => handleCreateJobFromQuote(job)}
                              className="flex items-center gap-2"
                            >
                              <Briefcase className="h-4 w-4" />
                              Skapa Jobb
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleJobAssignment(job)}
                              className="flex items-center gap-2"
                            >
                              <Send className="h-4 w-4" />
                              Skicka Förfrågan
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handleJobAssignment(job)}
                            className="flex items-center gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Skicka Förfrågan
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Inga jobb hittades' : 'Inga jobb tillgängliga för tilldelning'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Väntande Förfrågningar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobRequests?.filter(r => r.status === 'pending').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">behöver svar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accepterade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobRequests?.filter(r => r.status === 'accepted').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">förfrågningar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tillgängliga Jobb</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allJobs?.filter(j => j.status === 'pool').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">i poolen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktiv Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">tillgängliga arbetare</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Request Modal */}
      <JobRequestModal
        open={isJobRequestModalOpen}
        onOpenChange={(open) => {
          setIsJobRequestModalOpen(open);
          if (!open) setSelectedJob(null);
        }}
        job={selectedJob}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera jobbförfrågan?</AlertDialogTitle>
            <AlertDialogDescription>
              Jobbförfrågan kommer att flyttas till papperskorgen och kan återställas senare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminJobRequests;