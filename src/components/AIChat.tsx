import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Phone, User, Bot, Calculator, Calendar, Upload, FileImage, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { conversationManager } from './AIChat/ConversationManager';
import { ChatMode, Message, ChatAttachment, LeadData } from './AIChat/types';
import WhatsAppButton from './WhatsAppButton';
import { calcDisplayPrice } from '@/utils/priceCalculation';
import { usePriceStore } from '@/stores/priceStore';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [leadData, setLeadData] = useState<LeadData>({ consent: {} });
  const [calculatorData, setCalculatorData] = useState<any>({});
  const [showConsentForm, setShowConsentForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mode: priceMode } = usePriceStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Ladda befintliga meddelanden från konversationshanteraren
    setMessages(conversationManager.messages);
    setCurrentMode(conversationManager.currentState.mode);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validera filtyp och storlek
    if (!file.type.startsWith('image/')) {
      alert('Endast bilder är tillåtna');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Filen är för stor. Max 5MB.');
      return;
    }

    // Skapa attachment object
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment: ChatAttachment = {
        id: Date.now().toString(),
        type: 'image',
        url: e.target?.result as string,
        name: file.name,
        size: file.size,
        mimeType: file.type
      };
      
      setAttachments(prev => [...prev, attachment]);
      setShowConsentForm(true);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsTyping(true);

    try {
      // Använd avancerad konversationshanterare
      const response = await conversationManager.processMessage(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        type: 'bot',
        timestamp: new Date(),
        metadata: response.data
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Hantera mode-ändringar
      if (response.modeChange) {
        setCurrentMode(response.modeChange as ChatMode);
      }

      // Hantera data-uppdateringar
      if (response.data) {
        if (response.data.service) {
          setCalculatorData(response.data);
        }
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Ursäkta, något gick fel. Försök igen eller ring oss direkt på +46 79 335 02 28.',
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleQuickStart = async (prompt: string) => {
    setInputValue(prompt);
    await handleSendMessage();
  };

  const quickStarts = [
    "Starta offert",
    "Fråga om ROT-avdrag", 
    "Hitta tjänst",
    "Boka hembesök"
  ];

  const renderModeContent = () => {
    switch (currentMode) {
      case 'calculator':
        return renderCalculatorMode();
      case 'form':
        return renderFormMode();
      case 'booking':
        return renderBookingMode();
      default:
        return renderChatMode();
    }
  };

  const renderCalculatorMode = () => {
    if (!calculatorData.service) return null;

    const service = calculatorData.service;
    const priceCalc = calcDisplayPrice(service, priceMode);

    return (
      <div className="p-4 bg-muted/50 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Prisberäkning</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tjänst:</span>
            <span className="font-medium">{service.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Ordinarie pris:</span>
            <span>{service.basePrice} kr/h</span>
          </div>
          {priceCalc.savings > 0 && (
            <>
              <div className="flex justify-between text-green-600">
                <span>ROT/RUT-avdrag:</span>
                <span>-{Math.round(priceCalc.savings)} kr</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Ditt pris:</span>
                <span className="text-primary">{priceCalc.display}</span>
              </div>
            </>
          )}
        </div>
        <Button 
          onClick={() => setCurrentMode('form')} 
          className="w-full mt-3" 
          size="sm"
        >
          Boka hembesök
        </Button>
      </div>
    );
  };

  const renderFormMode = () => (
    <div className="p-4 bg-muted/50 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-4 w-4 text-primary" />
        <h4 className="font-semibold">Kontaktuppgifter</h4>
      </div>
      <div className="space-y-3">
        <Input
          placeholder="Ditt namn"
          value={leadData.name || ''}
          onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
        />
        <Input
          placeholder="Telefonnummer"
          value={leadData.phone || ''}
          onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
        />
        <Input
          placeholder="Ort/adress"
          value={leadData.location || ''}
          onChange={(e) => setLeadData(prev => ({ ...prev, location: e.target.value }))}
        />
        <Button 
          onClick={() => setCurrentMode('booking')} 
          className="w-full" 
          size="sm"
          disabled={!leadData.name || !leadData.phone || !leadData.location}
        >
          Nästa steg
        </Button>
      </div>
    </div>
  );

  const renderBookingMode = () => (
    <div className="p-4 bg-muted/50 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <h4 className="font-semibold">Välj tid</h4>
      </div>
      <div className="space-y-2 text-sm">
        <p>Vi kontaktar dig inom 2 timmar för att bekräfta tid och plats.</p>
        <Button className="w-full" size="sm">
          Bekräfta bokning
        </Button>
      </div>
    </div>
  );

  const renderChatMode = () => null;

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
                      Hej! Jag kan hjälpa dig med ditt hemprojekt. Vad kan jag hjälpa dig med?
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

              {/* Mode-specific content */}
              {renderModeContent()}

              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
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
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((att) => (
                            <div key={att.id} className="flex items-center gap-2 p-1 bg-background/50 rounded">
                              <FileImage className="h-3 w-3" />
                              <span className="text-xs truncate">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="flex gap-2 p-2 bg-muted/30 rounded-lg">
                  {attachments.map((att) => (
                    <div key={att.id} className="relative">
                      <img 
                        src={att.url} 
                        alt={att.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                      >
                        <Trash2 className="h-2 w-2" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Consent form */}
              {showConsentForm && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={leadData.consent.imageStorage || false}
                      onChange={(e) => setLeadData(prev => ({
                        ...prev,
                        consent: { ...prev.consent, imageStorage: e.target.checked }
                      }))}
                      className="mt-0.5"
                    />
                    <span>Jag samtycker till att bilden lagras till mitt ärende enligt <a href="#" className="underline">integritetspolicyn</a></span>
                  </label>
                </div>
              )}

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
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Skriv ditt meddelande..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="text-sm pr-8"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title="Bifoga bild"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={(!inputValue.trim() && attachments.length === 0) || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick actions */}
              <div className="flex gap-2 mt-2">
                <WhatsAppButton />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = 'tel:0701234567'}
                  className="text-xs"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Ring nu
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