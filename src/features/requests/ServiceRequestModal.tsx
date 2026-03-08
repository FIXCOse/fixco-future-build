import { useEffect, useMemo, useState, useCallback } from "react";
import ReactDOM from 'react-dom';
import { getServiceBySlug, ServiceConfig, SERVICE_CONFIG } from "./serviceConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import { User, Building2, Home, Sparkles, ArrowLeft, ArrowRight, Wrench, AlertCircle, CalendarClock, CalendarDays, CalendarRange, Globe } from "lucide-react";

// ─── Modal translations ────────────────────────────────────────
const modalTranslations = {
  sv: {
    bookHomeVisit: 'Boka Hembesök',
    requestQuote: 'Begär offert',
    thankYou: 'Tack för din förfrågan!',
    weWillReturn: 'Vi återkommer så snart som möjligt.',
    selectExtras: 'Välj extra tjänster som passar ditt projekt',
    fillDetails24h: 'Fyll i dina uppgifter så återkommer vi inom 24h',
    fillDetailsBooking: 'Fyll i dina uppgifter för att slutföra bokningen',
    close: 'Stäng',
    selectServices: 'Välj tjänster',
    selectCategory: 'Välj tjänstekategori',
    selectServiceNeeded: 'Välj den tjänst du behöver',
    selectOneOrMore: 'Välj en eller flera tjänster du behöver',
    tellUsWhatYouNeed: 'Berätta vad du behöver hjälp med',
    weHelpWithAll: 'Vi hjälper dig med allt från el till målning',
    quoteByNeed: 'Offert efter behov',
    rotEligible: 'ROT-berättigad',
    addExtras: 'Vill du lägga till något mer?',
    mostChoose: 'De flesta kunder väljer 1-2 tillägg',
    noAddons: 'Inga tillägg tillgängliga för denna tjänst',
    popular: 'Populär',
    howSoon: 'Hur snart önskar du hjälp?',
    helpsPrioritize: 'Hjälper oss prioritera din förfrågan',
    asap: 'Så snart som möjligt',
    within12days: 'Inom 1-2 dagar',
    withinWeek: 'Inom en vecka',
    nextMonth: 'Nästa månad',
    yourOrder: 'Din beställning',
    total: 'Totalt',
    changeAddons: 'Ändra tillägg',
    contactInfo: 'Kontaktuppgifter',
    bookingAs: 'Jag bokar som',
    private: 'Privat',
    company: 'Företag',
    brf: 'BRF',
    yourName: 'Ditt namn *',
    contactPerson: 'Kontaktperson *',
    personnummer: 'Personnummer (YYYYMMDD-XXXX)',
    companyName: 'Företagsnamn *',
    brfName: 'BRF-namn *',
    orgNumber: 'Organisationsnummer *',
    email: 'E-post *',
    phone: 'Telefon *',
    address: 'Adress',
    postalCode: 'Postnummer (123 45)',
    city: 'Ort',
    projectDetails: 'Projektdetaljer',
    describeProject: 'Beskriv ditt projekt',
    tellUsMore: 'Berätta vad du behöver hjälp med...',
    imagesOptional: 'Bilder (valfritt)',
    uploadImages: 'Ladda upp bilder (valfritt)',
    back: 'Tillbaka',
    cancel: 'Avbryt',
    continue: 'Fortsätt',
    skip: 'Hoppa över',
    sending: 'Skickar…',
    bookHomeVisitBtn: 'Boka hembesök',
    sendQuote: 'Skicka offertförfrågan',
    sendBooking: 'Skicka bokning',
    homeVisitPrefix: 'Hembesök:',
    selectAddons: 'Välj tillägg',
    yourDetails: 'Dina uppgifter',
    thanksToast: 'Tack! Vi återkommer så snart som möjligt.',
    errorToast: 'Kunde inte skicka. Försök igen.',
    validationError: 'Vänligen kontrollera alla fält',
    invalidValue: 'Ogiltigt värde',
  },
  en: {
    bookHomeVisit: 'Book Home Visit',
    requestQuote: 'Request Quote',
    thankYou: 'Thank you for your request!',
    weWillReturn: "We'll get back to you as soon as possible.",
    selectExtras: 'Choose extra services that suit your project',
    fillDetails24h: 'Fill in your details and we will respond within 24h',
    fillDetailsBooking: 'Fill in your details to complete your booking',
    close: 'Close',
    selectServices: 'Select services',
    selectCategory: 'Select service category',
    selectServiceNeeded: 'Select the service you need',
    selectOneOrMore: 'Select one or more services you need',
    tellUsWhatYouNeed: 'Tell us what you need help with',
    weHelpWithAll: 'We help with everything from electrical to painting',
    quoteByNeed: 'Quote on request',
    rotEligible: 'ROT eligible',
    addExtras: 'Want to add something extra?',
    mostChoose: 'Most customers choose 1-2 extras',
    noAddons: 'No extras available for this service',
    popular: 'Popular',
    howSoon: 'How soon do you need help?',
    helpsPrioritize: 'Helps us prioritize your request',
    asap: 'As soon as possible',
    within12days: 'Within 1-2 days',
    withinWeek: 'Within a week',
    nextMonth: 'Next month',
    yourOrder: 'Your order',
    total: 'Total',
    changeAddons: 'Change extras',
    contactInfo: 'Contact details',
    bookingAs: "I'm booking as",
    private: 'Private',
    company: 'Company',
    brf: 'HOA',
    yourName: 'Your name *',
    contactPerson: 'Contact person *',
    personnummer: 'Personal ID (YYYYMMDD-XXXX)',
    companyName: 'Company name *',
    brfName: 'HOA name *',
    orgNumber: 'Org. number *',
    email: 'Email *',
    phone: 'Phone *',
    address: 'Address',
    postalCode: 'Postal code (123 45)',
    city: 'City',
    projectDetails: 'Project details',
    describeProject: 'Describe your project',
    tellUsMore: 'Tell us what you need help with...',
    imagesOptional: 'Images (optional)',
    uploadImages: 'Upload images (optional)',
    back: 'Back',
    cancel: 'Cancel',
    continue: 'Continue',
    skip: 'Skip',
    sending: 'Sending…',
    bookHomeVisitBtn: 'Book home visit',
    sendQuote: 'Send quote request',
    sendBooking: 'Send booking',
    homeVisitPrefix: 'Home visit:',
    selectAddons: 'Select extras',
    yourDetails: 'Your details',
    thanksToast: "Thank you! We'll get back to you shortly.",
    errorToast: 'Could not send. Please try again.',
    validationError: 'Please check all fields',
    invalidValue: 'Invalid value',
  },
} as const;

type ModalLang = 'sv' | 'en';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useServiceAddons, SelectedAddon } from "@/hooks/useServiceAddons";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/utils/iconMapper";
import { serviceCategories } from "@/data/servicesDataNew";
import { useScrollLock } from "@/hooks/useScrollLock";
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
  showCategories?: boolean;
  mode?: 'quote' | 'home_visit';
};

export function openServiceRequestModal(detail: OpenModalDetail) {
  window.dispatchEvent(new CustomEvent("openServiceRequestModal", { detail }));
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
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);
  const [showCategories, setShowCategories] = useState(false);
  const [mode, setMode] = useState<'quote' | 'home_visit'>('quote');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [desiredTime, setDesiredTime] = useState<string>('');
  const [skipAddonsStep, setSkipAddonsStep] = useState(false);
  const [modalLang, setModalLang] = useState<ModalLang>(
    typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'sv'
  );

  const ml = modalTranslations[modalLang];

  const { trackFunnelStep, trackConversion, trackClick } = useEventTracking();

  // Lock scroll when modal is open
  useScrollLock(open);

  // Navigation functions with tracking
  const goToStep0 = () => { setCurrentStep(0); trackFunnelStep('step_0', { service: service?.slug }); };
  const goToStep1 = () => { setCurrentStep(1); trackFunnelStep('step_1_addons', { service: service?.slug }); };
  const goToStep2 = () => { setCurrentStep(2); trackFunnelStep('step_2_time', { service: service?.slug }); };
  const goToStep3 = () => { setCurrentStep(3); trackFunnelStep('step_3_details', { service: service?.slug }); };
const skipAddons = () => {
    setSelectedAddons([]);
    setSkipAddonsStep(false);
    setCurrentStep(2);
    trackFunnelStep('step_2_time', { service: service?.slug, skipped_addons: true });
  };

  // Hämta tillgängliga add-ons för vald tjänst
  const { data: addons = [] } = useServiceAddons(service?.slug || null, 'sv');

  // Automatiskt hoppa över Steg 1 om inga tillägg finns
  useEffect(() => {
    if (currentStep === 1 && addons.length === 0 && open && service && !skipAddonsStep) {
      setCurrentStep(2); // Always go to desired time step
      setSelectedAddons([]);
    }
  }, [addons.length, currentStep, open, service, skipAddonsStep]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<OpenModalDetail>;
      const slug = ce.detail?.serviceSlug;
      const prefill = ce.detail?.prefill ?? {};
      const shouldShowCategories = ce.detail?.showCategories ?? false;
      const requestMode = ce.detail?.mode ?? 'quote';
      
      setMode(requestMode);
      
      // Om showCategories eller ingen serviceSlug anges, visa väljare (steg 0)
      if (shouldShowCategories || !slug) {
        setService(null);
        setCustomerType('private');
        setValues(prefill);
        setFiles({});
        setDone(false);
        setSelectedAddons([]);
        setSelectedCategories([]);
        setDesiredTime('');
        setCurrentStep(0);
        setShowCategories(shouldShowCategories);
        setOpen(true);
        trackFunnelStep('modal_opened', { mode: requestMode, showCategories: shouldShowCategories });
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
      trackFunnelStep('modal_opened', { service: slug, mode: requestMode });
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
          newErrors[key] = result.error.issues[0]?.message || ml.invalidValue;
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
      toast.error(ml.validationError);
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
          uploaded_files: fileUrls,
          desired_time: desiredTime || undefined
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

      trackConversion(data.bookingId, {
        service: service.slug,
        service_name: service.name,
        customer_type: customerType,
        mode,
        addons_count: selectedAddons.length,
      });

      toast.success(ml.thanksToast);
      setDone(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (e) {
      console.error("[ServiceRequestModal] Submit error:", e);
      toast.error(ml.errorToast);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center animate-fade-in">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Modal */}
      <div className="relative w-full md:w-[800px] lg:w-[900px] bg-gradient-to-b from-card to-card/95 rounded-t-3xl md:rounded-3xl shadow-2xl border border-border/50 animate-scale-in overflow-hidden max-h-[100dvh] md:max-h-[85vh] flex flex-col">
        {/* Progress Indicator */}
        {!done && service && addons.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-4 border-b border-border/50 bg-muted/30 flex-shrink-0">
            <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors ${
                currentStep === 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
              }`}>
                1
              </div>
              <span className="text-sm font-medium hidden md:inline">{ml.selectAddons}</span>
            </div>
            
            <div className="w-8 md:w-12 h-0.5 bg-border" />
            
            <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors ${
                currentStep === 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden md:inline">{ml.yourDetails}</span>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="relative border-b border-border/50 p-6 pb-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {service?.name ?? (mode === 'home_visit' ? ml.bookHomeVisit : ml.requestQuote)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {done ? ml.thankYou : currentStep === 1 && addons.length > 0 ? ml.selectExtras : (isQuote ? ml.fillDetails24h : ml.fillDetailsBooking)}
              </p>
            </div>
            {/* Language switcher */}
            <button
              onClick={() => setModalLang(l => l === 'sv' ? 'en' : 'sv')}
              className="flex items-center justify-center gap-1 h-10 px-3 rounded-full hover:bg-muted/80 transition-colors"
              title={modalLang === 'sv' ? 'Switch to English' : 'Växla till svenska'}
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">{modalLang === 'sv' ? 'EN' : 'SV'}</span>
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/80 transition-colors group"
              aria-label={ml.close}
            >
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {done ? (
            <div className="text-center py-8 animate-scale-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">{ml.thankYou}</h4>
              <p className="text-muted-foreground">{ml.weWillReturn}</p>
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
                  {mode === 'home_visit' ? ml.selectServices : (showCategories ? ml.selectCategory : ml.selectServiceNeeded)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {mode === 'home_visit' ? ml.selectOneOrMore : (showCategories ? ml.tellUsWhatYouNeed : ml.weHelpWithAll)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {showCategories ? (
                  // Visa kategorier
                  serviceCategories.map(category => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategories.includes(category.slug);
                    
                    return (
                      <motion.div
                        key={category.slug}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Multi-select för BÅDA modes
                          setSelectedCategories(prev => 
                            prev.includes(category.slug)
                              ? prev.filter(s => s !== category.slug)
                              : [...prev, category.slug]
                          );
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected && mode === 'home_visit'
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="font-semibold text-foreground mb-1">{category.title}</h5>
                            <p className="text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>

                          <Checkbox checked={isSelected} />
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  // Visa specifika tjänster
                  SERVICE_CONFIG.map(svc => (
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
                              ? ml.quoteByNeed 
                              : svc.pricingMode === 'unit' 
                                ? `${svc.unitPriceSek} kr/${svc.unitLabel}`
                                : `${svc.fixedPriceSek} kr`
                            }
                            {svc.rotEligible && ` • ${ml.rotEligible}`}
                          </p>
                        </div>

                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))
                )}
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
                      {ml.addExtras}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      🔥 {ml.mostChoose}
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
                                    {ml.popular}
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
                  <p className="text-muted-foreground">{ml.noAddons}</p>
                </div>
              )}
            </motion.div>
          ) : currentStep === 2 ? (
            // STEG 2: ÖNSKAD TID (för alla modes)
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold flex items-center justify-center gap-2 mb-1">
                  <CalendarClock className="w-5 h-5 text-primary" />
                  {ml.howSoon}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {ml.helpsPrioritize}
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  { id: 'asap', name: ml.asap, icon: AlertCircle },
                  { id: '1-2days', name: ml.within12days, icon: CalendarClock },
                  { id: 'week', name: ml.withinWeek, icon: CalendarDays },
                  { id: 'month', name: ml.nextMonth, icon: CalendarRange }
                ].map(time => {
                  const IconComponent = time.icon;
                  const isSelected = desiredTime === time.id;
                  
                  return (
                    <motion.div
                      key={time.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDesiredTime(time.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10 shadow-lg' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground">{time.name}</h5>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : currentStep === 3 ? (
            // STEG 3 (eller 2 för quote): FORMULÄR
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              {(selectedAddons.length > 0 || pricePreview) && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-3 text-foreground">{ml.yourOrder}</h4>
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
                        <span>{ml.total}</span>
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
                      {ml.changeAddons}
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
                  {ml.contactInfo}
                </h4>
                
                {/* Kundtypsväljare */}
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-2 block">{ml.bookingAs}</label>
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
                      {ml.private}
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="company"
                      className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      <Building2 className="w-4 h-4" />
                      {ml.company}
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="brf"
                      className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      <Home className="w-4 h-4" />
                      {ml.brf}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={`px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-border/50'
                      } bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-full`}
                      placeholder={customerType === 'private' ? ml.yourName : ml.contactPerson}
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
                          placeholder={ml.personnummer}
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
                          placeholder={ml.companyName}
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
                          placeholder={ml.brfName}
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
                          placeholder={`${ml.orgNumber} (XXXXXX-XXXX)`}
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
                      placeholder={ml.email}
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
                      placeholder={`${ml.phone} (070-123 45 67)`}
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
                      placeholder={ml.address}
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
                      placeholder={ml.postalCode}
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
                      placeholder={ml.city}
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
                    {ml.projectDetails}
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
            </motion.div>
          ) : null}
        </div>

        {/* Fixed Footer with Navigation Buttons */}
        {!done && (
          <div className="px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-border/20 bg-background/50 backdrop-blur-sm flex-shrink-0">
            <div className="flex gap-3">
              {/* Back Button */}
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStep === 3) {
                      if (showCategories && addons.length === 0) {
                        // Om vi kom från kategori-val och det finns inga addons,
                        // gå direkt tillbaka till kategori-valet
                        goToStep0();
                      } else if (mode === 'home_visit') {
                        goToStep2();
                      } else {
                        // Sätt skipAddonsStep INNAN vi går till steg 1
                        // för att förhindra useEffect från att hoppa tillbaka
                        setSkipAddonsStep(true);
                        goToStep1();
                      }
                    } else if (currentStep === 2) {
                      if (mode === 'home_visit') {
                        if (addons.length === 0 && showCategories) {
                          goToStep0();
                        } else {
                          setSkipAddonsStep(true);
                          goToStep1();
                        }
                      }
                    } else if (currentStep === 1) {
                      if (showCategories) {
                        goToStep0();
                      } else {
                        setOpen(false); // Stäng modalen om man inte kom från kategori-val
                      }
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {ml.back}
                </Button>
              )}

              {/* Cancel Button (Step 0 only) */}
              {currentStep === 0 && showCategories && mode !== 'home_visit' && (
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  {ml.cancel}
                </Button>
              )}

              {/* Step 0: Continue Button - För båda modes */}
              {currentStep === 0 && showCategories && (
                <Button
                  onClick={() => {
                    if (selectedCategories.length === 0) return;
                    
                    // Skapa en kombinerad service från valda kategorier
                    const selectedCategoryData = serviceCategories.filter(cat => 
                      selectedCategories.includes(cat.slug)
                    );
                    
                    const categoryNames = selectedCategoryData.map(c => c.title).join(', ');
                    
                    const genericService: ServiceConfig = {
                      slug: selectedCategories.join('-'),
                      name: mode === 'home_visit' 
                        ? `${ml.homeVisitPrefix} ${categoryNames}`
                        : categoryNames,
                      pricingMode: "quote",
                      rotEligible: true,
                      fields: [
                        { 
                          kind: "textarea", 
                          key: "beskrivning", 
                          label: "Beskriv ditt projekt", 
                          placeholder: `Berätta vad du behöver hjälp med...`,
                          required: true 
                        },
                        { 
                          kind: "file", 
                          key: "bilder", 
                          label: "Bilder (valfritt)", 
                          accept: "image/*", 
                          multiple: true 
                        }
                      ]
                    };
                    
                    setService(genericService);
                    setSkipAddonsStep(false);
                    goToStep1();
                  }}
                  disabled={selectedCategories.length === 0}
                  className="flex-1"
                >
                  {ml.continue}
                  {selectedCategories.length > 0 && (
                    <Badge className="ml-2 bg-primary-foreground text-primary">
                      {selectedCategories.length}
                    </Badge>
                  )}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {/* Step 1: Skip or Continue */}
              {currentStep === 1 && addons.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={skipAddons}
                    className="flex-1"
                  >
                    Hoppa över
                  </Button>
                  <Button
                    onClick={() => {
                      setSkipAddonsStep(false); // Reset flag when moving forward
                      goToStep2(); // Always go to desired time step
                    }}
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
                </>
              )}

              {/* Step 2: Continue to form */}
              {currentStep === 2 && (
                <Button
                  onClick={goToStep3}
                  disabled={!desiredTime}
                  className="flex-1"
                >
                  Fortsätt
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {/* Step 3: Submit Button */}
              {currentStep === 3 && (
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
                      {mode === 'home_visit'
                        ? "Boka hembesök"
                        : isQuote
                          ? "Skicka offertförfrågan"
                          : "Skicka bokning"
                      }
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
