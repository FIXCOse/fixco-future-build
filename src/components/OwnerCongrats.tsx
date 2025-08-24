import { useEffect } from "react";
import confetti from "canvas-confetti";

interface OwnerCongratsProps {
  open: boolean;
  onClose: () => void;
}

export function OwnerCongrats({ open, onClose }: OwnerCongratsProps) {
  useEffect(() => {
    if (!open) return;
    // Make chaos 🎉 – konfetti i vågor
    const end = Date.now() + 1500;
    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog" 
      aria-modal="true"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-[210] w-full max-w-[720px] rounded-2xl bg-card border shadow-2xl p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Stäng"
          className="absolute top-3 right-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
        >
          ×
        </button>

        <div className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            🎉 Stort grattis, Omar!
          </h1>
          <p className="text-lg text-muted-foreground">
            Ditt <span className="font-semibold text-primary">OWNER-konto</span> är nu aktiverat.
            Du har full kontroll över Fixco. Låt oss kicka igång!
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/mitt-fixco" 
              className="group rounded-xl border border-border p-4 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Gå till kontrollpanelen
              </div>
              <div className="text-sm text-muted-foreground">
                Överblick & snabblänkar
              </div>
            </a>
            
            <a 
              href="/admin/tjanster" 
              className="group rounded-xl border border-border p-4 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Skapa/hantera tjänster
              </div>
              <div className="text-sm text-muted-foreground">
                Lägg till eller redigera utbudet
              </div>
            </a>
            
            <a 
              href="/mitt-fixco/foretag" 
              className="group rounded-xl border border-border p-4 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Bjud in team & roller
              </div>
              <div className="text-sm text-muted-foreground">
                ADMIN/TECH mm
              </div>
            </a>
            
            <a 
              href="/mitt-fixco/properties" 
              className="group rounded-xl border border-border p-4 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Lägg till fastighet/BRF
              </div>
              <div className="text-sm text-muted-foreground">
                Spara adress för snabb bokning
              </div>
            </a>
          </div>

          <div className="mt-8">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-lg hover-scale"
            >
              Kör igång!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}