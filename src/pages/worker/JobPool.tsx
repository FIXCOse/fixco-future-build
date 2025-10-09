import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Euro, Search, Hand, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchJobs, claimJob } from '@/lib/api/jobs';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const JobPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingJobId, setClaimingJobId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadJobs = async () => {
    try {
      setLoading(true);
      console.log('JobPool - Fetching pool jobs...');
      
      // Check auth session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('JobPool - Session:', session ? 'EXISTS' : 'MISSING', 'Error:', sessionError);
      
      if (!session) {
        toast({
          title: "Inte inloggad",
          description: "Du måste vara inloggad som worker för att se jobbpoolen. Logga in igen.",
          variant: "destructive"
        });
        setLoading(false);
        navigate('/auth');
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('JobPool - Current user:', user?.id, user?.email);
      
      if (!user) {
        toast({
          title: "Session problem",
          description: "Kunde inte hämta användarinformation. Logga in igen.",
          variant: "destructive"
        });
        setLoading(false);
        navigate('/auth');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      console.log('JobPool - User role:', profile?.role);
      
      if (!profile || !['worker', 'technician'].includes(profile.role)) {
        toast({
          title: "Åtkomst nekad",
          description: "Du måste ha worker-rollen för att komma åt jobbpoolen",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const data = await fetchJobs({ pool_only: true });
      console.log('JobPool - Loaded jobs:', data?.length, 'jobs', data);
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Fel",
        description: error instanceof Error ? error.message : "Kunde inte ladda jobb från poolen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useJobsRealtime(() => {
    console.log('JobPool - Realtime update');
    loadJobs();
  });

  const handleClaimJob = async (jobId: string, jobTitle: string) => {
    setClaimingJobId(jobId);
    try {
      await claimJob(jobId);
      toast({
        title: "Jobb claimat!",
        description: `Du har framgångsrikt claimat jobbet "${jobTitle}". Det finns nu under "Mina jobb".`
      });
      loadJobs(); // Refresh the list
      navigate('/worker/jobs');
    } catch (error: any) {
      console.error('Error claiming job:', error);
      toast({
        title: "Kunde inte claima jobb",
        description: error.message || "Ett fel uppstod",
        variant: "destructive"
      });
    } finally {
      setClaimingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar tillgängliga jobb...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Jobbpool
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-2">
          Claima tillgängliga jobb som passar din kompetens
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-900">{jobs.length}</div>
            <p className="text-sm text-blue-700">Tillgängliga jobb</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Sök jobb efter titel, beskrivning eller adress..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Inga jobb tillgängliga</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Inga jobb matchar din sökning. Prova med andra sökord.'
                  : 'Det finns inga lediga jobb i poolen just nu. Kolla tillbaka senare!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg md:text-xl">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {job.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Job Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{job.address}, {job.city}</span>
                    </div>
                    
                    {/* Workers ska bara se fast pris om det är satt, inte offererat pris från hourly_rate */}
                    {job.pricing_mode === 'fixed' && job.fixed_price && (
                      <div className="flex items-center text-green-600 font-medium">
                        <Euro className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{job.fixed_price} kr (fast pris)</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleClaimJob(job.id, job.title)}
                    disabled={claimingJobId === job.id}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    <Hand className="w-4 h-4 mr-2" />
                    {claimingJobId === job.id ? 'Claimar...' : 'Claima detta jobb'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobPool;