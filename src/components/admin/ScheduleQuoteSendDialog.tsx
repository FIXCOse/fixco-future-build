import { useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toast } from 'sonner';
import { CalendarIcon, Clock, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useScheduledQuoteSends } from '@/hooks/useScheduledQuoteSends';

type Props = {
  quoteId: string;
  quoteNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ScheduleQuoteSendDialog({ quoteId, quoteNumber, open, onOpenChange }: Props) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('09:00');
  const { scheduledSends, isLoading, schedule, cancel, isScheduling, isCancelling } = useScheduledQuoteSends(quoteId);

  const handleSchedule = () => {
    if (!date) return;
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledFor = new Date(date);
    scheduledFor.setHours(hours, minutes, 0, 0);

    if (scheduledFor <= new Date()) {
      toast.error('Datum och tid måste vara i framtiden');
      return;
      return;
    }

    schedule({ quoteId, scheduledFor }, {
      onSuccess: () => {
        setDate(undefined);
        setTime('09:00');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schemalägg utskick</DialogTitle>
          <DialogDescription>
            Välj datum och tid för när offert {quoteNumber} ska skickas automatiskt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Existing scheduled sends */}
          {scheduledSends.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Schemalagda utskick</p>
              {scheduledSends.map((send) => (
                <div key={send.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(send.scheduled_for), "d MMM yyyy 'kl.' HH:mm", { locale: sv })}
                    </span>
                    <Badge variant="outline" className="text-xs">Väntar</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancel(send.id)}
                    disabled={isCancelling}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Date picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Datum</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: sv }) : 'Välj datum'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tid</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
          <Button onClick={handleSchedule} disabled={!date || isScheduling}>
            {isScheduling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Schemalägg
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
