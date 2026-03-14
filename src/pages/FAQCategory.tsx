import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { blogPosts, blogCategories } from '@/data/blogData';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/copy/CopyProvider';
import { getFAQSchema, getBreadcrumbSchema } from '@/components/SEOSchemaEnhanced';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';

// Map URL slug to blog categories for FAQ filtering
const FAQ_CATEGORY_MAP: Record<string, { categories: string[]; titleSv: string; titleEn: string; descSv: string; descEn: string }> = {
  'badrumsrenovering': {
    categories: ['renovering'],
    titleSv: 'Vanliga frågor om badrumsrenovering',
    titleEn: 'FAQ about bathroom renovation',
    descSv: 'Svar på vanliga frågor om badrumsrenovering: kostnad, tid, ROT-avdrag, våtrumskrav och mer.',
    descEn: 'Answers to common questions about bathroom renovation: cost, time, ROT deduction and more.',
  },
  'koksrenovering': {
    categories: ['renovering'],
    titleSv: 'Vanliga frågor om köksrenovering',
    titleEn: 'FAQ about kitchen renovation',
    descSv: 'Svar på vanliga frågor om köksrenovering: kostnad, IKEA vs platsbyggt, ROT-avdrag och mer.',
    descEn: 'Answers to common questions about kitchen renovation: cost, IKEA vs custom, ROT deduction and more.',
  },
  'rot-avdrag': {
    categories: ['rot-rut'],
    titleSv: 'Vanliga frågor om ROT-avdrag 2026',
    titleEn: 'FAQ about ROT deduction 2026',
    descSv: 'Allt om ROT-avdrag 2026: regler, maxbelopp 50 000 kr, vilka arbeten som gäller och hur du ansöker.',
    descEn: 'Everything about ROT deduction 2026: rules, max amount, eligible work and how to apply.',
  },
  'rut-avdrag': {
    categories: ['rut'],
    titleSv: 'Vanliga frågor om RUT-avdrag 2026',
    titleEn: 'FAQ about RUT deduction 2026',
    descSv: 'Allt om RUT-avdrag 2026: städning, flytt, montering. Regler, maxbelopp och ansökan.',
    descEn: 'Everything about RUT deduction 2026: cleaning, moving, assembly. Rules, limits and application.',
  },
  'elektriker': {
    categories: ['energi', 'guider'],
    titleSv: 'Vanliga frågor om elarbeten',
    titleEn: 'FAQ about electrical work',
    descSv: 'Svar på vanliga frågor om elinstallation, laddbox, belysning och auktoriserade elektriker.',
    descEn: 'Answers to common questions about electrical installation, EV chargers, lighting and certified electricians.',
  },
  'malare': {
    categories: ['renovering', 'tips'],
    titleSv: 'Vanliga frågor om målning',
    titleEn: 'FAQ about painting',
    descSv: 'Svar på vanliga frågor om inomhus- och utomhusmålning: kostnad, ROT-avdrag, färgval och mer.',
    descEn: 'Answers to FAQ about interior and exterior painting: cost, ROT deduction, color choices and more.',
  },
  'snickare': {
    categories: ['renovering', 'guider', 'tips'],
    titleSv: 'Vanliga frågor om snickare & byggtjänster',
    titleEn: 'FAQ about carpentry & construction',
    descSv: 'Svar på vanliga frågor om snickare, renovering, altanbygge, kök och ROT-avdrag.',
    descEn: 'Answers to FAQ about carpentry, renovation, deck building, kitchen and ROT deduction.',
  },
  'vvs': {
    categories: ['renovering', 'guider'],
    titleSv: 'Vanliga frågor om VVS & rörarbeten',
    titleEn: 'FAQ about plumbing',
    descSv: 'Svar på vanliga frågor om VVS-arbeten: vattenläckor, golvvärme, badrum och ROT-avdrag.',
    descEn: 'Answers to FAQ about plumbing: leaks, underfloor heating, bathroom and ROT deduction.',
  },
  'energi': {
    categories: ['energi'],
    titleSv: 'Vanliga frågor om energi & värmepumpar',
    titleEn: 'FAQ about energy & heat pumps',
    descSv: 'Svar på vanliga frågor om värmepumpar, solceller, laddbox och energieffektivisering 2026.',
    descEn: 'Answers to FAQ about heat pumps, solar panels, EV chargers and energy efficiency 2026.',
  },
  'golvlaggning': {
    categories: ['renovering', 'guider'],
    titleSv: 'Vanliga frågor om golvläggning',
    titleEn: 'FAQ about floor installation',
    descSv: 'Svar på vanliga frågor om golvläggning: parkett vs laminat, vinyl, klinker, kostnad och ROT-avdrag.',
    descEn: 'Answers to FAQ about floor installation: parquet vs laminate, vinyl, tiles, cost and ROT deduction.',
  },
};

const FAQCategory = () => {
  const { category } = useParams<{ category: string }>();
  const { locale } = useCopy();
  const isEnglish = locale === 'en';
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const config = category ? FAQ_CATEGORY_MAP[category] : undefined;

  if (!config) {
    return <Navigate to={isEnglish ? '/en/faq' : '/faq'} replace />;
  }

  const faqs = useMemo(() => {
    // Collect all FAQs from blog posts matching this category
    const matchingPosts = blogPosts.filter(p => config.categories.includes(p.category));
    const allFaqs: Array<{ q: string; a: string }> = [];
    matchingPosts.forEach(post => {
      if (post.faqs) {
        post.faqs.forEach(faq => allFaqs.push(faq));
      }
    });
    // Deduplicate by question
    const seen = new Set<string>();
    return allFaqs.filter(f => {
      if (seen.has(f.q)) return false;
      seen.add(f.q);
      return true;
    });
  }, [config.categories]);

  const title = isEnglish ? config.titleEn : config.titleSv;
  const description = isEnglish ? config.descEn : config.descSv;

  const faqSchemaItems = faqs.map(f => ({ question: f.q, answer: f.a }));
  const faqSchema = getFAQSchema(faqSchemaItems);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isEnglish ? 'Home' : 'Hem', url: '/' },
    { name: 'FAQ', url: isEnglish ? '/en/faq' : '/faq' },
    { name: title, url: isEnglish ? `/en/faq/${category}` : `/faq/${category}` },
  ]);

  const toggleItem = (idx: number) => {
    setOpenItems(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title} | Fixco</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://fixco.se${isEnglish ? `/en/faq/${category}` : `/faq/${category}`}`} />
        <meta property="og:title" content={`${title} | Fixco`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 hero-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to={isEnglish ? '/en/faq' : '/faq'} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {isEnglish ? 'All FAQ' : 'Alla frågor'}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              {isEnglish ? 'No FAQ available for this category yet.' : 'Inga frågor tillgängliga för denna kategori ännu.'}
            </p>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openItems.includes(idx);
                return (
                  <div key={idx} className="card-premium overflow-hidden">
                    <button
                      onClick={() => toggleItem(idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
                    >
                      <span className="font-semibold pr-4">{faq.q}</span>
                      {isOpen ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 border-t border-border">
                        <div className="pt-4 text-muted-foreground leading-relaxed">{faq.a}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {isEnglish ? 'Need help? Get a free quote today.' : 'Behöver du hjälp? Få en gratis offert idag.'}
            </p>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground font-bold"
              onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
            >
              {isEnglish ? 'Get free quote' : 'Begär gratis offert'}
            </Button>
          </div>

          {/* Links to other FAQ categories */}
          <div className="mt-16 border-t border-border pt-8">
            <h2 className="text-lg font-bold mb-4">{isEnglish ? 'More FAQ categories' : 'Fler FAQ-kategorier'}</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FAQ_CATEGORY_MAP)
                .filter(([slug]) => slug !== category)
                .map(([slug, cfg]) => (
                  <Link
                    key={slug}
                    to={isEnglish ? `/en/faq/${slug}` : `/faq/${slug}`}
                    className="px-3 py-2 text-sm rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    {isEnglish ? cfg.titleEn.replace('FAQ about ', '') : cfg.titleSv.replace('Vanliga frågor om ', '')}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQCategory;
