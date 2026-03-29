/**
 * Adaptive Image Component
 * Loads appropriate image quality based on network conditions
 */

import React, { useState, useEffect, useRef } from 'react';
import { useOffline } from '@/lib/offline/offline-context';
import { cn } from '@/lib/utils';

interface AdaptiveImageProps {
  src: string;
  lowSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: React.ReactNode;
}

export function AdaptiveImage({
  src,
  lowSrc,
  alt,
  className,
  width,
  height,
  lazy = true,
  placeholder
}: AdaptiveImageProps) {
  const { lowDataMode, isOnline } = useOffline();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine which source to use
  const imageSrc = lowDataMode && lowSrc ? lowSrc : src;

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '100px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  if (!isOnline && !loaded) {
    return (
      <div 
        className={cn(
          'bg-muted/20 flex items-center justify-center text-muted-foreground text-xs',
          className
        )}
        style={{ width, height }}
      >
        {placeholder || 'Image unavailable offline'}
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={cn(
          'bg-muted/20 flex items-center justify-center text-muted-foreground text-xs',
          className
        )}
        style={{ width, height }}
      >
        {placeholder || 'Failed to load'}
      </div>
    );
  }

  return (
    <div className="relative">
      {!loaded && (
        <div 
          className={cn(
            'absolute inset-0 bg-muted/30 animate-pulse rounded',
            className
          )}
          style={{ width, height }}
        />
      )}
      <img
        ref={imgRef}
        src={lazy ? undefined : imageSrc}
        data-src={lazy ? imageSrc : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
}

/**
 * Icon component optimized for low-data mode
 * Uses SVG for minimal size
 */
interface AdaptiveIconProps {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  fallbackText?: string;
}

export function AdaptiveIcon({ icon: Icon, className, fallbackText }: AdaptiveIconProps) {
  const { lowDataMode } = useOffline();

  // In ultra-low mode with fallback text, show text instead of icon
  if (lowDataMode && fallbackText) {
    return (
      <span className={cn('text-xs font-medium', className)}>
        {fallbackText}
      </span>
    );
  }

  return <Icon className={className} />;
}
