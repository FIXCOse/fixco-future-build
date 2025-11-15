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
import { GradientText } from "@/components/v2/GradientText";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { useServiceAddons, SelectedAddon } from "@/hooks/useServiceAddons";

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
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={close} />
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
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const { data: addons = [] } = useServiceAddons(payload?.serviceId || null);

  // Debug logging
  console.log('🔍 [ActionWizard] Opened with:', { 
    serviceId: payload?.serviceId, 
    serviceName: payload?.serviceName,
    addonsCount: addons.length,
    addons: addons.map((a: any) => ({ id: a.id, title: a.title, price: a.addon_price }))
  });

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

  const toggleAddon = (addon: any) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.addon_id === addon.id);
      if (exists) {
        return prev.filter(a => a.addon_id !== addon.id);
      } else {
        return [...prev, {
          addon_id: addon.id,
          title: addon.title,
          price: addon.addon_price,
          quantity: 1,
        }];
      }
    });
  };

  const calculateTotal = () => {
    const basePrice = form.hourly_rate || 0;
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
    return basePrice + addonsTotal;
  };

  async function submit() {
    console.log("[WIZARD] Submit started", { mode, form, user });
    setLoading(true);
    
    try {
      // Get current session info
      const { data: session } = await supabase.auth.getSession();
      console.log("[WIZARD] Session:", session);

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
        selected_addons: JSON.stringify(selectedAddons),
        base_price: form.hourly_rate ?? 0,
        final_price: calculateTotal(),
        // Required fields for anonymous insert
        name: form.contact_name?.trim() || null,
        email: form.contact_email?.trim() || null,  
        phone: form.contact_phone?.trim() || null,
      };

      console.log("[WIZARD] Prepared payload:", base);

      // ALLT skapas som bokningar, oavsett mode
      console.log("[WIZARD] RPC create_booking_secure...");
      const { data, error } = await supabase.rpc('create_booking_secure', { p: base });
      console.log("[BOOKING][RPC] Result:", { data, error });
      if (error) throw error;
      console.log("[BOOKING] Success! ID:", data);
      alert(`${mode === "book" ? "Bokning" : "Offertförfrågan"} skickad! ID: ${String(data).slice(0, 8)}`);

      onClose();
    } catch (err: any) {
      console.error("[WIZARD] Submit error:", err);
      console.log("[WIZARD] Error details:", {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
      alert(`Fel: ${err.message || "Kunde inte skicka. Försök igen."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-foreground">
        {mode === "book" ? "Boka tjänst" : (
          <GradientText gradient="rainbow">
            Begär offert
          </GradientText>
        )}
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

          {/* Tilläggstjänster - Add-ons Section */}
          {(() => {
            console.log('🎨 [ActionWizard] Checking if addons section should render, addons.length:', addons.length);
            return addons.length > 0;
          })() && (
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-semibold">
                Lägg till extra tjänster (valfritt)
              </Label>
              
              <div className="space-y-2">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.some(a => a.addon_id === addon.id);
                  
                  return (
                    <div 
                      key={addon.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => toggleAddon(addon)}
                    >
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => toggleAddon(addon)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {addon.icon && <span className="text-lg">{addon.icon}</span>}
                          <span className="font-medium">{addon.title}</span>
                          <Badge variant="secondary" className="ml-auto">
                            +{addon.addon_price} {addon.price_unit}
                          </Badge>
                        </div>
                        
                        {addon.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {addon.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prissammanfattning - Price Summary */}
          {(form.hourly_rate || selectedAddons.length > 0) && (
            <div className="border-t pt-4 space-y-2 bg-muted/30 p-4 rounded-lg">
              {form.hourly_rate && form.hourly_rate > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Grundtjänst</span>
                  <span className="font-medium">{form.hourly_rate} kr</span>
                </div>
              )}
              
              {selectedAddons.map((addon) => (
                <div key={addon.addon_id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">+ {addon.title}</span>
                  <span className="font-medium">{addon.price} kr</span>
                </div>
              ))}
              
              <div className="flex justify-between font-semibold border-t pt-2 text-base">
                <span>Total uppskattad kostnad</span>
                <span className="text-primary">{calculateTotal()} kr</span>
              </div>
            </div>
          )}

          <div>
            <Label>ROT/RUT-avdrag (valfritt)</Label>
            <Select value={form.rot_rut_type || "none"} onValueChange={(v) => onChange("rot_rut_type", v === "none" ? null : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Välj avdrag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Inget avdrag</SelectItem>
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