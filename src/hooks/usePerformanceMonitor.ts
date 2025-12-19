import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number | null;
  loadTime: number;
  networkType: string;
  isSlowConnection: boolean;
  renderCount: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: null,
    loadTime: 0,
    networkType: 'unknown',
    isSlowConnection: false,
    renderCount: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderCount = useRef(0);

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

  // Memory monitoring (Chrome only)
  useEffect(() => {
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memory: Math.round(memory.usedJSHeapSize / 1048576)
        }));
      }
    };
    
    const interval = setInterval(measureMemory, 5000);
    measureMemory();
    
    return () => clearInterval(interval);
  }, []);

  // Network detection
  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        const networkType = connection.effectiveType || 'unknown';
        const isSlowConnection = ['slow-2g', '2g'].includes(networkType);
        
        setMetrics(prev => ({
          ...prev,
          networkType,
          isSlowConnection
        }));
      }
    };

    updateNetworkInfo();
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // Load time measurement
  useEffect(() => {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 0) {
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    }
  }, []);

  // Track render count
  useEffect(() => {
    renderCount.current++;
    setMetrics(prev => ({ ...prev, renderCount: renderCount.current }));
  });

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
    ...metrics,
    logPerformance,
    measureAsync,
    isLowPerformance: metrics.fps < 30 || metrics.isSlowConnection
  };
};

export default usePerformanceMonitor;
