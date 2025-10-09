import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageCircle, Send, CheckCircle, Clock, Mail } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

type QuoteQuestion = {
  id: string;
  quote_id: string;
  question: string;
  customer_name: string;
  customer_email: string | null;
  asked_at: string;
  answered: boolean;
  answer: string | null;
  answered_at: string | null;
  quote: {
    number: string;
    title: string;
    customer: {
      name: string;
      email: string;
    } | null;
  } | null;
};

export default function AdminQuoteQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuoteQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<QuoteQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('unanswered');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_questions')
        .select(`
          *,
          quote:quotes_new!inner(
            number,
            title,
            customer:customers(name, email)
          )
        `)
        .order('asked_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err: any) {
      console.error('Failed to fetch questions:', err);
      toast.error('Kunde inte hämta frågor');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerQuestion = async () => {
    if (!selectedQuestion || !answer.trim()) {
      toast.error('Ange ett svar');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('answer-quote-question', {
        body: {
          question_id: selectedQuestion.id,
          answer: answer.trim(),
          customer_email: selectedQuestion.customer_email || selectedQuestion.quote?.customer?.email
        }
      });

      if (error) throw error;

      toast.success('Svar skickat till kund!');
      setSelectedQuestion(null);
      setAnswer('');
      fetchQuestions();
    } catch (err: any) {
      console.error('Failed to answer question:', err);
      toast.error('Kunde inte skicka svar');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'unanswered') return !q.answered;
    if (filter === 'answered') return q.answered;
    return true;
  });

  const unansweredCount = questions.filter(q => !q.answered).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <AdminBack />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <CardTitle>Kundfrågor om offerter</CardTitle>
              {unansweredCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unansweredCount} obesvarade
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'unanswered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unanswered')}
            >
              Obesvarade ({unansweredCount})
            </Button>
            <Button
              variant={filter === 'answered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('answered')}
            >
              Besvarade ({questions.filter(q => q.answered).length})
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Alla ({questions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Inga frågor att visa</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map(question => (
                <Card 
                  key={question.id}
                  className={`border ${!question.answered ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="link"
                              className="p-0 h-auto font-semibold text-primary hover:underline"
                              onClick={() => navigate(`/admin/quotes?id=${question.quote_id}`)}
                            >
                              {question.quote?.number || 'Okänd offert'}
                            </Button>
                            {!question.answered && (
                              <Badge variant="destructive" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Väntar på svar
                              </Badge>
                            )}
                            {question.answered && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Besvarad
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {question.quote?.title}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{format(new Date(question.asked_at), 'PPP', { locale: sv })}</p>
                          <p className="text-xs">{format(new Date(question.asked_at), 'HH:mm')}</p>
                        </div>
                      </div>

                      {/* Customer & Question */}
                      <div className="space-y-2 border-l-2 border-muted pl-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{question.customer_name}</span>
                          {question.customer_email && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {question.customer_email}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm">{question.question}</p>
                      </div>

                      {/* Answer (if exists) */}
                      {question.answered && question.answer && (
                        <div className="space-y-2 bg-muted/50 rounded-lg p-3 border-l-2 border-primary">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-primary">Ditt svar:</span>
                            {question.answered_at && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(question.answered_at), 'PPP HH:mm', { locale: sv })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{question.answer}</p>
                        </div>
                      )}

                      {/* Actions */}
                      {!question.answered && (
                        <div className="flex justify-end pt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question);
                              setAnswer('');
                            }}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Svara på fråga
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Dialog */}
      <Dialog 
        open={!!selectedQuestion} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedQuestion(null);
            setAnswer('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Svara på kundfråga</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              {/* Quote Info */}
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="text-sm font-medium">
                  {selectedQuestion.quote?.number} - {selectedQuestion.quote?.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Kund: {selectedQuestion.customer_name}
                  {selectedQuestion.customer_email && ` (${selectedQuestion.customer_email})`}
                </p>
              </div>

              {/* Customer Question */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Kundens fråga:</p>
                <p className="text-sm bg-muted p-3 rounded-lg border-l-2 border-primary">
                  {selectedQuestion.question}
                </p>
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ditt svar:</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Skriv ditt svar här..."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Ditt svar skickas via email till kunden
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedQuestion(null);
                    setAnswer('');
                  }}
                >
                  Avbryt
                </Button>
                <Button
                  onClick={handleAnswerQuestion}
                  disabled={submitting || !answer.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Skickar...' : 'Skicka svar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
