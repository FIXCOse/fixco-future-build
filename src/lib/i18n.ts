import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/integrations/supabase/client';

const resources = {
  sv: {
    translation: {
      nav: {
        home: "Hem",
        services: "Tjänster", 
        references: "Referenser",
        about: "Om oss",
        contact: "Kontakt",
        myFixco: "Mitt Fixco",
        smartHome: "Smart Hem",
        admin: "Administration"
      },
      hero: {
        title: "löser allt inom",
        subtitle: "hem & byggnad",
        description: "Snabbare, billigare och mer professionellt än konkurrenterna.",
        highlightText: "Start inom < 5 dagar, 50% rabatt med ROT.",
        cta1: "Begär offert",
        cta2: "Se våra tjänster"
      },
      cta: {
        title: "Redo att starta ditt",
        titleHighlight: "projekt",
        description: "Få en kostnadsfri offert inom 24 timmar och se varför tusentals kunder väljer Fixco",
        button1: "Boka nu - gratis offert",
        button2: "Ring: 08-123 456 78"
      },
      common: {
        requestQuote: "Begär offert",
        bookNow: "Boka nu",
        freeQuote: "Kostnadsfri offert",
        callUs: "Ring oss",
        contactUs: "Kontakta oss",
        readMore: "Läs mer",
        viewAll: "Se alla",
        seeAllServices: "Se alla våra tjänster",
        bookService: "Boka tjänst",
        phone: "08-123 456 78",
        fixcoQuality: "Fixco Kvalitet",
        startWithin5Days: "Start inom < 5 dagar",
        swedenLocations: "Uppsala & Stockholm",
        customers2000: "2000+ kunder",
        lowestPriceROT: "Lägst pris (ROT)",
        afterROTDeduction: "480 kr/h efter ROT-avdrag",
        averageRating: "Genomsnittligt betyg 4.9/5",
        nationalProjects: "Nationellt vid större projekt",
        ourPromise: "Vårt löfte till dig"
      },
      contact: {
        title: "Kontakta",
        titleHighlight: "Fixco",
        subtitle: "Få en kostnadsfri offert inom 24 timmar. Vi arbetar i Uppsala & Stockholms län (nationellt vid större projekt).",
        quickResponse: "Snabb respons",
        responseTime: "Svar inom 2 timmar",
        freeQuote: "Kostnadsfri offert",
        noHiddenCosts: "Inga dolda kostnader",
        localService: "Lokal service",
        serviceArea: "Uppsala & Stockholm",
        formTitle: "Begär offert",
        formSubtitle: "Fyll i formuläret så återkommer vi inom 24 timmar med en kostnadsfri och detaljerad offert.",
        contactInfo: "Kontaktinformation",
        phone: "Telefon",
        callNow: "Ring nu för akuta ärenden",
        email: "E-post",
        responseWithin2Hours: "Svar inom 2 timmar",
        businessArea: "Verksamhetsområde",
        businessAreaLocation: "Uppsala & Stockholms län",
        nationalProjects: "Nationellt vid större projekt",
        businessHours: "Öppettider",
        mondayFriday: "Måndag - Fredag",
        saturday: "Lördag",
        sunday: "Söndag",
        closed: "Stängt",
        emergencyService: "Akutservice",
        emergencyNote: "Ring för akuta läckage och elfärder",
        whyChooseFixco: "Varför välja Fixco?",
        startWithin24Hours: "Start inom 24 timmar",
        rotDiscount: "ROT-avdrag - endast 480 kr/h",
        guaranteedQuality: "Garanterad kvalitet",
        freeQuotes: "Kostnadsfria offerter",
        thankYouTitle: "Tack för din förfrågan!",
        thankYouDesc: "Vi återkommer inom 24 timmar med en kostnadsfri offert."
      },
      forms: {
        name: "Namn",
        nameRequired: "Namn krävs",
        fullName: "Ditt fullständiga namn",
        phone: "Telefon",
        phoneRequired: "Telefon krävs",
        phoneFormat: "070-123 45 67",
        email: "E-post",
        emailRequired: "E-post krävs",
        emailFormat: "din@email.se",
        address: "Adress för projektet",
        addressFormat: "Gatuadress, ort",
        service: "Typ av tjänst",
        selectService: "Välj tjänst",
        projectDescription: "Beskrivning av projekt",
        projectDescriptionRequired: "Beskrivning av projekt krävs",
        projectDescriptionPlaceholder: "Beskriv ditt projekt så detaljerat som möjligt. Vilka arbeten behöver utföras? Ungefär vilken tidsram? Finns det speciella önskemål?",
        submitRequest: "Skicka förfrågan",
        submitting: "Skickar...",
        privacyConsent: "Genom att skicka formuläret godkänner du att vi kontaktar dig angående din förfrågan.",
        required: "krävs",
        requiredField: "Detta fält är obligatoriskt"
      },
      servicesData: {
        carpentry: "Snickeri",
        plumbing: "VVS",
        assembly: "Montering",
        garden: "Trädgård",
        cleaning: "Städning",
        projectManagement: "Projektledning",
        groundwork: "Markarbeten",
        technicalInstallations: "Tekniska installationer",
        electrical: "El",
        propertyMaintenance: "Fastighetsskötsel",
        other: "Övrigt"
      },
      errors: {
        fieldsRequired: "Fält saknas",
        fillAllFields: "Vänligen fyll i alla obligatoriska fält.",
        somethingWentWrong: "Något gick fel",
        tryAgainOrCall: "Vänligen försök igen eller ring oss direkt."
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services",
        references: "References", 
        about: "About",
        contact: "Contact",
        myFixco: "My Fixco",
        smartHome: "Smart Home",
        admin: "Administration"
      },
      hero: {
        title: "solves everything in",
        subtitle: "home & construction",
        description: "Faster, cheaper and more professional than the competition.",
        highlightText: "Start within < 5 days, 50% discount with ROT.",
        cta1: "Request quote",
        cta2: "See our services"
      },
      cta: {
        title: "Ready to start your",
        titleHighlight: "project",
        description: "Get a free quote within 24 hours and see why thousands of customers choose Fixco",
        button1: "Book now - free quote",
        button2: "Call: 08-123 456 78"
      },
      common: {
        requestQuote: "Request quote",
        bookNow: "Book now",
        freeQuote: "Free quote",
        callUs: "Call us",
        contactUs: "Contact us",
        readMore: "Read more",
        viewAll: "View all",
        seeAllServices: "See all our services",
        bookService: "Book service",
        phone: "08-123 456 78",
        fixcoQuality: "Fixco Quality",
        startWithin5Days: "Start within < 5 days",
        swedenLocations: "Uppsala & Stockholm",
        customers2000: "2000+ customers",
        lowestPriceROT: "Lowest price (ROT)",
        afterROTDeduction: "480 SEK/h after ROT deduction",
        averageRating: "Average rating 4.9/5",
        nationalProjects: "Nationwide for larger projects",
        ourPromise: "Our promise to you"
      },
      contact: {
        title: "Contact",
        titleHighlight: "Fixco",
        subtitle: "Get a free quote within 24 hours. We work in Uppsala & Stockholm counties (nationwide for larger projects).",
        quickResponse: "Quick response",
        responseTime: "Response within 2 hours",
        freeQuote: "Free quote",
        noHiddenCosts: "No hidden costs",
        localService: "Local service",
        serviceArea: "Uppsala & Stockholm",
        formTitle: "Request quote",
        formSubtitle: "Fill out the form and we'll get back to you within 24 hours with a free and detailed quote.",
        contactInfo: "Contact information",
        phone: "Phone",
        callNow: "Call now for urgent matters",
        email: "Email",
        responseWithin2Hours: "Response within 2 hours",
        businessArea: "Service area",
        businessAreaLocation: "Uppsala & Stockholm counties",
        nationalProjects: "Nationwide for larger projects",
        businessHours: "Business hours",
        mondayFriday: "Monday - Friday",
        saturday: "Saturday",
        sunday: "Sunday",
        closed: "Closed",
        emergencyService: "Emergency service",
        emergencyNote: "Call for urgent leaks and electrical hazards",
        whyChooseFixco: "Why choose Fixco?",
        startWithin24Hours: "Start within 24 hours",
        rotDiscount: "ROT deduction - only 480 SEK/h",
        guaranteedQuality: "Guaranteed quality",
        freeQuotes: "Free quotes",
        thankYouTitle: "Thank you for your inquiry!",
        thankYouDesc: "We'll get back to you within 24 hours with a free quote."
      },
      forms: {
        name: "Name",
        nameRequired: "Name is required",
        fullName: "Your full name",
        phone: "Phone",
        phoneRequired: "Phone is required",
        phoneFormat: "070-123 45 67",
        email: "Email",
        emailRequired: "Email is required",
        emailFormat: "your@email.com",
        address: "Project address",
        addressFormat: "Street address, city",
        service: "Type of service",
        selectService: "Select service",
        projectDescription: "Project description",
        projectDescriptionRequired: "Project description is required",  
        projectDescriptionPlaceholder: "Describe your project in as much detail as possible. What work needs to be done? Approximate timeframe? Any special requirements?",
        submitRequest: "Submit request",
        submitting: "Submitting...",
        privacyConsent: "By submitting the form, you agree that we may contact you regarding your inquiry.",
        required: "required",
        requiredField: "This field is required"
      },
      servicesData: {
        carpentry: "Carpentry",
        plumbing: "Plumbing", 
        assembly: "Assembly",
        garden: "Garden",
        cleaning: "Cleaning",
        projectManagement: "Project management",
        groundwork: "Groundwork",
        technicalInstallations: "Technical installations",
        electrical: "Electrical",
        propertyMaintenance: "Property maintenance",
        other: "Other"
      },
      errors: {
        fieldsRequired: "Fields required",
        fillAllFields: "Please fill in all required fields.",
        somethingWentWrong: "Something went wrong",
        tryAgainOrCall: "Please try again or call us directly."
      }
    }
  }
};

// Load resources from Supabase (fallback to static resources)
let dynamicResources = { ...resources };

// Function to load dynamic resources from Supabase
export const loadDynamicResources = async (locale: string) => {
  try {
    const { data, error } = await supabase
      .from('i18n_resources')
      .select('ns, key, value')
      .eq('locale', locale);

    if (error) {
      console.error('Failed to load dynamic resources:', error);
      return;
    }

    if (data && data.length > 0) {
      const grouped = data.reduce((acc: any, item) => {
        if (!acc[item.ns]) acc[item.ns] = {};
        acc[item.ns][item.key] = item.value;
        return acc;
      }, {});

      // Merge with existing resources
      if (!dynamicResources[locale]) {
        dynamicResources[locale] = {};
      }
      
      Object.keys(grouped).forEach(ns => {
        if (!dynamicResources[locale][ns]) {
          dynamicResources[locale][ns] = {};
        }
        Object.assign(dynamicResources[locale][ns], grouped[ns]);
      });

      // Add resources to i18n
      i18n.addResourceBundle(locale, 'translation', dynamicResources[locale].translation || {}, true, true);
    }
  } catch (error) {
    console.error('Error loading dynamic resources:', error);
  }
};

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: dynamicResources,
    fallbackLng: 'sv',
    supportedLngs: ['sv', 'en'],
    defaultNS: 'translation',
    returnEmptyString: false,
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
      cookieMinutes: 60 * 24 * 365, // 1 year
      cookieDomain: undefined,
      cookieOptions: { path: '/', sameSite: 'lax' }
    },
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'currency') {
          return new Intl.NumberFormat(lng === 'en' ? 'en-US' : 'sv-SE', {
            style: 'currency',
            currency: 'SEK'
          }).format(value);
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng === 'en' ? 'en-US' : 'sv-SE').format(new Date(value));
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng === 'en' ? 'en-US' : 'sv-SE').format(value);
        }
        return value;
      }
    },
    react: {
      useSuspense: false
    }
  });

// Load dynamic resources for current language
loadDynamicResources(i18n.language);

// Load resources when language changes
i18n.on('languageChanged', (lng) => {
  loadDynamicResources(lng);
  document.documentElement.lang = lng;
});

export default i18n;