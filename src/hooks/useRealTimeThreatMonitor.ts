import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreatLevel {
  score: number;
  level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
}

interface BehaviorPattern {
  clickFrequency: number;
  typingSpeed: number;
  mouseMovement: number;
  sessionDuration: number;
  pageChanges: number;
}

export function useRealTimeThreatMonitor() {
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>({
    score: 0,
    level: 'safe',
    factors: [],
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [behavior, setBehavior] = useState<BehaviorPattern>({
    clickFrequency: 0,
    typingSpeed: 0,
    mouseMovement: 0,
    sessionDuration: 0,
    pageChanges: 0,
  });

  const sessionStartRef = useState(() => Date.now())[0];
  const clickCountRef = useState(() => ({ count: 0, lastReset: Date.now() }))[0];
  const keyCountRef = useState(() => ({ count: 0, lastReset: Date.now() }))[0];

  // Calculate threat score
  const calculateThreatScore = useCallback((factors: string[]): ThreatLevel => {
    let score = 0;
    
    const factorWeights: Record<string, number> = {
      rapid_clicks: 15,
      automated_typing: 20,
      no_mouse_movement: 10,
      suspicious_timing: 15,
      multiple_tabs: 10,
      devtools_open: 25,
      vpn_detected: 5,
      unusual_location: 20,
      failed_auth_attempts: 30,
      rate_limit_exceeded: 25,
    };
    
    factors.forEach(factor => {
      score += factorWeights[factor] || 10;
    });
    
    let level: ThreatLevel['level'] = 'safe';
    if (score >= 80) level = 'critical';
    else if (score >= 60) level = 'high';
    else if (score >= 40) level = 'medium';
    else if (score >= 20) level = 'low';
    
    return { score: Math.min(score, 100), level, factors };
  }, []);

  // Monitor click behavior
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      
      // Reset counter every 10 seconds
      if (now - clickCountRef.lastReset > 10000) {
        clickCountRef.count = 0;
        clickCountRef.lastReset = now;
      }
      
      clickCountRef.count++;
      
      // Detect rapid clicking (possible automation)
      if (clickCountRef.count > 20) {
        setThreatLevel(prev => {
          const factors = [...new Set([...prev.factors, 'rapid_clicks'])];
          return calculateThreatScore(factors);
        });
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [calculateThreatScore]);

  // Monitor typing behavior
  useEffect(() => {
    const handleKeydown = () => {
      const now = Date.now();
      
      if (now - keyCountRef.lastReset > 5000) {
        // Calculate typing speed
        const speed = (keyCountRef.count / 5) * 60; // chars per minute
        
        // Detect inhuman typing speeds (>600 CPM is suspicious)
        if (speed > 600) {
          setThreatLevel(prev => {
            const factors = [...new Set([...prev.factors, 'automated_typing'])];
            return calculateThreatScore(factors);
          });
        }
        
        keyCountRef.count = 0;
        keyCountRef.lastReset = now;
      }
      
      keyCountRef.count++;
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [calculateThreatScore]);

  // Monitor for DevTools
  useEffect(() => {
    if (!isMonitoring) return;
    
    const detectDevTools = () => {
      const threshold = 160;
      const widthGap = window.outerWidth - window.innerWidth > threshold;
      const heightGap = window.outerHeight - window.innerHeight > threshold;
      
      if (widthGap || heightGap) {
        setThreatLevel(prev => {
          const factors = [...new Set([...prev.factors, 'devtools_open'])];
          return calculateThreatScore(factors);
        });
      }
    };
    
    const interval = setInterval(detectDevTools, 2000);
    return () => clearInterval(interval);
  }, [isMonitoring, calculateThreatScore]);

  // Log threats to database
  useEffect(() => {
    if (threatLevel.level === 'high' || threatLevel.level === 'critical') {
      const logThreat = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          await supabase.from('audit_logs').insert({
            user_id: user?.id,
            module: 'threat_monitor',
            action: `threat_detected_${threatLevel.level}`,
            meta_json: {
              score: threatLevel.score,
              factors: threatLevel.factors,
              timestamp: new Date().toISOString(),
            }
          });
          
          if (threatLevel.level === 'critical') {
            toast.error('Security Alert', {
              description: 'Suspicious activity detected. Your session may be monitored.',
              duration: 10000,
            });
          }
        } catch (err) {
          console.error('Failed to log threat:', err);
        }
      };
      
      logThreat();
    }
  }, [threatLevel]);

  // Clear old factors periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => {
        if (prev.factors.length === 0) return prev;
        // Remove oldest factor every 30 seconds if no new threats
        const newFactors = prev.factors.slice(1);
        return calculateThreatScore(newFactors);
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [calculateThreatScore]);

  // Manual threat reporting
  const reportThreat = useCallback((factor: string) => {
    setThreatLevel(prev => {
      const factors = [...new Set([...prev.factors, factor])];
      return calculateThreatScore(factors);
    });
  }, [calculateThreatScore]);

  // Clear all threats (admin action)
  const clearThreats = useCallback(() => {
    setThreatLevel({ score: 0, level: 'safe', factors: [] });
  }, []);

  return {
    threatLevel,
    isMonitoring,
    setIsMonitoring,
    behavior,
    reportThreat,
    clearThreats,
  };
}
