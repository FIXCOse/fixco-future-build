import { useEffect, useRef, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";
import { useToast } from "@/hooks/use-toast";
import { aiEditImage, callAiChat } from "@/features/ai/lib/ai";
import { FIXCO_SYSTEM_CONTEXT } from "@/features/ai/context/fixco-context";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FixcoFIcon } from '@/components/icons/FixcoFIcon';
import { GradientText } from '@/components/v2/GradientText';

// Tjänst-mappning för snabblänkar
const SERVICE_LINKS: Record<string, string> = {
  "bygga-altan": "/tjanster/altan",
  "akustikpanel": "/tjanster/akustikpaneler",
  "byt-golv": "/tjanster/golv",
  "platsbyggd-bokhylla": "/tjanster/platsbyggd-bokhylla",
  "platsbyggd-garderob": "/tjanster/platsbyggd-garderob",
  "byta-eluttag": "/tjanster/byta-eluttag",
  "installera-spotlights": "/tjanster/installera-spotlights",
  "led-installation": "/tjanster/led-installation",
  "malning": "/tjanster/malning",
};

// Detektera tjänst från användarens meddelande
function detectServiceSlug(text: string): string | null {
  const t = text.toLowerCase();
  if (/(altan|trall|trädäck|uteplats)/.test(t)) return "bygga-altan";
  if (/(akustikpanel|ljudpanel|panel)/.test(t)) return "akustikpanel";
  if (/(golv|parkett|laminat|vinylgolv)/.test(t)) return "byt-golv";
  if (/(bokhylla|hyllor)/.test(t)) return "platsbyggd-bokhylla";
  if (/(garderob|förvaring|klädförvaring|skåp)/.test(t)) return "platsbyggd-garderob";
  if (/(eluttag|uttag)/.test(t)) return "byta-eluttag";
  if (/(spotlight|spot|taklampa)/.test(t)) return "installera-spotlights";
  if (/(led|belysning|lampor)/.test(t)) return "led-installation";
  if (/(målning|måla|tapetsera)/.test(t)) return "malning";
  return null;
}

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export function FloatingAIWidget() {
  const navigate = useNavigate();
  const { t } = useCopy();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "image">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: "system", 
      content: FIXCO_SYSTEM_CONTEXT
    }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [instruction, setInstruction] = useState("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [variants, setVariants] = useState<string[]>([]);

  // Detekterad tjänst för CTA-kort
  const [detectedSlug, setDetectedSlug] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ESC closes panel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function onSend() {
    if (!input.trim() || busy) return;
    
    const userMessage: ChatMessage = { role: "user", content: input };
    const slug = detectServiceSlug(input);
    setDetectedSlug(slug);
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setBusy(true);

    try {
      const result = await callAiChat([...messages, userMessage], [
        "get_services",
        "estimate_quote",
        "create_lead"
      ]);
      
      const content = result.messages?.[0]?.content || result.content || "Hur kan jag hjälpa dig?";
      
      // Trunkera extremt långa svar för widget
      const truncated = content.length > 600 ? content.slice(0, 600) + "..." : content;
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: truncated
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Något gick fel. Försök igen eller begär offert direkt."
      }]);
    } finally {
      setBusy(false);
    }
  }

  function navigateToService(slug: string) {
    const url = SERVICE_LINKS[slug];
    if (url) {
      navigate(url);
      setOpen(false);
    }
  }

  function openOfferModal(prefillMsg?: string) {
    openServiceRequestModal({
      serviceSlug: detectedSlug || undefined,
      prefill: prefillMsg ? { onskemal: prefillMsg } : {}
    });
  }

  async function onGenerate() {
    if (!file || !instruction.trim() || busy) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Endast JPG, PNG eller WEBP tillåtna",
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: "Max 15 MB per bild",
        variant: 'destructive'
      });
      return;
    }

    setBusy(true);
    try {
      const mainVariant = await aiEditImage(file, instruction);
      const variant2 = await aiEditImage(file, instruction + ' - variant med ljusare toner');
      const variant3 = await aiEditImage(file, instruction + ' - variant med mörkare toner');
      
      const allVariants = [mainVariant, variant2, variant3];
      setVariants(allVariants);
      setResultUrl(mainVariant);
      
      toast({
        title: "3 visualiseringar skapade!",
        description: "Välj den du gillar bäst"
      });
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Något gick fel. Försök igen.",
        variant: 'destructive'
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-label="Öppna AI-chatt med Fixco"
              onClick={() => setOpen(!open)}
              className="group fixed right-4 bottom-20 z-[9999] h-14 px-3 rounded-full shadow-2xl border-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2.5"
            >
              {/* Pulse animation bakom */}
              <span className="absolute inset-0 animate-pulse-slow opacity-20 rounded-full bg-primary-foreground" />
              
              {/* Logo och chattikon */}
              <div className="relative flex items-center gap-2">
                <FixcoFIcon className="w-7 h-7" />
                <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium">
            Chatta med Fixco AI
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed right-4 bottom-36 z-[9999] w-[380px] max-h-[600px] overflow-hidden rounded-2xl border-2 bg-background shadow-2xl animate-in slide-in-from-bottom-8"
          role="dialog"
          aria-modal="true"
          aria-label={t('ai_widget.title')}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="font-bold text-lg">{t('ai_widget.title')}</div>
          <button
            onClick={() => setOpen(false)}
            aria-label={t('ai_widget.close')}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-2 py-2 border-b bg-muted/10">
          <button
            onClick={() => setTab("chat")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "chat"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            }`}
          >
            {t('ai_widget.tab_chat')}
          </button>
          <button
            onClick={() => setTab("image")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "image"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            }`}
          >
            {t('ai_widget.tab_image')}
          </button>
        </div>

        {/* Content */}
        {tab === "chat" ? (
          <div className="flex flex-col h-[440px]">
            {/* Messages */}
            <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
              {messages.filter(m => m.role !== "system").length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Hej! Ladda upp en bild i <strong>Bild</strong> eller ställ en fråga här.
                </div>
              )}
              {messages
                .filter(m => m.role !== "system")
                .map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "assistant" ? "flex justify-start" : "flex justify-end"}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-2xl max-w-[85%] ${
                        m.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              
              {/* CTA-kort om tjänst upptäcktes */}
              {detectedSlug && (
                <div className="mt-3 p-3 border rounded-xl bg-muted/30 text-sm space-y-2">
                  <div className="font-medium">Snabba val</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigateToService(detectedSlug)}
                    >
                      Visa tjänst
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openOfferModal(`Intresserad av: ${detectedSlug.replace(/-/g, " ")}`)}
                    >
                      Begär offert
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Inga priser i chatten – vi återkommer med offert.
                  </p>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 space-y-2 bg-muted/10">
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Skriv din fråga..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend()}
                  disabled={busy}
                />
                <Button onClick={onSend} disabled={busy || !input.trim()}>
                  Skicka
                </Button>
              </div>
              <div className="flex justify-between text-xs">
                <button 
                  onClick={() => navigate("/ai")}
                  className="text-primary hover:underline"
                >
                  Öppna full AI
                </button>
                <button 
                  className="text-primary hover:underline"
                  onClick={() => openOfferModal()}
                >
                  <GradientText gradient="rainbow">
                    Begär offert
                  </GradientText>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3 h-[440px] overflow-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ladda upp bild</label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Beskriv önskad förändring</label>
              <Textarea
                rows={3}
                placeholder="Ex: Lägg akustikpanel i mörk ek på väggen bakom TV:n"
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
              />
            </div>

            <Button
              onClick={onGenerate}
              disabled={busy || !file || !instruction.trim()}
              className="w-full"
            >
              {busy ? "Genererar..." : "Generera efter-bild"}
            </Button>

            {resultUrl && (
              <div className="space-y-3 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vald visualisering</label>
                  <img
                    src={resultUrl}
                    alt="Efter-bild"
                    className="w-full rounded-lg border-2 border-primary"
                  />
                </div>

                {variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Välj variant</label>
                    <div className="grid grid-cols-3 gap-2">
                      {variants.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setResultUrl(url)}
                          className={`
                            rounded-lg overflow-hidden border-2 transition-all
                            ${resultUrl === url ? 'border-primary' : 'border-border hover:border-primary/50'}
                          `}
                        >
                          <img
                            src={url}
                            alt={`Variant ${idx + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate("/ai")}
                  className="block text-center text-sm text-primary hover:underline font-medium w-full"
                >
                  Öppna i full AI
                </button>
                <p className="text-xs text-muted-foreground">
                  Visualisering – färg/struktur kan avvika från verkligt material.
                </p>
              </div>
            )}
          </div>
        )}
        </div>
      )}
    </>
  );
}
