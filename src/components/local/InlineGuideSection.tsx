import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { ServiceGuide } from "@/data/carpentryGuideData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

interface InlineGuideSectionProps {
  guide: ServiceGuide;
  area: string;
  canonicalUrl: string;
}

export const InlineGuideSection = ({ guide, area, canonicalUrl }: InlineGuideSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  // Article schema for the guide
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.intro,
    "author": {
      "@type": "Organization",
      "name": "Fixco",
      "url": "https://fixco.se"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fixco",
      "url": "https://fixco.se",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fixco.se/assets/fixco-logo-black.png"
      }
    },
    "mainEntityOfPage": canonicalUrl,
    "datePublished": "2026-03-01",
    "dateModified": "2026-03-20",
    "about": {
      "@type": "Service",
      "name": guide.title.replace('Guide: ', ''),
      "areaServed": { "@type": "City", "name": area }
    }
  };

  // Show intro + first section always, rest behind "Läs mer"
  const visibleSections = expanded ? guide.sections : guide.sections.slice(0, 1);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <BookOpen className="h-3.5 w-3.5" />
                Guide
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {guide.title}
              </h2>
            </motion.div>

            {/* Intro */}
            <motion.p
              variants={itemVariants}
              className="text-base text-muted-foreground leading-relaxed mb-8"
            >
              {guide.intro}
            </motion.p>

            {/* First section - uses parent variants */}
            {guide.sections.slice(0, 1).map((section, idx) => (
              <motion.div key={idx} variants={itemVariants} className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {section.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </motion.div>
            ))}

            {/* Expanded sections - use own initial/animate */}
            {expanded && guide.sections.slice(1).map((section, idx) => (
              <motion.div
                key={`expanded-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {section.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </motion.div>
            ))}

            {/* Expand/Collapse */}
            {!expanded && guide.sections.length > 1 && (
              <motion.button
                variants={itemVariants}
                onClick={() => setExpanded(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6"
              >
                Läs hela guiden
                <ChevronDown className="h-4 w-4" />
              </motion.button>
            )}

            {/* CTA */}
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
              >
                <p className="text-sm font-medium text-foreground">
                  {guide.cta}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};
