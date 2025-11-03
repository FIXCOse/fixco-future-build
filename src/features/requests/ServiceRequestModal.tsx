import { useEffect, useMemo, useState, useCallback } from "react";
import { getServiceBySlug, ServiceConfig } from "./serviceConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  serviceRequestSchema,
  nameSchema,
  emailSchema,
  phoneSchema,
  personnummerSchema,
  addressSchema,
  postalCodeSchema,
  citySchema
} from "./bookingValidation";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<OpenModalDetail>;
      const slug = ce.detail?.serviceSlug;
      const prefill = ce.detail?.prefill ?? {};
      
      // Try to find predefined config
      let svc = slug ? getServiceBySlug(slug) : null;
      
      // FALLBACK: If no config found, create a generic one for ANY service
      if (!svc && slug) {
        svc = {
          slug: slug,
          name: prefill.service_name || slug.replace(/-/g, ' '),
          pricingMode: "quote" as const,
          rotEligible: true,
          fields: [
            { kind: "textarea" as const, key: "beskrivning", label: "Beskriv ditt projekt", placeholder: "Berätta vad du vill ha gjort..." },
            { kind: "file" as const, key: "bilder", label: "Bilder (valfritt)", accept: "image/*", multiple: true }
          ]
        };
      }
      
      // ALWAYS add file upload field if not present
      if (svc && !svc.fields.some(f => f.kind === "file")) {
        svc.fields.push({
          kind: "file" as const,
          key: "bilder",
          label: "Ladda upp bilder (valfritt)",
          accept: "image/*",
          multiple: true
        });
      }
      
      setService(svc ?? null);
      setValues(prefill);
      setFiles({});
      setDone(false);
      setOpen(true);
    };
    
    window.addEventListener("openServiceRequestModal", onOpen);
    return () => window.removeEventListener("openServiceRequestModal", onOpen);
  }, []);

  const [fieldToValidate, setFieldToValidate] = useState<{ key: string; value: any } | null>(null);
  const debouncedValidation = useDebounce(fieldToValidate, 300);

  // Validera fält i realtid med debounce
  useEffect(() => {
    if (!debouncedValidation) return;

    const { key, value } = debouncedValidation;
    
    const fieldSchema = {
      name: nameSchema,
      email: emailSchema,
      phone: phoneSchema,
      personnummer: personnummerSchema,
      address: addressSchema,
      postal_code: postalCodeSchema,
      city: citySchema,
    }[key];

    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        
        if (!result.success) {
          newErrors[key] = result.error.issues[0]?.message || 'Ogiltigt värde';
        } else {
          delete newErrors[key];
        }
        
        return newErrors;
      });
    }
  }, [debouncedValidation]);

  function onChange(key: string, val: any) {
    setValues(v => ({ ...v, [key]: val }));
    
    // Trigga debounced validering
    setFieldToValidate({ key, value: val });
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
    if (!service) {
      console.error("[ServiceRequestModal] No service set");
      return;
    }

    // Validera formulärdata
    const validation = serviceRequestSchema.safeParse(values);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error('Vänligen kontrollera alla fält');
      return;
    }

    setBusy(true);
    try {
      const mode = isQuote ? "quote" : "book";
      
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

      // Send simple JSON payload to edge function
      const jsonPayload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        service_slug: service.slug,
        mode,
        fields: {
          ...values,
          service_name: service.name,
          uploaded_files: fileUrls
        },
        fileUrls,
      };

      console.log('[ServiceRequestModal] Sending JSON:', jsonPayload);

      const { data, error } = await supabase.functions.invoke('create-booking-with-quote', {
        body: jsonPayload,
      });

      console.log('[ServiceRequestModal] Edge function response:', { data, error });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Unknown error');

      const booking = { id: data.bookingId };

      toast.success("Tack! Vi återkommer så snart som möjligt.");
      setDone(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (e) {
      console.error("[ServiceRequestModal] Submit error:", e);
      toast.error("Kunde inte skicka. Försök igen.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center animate-fade-in">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Modal */}
      <div className="relative w-full md:w-[680px] bg-gradient-to-b from-card to-card/95 rounded-t-3xl md:rounded-3xl shadow-2xl border border-border/50 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-border/50 p-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {service?.name ?? "Begär offert"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isQuote ? "Vi återkommer med offert inom 24h" : "Bekräftelse skickas direkt till din e-post"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/80 transition-colors group"
              aria-label="Stäng"
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {done ? (
            <div className="text-center py-8 animate-scale-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Tack för din förfrågan!</h4>
              <p className="text-muted-foreground">Vi återkommer så snart som möjligt.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Kontaktinformation */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Kontaktuppgifter
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="Ditt namn *"
                      value={values.name || ""}
                      onChange={e => onChange("name", e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.personnummer ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="Personnummer (YYYYMMDD-XXXX)"
                      value={values.personnummer || ""}
                      onChange={e => onChange("personnummer", e.target.value)}
                    />
                    {errors.personnummer && (
                      <p className="text-xs text-red-500 mt-1">{errors.personnummer}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="E-post *"
                      type="email"
                      value={values.email || ""}
                      onChange={e => onChange("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="Telefon (070-123 45 67) *"
                      type="tel"
                      value={values.phone || ""}
                      onChange={e => onChange("phone", e.target.value)}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.address ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="Adress"
                      value={values.address || ""}
                      onChange={e => onChange("address", e.target.value)}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.postal_code ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="Postnummer (123 45)"
                      value={values.postal_code || ""}
                      onChange={e => onChange("postal_code", e.target.value)}
                    />
                    {errors.postal_code && (
                      <p className="text-xs text-red-500 mt-1">{errors.postal_code}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.city ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder="Ort"
                      value={values.city || ""}
                      onChange={e => onChange("city", e.target.value)}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Projektdetaljer */}
              {service?.fields && service.fields.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Projektdetaljer
                  </h4>
                  <div className="space-y-3">
                    {service.fields.map((f, idx) => {
                      if (f.kind === "text")
                        return (
                          <input
                            key={idx}
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                            rows={4}
                            placeholder={f.placeholder ?? f.label}
                            value={values[f.key] || ""}
                            onChange={e => onChange(f.key, e.target.value)}
                          />
                        );
                      if (f.kind === "file")
                        return (
                          <div key={idx} className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                            <div className="relative">
                              <input
                                type="file"
                                accept={f.accept ?? "*/*"}
                                multiple={f.multiple}
                                onChange={e => onFiles(f.key, e.target.files)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-border/50 bg-background/50 text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all cursor-pointer"
                              />
                            </div>
                          </div>
                        );
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* Pris & Policy */}
              <div className="rounded-xl bg-muted/30 border border-border/30 p-4 space-y-2">
                {!isQuote && pricePreview && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uppskattat totalpris:</span>
                    <span className="text-lg font-bold text-primary">{pricePreview}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    {isQuote 
                      ? "Vi skickar offert inom 24h. Pris bekräftas efter platsbesök. ROT-avdrag kan vara aktuellt."
                      : "Bokning bekräftas via e-post. Pris bekräftas efter platsbesök. ROT-avdrag kan vara aktuellt."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer med knappar */}
        {!done && (
          <div className="border-t border-border/50 p-6 pt-4 bg-muted/10">
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors font-medium text-foreground"
                onClick={() => setOpen(false)}
              >
                Avbryt
              </button>
              <button
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all font-semibold flex items-center gap-2"
                disabled={busy || Object.keys(errors).length > 0}
                onClick={onSubmit}
              >
                {busy ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Skickar…
                  </>
                ) : (
                  <>
                    {isQuote ? "Skicka offertförfrågan" : "Skicka bokning"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
