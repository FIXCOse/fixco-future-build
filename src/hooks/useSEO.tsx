import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'service';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
  canonicalPath?: string;
  noindex?: boolean;
  alternateLanguages?: { locale: string; url: string }[];
}

export const useSEO = ({
  title,
  description,
  keywords,
  image = 'https://fixco.se/assets/fixco-logo-black.png',
  type = 'website',
  author = 'Fixco',
  publishedTime,
  modifiedTime,
  schema,
  canonicalPath,
  noindex = false,
  alternateLanguages = []
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = 'https://fixco.se';
  const currentUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : `${baseUrl}${location.pathname}`;
  
  // Full title with brand
  const fullTitle = title.includes('Fixco') ? title : `${title} | Fixco`;
  
  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
        page_title: fullTitle
      });
    }
  }, [location, fullTitle]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Fixco" />
      <meta property="og:locale" content="sv_SE" />
      <meta property="og:locale:alternate" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@fixco_se" />

      {/* Alternate Languages (hreflang) */}
      {alternateLanguages.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
