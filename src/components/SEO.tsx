import React, { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  schemas?: object[];
  noindex?: boolean;
  image?: string;
};

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonicalPath,
  schemas = [],
  noindex = false,
  image = "https://fixco.se/assets/hero-construction.jpg",
}) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Set robots meta if noindex
    if (noindex) {
      let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.content = "noindex,nofollow";
    }

    // Set canonical URL
    const baseUrl = "https://fixco.se";
    const canonicalHref = canonicalPath ? `${baseUrl}${canonicalPath}` : window.location.href;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    // Helper function to set meta tags
    const setMeta = (property: string, content: string, useProperty = true) => {
      const attr = useProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Open Graph tags
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", canonicalHref);
    setMeta("og:image", image);
    setMeta("og:type", "website");
    setMeta("og:locale", "sv_SE");
    setMeta("og:site_name", "Fixco");

    // Twitter Card tags
    setMeta("twitter:card", "summary_large_image", false);
    setMeta("twitter:title", title, false);
    setMeta("twitter:description", description, false);
    setMeta("twitter:image", image, false);

    // Remove old JSON-LD schemas
    Array.from(document.querySelectorAll('script[data-seo-jsonld="true"]')).forEach((el) => el.remove());

    // Add new JSON-LD schemas
    schemas.forEach((schemaObj) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }, [title, description, canonicalPath, JSON.stringify(schemas), noindex, image]);

  return null;
};
