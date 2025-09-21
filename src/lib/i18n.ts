import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
      trustBar: {
        startWithin5Days: "Start inom < 5 dagar",
        locations: "Uppsala & Stockholm", 
        happyCustomers: "500+ nöjda kunder",
        insuredGuaranteed: "Försäkrad & garanterad",
        familyBusiness: "Familjeföretag sedan 2015"
      },
      services: {
        title: "Våra tjänster",
        subtitle: "Från små reparationer till stora byggnationer – vi har expertisen och erfarenheten för att leverera professionella lösningar inom alla områden.",
        rotSaving: "Utnyttja ROT-avdraget och spara 50%.",
        visualize3d: "Visa i 3D",
        beforeAfter: "Före & Efter",
        ecoScore: "Miljöbetyg",
        chooseCategory: "Välj kategori",
        chooseCategoryDesc: "Klicka på en kategori för att se alla tjänster och få detaljerad information om priser och tillgänglighet.",
        dontSeeService: "Ser du inte den tjänst du behöver? Vi löser det mesta inom bygg och anläggning.",
        seeAllServices: "Se alla tjänster",
        requestQuoteWithROT: "Begär offert med ROT-avdrag"
      },
      smartHome: {
        title: "Smart Hemautomation",
        subtitle: "Styr och optimera ditt hem med AI och IoT-teknik",
        energyConsumption: "Energiförbrukning",
        devices: "Anslutna enheter",
        automation: "Automatisering",
        savings: "Besparingar"
      },
      contact: {
        title: "Begär",
        titleHighlight: "offert",
        subtitle: "Få en kostnadsfri offert inom 24 timmar. Vi arbetar i Uppsala & Stockholms län (nationellt vid större projekt).",
        freeQuote: "Kostnadsfri offert",
        noHiddenCosts: "Inga dolda kostnader",
        formTitle: "Berätta om ditt projekt",
        formSubtitle: "Fyll i formuläret så återkommer vi inom 24 timmar med en kostnadsfri och detaljerad offert.",
        thankYouTitle: "Tack för din förfrågan!",
        thankYouDesc: "Vi återkommer inom 24 timmar med en kostnadsfri offert.",
        freeQuotes: "Kostnadsfria offerter"
      },
      about: {
        contactTitle: "Kontakta oss idag för en kostnadsfri konsultation och offert."
      },
      bookVisit: {
        subtitle: "Kostnadsfri konsultation och offert direkt hemma hos dig. Vi kommer inom 24 timmar och ger dig en detaljerad genomgång."
      },
      references: {
        ctaTitle: "Låt oss hjälpa dig förverkliga ditt projekt. Begär en kostnadsfri offert idag och se vad vi kan göra för dig.",
        requestFreeQuote: "Begär kostnadsfri offert"
      },
      faq: {
        priceAnswer: "Vårt timpris är 959 kr/h, men med ROT-avdrag betalar du endast 480 kr/h. Vissa tjänster har fast pris, som byte av toalettstol (1 750 kr med ROT) eller handfat (1 250 kr med ROT). Vi ger alltid kostnadsfri offert innan arbetet påbörjas.",
        bookingAnswer: "Du kan boka genom att fylla i vårt kontaktformulär på hemsidan, ringa 08-123 456 78 eller skicka mail till info@fixco.se. Vi återkommer inom 2 timmar med en kostnadsfri offert och förslag på tidsplan."
      },
      quoteRequest: {
        title: "Begär offert",
        subtitle: "Beskriv ditt projekt och få en kostnadsfri offert för:"
      },
      ecoScore: {
        excellent: "Utmärkt",
        good: "Bra", 
        fair: "Okej",
        poor: "Dålig",
        description: "Miljöpåverkan baserat på material och metoder"
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
      trustBar: {
        startWithin5Days: "Start within < 5 days",
        locations: "Uppsala & Stockholm",
        happyCustomers: "500+ happy customers",
        insuredGuaranteed: "Insured & guaranteed",
        familyBusiness: "Family business since 2015"
      },
      services: {
        title: "Our Services",
        subtitle: "From small repairs to large constructions – we have the expertise and experience to deliver professional solutions in all areas.",
        rotSaving: "Use ROT deduction and save 50%.",
        visualize3d: "Show in 3D",
        beforeAfter: "Before & After", 
        ecoScore: "Eco Score",
        chooseCategory: "Choose category",
        chooseCategoryDesc: "Click on a category to see all services and get detailed information about prices and availability.",
        dontSeeService: "Don't see the service you need? We solve most things in construction and contracting.",
        seeAllServices: "See all services",
        requestQuoteWithROT: "Request quote with ROT deduction"
      },
      smartHome: {
        title: "Smart Home Automation",
        subtitle: "Control and optimize your home with AI and IoT technology",
        energyConsumption: "Energy Consumption", 
        devices: "Connected Devices",
        automation: "Automation",
        savings: "Savings"
      },
      contact: {
        title: "Request",
        titleHighlight: "quote",
        subtitle: "Get a free quote within 24 hours. We work in Uppsala & Stockholm counties (nationwide for larger projects).",
        freeQuote: "Free quote",
        noHiddenCosts: "No hidden costs",
        formTitle: "Tell us about your project",
        formSubtitle: "Fill out the form and we'll get back to you within 24 hours with a free and detailed quote.",
        thankYouTitle: "Thank you for your inquiry!",
        thankYouDesc: "We'll get back to you within 24 hours with a free quote.",
        freeQuotes: "Free quotes"
      },
      about: {
        contactTitle: "Contact us today for a free consultation and quote."
      },
      bookVisit: {
        subtitle: "Free consultation and quote directly at your home. We'll come within 24 hours and give you a detailed walkthrough."
      },
      references: {
        ctaTitle: "Let us help you realize your project. Request a free quote today and see what we can do for you.",
        requestFreeQuote: "Request free quote"
      },
      faq: {
        priceAnswer: "Our hourly rate is 959 SEK/h, but with ROT deduction you only pay 480 SEK/h. Some services have fixed prices, like toilet replacement (1,750 SEK with ROT) or sink replacement (1,250 SEK with ROT). We always provide a free quote before work begins.",
        bookingAnswer: "You can book by filling out our contact form on the website, calling 08-123 456 78 or emailing info@fixco.se. We'll get back to you within 2 hours with a free quote and schedule proposal."
      },
      quoteRequest: {
        title: "Request quote",
        subtitle: "Describe your project and get a free quote for:"
      },
      ecoScore: {
        excellent: "Excellent",
        good: "Good",
        fair: "Fair", 
        poor: "Poor",
        description: "Environmental impact based on materials and methods"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sv',
    fallbackLng: 'sv',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;