import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Tag, Share2, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getBlogPostBySlug, getRelatedPosts, blogCategories } from '@/data/blogData';
import Breadcrumbs from '@/components/Breadcrumbs';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';
import BlogThumbnail from '@/components/blog/BlogThumbnail';

// Extend window for global modal function
declare global {
  interface Window {
    openFixcoModal?: () => void;
  }
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  
  if (!post) {
    return <Navigate to="/blogg" replace />;
  }

  const relatedPosts = getRelatedPosts(post.slug, 3);
  const categoryName = blogCategories.find(c => c.slug === post.category)?.name || post.category;

  // Expose global function for CTA buttons in rendered HTML
  useEffect(() => {
    window.openFixcoModal = () => {
      openServiceRequestModal({ mode: 'home_visit', showCategories: true });
    };
    return () => {
      delete window.openFixcoModal;
    };
  }, []);

  // Schema.org för Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fixco AB",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fixco.se/assets/fixco-logo-black.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fixco.se/blogg/${post.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Hem", "item": "https://fixco.se" },
      { "@type": "ListItem", "position": 2, "name": "Blogg", "item": "https://fixco.se/blogg" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://fixco.se/blogg/${post.slug}` }
    ]
  };

  // Konvertera markdown-liknande innehåll till HTML med nya designelement
  const renderContent = (content: string) => {
    let html = content
      // Info boxes - blå gradient
      .replace(/:::info\n([\s\S]*?):::/g, `
        <div class="my-6 p-5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm">
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-blue-600 dark:text-blue-400 mb-1">Viktigt att veta</p>
              <p class="text-foreground/90 m-0">$1</p>
            </div>
          </div>
        </div>
      `)
      // Warning boxes - orange/röd gradient
      .replace(/:::warning\n([\s\S]*?):::/g, `
        <div class="my-6 p-5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-orange-600 dark:text-orange-400 mb-1">Varning</p>
              <p class="text-foreground/90 m-0">$1</p>
            </div>
          </div>
        </div>
      `)
      // Tip boxes - grön gradient
      .replace(/:::tip\n([\s\S]*?):::/g, `
        <div class="my-6 p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 backdrop-blur-sm">
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Tips</p>
              <p class="text-foreground/90 m-0">$1</p>
            </div>
          </div>
        </div>
      `)
      // CTA boxes - gradient med knapp (öppnar HomeVisit-modal)
      .replace(/:::cta\n([\s\S]*?):::/g, `
        <div class="my-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
          <div class="relative z-10">
            <p class="text-xl md:text-2xl font-bold text-foreground mb-2">$1</p>
            <p class="text-muted-foreground mb-6">Få professionell hjälp av våra experter</p>
            <button onclick="window.openFixcoModal && window.openFixcoModal()" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer border-0">
              Begär gratis offert
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        </div>
      `)
      // Stats boxes - statistik med snygga kort
      .replace(/:::stats\n([\s\S]*?):::/g, (match, content) => {
        const stats = content.trim().split('\n').map((line: string) => {
          const [value, label] = line.split('|').map((s: string) => s.trim());
          return { value, label };
        });
        const statsHtml = stats.map((stat: { value: string; label: string }) => `
          <div class="flex-1 min-w-[140px] p-4 rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/50 text-center">
            <p class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">${stat.value}</p>
            <p class="text-sm text-muted-foreground mt-1">${stat.label}</p>
          </div>
        `).join('');
        return `<div class="my-8 flex flex-wrap gap-4 justify-center">${statsHtml}</div>`;
      })
      // Source boxes - källhänvisningar
      .replace(/:::source\n([\s\S]*?):::/g, `
        <div class="my-6 p-4 rounded-lg bg-muted/30 border-l-4 border-primary/50">
          <div class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span class="text-muted-foreground font-medium">Källa:</span>
            <span class="text-foreground/80">$1</span>
          </div>
        </div>
      `)
      // Highlight quotes - gradient border
      .replace(/^> "(.*)"$/gm, `
        <blockquote class="my-6 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border-l-4 border-primary relative">
          <svg class="absolute top-4 left-4 w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <p class="italic text-lg text-foreground/90 pl-8 m-0">$1</p>
        </blockquote>
      `)
      // Headers med gradient underline
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl md:text-3xl font-bold mt-12 mb-6 pb-3 border-b-2 border-gradient-primary text-foreground relative after:absolute after:bottom-0 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary after:to-accent after:rounded-full">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground flex items-center gap-2"><span class="w-2 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></span>$1</h3>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      // Check/X lists med bättre styling
      .replace(/^- ✅ (.*$)/gm, '<li class="flex items-start gap-3 py-2"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5"><svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></span><span class="text-foreground/90">$1</span></li>')
      .replace(/^- ❌ (.*$)/gm, '<li class="flex items-start gap-3 py-2"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5"><svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></span><span class="text-foreground/90">$1</span></li>')
      // Regular lists
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc py-1 text-muted-foreground">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal py-1 text-muted-foreground">$1</li>')
      // Tables - parse entire table blocks at once to keep them together
      .replace(/((?:^\|.+\|$\n?)+)/gm, (tableBlock) => {
        const rows = tableBlock.trim().split('\n').filter(row => row.trim() && !row.includes('---'));
        if (rows.length === 0) return '';

        const getColWidthClass = (index: number) => {
          if (index === 0) return 'w-32';
          if (index === 1) return 'w-48';
          return '';
        };

        const renderRow = (row: string, isHeader: boolean) => {
          const cells = row.replace(/^\||\|$/g, '').split('|').map((cell: string) => cell.trim());

          if (isHeader) {
            return `<tr class="bg-gradient-to-r from-primary/15 via-primary/10 to-accent/15">${cells
              .map((cell: string, index: number) => {
                const widthClass = getColWidthClass(index);
                return `<th class="${widthClass} px-5 py-4 align-top text-left font-bold text-foreground uppercase tracking-wide text-xs border-b-2 border-primary/30">${cell}</th>`;
              })
              .join('')}</tr>`;
          }

          return `<tr class="group border-b border-border/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300">${cells
            .map((cell: string, index: number) => {
              const widthClass = getColWidthClass(index);

              // Check if cell contains lifespan data (år)
              const lifespanMatch = cell.match(/(\d+)\s*år/);
              if (lifespanMatch) {
                const years = parseInt(lifespanMatch[1]);
                const percentage = Math.min((years / 100) * 100, 100);
                const gradientColor =
                  years >= 60
                    ? 'from-emerald-500 to-green-400'
                    : years >= 30
                      ? 'from-amber-500 to-yellow-400'
                      : 'from-orange-500 to-red-400';

                return `<td class="${widthClass} px-5 py-4 align-top">
                  <div class="flex flex-col gap-2">
                    <span class="font-bold text-lg tabular-nums bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent">${years} år</span>
                    <div class="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r ${gradientColor} rounded-full transition-all duration-700" style="width: ${percentage}%"></div>
                    </div>
                  </div>
                </td>`;
              }

              // First column styling (component name)
              if (index === 0) {
                return `<td class="${widthClass} px-5 py-4 align-top font-semibold text-foreground group-hover:text-primary transition-colors">${cell}</td>`;
              }

              return `<td class="${widthClass} px-5 py-4 align-top text-muted-foreground break-words">${cell}</td>`;
            })
            .join('')}</tr>`;
        };

        // Determine if first row is header
        const firstRowCells = rows[0].replace(/^\||\|$/g, '').split('|').map((s: string) => s.trim().toLowerCase());
        const isFirstRowHeader = firstRowCells.some((cell: string) =>
          cell.includes('komponent') || cell.includes('typ') || cell.includes('livslängd') ||
          cell.includes('beskrivning') || cell.includes('kategori') || cell === 'år'
        );

        const tableRows = rows.map((row, index) => renderRow(row, index === 0 && isFirstRowHeader)).join('');

        return `<div class="my-8 overflow-x-auto rounded-2xl border border-border/50 bg-gradient-to-br from-card via-background to-card shadow-lg shadow-primary/5 backdrop-blur-sm">
          <table class="w-full min-w-[640px] table-fixed text-sm">${tableRows}</table>
        </div>`;
      })

    return html;
  };

  return (
    <>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://fixco.se/blogg/${post.slug}`} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={`https://fixco.se/blogg/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={categoryName} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Breadcrumbs />

        {/* Hero Thumbnail */}
        <div className="container mx-auto px-4 pt-6">
          <div className="max-w-4xl mx-auto">
            <BlogThumbnail category={post.category} className="rounded-2xl shadow-2xl" />
          </div>
        </div>

        {/* Article Header */}
        <header className="pt-8 pb-12 bg-gradient-to-b from-background to-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              {/* Back link */}
              <Link 
                to="/blogg" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Tillbaka till bloggen
              </Link>

              {/* Category & Reading time */}
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-1">
                  {categoryName}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min läsning
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt} className="text-sm">
                    {new Date(post.publishedAt).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-slate dark:prose-invert max-w-none
                  prose-headings:text-foreground prose-p:text-muted-foreground
                  prose-strong:text-foreground prose-a:text-primary
                  prose-li:text-muted-foreground prose-table:my-0"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="hover:bg-primary/10 transition-colors cursor-default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 flex items-center gap-4 flex-wrap">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Dela artikeln:
                </span>
                <Button variant="outline" size="sm" className="hover:bg-[#1877f2]/10 hover:text-[#1877f2] hover:border-[#1877f2]/50" asChild>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://fixco.se/blogg/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-[#0077b5]/10 hover:text-[#0077b5] hover:border-[#0077b5]/50" asChild>
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=https://fixco.se/blogg/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="py-16 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4" />
                Spara upp till 75 000 kr med ROT-avdrag
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Behöver du hjälp med ditt projekt?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Våra experter hjälper dig med allt från planering till färdigt resultat. 
                Begär en gratis offert idag!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
                >
                  Begär gratis offert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10" asChild>
                  <a href="tel:+46793350228">
                    Ring oss: 079-335 02 28
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                Relaterade artiklar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blogg/${relatedPost.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                      <CardContent className="p-6">
                        <Badge className="mb-3 text-xs bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-0">
                          {blogCategories.find(c => c.slug === relatedPost.category)?.name}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedPost.readingTime} min
                          </span>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <section className="py-8 bg-background border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <Button variant="outline" className="group" asChild>
              <Link to="/blogg" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Se alla artiklar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPost;
