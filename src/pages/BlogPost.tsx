import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Tag, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getBlogPostBySlug, getRelatedPosts, blogCategories } from '@/data/blogData';
import Breadcrumbs from '@/components/Breadcrumbs';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  
  if (!post) {
    return <Navigate to="/blogg" replace />;
  }

  const relatedPosts = getRelatedPosts(post.slug, 3);
  const categoryName = blogCategories.find(c => c.slug === post.category)?.name || post.category;

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

  // Konvertera markdown-liknande innehåll till HTML
  const renderContent = (content: string) => {
    return content
      // Headers
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Lists
      .replace(/^- ✅ (.*$)/gm, '<li class="flex items-start gap-2 text-primary"><span class="mt-1">✓</span><span class="text-foreground">$1</span></li>')
      .replace(/^- ❌ (.*$)/gm, '<li class="flex items-start gap-2 text-destructive"><span class="mt-1">✗</span><span class="text-foreground">$1</span></li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Tables - simplified
      .replace(/\|.*\|/g, (match) => {
        const cells = match.split('|').filter(Boolean).map(cell => cell.trim());
        const isHeader = match.includes('---');
        if (isHeader) return '';
        return `<tr class="border-b border-border">${cells.map(cell => `<td class="px-4 py-2">${cell}</td>`).join('')}</tr>`;
      })
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground leading-relaxed">')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-8 border-border" />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
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

        {/* Article Header */}
        <header className="pt-8 pb-12 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Back link */}
              <Link 
                to="/blogg" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Tillbaka till bloggen
              </Link>

              {/* Category & Reading time */}
              <div className="flex items-center gap-4 mb-4">
                <Badge className="gradient-primary text-white">
                  {categoryName}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min läsning
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
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
                  prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Dela artikeln:
                </span>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://fixco.se/blogg/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
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
        <section className="py-12 bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Behöver du hjälp med ditt projekt?</h2>
              <p className="text-muted-foreground mb-6">
                Våra experter hjälper dig med allt från planering till färdigt resultat. 
                Begär en gratis offert idag och spara med ROT-avdrag!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/kontakt">
                    Begär gratis offert
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
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
          <section className="py-12 bg-muted/20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Relaterade artiklar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blogg/${relatedPost.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3 text-xs">
                          {blogCategories.find(c => c.slug === relatedPost.category)?.name}
                        </Badge>
                        <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
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
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <Button variant="outline" asChild>
              <Link to="/blogg" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Se alla artiklar
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPost;
