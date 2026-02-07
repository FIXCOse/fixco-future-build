import { Helmet } from 'react-helmet-async';

interface SEOSchemaProps {
  type: 'homepage' | 'services' | 'service-detail' | 'contact' | 'faq';
  title?: string;
  description?: string;
  service?: {
    name: string;
    price: number;
    eligible: { rot: boolean; rut: boolean };
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const SEOSchema = ({ type, title, description, service, breadcrumbs }: SEOSchemaProps) => {
  const baseUrl = 'https://fixco.se';
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Fixco",
    "description": "Professionella bygg- och renoveringstjänster i Uppsala och Stockholm",
    "url": baseUrl,
    "telephone": "+46-70-123-45-67",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Uppsala",
      "addressRegion": "Uppsala län",
      "addressCountry": "SE"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Uppsala"
      },
      {
        "@type": "City", 
        "name": "Stockholm"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2000"
    },
    "priceRange": "480-1300 SEK/timme",
    "paymentAccepted": "Swish, Bankcard, Invoice",
    "currenciesAccepted": "SEK"
  };

  // Service Schema for service detail pages
  const serviceSchema = service ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Fixco"
    },
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "SEK",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Uppsala"
      },
      {
        "@type": "City",
        "name": "Stockholm"
      }
    ]
  } : null;

  // FAQ Schema
  const faqSchema = type === 'faq' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Vad kostar era tjänster?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Våra priser varierar beroende på tjänst, från 480 kr/h med ROT-avdrag till 1300 kr/h för specialiserade tjänster."
        }
      },
      {
        "@type": "Question",
        "name": "Vilka områden täcker ni?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vi verkar främst i Uppsala och Stockholm län, men tar även större projekt i hela Sverige."
        }
      },
      {
        "@type": "Question",
        "name": "Hur fungerar ROT-avdraget?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ROT-avdrag ger 30% rabatt på arbetskostnaden. Vi sköter hela processen åt dig."
        }
      }
    ]
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Organization Schema - Always include */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Service Schema - Only on service pages */}
      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
      
      {/* FAQ Schema - Only on FAQ page */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      
      {/* Breadcrumb Schema - Where applicable */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {/* Page-specific meta tags */}
      <title>{title || 'Fixco - Professionella Bygg- och Renoveringstjänster'}</title>
      <meta name="description" content={description || 'Snabbare, billigare och mer professionellt än konkurrenterna. Start inom 5 dagar, 30% rabatt med ROT-avdrag.'} />
      <link rel="canonical" href={window.location.href} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title || 'Fixco - Professionella Bygg- och Renoveringstjänster'} />
      <meta property="og:description" content={description || 'Snabbare, billigare och mer professionellt än konkurrenterna.'} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEOSchema;