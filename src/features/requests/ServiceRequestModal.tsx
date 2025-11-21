import { useEffect, useMemo, useState, useCallback } from "react";
import { getServiceBySlug, ServiceConfig, SERVICE_CONFIG } from "./serviceConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import { User, Building2, Home, Sparkles, ArrowLeft, ArrowRight, Wrench } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useServiceAddons, SelectedAddon } from "@/hooks/useServiceAddons";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/utils/iconMapper";
import { 
  serviceRequestSchema,
  nameSchema,
  emailSchema,
  phoneSchema,
  personnummerSchema,
  orgNumberSchema,
  companyNameSchema,
  brfNameSchema,
  addressSchema,
  postalCodeSchema,
  citySchema
} from "./bookingValidation";

export type OpenModalDetail = {
  serviceSlug?: string;
  prefill?: Record<string, any>;
};

export function openServiceRequestModal(detail: OpenModalDetail) {
  console.log('[openServiceRequestModal] Dispatching event with detail:', detail);
  window.dispatchEvent(new CustomEvent("openServiceRequestModal", { detail }));
  console.log('[openServiceRequestModal] Event dispatched');
}

export default function ServiceRequestModal() {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<ServiceConfig | null>(null);
  const [customerType, setCustomerType] = useState<'private' | 'company' | 'brf'>('private');
  const [values, setValues] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);

  // Navigation functions
  const goToStep0 = () => setCurrentStep(0);
  const goToStep1 = () => setCurrentStep(1);
  const goToStep2 = () => setCurrentStep(2);
  const skipAddons = () => {
    setSelectedAddons([]);
    setCurrentStep(2);
  };

  // Hämta tillgängliga add-ons för vald tjänst
  const { data: addons = [] } = useServiceAddons(service?.slug || null, 'sv');

  // Automatiskt hoppa över Steg 1 om inga tillägg finns
  useEffect(() => {
    if (currentStep === 1 && addons.length === 0 && open && service) {
      setCurrentStep(2);
      setSelectedAddons([]);
    }
  }, [addons.length, currentStep, open, service]);

  useEffect(() => {
    console.log('[ServiceRequestModal] Component mounted, registering event listener');
    
    const onOpen = (e: Event) => {
      console.log('[ServiceRequestModal] Event received!', e);
      const ce = e as CustomEvent<OpenModalDetail>;
      const slug = ce.detail?.serviceSlug;
      const prefill = ce.detail?.prefill ?? {};
      console.log('[ServiceRequestModal] serviceSlug:', slug, 'prefill:', prefill);
      
      // Om ingen serviceSlug anges, visa tjänstväljare (steg 0)
      if (!slug) {
        console.log('[ServiceRequestModal] No slug, showing service selector (step 0)');
        setService(null);
        setCustomerType('private');
        setValues(prefill);
        setFiles({});
        setDone(false);
        setSelectedAddons([]);
        setCurrentStep(0);
        setOpen(true);
        console.log('[ServiceRequestModal] Modal should now be open!');
        return;
      }
      
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
      setCustomerType('private');
      setValues(prefill);
      setFiles({});
      setDone(false);
      setSelectedAddons([]);
      // Sätt initialt steg baserat på om addons finns (kommer justeras av useEffect om addons=0)
      setCurrentStep(1);
      setOpen(true);
    };
    
    window.addEventListener("openServiceRequestModal", onOpen);
    console.log('[ServiceRequestModal] Event listener registered');
    return () => {
      console.log('[ServiceRequestModal] Cleaning up event listener');
      window.removeEventListener("openServiceRequestModal", onOpen);
    };
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
      company_name: companyNameSchema,
      brf_name: brfNameSchema,
      org_number: orgNumberSchema,
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

  // Toggle add-on selection
  const toggleAddon = useCallback((addon: any) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.addon_id === addon.id);
      if (exists) {
        return prev.filter(a => a.addon_id !== addon.id);
      } else {
        return [...prev, {
          addon_id: addon.id,
          title: addon.title,
          price: addon.addon_price,
          quantity: 1
        }];
      }
    });
  }, []);

  const isQuote = service?.pricingMode === "quote";
  const isUnit = service?.pricingMode === "unit";
  const isFixed = service?.pricingMode === "fixed";

  const pricePreview = useMemo(() => {
    if (!service) return null;
    
    let basePrice = 0;
    if (isUnit && service.unitPriceSek && values["antal"]) {
      const qty = Number(values["antal"] || 0);
      if (!qty) return null;
      basePrice = qty * service.unitPriceSek;
    } else if (isFixed && service.fixedPriceSek) {
      basePrice = service.fixedPriceSek;
    } else {
      return null;
    }
    
    // Lägg till add-ons i totalpriset
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const total = basePrice + addonsTotal;
    
    return `${total.toLocaleString("sv-SE")} kr`;
  }, [service, values, isUnit, isFixed, selectedAddons]);

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
        customer_type: customerType,
        name: values.name,
        email: values.email,
        phone: values.phone,
        personnummer: values.personnummer,
        company_name: values.company_name,
        brf_name: values.brf_name,
        org_number: values.org_number,
        address: values.address,
        service_slug: service.slug,
        mode,
        fields: {
          ...values,
          service_name: service.name,
          uploaded_files: fileUrls
        },
        fileUrls,
        selected_addons: selectedAddons.length > 0 ? JSON.stringify(selectedAddons) : undefined,
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

  console.log('[ServiceRequestModal] Rendering, open:', open, 'currentStep:', currentStep, 'service:', service);

  if (!open) {
    console.log('[ServiceRequestModal] Not rendering (open=false)');
    return null;
  }

  console.log('[ServiceRequestModal] Rendering modal!');
  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center animate-fade-in">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Modal */}
      <div className="relative w-full md:w-[680px] bg-gradient-to-b from-card to-card/95 rounded-t-3xl md:rounded-3xl shadow-2xl border border-border/50 animate-scale-in overflow-hidden">
        {/* Progress Indicator */}
        {!done && service && addons.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-4 border-b border-border/50 bg-muted/30">
            <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors ${
                currentStep === 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
              }`}>
                1
              </div>
              <span className="text-sm font-medium hidden md:inline">Välj tillägg</span>
            </div>
            
            <div className="w-8 md:w-12 h-0.5 bg-border" />
            
            <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors ${
                currentStep === 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden md:inline">Dina uppgifter</span>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="relative border-b border-border/50 p-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {service?.name ?? "Begär offert"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {done ? "Tack för din förfrågan!" : currentStep === 1 && addons.length > 0 ? "Välj extra tjänster som passar ditt projekt" : (isQuote ? "Fyll i dina uppgifter så återkommer vi inom 24h" : "Fyll i dina uppgifter för att slutföra bokningen")}
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
          ) : currentStep === 0 ? (
            // STEG 0: VÄLJ TJÄNST
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold flex items-center justify-center gap-2 mb-1">
                  <Wrench className="w-5 h-5 text-primary" />
                  Välj den tjänst du behöver
                </h4>
                <p className="text-sm text-muted-foreground">
                  Vi hjälper dig med allt från el till målning
                </p>
              </div>

              <div className="grid gap-3">
                {SERVICE_CONFIG.map(svc => (
                  <motion.div
                    key={svc.slug}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setService(svc);
                      setCurrentStep(1);
                    }}
                    className="p-4 rounded-xl border-2 border-border hover:border-primary/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="font-semibold text-foreground mb-1">{svc.name}</h5>
                        <p className="text-xs text-muted-foreground">
                          {svc.pricingMode === 'quote' 
                            ? 'Offert efter behov' 
                            : svc.pricingMode === 'unit' 
                              ? `${svc.unitPriceSek} kr/${svc.unitLabel}`
                              : `${svc.fixedPriceSek} kr`
                          }
                          {svc.rotEligible && ' • ROT-berättigad'}
                        </p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : currentStep === 1 && addons.length > 0 ? (
            // STEG 1: VÄLJ TILLÄGG
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {addons.length > 0 ? (
                <>
                  <div className="text-center">
                    <h4 className="text-lg font-bold flex items-center justify-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Vill du lägga till något mer?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      🔥 De flesta kunder väljer 1-2 tillägg
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {addons.map(addon => {
                      const isSelected = selectedAddons.some(a => a.addon_id === addon.id);
                      return (
                        <motion.div
                          key={addon.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAddon(addon)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10 shadow-lg' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {(() => {
                              const IconComponent = getIconComponent(addon.icon);
                              return <IconComponent className="h-8 w-8 text-primary flex-shrink-0 mt-1" />;
                            })()}
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-foreground">{addon.title}</h5>
                                {addon.is_popular && (
                                  <Badge variant="secondary" className="bg-orange-500 text-white text-xs">
                                    Populär
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {addon.description}
                              </p>
                              
                              <p className="text-lg font-bold text-primary">
                                +{addon.addon_price.toLocaleString('sv-SE')} kr
                              </p>
                            </div>
                            
                            <Checkbox checked={isSelected} className="mt-1" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Inga tillägg tillgängliga för denna tjänst</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={skipAddons}
                  className="flex-1"
                >
                  Hoppa över
                </Button>
                <Button 
                  onClick={goToStep2}
                  className="flex-1"
                >
                  Fortsätt
                  {selectedAddons.length > 0 && (
                    <Badge className="ml-2 bg-primary-foreground text-primary">
                      {selectedAddons.length}
                    </Badge>
                  )}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            // STEG 2: FYLL I UPPGIFTER
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              {(selectedAddons.length > 0 || pricePreview) && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-3 text-foreground">Din beställning</h4>
                  <div className="space-y-2 text-sm">
                    {pricePreview && (
                      <div className="flex justify-between">
                        <span>{service?.name}</span>
                        <span className="font-medium">{pricePreview}</span>
                      </div>
                    )}
                    {selectedAddons.map(addon => {
                      const originalAddon = addons.find(a => a.id === addon.addon_id);
                      const IconComponent = getIconComponent(originalAddon?.icon);
                      return (
                        <div key={addon.addon_id} className="flex justify-between items-center text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                            + {addon.title}
                          </span>
                          <span>+{addon.price.toLocaleString('sv-SE')} kr</span>
                        </div>
                      );
                    })}
                    {pricePreview && selectedAddons.length > 0 && (
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-border/50">
                        <span>Totalt</span>
                        <span>
                          {(
                            (isUnit && service?.unitPriceSek && values["antal"] 
                              ? Number(values["antal"] || 0) * service.unitPriceSek 
                              : isFixed && service?.fixedPriceSek 
                                ? service.fixedPriceSek 
                                : 0) +
                            selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
                          ).toLocaleString("sv-SE")} kr
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {selectedAddons.length > 0 && (
                    <Button 
                      variant="link" 
                      onClick={goToStep1}
                      className="p-0 h-auto text-xs mt-3"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Ändra tillägg
                    </Button>
                  )}
                </div>
              )}

              {/* Kontaktinformation */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Kontaktuppgifter
                </h4>
                
                {/* Kundtypsväljare */}
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-2 block">Jag bokar som</label>
                  <ToggleGroup 
                    type="single" 
                    value={customerType} 
                    onValueChange={(val) => val && setCustomerType(val as 'private' | 'company' | 'brf')}
                    className="grid grid-cols-3 gap-2 w-full"
                  >
                    <ToggleGroupItem 
                      value="private" 
                      className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      <User className="w-4 h-4" />
                      Privat
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="company"
                      className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      <Building2 className="w-4 h-4" />
                      Företag
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="brf"
                      className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      <Home className="w-4 h-4" />
                      BRF
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder={customerType === 'private' ? "Ditt namn *" : "Kontaktperson *"}
                      value={values.name || ""}
                      onChange={e => onChange("name", e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Personnummer - endast för privatpersoner */}
                  <AnimatePresence mode="wait">
                    {customerType === 'private' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Företagsnamn - endast för företag */}
                  <AnimatePresence mode="wait">
                    {customerType === 'company' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          className={`px-4 py-3 rounded-xl border ${
                            errors.company_name ? 'border-red-500' : 'border-border/50'
                          } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                          placeholder="Företagsnamn *"
                          value={values.company_name || ""}
                          onChange={e => onChange("company_name", e.target.value)}
                        />
                        {errors.company_name && (
                          <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BRF-namn - endast för BRF */}
                  <AnimatePresence mode="wait">
                    {customerType === 'brf' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          className={`px-4 py-3 rounded-xl border ${
                            errors.brf_name ? 'border-red-500' : 'border-border/50'
                          } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                          placeholder="BRF-namn *"
                          value={values.brf_name || ""}
                          onChange={e => onChange("brf_name", e.target.value)}
                        />
                        {errors.brf_name && (
                          <p className="text-xs text-red-500 mt-1">{errors.brf_name}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Organisationsnummer - för företag och BRF */}
                  <AnimatePresence mode="wait">
                    {(customerType === 'company' || customerType === 'brf') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          className={`px-4 py-3 rounded-xl border ${
                            errors.org_number ? 'border-red-500' : 'border-border/50'
                          } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                          placeholder="Organisationsnummer (XXXXXX-XXXX) *"
                          value={values.org_number || ""}
                          onChange={e => onChange("org_number", e.target.value)}
                        />
                        {errors.org_number && (
                          <p className="text-xs text-red-500 mt-1">{errors.org_number}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Format: 123456-7890</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
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
                    {service.fields.map((field) => {
                      if (field.kind === "text") {
                        return (
                          <div key={field.key}>
                            <input
                              className="px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full"
                              type="text"
                              placeholder={field.placeholder ?? field.label}
                              value={values[field.key] ?? ""}
                              onChange={e => onChange(field.key, e.target.value)}
                            />
                          </div>
                        );
                      } else if (field.kind === "number") {
                        return (
                          <div key={field.key}>
                            <input
                              className="px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full"
                              type="number"
                              placeholder={field.label}
                              min={field.min}
                              max={field.max}
                              value={values[field.key] ?? ""}
                              onChange={e => onChange(field.key, Number(e.target.value))}
                            />
                          </div>
                        );
                      } else if (field.kind === "textarea") {
                        return (
                          <div key={field.key}>
                            <textarea
                              className="px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full min-h-[100px] resize-y"
                              placeholder={field.placeholder ?? field.label}
                              value={values[field.key] ?? ""}
                              onChange={e => onChange(field.key, e.target.value)}
                            />
                          </div>
                        );
                      } else if (field.kind === "file") {
                        return (
                          <div key={field.key}>
                            <label className="block">
                              <span className="text-sm text-muted-foreground mb-2 block">{field.label}</span>
                              <input
                                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                                type="file"
                                accept={field.accept}
                                multiple={field.multiple}
                                onChange={e => onFiles(field.key, e.target.files)}
                              />
                            </label>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={goToStep1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tillbaka
                </Button>
                <Button 
                  onClick={onSubmit}
                  disabled={busy || Object.keys(errors).length > 0}
                  className="flex-1"
                >
                  {busy ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Skickar…
                    </>
                  ) : (
                    <>
                      {isQuote ? "Skicka offertförfrågan" : "Skicka bokning"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
