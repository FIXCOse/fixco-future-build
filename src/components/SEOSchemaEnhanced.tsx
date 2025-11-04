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
      "name": "ROT-avdrag",
      "url": `${baseUrl}/rot-info`,
      "description": "Allt om ROT-avdrag 50% rabatt"
    },
    {
      "@type": "WebPageElement",
      "name": "RUT-avdrag", 
      "url": `${baseUrl}/rut`,
      "description": "Allt om RUT-avdrag för hemtjänster"
    },
    {
      "@type": "WebPageElement",
      "name": "Referenser",
      "url": `${baseUrl}/referenser`,
      "description": "Se våra tidigare projekt"
    },
    {
      "@type": "WebPageElement",
      "name": "Vanliga Frågor",
      "url": `${baseUrl}/faq`,
      "description": "Svar på vanliga frågor"
    },
    {
      "@type": "WebPageElement",
      "name": "Boka Hembesök",
      "url": `${baseUrl}/boka-hembesok`,
      "description": "Boka gratis hembesök direkt"
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
