// Enhanced SEO Schema Generator for rich snippets and better rankings

const baseUrl = 'https://fixco.se';

// Organization Schema - ServiceAreaBusiness for local SEO
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ServiceAreaBusiness",
  "@id": `${baseUrl}#organization`,
  "name": "Fixco",
  "alternateName": ["Fixco Sverige", "Fixco AB"],
  "description": "Professionella bygg- och renoveringstjänster med ROT & RUT-avdrag i Uppsala och Stockholm",
  "url": baseUrl,
  "logo": `${baseUrl}/assets/fixco-logo-black.png`,
  "image": `${baseUrl}/assets/hero-construction.jpg`,
  "telephone": "+46-70-123-45-67",
  "email": "info@fixco.se",
  "paymentAccepted": ["Swish", "Bankcard", "Invoice"],
  "currenciesAccepted": "SEK",
  "foundingDate": "2020",
  "slogan": "Snabbare, billigare, mer professionellt",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kungsgatan 1",
    "addressLocality": "Uppsala",
    "postalCode": "753 18",
    "addressRegion": "Uppsala län",
    "addressCountry": "SE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "59.8586",
    "longitude": "17.6389"
  },
  "areaServed": ["Uppsala kommun", "Stockholms stad"],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "59.8586",
      "longitude": "17.6389"
    },
    "geoRadius": "80000"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "F-skatt",
      "name": "Godkänd för F-skatt"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Elsäkerhetsverket",
      "name": "Auktorisation Elsäkerhetsverket"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Säker Vatten",
      "name": "Certifierad VVS-installatör"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Fixco Tjänster",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Elmontör",
          "description": "Elinstallation, felsökning, laddboxar",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "VVS",
          "description": "Rörmokare, badrum, akuta läckor",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Snickare",
          "description": "Kök, garderober, inredning",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Montering",
          "description": "IKEA-möbler, TV-fästen, vitvaror",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Trädgård",
          "description": "Gräsklippning, häckar, plantering",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Städning",
          "description": "Hemstäd, flyttstäd, byggstäd",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Markarbeten",
          "description": "Dränering, schaktning, plattläggning",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Tekniska installationer",
          "description": "Nätverk, larm, IT-support",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Flytt",
          "description": "Flytthjälp, packning, transport",
          "provider": { "@id": `${baseUrl}#organization` }
        }
      }
    ]
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "15:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/fixco",
    "https://www.instagram.com/fixco_se",
    "https://www.linkedin.com/company/fixco"
  ],
  "hasPart": [
    {
      "@type": "WebPage",
      "name": "Tjänster",
      "url": `${baseUrl}/tjanster`,
      "description": "Alla våra tjänster med ROT & RUT-avdrag"
    },
    {
      "@type": "WebPage",
      "name": "Kontakt",
      "url": `${baseUrl}/kontakt`,
      "description": "Ta kontakt för offert eller frågor"
    },
    {
      "@type": "WebPage",
      "name": "Om oss",
      "url": `${baseUrl}/om-oss`,
      "description": "Läs mer om Fixco"
    },
    {
      "@type": "WebPage",
      "name": "Boka hembesök",
      "url": `${baseUrl}/boka-hembesok`,
      "description": "Boka gratis hembesök direkt"
    }
  ]
});

// Service Schema for service pages
export const getServiceSchema = (service: {
  name: string;
  description: string;
  price: number;
  priceRange?: string;
  eligible: { rot: boolean; rut: boolean };
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${baseUrl}/tjanster/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#organization`,
    "name": "Fixco"
  },
  "serviceType": service.name,
  "offers": {
    "@type": "Offer",
    "price": service.price.toString(),
    "priceCurrency": "SEK",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": service.price.toString(),
      "priceCurrency": "SEK",
      "unitText": "per timme"
    },
    "availability": "https://schema.org/InStock",
    "url": `${baseUrl}/tjanster`,
    "eligibleRegion": {
      "@type": "Country",
      "name": "SE"
    }
  },
  "areaServed": [
    { "@type": "City", "name": "Uppsala" },
    { "@type": "City", "name": "Stockholm" }
  ],
  "category": "Bygg och renovering",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Fixco Tjänster",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name
        }
      }
    ]
  }
});

// FAQ Schema for rich snippets
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Breadcrumb Schema for navigation
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${baseUrl}${item.url}`
  }))
});

// Website Schema for homepage
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}#website`,
  "url": baseUrl,
  "name": "Fixco",
  "description": "Professionella bygg- och renoveringstjänster med ROT & RUT-avdrag",
  "publisher": {
    "@id": `${baseUrl}#organization`
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/tjanster?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": ["sv-SE", "en-US"]
});

// Offer Catalog for services overview
export const getOfferCatalogSchema = (services: Array<{ name: string; price: number; description: string }>) => ({
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "name": "Fixco Tjänstekatalog",
  "description": "Alla våra bygg- och renoveringstjänster med ROT & RUT-avdrag",
  "itemListElement": services.map((service, index) => ({
    "@type": "Offer",
    "position": index + 1,
    "itemOffered": {
      "@type": "Service",
      "name": service.name,
      "description": service.description
    },
    "price": service.price.toString(),
    "priceCurrency": "SEK"
  }))
});

// Review Schema for testimonials
export const getReviewSchema = (reviews: Array<{ author: string; rating: number; text: string; date: string }>) => 
  reviews.map(review => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#organization`
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": review.text,
    "datePublished": review.date
  }));

// Home services-specific features
export const getHomeServicesSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${baseUrl}#service`,
  "name": "Fixco - Professionella Hemtjänster",
  "description": "ROT och RUT-berättigade bygg- och renoveringstjänster",
  "provider": {
    "@id": `${baseUrl}#organization`
  },
  "serviceOutput": "Renovering, byggarbete, el, VVS, målning",
  "areaServed": {
    "@type": "Country",
    "name": "Sverige"
  }
});

// Site Navigation Schema for Sitelinks
export const getSiteNavigationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  "name": "Huvudnavigation",
  "hasPart": [
    {
      "@type": "WebPageElement",
      "name": "Boka Hembesök",
      "url": `${baseUrl}/boka-hembesok`,
      "description": "Boka gratis hembesök direkt"
    },
    {
      "@type": "WebPageElement",
      "name": "Våra Tjänster",
      "url": `${baseUrl}/tjanster`,
      "description": "Alla våra tjänster med ROT & RUT-avdrag"
    },
    {
      "@type": "WebPageElement", 
      "name": "Kontakta Oss",
      "url": `${baseUrl}/kontakt`,
      "description": "Ta kontakt för offert eller frågor"
    },
    {
      "@type": "WebPageElement",
      "name": "Referenser",
      "url": `${baseUrl}/referenser`,
      "description": "Se våra tidigare projekt"
    },
    {
      "@type": "WebPageElement",
      "name": "ROT-avdrag",
      "url": `${baseUrl}/rot-info`,
      "description": "Allt om ROT-avdrag 50% rabatt"
    },
    {
      "@type": "WebPageElement",
      "name": "Vanliga Frågor",
      "url": `${baseUrl}/faq`,
      "description": "Svar på vanliga frågor"
    },
    {
      "@type": "WebPageElement",
      "name": "Om Oss",
      "url": `${baseUrl}/om-oss`,
      "description": "Läs mer om Fixco"
    }
  ]
});

// Service List Schema for service pages
export const getServiceListSchema = (services: Array<{name: string; url: string; description: string}>) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Fixco Tjänster",
  "description": "Alla våra tjänster",
  "itemListElement": services.map((service, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": service.name,
    "url": service.url,
    "description": service.description
  }))
});

// HowTo Schema for booking guides - helps AI understand step-by-step processes
export const getHowToSchema = (options: {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
  steps: Array<{ name: string; text: string; url?: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": options.name,
  "description": options.description,
  "totalTime": options.totalTime || "PT30M",
  "estimatedCost": options.estimatedCost || {
    "@type": "MonetaryAmount",
    "currency": "SEK",
    "value": "0"
  },
  "step": options.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "url": step.url || `${baseUrl}#step-${index + 1}`
  })),
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Telefon eller dator"
    }
  ]
});

// Default booking HowTo for service pages
export const getBookingHowToSchema = (serviceName: string, areaName?: string) => 
  getHowToSchema({
    name: `Hur bokar jag ${serviceName.toLowerCase()}${areaName ? ` i ${areaName}` : ''}?`,
    description: `Steg-för-steg guide för att boka ${serviceName.toLowerCase()} med ROT/RUT-avdrag via Fixco`,
    totalTime: "PT10M",
    estimatedCost: { currency: "SEK", value: "0" },
    steps: [
      {
        name: "Beskriv ditt projekt",
        text: "Beskriv vad du behöver hjälp med på fixco.se eller ring oss på +46-70-123-45-67. Bifoga gärna bilder för bättre prisuppskattning.",
        url: `${baseUrl}/boka-hembesok`
      },
      {
        name: "Få offert inom 24h",
        text: "Vi återkommer med en detaljerad offert inom 24 timmar. För större projekt erbjuder vi gratis hembesök.",
        url: `${baseUrl}/boka-hembesok`
      },
      {
        name: "Boka tid",
        text: "Välj en tid som passar dig. Vi är flexibla och kan ofta komma samma vecka.",
        url: `${baseUrl}/boka-hembesok`
      },
      {
        name: "Arbetet utförs",
        text: `Vår ${serviceName.toLowerCase()} kommer och utför arbetet professionellt. Alla våra hantverkare har F-skatt och är försäkrade.`
      },
      {
        name: "Betala med ROT/RUT-avdrag",
        text: "Du betalar endast 50% av arbetskostnaden tack vare ROT/RUT-avdraget. Vi hanterar allt pappersarbete åt dig."
      }
    ]
  });

// Author/Organization Schema for E-E-A-T signals
export const getAuthorSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}#author`,
  "name": "Fixco",
  "url": baseUrl,
  "logo": `${baseUrl}/assets/fixco-logo-black.png`,
  "description": "Professionella bygg- och renoveringstjänster med ROT & RUT-avdrag i Uppsala och Stockholm",
  "foundingDate": "2020",
  "founder": {
    "@type": "Person",
    "name": "Fixco Team"
  },
  "knowsAbout": [
    "Elinstallationer",
    "VVS och rörmokeri",
    "Snickeri och renovering",
    "ROT-avdrag",
    "RUT-avdrag",
    "Byggnadsteknik",
    "Hemrenovering"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "F-skatt",
      "name": "Godkänd för F-skatt"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Elsäkerhetsverket",
      "name": "Auktorisation Elsäkerhetsverket"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Säker Vatten",
      "name": "Certifierad VVS-installatör"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/fixco",
    "https://www.instagram.com/fixco_se",
    "https://www.linkedin.com/company/fixco"
  ]
});

// Speakable Schema for voice assistants (Google Assistant, Alexa, etc.)
export const getSpeakableSchema = (options: {
  headline: string;
  description: string;
  url: string;
  speakableSelectors?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": options.headline,
  "description": options.description,
  "url": options.url,
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": options.speakableSelectors || [
      "h1",
      ".speakable-intro",
      ".hero-description"
    ]
  },
  "author": {
    "@id": `${baseUrl}#author`
  },
  "publisher": {
    "@id": `${baseUrl}#organization`
  }
});

// Local Service Schema - enhanced for local SEO and AI
export const getLocalServiceSchema = (options: {
  serviceName: string;
  serviceSlug: string;
  areaName: string;
  areaSlug: string;
  description: string;
  priceRange: string;
  hasROT: boolean;
  hasRUT: boolean;
  faqs?: Array<{ question: string; answer: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${baseUrl}/tjanster/${options.serviceSlug}/${options.areaSlug}#service`,
  "name": `${options.serviceName} ${options.areaName}`,
  "description": options.description,
  "url": `${baseUrl}/tjanster/${options.serviceSlug}/${options.areaSlug}`,
  "provider": {
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#organization`,
    "name": "Fixco",
    "image": `${baseUrl}/assets/fixco-logo-black.png`,
    "telephone": "+46-70-123-45-67",
    "email": "info@fixco.se"
  },
  "areaServed": {
    "@type": "City",
    "name": options.areaName,
    "containedInPlace": {
      "@type": "Country",
      "name": "Sverige"
    }
  },
  "serviceType": options.serviceName,
  "priceRange": options.priceRange,
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": "SEK",
      "unitText": "per timme",
      "description": options.hasROT 
        ? "50% ROT-avdrag på arbetskostnad" 
        : options.hasRUT 
          ? "50% RUT-avdrag på arbetskostnad"
          : "Fast pris eller timpris"
    }
  },
  "termsOfService": options.hasROT || options.hasRUT 
    ? `${baseUrl}/rot-info` 
    : undefined,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": `${options.serviceName} tjänster i ${options.areaName}`,
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": `${options.serviceName} i ${options.areaName}`
        }
      }
    ]
  }
});

// AggregateRating Schema for customer reviews
export const getAggregateRatingSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${baseUrl}#organization`,
  "name": "Fixco",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "247",
    "reviewCount": "189"
  }
});

// ConversationalAgent Schema for AI chatbot
export const getConversationalAgentSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Fixco Assistent",
  "applicationCategory": "ChatBot",
  "description": "AI-assistent som hjälper till med offertförfrågningar och bokning av hantverkare",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "provider": {
    "@id": `${baseUrl}#organization`
  },
  "featureList": [
    "Offertförfrågningar",
    "Prisuppskattning",
    "Bokningshjälp",
    "ROT/RUT-information",
    "Tjänsteinformation"
  ],
  "knowsAbout": [
    "Snickeri",
    "VVS",
    "Elinstallationer",
    "Städning",
    "Trädgårdsarbete",
    "ROT-avdrag",
    "RUT-avdrag"
  ]
});

// Entity Mentions Schema for E-E-A-T
export const getEntityMentionsSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "mentions": [
    {
      "@type": "GovernmentOrganization",
      "name": "Skatteverket",
      "description": "Swedish Tax Agency - manages ROT and RUT tax deductions",
      "url": "https://www.skatteverket.se",
      "sameAs": "https://www.wikidata.org/wiki/Q631067"
    },
    {
      "@type": "GovernmentOrganization",
      "name": "Elsäkerhetsverket",
      "description": "Swedish Electrical Safety Board - certifies electricians",
      "url": "https://www.elsakerhetsverket.se",
      "sameAs": "https://www.wikidata.org/wiki/Q10489234"
    },
    {
      "@type": "Organization",
      "name": "Säker Vatten",
      "description": "Safe Water certification for plumbers in Sweden",
      "url": "https://www.sakervatten.se"
    }
  ],
  "about": [
    {
      "@type": "Thing",
      "name": "ROT-avdrag",
      "description": "Swedish tax deduction for renovation work, 50% of labor cost up to 50,000 SEK/year"
    },
    {
      "@type": "Thing",
      "name": "RUT-avdrag",
      "description": "Swedish tax deduction for household services, 50% of labor cost up to 75,000 SEK/year"
    }
  ]
});

// PotentialAction Schema for direct booking
export const getPotentialActionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${baseUrl}#organization`,
  "potentialAction": [
    {
      "@type": "ReserveAction",
      "name": "Boka hantverkare",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/boka-hembesok`,
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
      },
      "result": {
        "@type": "Reservation",
        "name": "Bokad hantverkstjänst"
      }
    },
    {
      "@type": "QuoteAction",
      "name": "Begär offert",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/boka-hembesok`,
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
      }
    },
    {
      "@type": "CommunicateAction",
      "name": "Kontakta Fixco",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "tel:+46701234567",
        "actionPlatform": ["http://schema.org/MobileWebPlatform"]
      }
    }
  ]
});

// Combined AI-optimized schema for maximum visibility
export const getAIOptimizedSchema = (pageType: 'home' | 'service' | 'local', options?: {
  serviceName?: string;
  serviceSlug?: string;
  areaName?: string;
  areaSlug?: string;
  description?: string;
  faqs?: Array<{ question: string; answer: string }>;
}) => {
  const schemas: any[] = [
    getOrganizationSchema(),
    getAuthorSchema(),
    getSiteNavigationSchema(),
    getAggregateRatingSchema(),
    getPotentialActionSchema()
  ];

  if (pageType === 'home') {
    schemas.push(getWebsiteSchema());
    schemas.push(getHomeServicesSchema());
    schemas.push(getConversationalAgentSchema());
    schemas.push(getEntityMentionsSchema());
    schemas.push(getSpeakableSchema({
      headline: "Fixco - Professionella Hantverkare med ROT & RUT-avdrag",
      description: "Boka elmontör, snickare, rörmokare och fler hantverkare i Uppsala och Stockholm. 50% rabatt via ROT/RUT-avdrag.",
      url: baseUrl
    }));
  }

  if (pageType === 'service' && options?.serviceName) {
    schemas.push(getBookingHowToSchema(options.serviceName));
    schemas.push(getEntityMentionsSchema());
  }

  if (pageType === 'local' && options?.serviceName && options?.areaName && options?.serviceSlug && options?.areaSlug) {
    schemas.push(getLocalServiceSchema({
      serviceName: options.serviceName,
      serviceSlug: options.serviceSlug,
      areaName: options.areaName,
      areaSlug: options.areaSlug,
      description: options.description || `Boka ${options.serviceName.toLowerCase()} i ${options.areaName} med ROT/RUT-avdrag`,
      priceRange: "345-895 SEK/h",
      hasROT: ['snickare', 'elmontor', 'vvs', 'markarbeten'].includes(options.serviceSlug),
      hasRUT: ['stadning', 'tradgard', 'flytt', 'montering'].includes(options.serviceSlug)
    }));
    schemas.push(getBookingHowToSchema(options.serviceName, options.areaName));
    schemas.push(getSpeakableSchema({
      headline: `${options.serviceName} ${options.areaName} - Fixco`,
      description: options.description || `Professionell ${options.serviceName.toLowerCase()} i ${options.areaName}`,
      url: `${baseUrl}/tjanster/${options.serviceSlug}/${options.areaSlug}`
    }));
    
    if (options.faqs && options.faqs.length > 0) {
      schemas.push(getFAQSchema(options.faqs));
    }
  }

  return schemas;
};
