import { ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  webpSrc,
  width,
  height,
  priority = false,
  className,
  ...props 
}: OptimizedImageProps) => {
  const [imgError, setImgError] = useState(false);
  
  // Use WebP if available and not errored
  const imageSrc = imgError || !webpSrc ? src : webpSrc;
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      onError={() => setImgError(true)}
      {...props}
    />
  );
};
