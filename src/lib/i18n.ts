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
      about: {
        title: "Om Fixco",
        subtitle: "Sveriges mest avancerade helhetsentreprenör inom bygg, mark och service. Vi levererar professionella lösningar med AI-optimerad effektivitet.",
        historyTitle: "Vår historia",
        historyParagraph1: "Fixco grundades med visionen att revolutionera byggbranschen genom att kombinera traditionell hantverkskunskap med modern teknik och AI-optimerade processer.",
        historyParagraph2: "Vi har utvecklat Sveriges mest effektiva system för projektledning, kvalitetskontroll och kundservice, vilket gör att vi kan leverera snabbare, billigare och med högre kvalitet än våra konkurrenter.",
        historyParagraph3: "Idag är vi Sveriges ledande helhetsentreprenör med över 98% nöjda kunder och projektstart inom 24 timmar.",
        statsHappyCustomers: "Nöjda kunder",
        statsProjectStart: "Projektstart",
        statsCustomerSatisfaction: "Kundnöjdhet",
        statsWarranty: "Garanti",
        valuesTitle: "Våra värderingar",
        speedTitle: "Snabbhet",
        speedDescription: "Vi förstår att tiden är värdefull. Därför erbjuder vi projektstart inom 24 timmar och effektiva arbetsprocesser.",
        qualityTitle: "Kvalitet",
        qualityDescription: "Vi använder endast högkvalitativa material och certifierade hantverkare. 5 års garanti på alla våra arbeten.",
        transparencyTitle: "Transparens",
        transparencyDescription: "Inga dolda kostnader eller överraskningar. Du får alltid en tydlig offert och vet exakt vad du betalar.",
        coverageTitle: "Täckningsområde",
        coverageMainTitle: "Uppsala & Stockholms län",
        coverageDescription: "Vi arbetar främst i Uppsala och Stockholms län där vi kan garantera snabb service och lokal närvaro.",
        coverageLargeProjects: "Större projekt: För projekt över 50 000 kr åtar vi oss uppdrag i hela Sverige med samma höga kvalitet och service.",
        readyToStart: "Redo att starta ditt projekt?",
        contactTitle: "Kontakta oss idag för en kostnadsfri konsultation och offert."
      },
      faq: {
        title: "Vanliga frågor",
        subtitle: "Här hittar du svar på de mest vanliga frågorna om Fixcos tjänster, priser och garanti.",
        askQuestion: "Ställ en fråga",
        noAnswerTitle: "Hittar du inte svar på din fråga?",
        noAnswerSubtitle: "Kontakta oss direkt så hjälper vi dig gärna. Vi svarar alltid inom 2 timmar.",
        sendMessage: "Skicka meddelande",
        categories: {
          rot: "ROT-avdrag & Priser",
          booking: "Bokning & Tidsramar",
          quality: "Kvalitet & Garanti",
          practical: "Praktiska frågor"
        },
        priceAnswer: "Vårt timpris är 959 kr/h, men med ROT-avdrag betalar du endast 480 kr/h. Vissa tjänster har fast pris, som byte av toalettstol (1 750 kr med ROT) eller handfat (1 250 kr med ROT). Vi ger alltid kostnadsfri offert innan arbetet påbörjas.",
        bookingAnswer: "Du kan boka genom att fylla i vårt kontaktformulär på hemsidan, ringa 08-123 456 78 eller skicka mail till info@fixco.se. Vi återkommer inom 2 timmar med en kostnadsfri offert och förslag på tidsplan."
      },
      testimonials: {
        title: "Våra kunder älskar oss",
        subtitle: "Se vad våra nöjda kunder säger om Fixco",
        saved: "Sparade",
        pauseAutoplay: "Pausa automatisk",
        startAutoplay: "Starta automatisk",
        viewText: "visning"
      },
      comparison: {
        title: "Varför välja Fixco?",
        subtitle: "Transparent jämförelse som visar varför tusentals kunder väljer oss",
        comparison: "Jämförelse",
        fixco: "Fixco",
        competitors: "Konkurrenter",
        fixcoWins: "Fixco vinner",
        marketLeader: "Marknadsledare inom alla områden",
        rotSavings: "+ upp till 50% ROT-besparing",
        startTime: "Starttid",
        price: "Pris",
        coverage: "Täckningsområde",
        satisfaction: "Kundnöjdhet",
        rutHandling: "RUT-hantering",
        projectsOnTime: "Projekt klart i tid",
        weHandleEverything: "Vi sköter allt",
        youSelf: "Du själv",
        limited: "Begränsat",
        happyCustomers: "Nöjda kunder",
        support247: "Support",
        metrics: {
          startTime: {
            title: "Starttid",
            fixco: "< 5 dagar",
            competitor: "5-10 dagar",
            description: "Vi börjar inom 5 dagar vs konkurrenters veckolånga väntetider"
          },
          price: {
            title: "Pris",
            description: "Upp till 50% billigare med ROT-avdrag",
            descriptionNoRot: "Konkurrenskraftiga priser utan ROT"
          },
          coverage: {
            title: "Täckningsområde",
            fixco: "Uppsala & Stockholm",
            competitor: "Begränsat",
            description: "Full täckning i Uppsala & Stockholm, större projekt nationellt"
          },
          satisfaction: {
            title: "Kundnöjdhet",
            competitor: "3.8",
            description: "Branschens högsta kundnöjdhet baserat på tusentals recensioner"
          },
          rutHandling: {
            title: "RUT-hantering",
            fixco: "Vi sköter allt",
            competitor: "Du själv",
            description: "Vi hanterar all RUT-administration för hushållsnära tjänster"
          },
          projectsOnTime: {
            title: "Projekt klart i tid",
            competitor: "70-80",
            description: "Nästan alla projekt levereras enligt överenskommen tidsplan"
          }
        }
      },
      faqTeaser: {
        title: "Vanliga frågor",
        subtitle: "Svar på de vanligaste frågorna om våra tjänster",
        seeAllFAQ: "Se alla frågor & svar",
        noAnswerTitle: "Hittar du inte svar på din fråga?",
        noAnswerSubtitle: "Kontakta oss direkt så svarar vi inom 30 minuter"
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
      bookVisit: {
        subtitle: "Kostnadsfri konsultation och offert direkt hemma hos dig. Vi kommer inom 24 timmar och ger dig en detaljerad genomgång."
      },
      references: {
        ctaTitle: "Låt oss hjälpa dig förverkliga ditt projekt. Begär en kostnadsfri offert idag och se vad vi kan göra för dig.",
        requestFreeQuote: "Begär kostnadsfri offert"
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
      about: {
        title: "About Fixco",
        subtitle: "Sweden's most advanced comprehensive contractor in construction, land and service. We deliver professional solutions with AI-optimized efficiency.",
        historyTitle: "Our story",
        historyParagraph1: "Fixco was founded with the vision to revolutionize the construction industry by combining traditional craftsmanship with modern technology and AI-optimized processes.",
        historyParagraph2: "We have developed Sweden's most efficient system for project management, quality control and customer service, enabling us to deliver faster, cheaper and with higher quality than our competitors.",
        historyParagraph3: "Today we are Sweden's leading comprehensive contractor with over 98% satisfied customers and project start within 24 hours.",
        statsHappyCustomers: "Happy customers",
        statsProjectStart: "Project start",
        statsCustomerSatisfaction: "Customer satisfaction",
        statsWarranty: "Warranty",
        valuesTitle: "Our values",
        speedTitle: "Speed",
        speedDescription: "We understand that time is valuable. That's why we offer project start within 24 hours and efficient work processes.",
        qualityTitle: "Quality",
        qualityDescription: "We only use high-quality materials and certified craftsmen. 5 years warranty on all our work.",
        transparencyTitle: "Transparency",
        transparencyDescription: "No hidden costs or surprises. You always get a clear quote and know exactly what you pay.",
        coverageTitle: "Coverage area",
        coverageMainTitle: "Uppsala & Stockholm counties",
        coverageDescription: "We mainly work in Uppsala and Stockholm counties where we can guarantee fast service and local presence.",
        coverageLargeProjects: "Larger projects: For projects over 50,000 SEK we undertake assignments throughout Sweden with the same high quality and service.",
        readyToStart: "Ready to start your project?",
        contactTitle: "Contact us today for a free consultation and quote."
      },
      faq: {
        title: "Frequently asked questions",
        subtitle: "Here you'll find answers to the most common questions about Fixco's services, prices and warranty.",
        askQuestion: "Ask a question",
        noAnswerTitle: "Can't find the answer to your question?",
        noAnswerSubtitle: "Contact us directly and we'll be happy to help. We always respond within 2 hours.",
        sendMessage: "Send message",
        categories: {
          rot: "ROT deduction & Prices",
          booking: "Booking & Time frames",
          quality: "Quality & Warranty",
          practical: "Practical questions"
        },
        priceAnswer: "Our hourly rate is 959 SEK/h, but with ROT deduction you only pay 480 SEK/h. Some services have fixed prices, like toilet replacement (1,750 SEK with ROT) or sink replacement (1,250 SEK with ROT). We always provide a free quote before work begins.",
        bookingAnswer: "You can book by filling out our contact form on the website, calling 08-123 456 78 or emailing info@fixco.se. We'll get back to you within 2 hours with a free quote and schedule proposal."
      },
      testimonials: {
        title: "Our customers love us",
        subtitle: "See what our satisfied customers say about Fixco",
        saved: "Saved",
        pauseAutoplay: "Pause automatic",
        startAutoplay: "Start automatic",
        viewText: "viewing"
      },
      comparison: {
        title: "Why choose Fixco?",
        subtitle: "Transparent comparison showing why thousands of customers choose us",
        comparison: "Comparison",
        fixco: "Fixco",
        competitors: "Competitors",
        fixcoWins: "Fixco wins",
        marketLeader: "Market leader in all areas",
        rotSavings: "+ up to 50% ROT savings",
        startTime: "Start time",
        price: "Price",
        coverage: "Coverage area",
        satisfaction: "Customer satisfaction",
        rutHandling: "RUT handling",
        projectsOnTime: "Projects on time",
        weHandleEverything: "We handle everything",
        youSelf: "You yourself",
        limited: "Limited",
        happyCustomers: "Happy customers",
        support247: "Support",
        metrics: {
          startTime: {
            title: "Start time",
            fixco: "< 5 days",
            competitor: "5-10 days",
            description: "We start within 5 days vs competitors' week-long waiting times"
          },
          price: {
            title: "Price",
            description: "Up to 50% cheaper with ROT deduction",
            descriptionNoRot: "Competitive prices without ROT"
          },
          coverage: {
            title: "Coverage area",
            fixco: "Uppsala & Stockholm",
            competitor: "Limited",
            description: "Full coverage in Uppsala & Stockholm, larger projects nationwide"
          },
          satisfaction: {
            title: "Customer satisfaction",
            competitor: "3.8",
            description: "Industry's highest customer satisfaction based on thousands of reviews"
          },
          rutHandling: {
            title: "RUT handling",
            fixco: "We handle everything",
            competitor: "You yourself",
            description: "We handle all RUT administration for household services"
          },
          projectsOnTime: {
            title: "Projects on time",
            competitor: "70-80",
            description: "Almost all projects delivered according to agreed schedule"
          }
        }
      },
      faqTeaser: {
        title: "Frequently asked questions",
        subtitle: "Answers to the most common questions about our services",
        seeAllFAQ: "See all questions & answers",
        noAnswerTitle: "Can't find the answer to your question?",
        noAnswerSubtitle: "Contact us directly and we'll respond within 30 minutes"
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
      bookVisit: {
        subtitle: "Free consultation and quote directly at your home. We'll come within 24 hours and give you a detailed walkthrough."
      },
      references: {
        ctaTitle: "Let us help you realize your project. Request a free quote today and see what we can do for you.",
        requestFreeQuote: "Request free quote"
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