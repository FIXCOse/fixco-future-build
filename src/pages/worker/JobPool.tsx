import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Clock, 
  Euro, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { fetchJobs, claimJob } from '@/lib/api/jobs';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const JobPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const queryClient = useQueryClient();

  const { data: poolJobs, refetch } = useQuery({
    queryKey: ['job-pool'],
    queryFn: () => fetchJobs({ pool_only: true }),
  });

  // Real-time updates
  useJobsRealtime(() => {
    refetch();
  });

  const claimJobMutation = useMutation({
    mutationFn: claimJob,
    onSuccess: () => {
      toast.success('Jobbet har tagits!');
      queryClient.invalidateQueries({ queryKey: ['job-pool'] });
      queryClient.invalidateQueries({ queryKey: ['worker-my-jobs'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunde inte ta jobbet');
    },
  });

  const filteredJobs = poolJobs?.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = !filterRegion || 
      job.city?.toLowerCase().includes(filterRegion.toLowerCase());
    
    return matchesSearch && matchesRegion;
  });

  const handleClaimJob = async (jobId: string) => {
    claimJobMutation.mutate(jobId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Jobbpool</h1>
        <p className="text-muted-foreground">
          Tillgängliga jobb som du kan ta. Första som tar, först som tjänar!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Sök jobb, adress, beskrivning..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Filtrera på ort..."
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="pl-10 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{poolJobs?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Tillgängliga jobb</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredJobs?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Filtrerade resultat</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredJobs?.filter(j => j.pricing_mode === 'hourly').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Timarvode</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6">
        {!filteredJobs || filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {poolJobs?.length === 0 
                ? 'Inga jobb tillgängliga just nu. Kolla tillbaka senare!'
                : 'Inga jobb matchar dina filter.'
              }
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.address}, {job.city}
                      </span>
                      <Badge variant="outline">
                        {job.source_type === 'booking' ? 'Bokning' : 'Offert'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {job.pricing_mode === 'hourly' 
                        ? `${job.hourly_rate} kr/h`
                        : `${job.fixed_price} kr`
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {job.pricing_mode === 'hourly' ? 'Timarvode' : 'Fast pris'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {job.description && (
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {job.start_scheduled_at && (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Start: {format(new Date(job.start_scheduled_at), 'dd MMM', { locale: sv })}
                    </span>
                  )}
                  {job.due_date && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Deadline: {format(new Date(job.due_date), 'dd MMM', { locale: sv })}
                    </span>
                  )}
                  {job.rot_rut?.type && (
                    <Badge variant="secondary">
                      {job.rot_rut.type.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleClaimJob(job.id)}
                    disabled={claimJobMutation.isPending}
                    size="lg"
                  >
                    {claimJobMutation.isPending ? 'Tar jobbet...' : 'Ta jobbet'}
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