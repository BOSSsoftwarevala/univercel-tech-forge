/**
 * Optimized Scroll Hook - Smooth, performant scrolling
 * Uses RAF and passive listeners for 60fps scrolling
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollState {
  scrollY: number;
  scrollX: number;
  direction: 'up' | 'down' | 'none';
  isScrolling: boolean;
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function useOptimizedScroll(
  containerRef?: React.RefObject<HTMLElement>,
  options: { throttleMs?: number } = {}
) {
  const { throttleMs = 16 } = options; // ~60fps
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollX: 0,
    direction: 'none',
    isScrolling: false,
    isAtTop: true,
    isAtBottom: false
  });
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const rafId = useRef<number>();
  const lastUpdate = useRef(0);
  
  const updateScrollState = useCallback(() => {
    const element = containerRef?.current || document.documentElement;
    const scrollY = containerRef?.current ? element.scrollTop : window.scrollY;
    const scrollX = containerRef?.current ? element.scrollLeft : window.scrollX;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    const direction = scrollY > lastScrollY.current ? 'down' : 
                      scrollY < lastScrollY.current ? 'up' : 'none';
    
    lastScrollY.current = scrollY;
    
    setScrollState({
      scrollY,
      scrollX,
      direction,
      isScrolling: true,
      isAtTop: scrollY <= 0,
      isAtBottom: scrollY + clientHeight >= scrollHeight - 10
    });
    
    // Clear scrolling flag after scroll stops
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      setScrollState(prev => ({ ...prev, isScrolling: false }));
    }, 150);
  }, [containerRef]);
  
  const handleScroll = useCallback(() => {
    const now = Date.now();
    
    // Throttle updates
    if (now - lastUpdate.current < throttleMs) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateScrollState);
      return;
    }
    
    lastUpdate.current = now;
    updateScrollState();
  }, [throttleMs, updateScrollState]);
  
  useEffect(() => {
    const target = containerRef?.current || window;
    
    // Use passive listener for better performance
    target.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll, containerRef]);
  
  // Smooth scroll to position
  const scrollTo = useCallback((y: number, behavior: ScrollBehavior = 'smooth') => {
    const target = containerRef?.current;
    if (target) {
      target.scrollTo({ top: y, behavior });
    } else {
      window.scrollTo({ top: y, behavior });
    }
  }, [containerRef]);
  
  // Scroll to top
  const scrollToTop = useCallback(() => scrollTo(0), [scrollTo]);
  
  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const element = containerRef?.current || document.documentElement;
    scrollTo(element.scrollHeight);
  }, [containerRef, scrollTo]);
  
  return {
    ...scrollState,
    scrollTo,
    scrollToTop,
    scrollToBottom
  };
}

// Simple visibility check using IntersectionObserver
export function useElementVisibility(threshold = 0.1) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref: elementRef, isVisible };
}

export default useOptimizedScroll;
