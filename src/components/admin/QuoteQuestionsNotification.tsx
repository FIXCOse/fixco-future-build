import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function QuoteQuestionsNotification() {
  // Hämta antal obesvarade frågor
  const { data: unansweredCount = 0 } = useQuery({
    queryKey: ['unanswered-questions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('quote_questions')
        .select('*', { count: 'exact', head: true })
        .eq('answered', false);
      
      if (error) {
        console.error('Error fetching unanswered questions:', error);
        throw error;
      }
      console.log('🔔 Unanswered questions count:', count);
      return count || 0;
    },
    refetchInterval: 30000, // Uppdatera var 30:e sekund
  });

  // Hämta de senaste obesvarade frågorna
  const { data: recentQuestions = [] } = useQuery({
    queryKey: ['recent-unanswered-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_questions')
        .select('id, question, customer_name, asked_at, quote_id')
        .eq('answered', false)
        .order('asked_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching recent questions:', error);
        throw error;
      }
      console.log('📋 Recent unanswered questions:', data);
      return data || [];
    },
    refetchInterval: 30000,
  });

  console.log('🔔 QuoteQuestionsNotification rendered, count:', unansweredCount);

  // Visa alltid klockan, även om count är 0
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <MessageCircle className="h-5 w-5" />
          {unansweredCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unansweredCount > 9 ? '9+' : unansweredCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Offertfrågor</h3>
            <Badge variant="destructive">{unansweredCount} obesvarade</Badge>
          </div>
          
          {recentQuestions.length > 0 ? (
            <div className="space-y-3">
              {recentQuestions.map((q) => (
                <div key={q.id} className="text-sm space-y-1 border-b border-border pb-2 last:border-0">
                  <p className="font-medium text-foreground line-clamp-2">{q.question}</p>
                  <p className="text-xs text-muted-foreground">
                    {q.customer_name} • {new Date(q.asked_at).toLocaleDateString('sv-SE')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Inga nya frågor</p>
          )}
          
          <Link to="/admin/quote-questions" className="block">
            <Button variant="outline" size="sm" className="w-full">
              Visa alla frågor
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
