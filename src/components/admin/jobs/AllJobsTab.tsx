import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobManagementCard } from '@/components/admin/JobManagementCard';
import { useUsersData } from '@/hooks/useUsersData';
import { Search, Filter } from 'lucide-react';

export const AllJobsTab = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { users: workers } = useUsersData();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs-management', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['jobs-management'] });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sök jobb..."
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
              <SelectItem value="pool">I pool</SelectItem>
              <SelectItem value="pending_request">Väntande förfrågan</SelectItem>
              <SelectItem value="assigned">Tilldelat</SelectItem>
              <SelectItem value="in_progress">Pågående</SelectItem>
              <SelectItem value="completed">Slutfört</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Inga jobb hittades</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobManagementCard
                key={job.id}
                job={job}
                workers={workers}
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
