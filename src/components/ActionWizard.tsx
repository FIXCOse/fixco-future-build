import { createPortal } from "react-dom";
import { useActionWizard } from "@/stores/actionWizardStore";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";

export function ModalHost() {
  const { isOpen, mode, payload, close } = useActionWizard();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("[ModalHost] mounted");
    setReady(true);
  }, []);

  useEffect(() => {
    console.log("[ModalHost] state changed:", { isOpen, mode });
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!ready || !isOpen) return null;

  return createPortal(
    <div
      aria-modal
      role="dialog"
      tabIndex={-1}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      {/* Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl">
        <button
          onClick={close}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          aria-label="Stäng"
        >
          <X className="h-4 w-4" />
        </button>
        <ActionWizardInner mode={mode!} payload={payload!} onClose={close} />
      </div>
    </div>,
    document.body
  );
}

function ActionWizardInner({
  mode, payload, onClose
}: { mode: "book" | "quote"; payload: any; onClose: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    postal_code: "",
    city: "",
    rot_rut_type: null as null | "ROT" | "RUT",
    description: "",
    price_type: payload?.defaults?.priceType ?? (mode === "book" ? "hourly" : "quote"),
    hours_estimated: undefined as number | undefined,
    hourly_rate: payload?.defaults?.hourlyRate ?? undefined,
    notes: "",
  });

  const onChange = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  async function submit() {
    setLoading(true);
    try {
      const base = {
        service_id: payload?.serviceId ?? null,
        service_name: payload?.serviceName ?? null,
        contact_name: form.contact_name?.trim() || null,
        contact_email: form.contact_email?.trim() || null,
        contact_phone: form.contact_phone?.trim() || null,
        address: form.address?.trim() || null,
        postal_code: form.postal_code?.trim() || null,
        city: form.city?.trim() || null,
        rot_rut_type: form.rot_rut_type,
        description: form.description?.trim() || null,
        price_type: form.price_type,
        hours_estimated: form.hours_estimated ?? null,
        hourly_rate: form.hourly_rate ?? null,
        internal_notes: form.notes?.trim() || null,
        customer_id: user?.id ?? null,
        created_by_type: user ? "user" : "guest",
        source: user ? "user" : "guest",
      };

      if (mode === "book") {
        const { error } = await supabase.from("bookings").insert({
          ...base,
          base_price: form.hourly_rate || 0,
          final_price: form.hourly_rate || 0,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("quote_requests").insert(base);
        if (error) throw error;
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Kunde inte skicka. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-foreground">
        {mode === "book" ? "Boka tjänst" : "Begär offert"}
      </h2>
      
      {payload?.serviceName && (
        <p className="text-sm text-muted-foreground">
          Tjänst: {payload.serviceName}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_name">Namn *</Label>
              <Input
                id="contact_name"
                value={form.contact_name}
                onChange={(e) => onChange("contact_name", e.target.value)}
                placeholder="Ditt namn"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Telefon *</Label>
              <Input
                id="contact_phone"
                value={form.contact_phone}
                onChange={(e) => onChange("contact_phone", e.target.value)}
                placeholder="070-123 45 67"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="contact_email">E-post *</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => onChange("contact_email", e.target.value)}
              placeholder="din@email.se"
            />
          </div>

          <div>
            <Label htmlFor="address">Adress</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Gata 123"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">Postnummer</Label>
              <Input
                id="postal_code"
                value={form.postal_code}
                onChange={(e) => onChange("postal_code", e.target.value)}
                placeholder="12345"
              />
            </div>
            <div>
              <Label htmlFor="city">Ort</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Stockholm"
              />
            </div>
          </div>

          <div>
            <Label>ROT/RUT-avdrag</Label>
            <Select value={form.rot_rut_type || ""} onValueChange={(v) => onChange("rot_rut_type", v || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Välj avdrag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Inget avdrag</SelectItem>
                <SelectItem value="ROT">ROT-avdrag</SelectItem>
                <SelectItem value="RUT">RUT-avdrag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            onClick={() => setStep(2)}
            disabled={!form.contact_name || !form.contact_email || !form.contact_phone}
          >
            Fortsätt
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Beskriv vad som behöver göras..."
              rows={3}
            />
          </div>

          {mode === "book" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours_estimated">Antal timmar</Label>
                  <Input
                    id="hours_estimated"
                    type="number"
                    value={form.hours_estimated || ""}
                    onChange={(e) => onChange("hours_estimated", parseFloat(e.target.value) || undefined)}
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label htmlFor="hourly_rate">Timpris (kr)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={form.hourly_rate || ""}
                    onChange={(e) => onChange("hourly_rate", parseFloat(e.target.value) || undefined)}
                    placeholder="650"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setStep(1)}
            >
              Tillbaka
            </Button>
            <Button 
              disabled={loading} 
              className="flex-1" 
              onClick={submit}
            >
              {loading ? "Skickar..." : `Skicka ${mode === "book" ? "bokning" : "förfrågan"}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}