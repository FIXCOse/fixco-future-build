import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCopy } from "@/copy/CopyProvider";
import { useToast } from "@/hooks/use-toast";
import { aiEditImage, callAiChat, type AiMessage } from "@/features/ai/lib/ai";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export function FloatingAIWidget() {
  const { t } = useCopy();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "image">("chat");
  const [messages, setMessages] = useState<AiMessage[]>([
    { role: "system", content: "Du är Fixco AI-assistent. Hjälp användare med frågor om tjänster, visualiseringar och offerter." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [instruction, setInstruction] = useState("");
  const [resultUrl, setResultUrl] = useState<string>("");

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
    
    const userMessage: AiMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setBusy(true);

    try {
      const result = await callAiChat([...messages, userMessage], [
        "get_services",
        "estimate_quote",
        "create_lead"
      ]);
      
      const assistantMessage: AiMessage = {
        role: "assistant",
        content: result.response || result.message || "Tack för din fråga!"
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: t('ai_widget.error')
      }]);
    } finally {
      setBusy(false);
    }
  }

  async function onGenerate() {
    if (!file || !instruction.trim() || busy) return;
    
    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: t('ailab.error_file_type'),
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: t('ailab.error_file_size'),
        variant: 'destructive'
      });
      return;
    }

    setBusy(true);
    try {
      const url = await aiEditImage(file, instruction);
      setResultUrl(url);
      toast({
        title: "Visualisering skapad!",
        description: "Öppna i full AI för fler alternativ"
      });
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: t('ai_widget.error'),
        variant: 'destructive'
      });
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        aria-label={t('ai_widget.launcher')}
        onClick={() => setOpen(true)}
        className="fixed left-4 bottom-4 z-50 rounded-full px-5 py-3 shadow-2xl border-2 bg-background hover:bg-muted transition-all hover:scale-105 font-semibold"
      >
        {t('ai_widget.launcher')}
      </button>
    );
  }

  return (
    <>
      {/* Launcher button (minimized state) */}
      <button
        aria-label={t('ai_widget.launcher')}
        onClick={() => setOpen(!open)}
        className="fixed left-4 bottom-4 z-50 rounded-full px-5 py-3 shadow-2xl border-2 bg-background hover:bg-muted transition-all hover:scale-105 font-semibold"
      >
        {t('ai_widget.launcher')}
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed left-4 bottom-20 z-50 w-[380px] max-h-[600px] overflow-hidden rounded-2xl border-2 bg-background shadow-2xl animate-in slide-in-from-bottom-8"
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
                  {t('ai_widget.greeting')}
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 space-y-2 bg-muted/10">
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder={t('ai_widget.chat_placeholder')}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend()}
                  disabled={busy}
                />
                <Button onClick={onSend} disabled={busy || !input.trim()}>
                  {t('ai_widget.send')}
                </Button>
              </div>
              <div className="flex justify-between text-xs">
                <a href="/ai" className="text-primary hover:underline">
                  {t('ai_widget.open_full')}
                </a>
                <a href="/ai" className="text-primary hover:underline">
                  {t('ai_widget.create_offer')}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3 h-[440px] overflow-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('ai_widget.upload_file')}</label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('ailab.custom_instruction')}</label>
              <Textarea
                rows={3}
                placeholder={t('ai_widget.image_instruction_placeholder')}
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
              />
            </div>

            <Button
              onClick={onGenerate}
              disabled={busy || !file || !instruction.trim()}
              className="w-full"
            >
              {busy ? t('ailab.visualizing') : t('ai_widget.generate')}
            </Button>

            {resultUrl && (
              <div className="space-y-3 mt-4">
                <img
                  src={resultUrl}
                  alt={t('ailab.after_title')}
                  className="w-full rounded-lg border-2"
                />
                <a
                  href="/ai"
                  className="block text-center text-sm text-primary hover:underline font-medium"
                >
                  {t('ai_widget.open_full')}
                </a>
                <p className="text-xs text-muted-foreground">
                  {t('ailab.disclaimer')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
