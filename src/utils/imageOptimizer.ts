// Image optimization utilities for better performance

export const getOptimizedImageProps = (
  src: string,
  options: {
    width?: number;
    height?: number;
    priority?: boolean;
  } = {}
) => {
  const { width, height, priority = false } = options;
  
  // Convert PNG to WebP path if available
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  return {
    src,
    webpSrc,
    width,
    height,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    decoding: priority ? ('sync' as const) : ('async' as const),
  };
};

// Srcset for responsive images
export const generateSrcSet = (baseSrc: string, sizes: number[]) => {
  return sizes.map(size => {
    const ext = baseSrc.split('.').pop();
    const nameWithoutExt = baseSrc.replace(`.${ext}`, '');
    return `${nameWithoutExt}-${size}w.${ext} ${size}w`;
  }).join(', ');
};
