import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  tti: number | null;
  domNodes: number;
  memoryUsage: number | null;
  fps: number;
  requestCount: number;
  totalTransferSize: number;
}

interface PerformanceResult {
  metrics: PerformanceMetrics;
  score: number;
  grade: string;
  scoreColor: string;
  isLowPerformance: boolean;
  logPerformance: (label: string, duration: number) => void;
  measureAsync: <T>(label: string, fn: () => Promise<T>) => Promise<T>;
}

export const usePerformanceMonitor = (): PerformanceResult => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    tti: null,
    domNodes: 0,
    memoryUsage: null,
    fps: 60,
    requestCount: 0,
    totalTransferSize: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // FPS monitoring
  useEffect(() => {
    let animationId: number;
    
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Core Web Vitals monitoring
  useEffect(() => {
    // FCP
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find(e => e.name === 'first-contentful-paint');
      if (fcp) {
        setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
      }
    });
    
    try {
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });
    
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const fid = entries[0] as PerformanceEventTiming;
        setMetrics(prev => ({ ...prev, fid: fid.processingStart - fid.startTime }));
      }
    });
    
    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      }
    });
    
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Browser doesn't support this observer
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // TTFB and navigation timing
  useEffect(() => {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entries.length > 0) {
      const nav = entries[0];
      setMetrics(prev => ({
        ...prev,
        ttfb: nav.responseStart - nav.requestStart,
        tti: nav.domInteractive - nav.startTime
      }));
    }
  }, []);

  // Memory monitoring (Chrome only)
  useEffect(() => {
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1048576)
        }));
      }
    };
    
    const interval = setInterval(measureMemory, 5000);
    measureMemory();
    
    return () => clearInterval(interval);
  }, []);

  // DOM nodes monitoring
  useEffect(() => {
    const measureDOM = () => {
      const domNodes = document.querySelectorAll('*').length;
      setMetrics(prev => ({ ...prev, domNodes }));
    };

    const interval = setInterval(measureDOM, 2000);
    measureDOM();

    return () => clearInterval(interval);
  }, []);

  // Network monitoring
  useEffect(() => {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      let totalSize = 0;
      entries.forEach(entry => {
        totalSize += entry.transferSize || 0;
      });
      
      setMetrics(prev => ({
        ...prev,
        requestCount: prev.requestCount + entries.length,
        totalTransferSize: Math.round((prev.totalTransferSize * 1024 + totalSize) / 1024)
      }));
    });

    try {
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      // Browser doesn't support this observer
    }

    return () => resourceObserver.disconnect();
  }, []);

  // Calculate score and grade
  const { score, grade, scoreColor } = useMemo(() => {
    let totalScore = 0;
    let count = 0;

    // FCP scoring (target < 1.2s)
    if (metrics.fcp !== null) {
      totalScore += metrics.fcp <= 1200 ? 100 : metrics.fcp <= 2400 ? 70 : 30;
      count++;
    }

    // LCP scoring (target < 2.5s)
    if (metrics.lcp !== null) {
      totalScore += metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 70 : 30;
      count++;
    }

    // FID scoring (target < 100ms)
    if (metrics.fid !== null) {
      totalScore += metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 70 : 30;
      count++;
    }

    // CLS scoring (target < 0.1)
    if (metrics.cls !== null) {
      totalScore += metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 70 : 30;
      count++;
    }

    // FPS scoring
    totalScore += metrics.fps >= 55 ? 100 : metrics.fps >= 30 ? 70 : 30;
    count++;

    // DOM nodes scoring
    totalScore += metrics.domNodes <= 1500 ? 100 : metrics.domNodes <= 2500 ? 70 : 30;
    count++;

    const finalScore = count > 0 ? Math.round(totalScore / count) : 0;
    
    let finalGrade: string;
    let color: string;
    
    if (finalScore >= 90) {
      finalGrade = 'A';
      color = 'text-green-500';
    } else if (finalScore >= 80) {
      finalGrade = 'B';
      color = 'text-green-400';
    } else if (finalScore >= 70) {
      finalGrade = 'C';
      color = 'text-yellow-500';
    } else if (finalScore >= 60) {
      finalGrade = 'D';
      color = 'text-orange-500';
    } else {
      finalGrade = 'F';
      color = 'text-red-500';
    }

    return { score: finalScore, grade: finalGrade, scoreColor: color };
  }, [metrics]);

  const logPerformance = useCallback((label: string, duration: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }
  }, []);

  const measureAsync = useCallback(async <T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      logPerformance(label, performance.now() - start);
      return result;
    } catch (error) {
      logPerformance(`${label} (error)`, performance.now() - start);
      throw error;
    }
  }, [logPerformance]);

  return {
    metrics,
    score,
    grade,
    scoreColor,
    isLowPerformance: metrics.fps < 30,
    logPerformance,
    measureAsync
  };
};

export default usePerformanceMonitor;
