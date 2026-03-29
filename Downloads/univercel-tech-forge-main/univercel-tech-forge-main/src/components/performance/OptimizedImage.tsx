import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  lazy?: boolean;
  priority?: boolean;
  quality?: 'low' | 'medium' | 'high';
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Placeholder SVG for ultra-lite mode
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f1f5f9" width="100" height="100"/%3E%3C/svg%3E';

// Tiny placeholder for blur-up effect
const generateBlurPlaceholder = (width: number, height: number): string => {
  const aspectRatio = height / width;
  const placeholderWidth = 10;
  const placeholderHeight = Math.round(placeholderWidth * aspectRatio);
  
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${placeholderWidth} ${placeholderHeight}"%3E%3Crect fill="%23e2e8f0" width="${placeholderWidth}" height="${placeholderHeight}"/%3E%3C/svg%3E`;
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  lazy = true,
  priority = false,
  quality = 'medium',
  fallback,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Determine image source based on quality
  const getOptimizedSrc = (): string => {
    if (hasError && fallback) return fallback;
    if (hasError) return PLACEHOLDER_SVG;
    if (!isInView) return generateBlurPlaceholder(width || 100, height || 100);
    
    // If it's a remote URL, we could add quality params here
    // For now, just return the original
    return src;
  };

  // Get srcset for responsive images
  const getSrcSet = (): string | undefined => {
    if (!isInView || hasError) return undefined;
    
    // Only generate srcset for remote images that might support resizing
    if (src.startsWith('http') && (src.includes('unsplash') || src.includes('cloudinary'))) {
      // Example: generate different sizes
      const widths = [320, 640, 1024, 1280];
      return widths.map(w => `${src}&w=${w} ${w}w`).join(', ');
    }
    
    return undefined;
  };

  const aspectRatio = width && height ? height / width : undefined;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio: aspectRatio ? `${width}/${height}` : undefined,
      }}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton
          className={cn(
            "absolute inset-0",
            placeholderClassName
          )}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={getOptimizedSrc()}
          srcSet={getSrcSet()}
          sizes={width ? `(max-width: ${width}px) 100vw, ${width}px` : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Error fallback */}
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image unavailable
        </div>
      )}
    </div>
  );
}

// Responsive image wrapper for different screen sizes
interface ResponsiveImageProps extends OptimizedImageProps {
  mobileSrc?: string;
  tabletSrc?: string;
}

export function ResponsiveImage({
  src,
  mobileSrc,
  tabletSrc,
  ...props
}: ResponsiveImageProps) {
  return (
    <picture>
      {mobileSrc && (
        <source media="(max-width: 640px)" srcSet={mobileSrc} />
      )}
      {tabletSrc && (
        <source media="(max-width: 1024px)" srcSet={tabletSrc} />
      )}
      <OptimizedImage src={src} {...props} />
    </picture>
  );
}

// Avatar component with optimization
interface OptimizedAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
  className?: string;
}

export function OptimizedAvatar({
  src,
  alt,
  size = 'md',
  fallbackInitials,
  className,
}: OptimizedAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  return (
    <div className={cn("rounded-full overflow-hidden", sizeClasses[size], className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className="rounded-full"
        fallback={fallbackInitials ? generateInitialsAvatar(fallbackInitials) : undefined}
      />
    </div>
  );
}

function generateInitialsAvatar(initials: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect fill="#6366f1" width="100" height="100"/>
      <text x="50" y="50" dy=".35em" fill="white" font-family="system-ui" font-size="40" text-anchor="middle">${initials.slice(0, 2).toUpperCase()}</text>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}