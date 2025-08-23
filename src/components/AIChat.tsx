import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Phone, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesDataNew } from '@/data/servicesDataNew';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface ChatIntent {
  type: 'service_request' | 'pricing_inquiry' | 'rot_rut_question' | 'booking_request' | 'emergency';
  confidence: number;
  data?: any;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    location: '',
    service: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple intent detection
  const detectIntent = (message: string): ChatIntent => {
    const lowerMessage = message.toLowerCase();
    
    // Emergency keywords
    if (lowerMessage.includes('akut') || lowerMessage.includes('kris') || lowerMessage.includes('läckage')) {
      return { type: 'emergency', confidence: 0.9 };
    }
    
    // ROT/RUT questions
    if (lowerMessage.includes('rot') || lowerMessage.includes('rut') || lowerMessage.includes('avdrag')) {
      return { type: 'rot_rut_question', confidence: 0.8 };
    }
    
    // Price inquiries
    if (lowerMessage.includes('pris') || lowerMessage.includes('kostar') || lowerMessage.includes('kostnad')) {
      return { type: 'pricing_inquiry', confidence: 0.8 };
    }
    
    // Booking requests
    if (lowerMessage.includes('boka') || lowerMessage.includes('besök') || lowerMessage.includes('tid')) {
      return { type: 'booking_request', confidence: 0.7 };
    }
    
    // Service requests (default)
    return { type: 'service_request', confidence: 0.6 };
  };

  const generateResponse = (intent: ChatIntent, userMessage: string): string => {
    switch (intent.type) {
      case 'emergency':
        return `Jag förstår att du har ett akut ärende! Ring oss direkt på 070-123 45 67 för omedelbar hjälp. Vi har jour 24/7 för akuta situationer.`;
      
      case 'rot_rut_question':
        return `ROT-avdrag ger dig 50% rabatt på arbetskostnaden! Vi sköter hela processen åt dig - från ansökan till utbetalning. Vårt pris med ROT-avdrag börjar på 480 kr/h. Vill du veta mer om vilka tjänster som är ROT-berättigade?`;
      
      case 'pricing_inquiry':
        return `Våra priser varierar beroende på tjänst:\n\n• Med ROT-avdrag: från 480 kr/h\n• Utan avdrag: från 959 kr/h\n• Fasta priser för vissa tjänster\n\nVad för typ av arbete behöver du hjälp med? Då kan jag ge dig ett mer exakt prisförslag.`;
      
      case 'booking_request':
        return `Perfekt! Jag hjälper dig att boka. Vi startar oftast inom 5 dagar. För att ge dig bästa service behöver jag:\n\n1. Ditt namn\n2. Telefonnummer\n3. Vilken ort\n4. Typ av arbete\n\nKan du berätta lite mer?`;
      
      default:
        return `Hej! Jag hjälper dig gärna med information om våra tjänster. Vi erbjuder allt från småreparationer till stora renoveringar. Vad kan jag hjälpa dig med idag?`;
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const intent = detectIntent(inputValue);
      const response = generateResponse(intent, inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickStart = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage();
  };

  const quickStarts = [
    "Starta offert",
    "Fråga om ROT-avdrag", 
    "Hitta tjänst",
    "Boka hembesök"
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-premium flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-card border border-border rounded-xl shadow-premium flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Fixco Assistent</h3>
                  <p className="text-xs text-muted-foreground">Alltid redo att hjälpa</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-2 text-sm">
                      Hej! Jag är din AI-assistent. Vad kan jag hjälpa dig med?
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickStarts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickStart(prompt)}
                        className="text-xs p-2 bg-primary/10 hover:bg-primary/20 rounded border text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    message.type === 'user' ? 'bg-accent' : 'bg-primary'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3 text-accent-foreground" />
                    ) : (
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className={`rounded-lg p-2 text-sm max-w-[200px] ${
                    message.type === 'user' 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Skriv ditt meddelande..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;