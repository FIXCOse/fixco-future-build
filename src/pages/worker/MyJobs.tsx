import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  Calendar,
  ExternalLink,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import { fetchJobs, updateJobStatus } from '@/lib/api/jobs';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toast } from 'sonner';

const MyJobs = () => {
  const [activeTab, setActiveTab] = useState('active');

  const { data: allMyJobs, refetch } = useQuery({
    queryKey: ['worker-all-jobs'],
    queryFn: () => fetchJobs({ assigned_to_me: true }),
  });

  // Real-time updates
  useJobsRealtime(() => {
    refetch();
  });

  const activeJobs = allMyJobs?.filter(job => 
    ['assigned', 'in_progress', 'paused'].includes(job.status)
  ) || [];

  const completedJobs = allMyJobs?.filter(job => 
    ['completed', 'approved', 'invoiced'].includes(job.status)
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      case 'approved': return 'bg-green-600';
      case 'invoiced': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Pågår';
      case 'assigned': return 'Tilldelad';
      case 'paused': return 'Pausad';
      case 'completed': return 'Färdig';
      case 'approved': return 'Godkänd';
      case 'invoiced': return 'Fakturerad';
      default: return status;
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast.success('Status uppdaterad');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte uppdatera status');
    }
  };

  const JobCard = ({ job }: { job: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.address}, {job.city}
              </span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(job.status)}`} />
                <Badge variant="outline">
                  {getStatusLabel(job.status)}
                </Badge>
              </div>
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
          {job.assigned_at && (
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Tilldelad: {format(new Date(job.assigned_at), 'dd MMM', { locale: sv })}
            </span>
          )}
          {job.start_scheduled_at && (
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Planerad start: {format(new Date(job.start_scheduled_at), 'dd MMM', { locale: sv })}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {job.status === 'assigned' && (
              <Button 
                size="sm" 
                onClick={() => handleStatusChange(job.id, 'in_progress')}
              >
                <Play className="w-4 h-4 mr-2" />
                Starta
              </Button>
            )}
            
            {job.status === 'in_progress' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(job.id, 'paused')}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausa
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleStatusChange(job.id, 'completed')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Färdig
                </Button>
              </>
            )}
            
            {job.status === 'paused' && (
              <Button 
                size="sm"
                onClick={() => handleStatusChange(job.id, 'in_progress')}
              >
                <Play className="w-4 h-4 mr-2" />
                Fortsätt
              </Button>
            )}
          </div>
          
          <Link to={`/worker/jobs/${job.id}`}>
            <Button size="sm" variant="ghost">
              <ExternalLink className="w-4 h-4 mr-2" />
              Öppna
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mina jobb</h1>
        <p className="text-muted-foreground">
          Översikt över alla dina tilldelade jobb och deras status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activeJobs.length}</div>
            <p className="text-sm text-muted-foreground">Aktiva jobb</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {activeJobs.filter(j => j.status === 'in_progress').length}
            </div>
            <p className="text-sm text-muted-foreground">Pågående</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{completedJobs.length}</div>
            <p className="text-sm text-muted-foreground">Färdiga</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{allMyJobs?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Totalt</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Lists */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Aktiva ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">Färdiga ({completedJobs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Du har inga aktiva jobb just nu.
                <br />
                <Link to="/worker/pool" className="text-primary hover:underline">
                  Kolla jobbpoolen för nya uppdrag
                </Link>
              </CardContent>
            </Card>
          ) : (
            activeJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Du har inga färdiga jobb än.
              </CardContent>
            </Card>
          ) : (
            completedJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyJobs;