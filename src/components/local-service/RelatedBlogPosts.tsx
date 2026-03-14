import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useMemo } from 'react';
import { blogPosts } from '@/data/blogData';
import { SERVICE_TO_BLOG_CATEGORIES } from '@/data/blogSlugs';

interface RelatedBlogPostsProps {
  serviceSlug: string;
  locale?: string;
}

export const RelatedBlogPosts = ({ serviceSlug, locale = 'sv' }: RelatedBlogPostsProps) => {
  const isEnglish = locale === 'en';
  const blogPrefix = isEnglish ? '/en/blog' : '/blogg';

  const relatedPosts = useMemo(() => {
    const categories = SERVICE_TO_BLOG_CATEGORIES[serviceSlug] || ['renovering', 'tips'];
    return blogPosts
      .filter(p => categories.includes(p.category))
      .slice(0, 3);
  }, [serviceSlug]);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-10 border-t border-border">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        {isEnglish ? 'Read more' : 'Läs mer'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedPosts.map(post => (
          <Link
            key={post.slug}
            to={`${blogPrefix}/${post.slug}`}
            className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {post.category}
            </span>
            <h3 className="font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm">
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-xs text-primary mt-2 group-hover:gap-2 transition-all">
              {isEnglish ? 'Read' : 'Läs'} <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
