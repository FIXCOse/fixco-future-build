import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface JobEventCardProps {
  job: {
    id: string;
    title: string;
    address?: string;
    city?: string;
    status: string;
    locked?: boolean;
  };
  onDragStart: (e: React.DragEvent) => void;
  onClick: () => void;
}

const statusColors = {
  pool: 'bg-gray-100 border-gray-300 text-gray-700',
  assigned: 'bg-blue-100 border-blue-300 text-blue-700',
  in_progress: 'bg-green-100 border-green-300 text-green-700',
  paused: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  completed: 'bg-purple-100 border-purple-300 text-purple-700',
  cancelled: 'bg-red-100 border-red-300 text-red-700'
};

export function JobEventCard({ job, onDragStart, onClick }: JobEventCardProps) {
  const statusColor = statusColors[job.status as keyof typeof statusColors] || statusColors.pool;
  
  return (
    <Card
      draggable={!job.locked}
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        "p-2 cursor-pointer border-l-4 transition-all hover:shadow-md",
        statusColor,
        job.locked && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{job.title}</p>
          {job.address && (
            <p className="text-xs opacity-75 truncate">
              {job.address}, {job.city}
            </p>
          )}
        </div>
        {job.locked && (
          <Lock className="h-3 w-3 flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}
