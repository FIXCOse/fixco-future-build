import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Clock, 
  Euro, 
  Search, 
  Play, 
  Pause, 
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const MyJobsDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock jobs for demo
  const mockJobs = [
    {
      id: '1',
      title: 'Elinstallation villa',
      description: 'Installation av ny elcentral och uttag i villa på 120 kvm',
      address: 'Storgatan 12',
      city: 'Stockholm',
      postal_code: '11122',
      pricing_mode: 'hourly',
      hourly_rate: 650,
      estimated_hours: 8,
      status: 'in_progress',
      created_at: '2024-01-15T08:00:00Z',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Lampinstallation kontor',
      description: 'Byte av taklampor i kontorslokal, 15 st LED-armaturer',
      address: 'Kungsgatan 45',
      city: 'Stockholm', 
      postal_code: '11143',
      pricing_mode: 'fixed',
      fixed_price: 4500,
      status: 'assigned',
      created_at: '2024-01-14T14:30:00Z',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Elfel felsökning',
      description: 'Felsökning av elfel i kök, troligen kortslutning',
      address: 'Vasagatan 8',
      city: 'Stockholm',
      postal_code: '11120',
      pricing_mode: 'hourly',
      hourly_rate: 750,
      estimated_hours: 3,
      status: 'paused',
      created_at: '2024-01-13T09:15:00Z',
      priority: 'urgent'
    },
    {
      id: '4', 
      title: 'Värmepump installation',
      description: 'Installation av bergvärmepump för villa, inkl. elarbete',
      address: 'Östermalms torg 1',
      city: 'Stockholm',
      postal_code: '11442',
      pricing_mode: 'fixed',
      fixed_price: 12000,
      status: 'completed',
      created_at: '2024-01-12T16:20:00Z',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-100 text-green-800 border-green-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Pågår';
      case 'assigned': return 'Tilldelad';
      case 'paused': return 'Pausad';
      case 'completed': return 'Färdig';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Brådskande';
      case 'high': return 'Hög';
      case 'medium': return 'Medium';
      default: return 'Låg';
    }
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockJobs.length,
    assigned: mockJobs.filter(j => j.status === 'assigned').length,
    in_progress: mockJobs.filter(j => j.status === 'in_progress').length,
    paused: mockJobs.filter(j => j.status === 'paused').length,
    completed: mockJobs.filter(j => j.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mina jobb</h1>
          <p className="text-muted-foreground">
            Hantera dina tilldelade och pågående jobb.
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {filteredJobs.length} jobb
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök jobb efter titel, beskrivning eller adress..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="h-8"
              >
                {status === 'all' && 'Alla'}
                {status === 'assigned' && 'Tilldelade'}
                {status === 'in_progress' && 'Pågår'}
                {status === 'paused' && 'Pausade'}
                {status === 'completed' && 'Färdiga'}
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.address}, {job.city}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(job.status)}>
                    {getStatusLabel(job.status)}
                  </Badge>
                  <Badge className={getPriorityColor(job.priority)}>
                    {getPriorityLabel(job.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{job.description}</p>
              
              {/* Job Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prissättning:</span>
                  <div className="flex items-center text-green-600 font-semibold">
                    <Euro className="h-4 w-4 mr-1" />
                    {job.pricing_mode === 'hourly' 
                      ? `${job.hourly_rate} kr/h`
                      : `${job.fixed_price} kr (fast)`
                    }
                  </div>
                </div>
                
                {job.pricing_mode === 'hourly' && job.estimated_hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Uppskattad tid:</span>
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.estimated_hours}h
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Tilldelad:</span>
                  <span className="text-sm text-gray-600">
                    {format(new Date(job.created_at), 'dd MMM yyyy', { locale: sv })}
                  </span>
                </div>

                {job.pricing_mode === 'hourly' && job.estimated_hours && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Uppskattad intäkt:</span>
                    <span className="text-lg font-bold text-green-600">
                      ~{(job.hourly_rate * job.estimated_hours).toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {job.status === 'assigned' && (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Starta jobb
                  </Button>
                )}
                
                {job.status === 'in_progress' && (
                  <Button variant="outline" className="flex-1">
                    <Pause className="h-4 w-4 mr-2" />
                    Pausa jobb
                  </Button>
                )}

                {job.status === 'paused' && (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Fortsätt jobb
                  </Button>
                )}

                {job.status === 'completed' && (
                  <Button variant="outline" className="flex-1" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Färdig
                  </Button>
                )}

                <Link to={`/worker/jobs/${job.id}`}>
                  <Button variant="outline">
                    Detaljer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Inga jobb hittades</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Försök med andra sökord eller filter.'
                : 'Du har inga tilldelade jobb för tillfället.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyJobsDemo;