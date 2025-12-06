import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick?: () => void;
}

// Transform Supabase Storage URLs for optimized loading
export const getOptimizedUrl = (url: string, options?: { width?: number; quality?: number }) => {
  if (!url) return url;
  
  // Check if it's a Supabase Storage URL
  if (url.includes('supabase.co/storage')) {
    const params = new URLSearchParams();
    if (options?.width) params.set('width', options.width.toString());
    if (options?.quality) params.set('quality', options.quality.toString());
    params.set('format', 'webp');
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }
  
  return url;
};

export const ImageWithPlaceholder = ({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  onError,
  onClick,
}: ImageWithPlaceholderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoaded(true); // Stop showing skeleton
    onError?.(e);
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
};

// Hook to preload images
export const useImagePreloader = (images: string[], currentIndex: number) => {
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // Preload next image
    const nextIndex = (currentIndex + 1) % images.length;
    preloadImage(images[nextIndex]);

    // Preload previous image
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    if (prevIndex !== nextIndex) {
      preloadImage(images[prevIndex]);
    }
  }, [images, currentIndex]);
};

export default ImageWithPlaceholder;
