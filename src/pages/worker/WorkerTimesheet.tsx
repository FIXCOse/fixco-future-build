import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { fetchJobs, fetchTimeLogs } from '@/lib/api/jobs';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { sv } from 'date-fns/locale';

const WorkerTimesheet = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const { data: myJobs } = useQuery({
    queryKey: ['worker-timesheet-jobs'],
    queryFn: () => fetchJobs({ assigned_to_me: true }),
  });

  // Get time logs for all my jobs (simplified - would need proper aggregation)
  const { data: allTimeLogs } = useQuery({
    queryKey: ['worker-all-time-logs'],
    queryFn: async () => {
      if (!myJobs) return [];
      
      const logs = await Promise.all(
        myJobs.map(job => fetchTimeLogs(job.id))
      );
      
      return logs.flat().sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!myJobs,
  });

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTimeLogsForDate = (date: Date) => {
    return allTimeLogs?.filter(log => 
      isSameDay(new Date(log.created_at), date)
    ) || [];
  };

  const getTotalHoursForDate = (date: Date) => {
    const logs = getTimeLogsForDate(date);
    return logs.reduce((sum, log) => sum + (log.hours || log.manual_hours || 0), 0);
  };

  const weeklyHours = weekDays.reduce((sum, day) => sum + getTotalHoursForDate(day), 0);
  const todayHours = getTotalHoursForDate(new Date());
  
  // Calculate earnings (simplified)
  const averageHourlyRate = 450; // Would calculate from actual jobs
  const weeklyEarnings = weeklyHours * averageHourlyRate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tidrapport</h1>
          <p className="text-muted-foreground">
            Översikt över dina arbetade timmar och intäkter.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportera
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idag</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              {(todayHours * averageHourlyRate).toFixed(0)} kr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denna vecka</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              {format(weekStart, 'dd MMM', { locale: sv })} - {format(weekEnd, 'dd MMM', { locale: sv })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veckointäkt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyEarnings.toFixed(0)} kr</div>
            <p className="text-xs text-muted-foreground">
              Baserat på genomsnittlig timpenning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Snitt/dag</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(weeklyHours / 7).toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Senaste 7 dagarna
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Veckoöversikt
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
              >
                ← Förra veckan
              </Button>
              <span className="text-sm font-medium">
                {format(weekStart, 'dd MMM', { locale: sv })} - {format(weekEnd, 'dd MMM yyyy', { locale: sv })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
              >
                Nästa vecka →
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayHours = getTotalHoursForDate(day);
              const dayLogs = getTimeLogsForDate(day);
              const isDayToday = isToday(day);
              
              return (
                <div 
                  key={day.toISOString()} 
                  className={`p-4 border rounded-lg ${isDayToday ? 'border-primary bg-primary/5' : ''}`}
                >
                  <div className="text-center">
                    <div className={`text-sm font-medium ${isDayToday ? 'text-primary' : 'text-muted-foreground'}`}>
                      {format(day, 'EEE', { locale: sv })}
                    </div>
                    <div className={`text-lg font-bold ${isDayToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="text-center">
                      <div className="text-lg font-bold">{dayHours.toFixed(1)}h</div>
                      <div className="text-xs text-muted-foreground">
                        {(dayHours * averageHourlyRate).toFixed(0)} kr
                      </div>
                    </div>
                    
                    {dayLogs.length > 0 && (
                      <div className="space-y-1">
                        {dayLogs.slice(0, 2).map((log) => (
                          <div key={log.id} className="text-xs bg-accent rounded px-2 py-1">
                            {(log.hours || log.manual_hours || 0).toFixed(1)}h
                            {log.note && (
                              <div className="text-muted-foreground truncate">
                                {log.note}
                              </div>
                            )}
                          </div>
                        ))}
                        {dayLogs.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayLogs.length - 2} till
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste tidregistreringar</CardTitle>
        </CardHeader>
        <CardContent>
          {!allTimeLogs || allTimeLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Inga tidregistreringar än
            </p>
          ) : (
            <div className="space-y-3">
              {allTimeLogs.slice(0, 10).map((log) => {
                const job = myJobs?.find(j => j.id === log.job_id);
                
                return (
                  <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">
                        {(log.hours || log.manual_hours || 0).toFixed(1)} timmar
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {job?.title} • {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: sv })}
                      </div>
                      {log.note && (
                        <div className="text-sm text-muted-foreground">{log.note}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {((log.hours || log.manual_hours || 0) * averageHourlyRate).toFixed(0)} kr
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {log.hours ? 'Auto' : 'Manuell'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerTimesheet;