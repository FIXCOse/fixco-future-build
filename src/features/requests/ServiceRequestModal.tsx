import { useEffect, useMemo, useState } from "react";
import { getServiceBySlug, ServiceConfig } from "./serviceConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type OpenModalDetail = {
  serviceSlug?: string;
  prefill?: Record<string, any>;
};

export function openServiceRequestModal(detail: OpenModalDetail) {
  window.dispatchEvent(new CustomEvent("openServiceRequestModal", { detail }));
}

export default function ServiceRequestModal() {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<ServiceConfig | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<OpenModalDetail>;
      const slug = ce.detail?.serviceSlug;
      const svc = slug ? getServiceBySlug(slug) : null;
      setService(svc ?? null);
      setValues(ce.detail?.prefill ?? {});
      setFiles({});
      setDone(false);
      setOpen(true);
    };
    window.addEventListener("openServiceRequestModal", onOpen);
    return () => window.removeEventListener("openServiceRequestModal", onOpen);
  }, []);

  function onChange(key: string, val: any) {
    setValues(v => ({ ...v, [key]: val }));
  }

  function onFiles(key: string, list: FileList | null) {
    setFiles(f => ({ ...f, [key]: list ? Array.from(list) : [] }));
  }

  const isQuote = service?.pricingMode === "quote";
  const isUnit = service?.pricingMode === "unit";
  const isFixed = service?.pricingMode === "fixed";

  const pricePreview = useMemo(() => {
    if (!service) return null;
    if (isUnit && service.unitPriceSek && values["antal"]) {
      const qty = Number(values["antal"] || 0);
      if (!qty) return null;
      const total = qty * service.unitPriceSek;
      return `${total.toLocaleString("sv-SE")} kr`;
    }
    if (isFixed && service.fixedPriceSek) {
      return `${service.fixedPriceSek.toLocaleString("sv-SE")} kr`;
    }
    return null;
  }, [service, values, isUnit, isFixed]);

  async function onSubmit() {
    if (!service) return;
    if (!values.name || !values.email) {
      toast.error("Namn och e-post krävs");
      return;
    }

    setBusy(true);
    try {
      const type = isQuote ? "quote_request" : "booking";
      
      // Upload files first if any
      const fileUrls: string[] = [];
      for (const [key, fileList] of Object.entries(files)) {
        for (const file of fileList) {
          const path = `requests/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('booking-attachments')
            .upload(path, file);
          
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('booking-attachments')
              .getPublicUrl(path);
            fileUrls.push(publicUrl);
          }
        }
      }

      // Create the request based on type
      if (type === "booking") {
        const { error } = await supabase.from('bookings').insert({
          service_id: service.slug,
          service_name: service.name,
          contact_name: values.name,
          contact_email: values.email,
          contact_phone: values.phone,
          address: values.address,
          description: JSON.stringify(values),
          price_type: service.pricingMode === 'unit' ? 'unit' : 'fixed',
          base_price: service.unitPriceSek || service.fixedPriceSek || 0,
          final_price: isUnit && values.antal 
            ? (Number(values.antal) * (service.unitPriceSek || 0))
            : (service.fixedPriceSek || 0),
          rot_eligible: service.rotEligible,
          attachments: fileUrls,
          status: 'pending',
          source: 'ai_widget'
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.from('quote_requests').insert({
          service_id: service.slug,
          service_name: service.name,
          contact_name: values.name,
          contact_email: values.email,
          contact_phone: values.phone,
          address: values.address,
          message: JSON.stringify(values),
          attachments: fileUrls,
          status: 'new',
          source: 'ai_widget'
        });

        if (error) throw error;
      }

      toast.success("Tack! Vi återkommer så snart som möjligt.");
      setDone(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      toast.error("Kunde inte skicka. Försök igen.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative w-full md:w-[640px] bg-card rounded-t-2xl md:rounded-2xl shadow-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-foreground">
            {service?.name ?? "Begär offert / boka"}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="px-2 py-1 rounded hover:bg-muted"
            aria-label="Stäng"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div className="p-3 text-sm text-foreground">
            Tack! Vi återkommer så snart som möjligt.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <input
              className="border border-border rounded px-3 py-2 bg-background text-foreground"
              placeholder="Namn"
              value={values.name || ""}
              onChange={e => onChange("name", e.target.value)}
            />
            <input
              className="border border-border rounded px-3 py-2 bg-background text-foreground"
              placeholder="E-post"
              type="email"
              value={values.email || ""}
              onChange={e => onChange("email", e.target.value)}
            />
            <input
              className="border border-border rounded px-3 py-2 bg-background text-foreground"
              placeholder="Telefon"
              value={values.phone || ""}
              onChange={e => onChange("phone", e.target.value)}
            />
            <input
              className="border border-border rounded px-3 py-2 bg-background text-foreground"
              placeholder="Adress"
              value={values.address || ""}
              onChange={e => onChange("address", e.target.value)}
            />

            {service?.fields.map((f, idx) => {
              if (f.kind === "text")
                return (
                  <input
                    key={idx}
                    className="border border-border rounded px-3 py-2 bg-background text-foreground"
                    placeholder={f.label}
                    value={values[f.key] || ""}
                    onChange={e => onChange(f.key, e.target.value)}
                  />
                );
              if (f.kind === "number")
                return (
                  <input
                    key={idx}
                    type="number"
                    className="border border-border rounded px-3 py-2 bg-background text-foreground"
                    placeholder={f.label}
                    min={f.min}
                    max={f.max}
                    value={values[f.key] || ""}
                    onChange={e => onChange(f.key, e.target.value)}
                  />
                );
              if (f.kind === "textarea")
                return (
                  <textarea
                    key={idx}
                    className="md:col-span-2 border border-border rounded px-3 py-2 bg-background text-foreground"
                    rows={3}
                    placeholder={f.placeholder ?? f.label}
                    value={values[f.key] || ""}
                    onChange={e => onChange(f.key, e.target.value)}
                  />
                );
              if (f.kind === "file")
                return (
                  <div key={idx} className="md:col-span-2">
                    <label className="text-xs text-muted-foreground">{f.label}</label>
                    <input
                      type="file"
                      accept={f.accept ?? "*/*"}
                      multiple={f.multiple}
                      onChange={e => onFiles(f.key, e.target.files)}
                      className="w-full"
                    />
                  </div>
                );
              return null;
            })}

            <div className="md:col-span-2 text-sm">
              {!isQuote && pricePreview && (
                <div className="mb-1 text-foreground">
                  Uppskattat totalpris: <strong>{pricePreview}</strong> (inkl. moms)
                </div>
              )}
              <div className="text-[11px] text-muted-foreground">
                Priser i chatten visas inte. Offert/pris bekräftas efter platsbesök. ROT kan
                vara aktuellt (indikativt på arbete).
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-1">
              <button
                className="px-3 py-2 rounded border border-border hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Avbryt
              </button>
              <button
                className="px-3 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                disabled={busy}
                onClick={onSubmit}
              >
                {busy ? "Skickar…" : isQuote ? "Skicka offertförfrågan" : "Skicka bokning"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
