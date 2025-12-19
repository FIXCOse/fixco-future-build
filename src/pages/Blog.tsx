import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight, Search, Tag, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { blogPosts, blogCategories, getFeaturedPosts } from '@/data/blogData';
import Breadcrumbs from '@/components/Breadcrumbs';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const featuredPosts = getFeaturedPosts();
  
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Schema.org för BlogPosting
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Fixco Blogg",
    "description": "Tips, guider och nyheter om renovering, ROT-avdrag och hantverkstjänster",
    "url": "https://fixco.se/blogg",
    "publisher": {
      "@type": "Organization",
      "name": "Fixco AB",
      "logo": "https://fixco.se/assets/fixco-logo-black.png"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "url": `https://fixco.se/blogg/${post.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Blogg | Tips om ROT-avdrag, Renovering & Hantverkare | Fixco</title>
        <meta name="description" content="Läs våra expertguider om ROT-avdrag, badrumsrenovering, köksrenovering och mycket mer. Spara pengar och undvik misstag med våra tips." />
        <link rel="canonical" href="https://fixco.se/blogg" />
        <meta property="og:title" content="Fixco Blogg - Tips & Guider för Renovering" />
        <meta property="og:description" content="Expertguider om ROT-avdrag, renovering och hantverkstjänster. Spara pengar med våra tips." />
        <meta property="og:url" content="https://fixco.se/blogg" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(blogListSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 gradient-primary text-white">
                <BookOpen className="h-3 w-3 mr-1" />
                Expertkunskap
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
                Fixco Blogg
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Tips, guider och expertråd om renovering, ROT-avdrag och hur du får ut det mesta av dina hantverksprojekt.
              </p>
              
              {/* Sökfält */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Sök artiklar..."
                  className="pl-10 h-12 bg-card border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Kategori-filter */}
        <section className="py-6 bg-muted/30 border-y border-border sticky top-0 z-20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Alla
              </Button>
              {blogCategories.map(category => (
                <Button
                  key={category.slug}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {!selectedCategory && !searchQuery && featuredPosts.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Utvalda artiklar
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPosts.slice(0, 2).map((post, idx) => (
                  <Link 
                    key={post.id} 
                    to={`/blogg/${post.slug}`}
                    className="group"
                  >
                    <Card className={`h-full overflow-hidden hover:border-primary/50 transition-all ${idx === 0 ? 'lg:row-span-2' : ''}`}>
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-primary/40" />
                        </div>
                        <Badge className="absolute top-4 left-4 bg-primary text-white">
                          {blogCategories.find(c => c.slug === post.category)?.name}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString('sv-SE')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0">
                        <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Läs mer <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Alla artiklar */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full" />
                {selectedCategory 
                  ? blogCategories.find(c => c.slug === selectedCategory)?.name 
                  : searchQuery 
                    ? `Sökresultat: "${searchQuery}"` 
                    : 'Alla artiklar'}
              </h2>
              <span className="text-muted-foreground text-sm">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'artikel' : 'artiklar'}
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Inga artiklar hittades.</p>
                <Button variant="outline" onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}>
                  Visa alla artiklar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <Link 
                    key={post.id} 
                    to={`/blogg/${post.slug}`}
                    className="group"
                  >
                    <Card className="h-full hover:border-primary/50 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {blogCategories.find(c => c.slug === post.category)?.name}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString('sv-SE')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-primary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Redo att starta ditt projekt?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Oavsett om det gäller badrumsrenovering, köksrenovering eller elarbeten – 
              våra experter hjälper dig från start till mål.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/kontakt">
                  Begär gratis offert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tjanster">
                  Se våra tjänster
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Tags */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Populära ämnen
            </h3>
            <div className="flex flex-wrap gap-2">
              {['rot-avdrag', 'renovering', 'badrumsrenovering', 'köksrenovering', 'elektriker', 'kostnad', 'tips'].map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
