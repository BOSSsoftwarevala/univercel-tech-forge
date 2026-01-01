import React, { useEffect, useState, useCallback } from 'react';
import { Shield, AlertOctagon, Ban, Fingerprint, Eye, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface IntrusionBlockerProps {
  children: React.ReactNode;
  onBlock?: () => void;
}

interface ThreatIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected: boolean;
  description: string;
}

const IntrusionBlocker: React.FC<IntrusionBlockerProps> = ({ children, onBlock }) => {
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [threatLevel, setThreatLevel] = useState(0);
  const [threats, setThreats] = useState<ThreatIndicator[]>([]);

  const logThreat = useCallback(async (type: string, details: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('blackbox_events').insert({
        event_type: `intrusion_${type}`,
        module_name: 'intrusion_blocker',
        user_id: user?.id,
        is_sealed: true,
        risk_score: details.severity === 'critical' ? 100 : details.severity === 'high' ? 75 : 50,
        metadata: details,
      });
    } catch (err) {
      console.error('Failed to log threat:', err);
    }
  }, []);

  const blockAccess = useCallback((reason: string) => {
    setBlocked(true);
    setBlockReason(reason);
    onBlock?.();
    logThreat('access_blocked', { reason });
    
    // Force logout
    supabase.auth.signOut();
  }, [logThreat, onBlock]);

  useEffect(() => {
    const threatChecks: ThreatIndicator[] = [];

    // Check 1: Automation tools
    const checkAutomation = () => {
      const indicators = {
        webdriver: !!(navigator as any).webdriver,
        phantom: !!(window as any).callPhantom || !!(window as any)._phantom,
        nightmare: !!(window as any).__nightmare,
        selenium: !!(window as any).selenium || !!(window as any).webdriver,
        puppeteer: !!(window as any)._puppeteer,
        cypress: !!(window as any).Cypress,
        playwright: !!(window as any).__playwright,
      };

      const detected = Object.values(indicators).some(v => v);
      threatChecks.push({
        type: 'automation',
        severity: 'critical',
        detected,
        description: 'Automation framework detected',
      });

      if (detected) {
        blockAccess('Automated access is not permitted');
      }
    };

    // Check 2: Console tampering
    const checkConsoleTampering = () => {
      const originalConsole = console.log.toString();
      const tampered = !originalConsole.includes('[native code]');
      
      threatChecks.push({
        type: 'console_tampering',
        severity: 'high',
        detected: tampered,
        description: 'Console has been modified',
      });

      if (tampered) {
        setThreatLevel(prev => prev + 25);
      }
    };

    // Check 3: Debugger detection
    const checkDebugger = () => {
      let debuggerDetected = false;
      const before = new Date().getTime();
      
      // This will pause if debugger is open
      (function() {
        const check = function() {
          debuggerDetected = true;
        };
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function('debugger; return true;');
          fn();
        } catch (e) {
          check();
        }
      })();

      const after = new Date().getTime();
      if (after - before > 100) {
        debuggerDetected = true;
      }

      threatChecks.push({
        type: 'debugger',
        severity: 'high',
        detected: debuggerDetected,
        description: 'Debugger detected',
      });

      if (debuggerDetected) {
        setThreatLevel(prev => prev + 30);
        toast.warning('Developer tools detected', {
          description: 'Some features may be restricted.',
        });
      }
    };

    // Check 4: Proxy/VPN detection
    const checkProxy = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Check for known VPN/proxy indicators
        const suspiciousASN = [
          'AS13335', // Cloudflare
          'AS20473', // Vultr
          'AS14061', // DigitalOcean
          'AS16276', // OVH
        ];

        const isProxy = data.org?.toLowerCase().includes('vpn') ||
                       data.org?.toLowerCase().includes('proxy') ||
                       suspiciousASN.some(asn => data.asn?.includes(asn));

        threatChecks.push({
          type: 'proxy',
          severity: 'medium',
          detected: isProxy,
          description: 'VPN or proxy detected',
        });

        if (isProxy) {
          setThreatLevel(prev => prev + 15);
        }
      } catch {
        // Network check failed, not suspicious
      }
    };

    // Check 5: Browser fingerprint anomalies
    const checkBrowserAnomalies = () => {
      const anomalies: string[] = [];

      // Check for headless browser
      if (!navigator.plugins || navigator.plugins.length === 0) {
        anomalies.push('no_plugins');
      }

      // Check for fake user agent
      if (navigator.userAgent.includes('HeadlessChrome')) {
        anomalies.push('headless_chrome');
      }

      // Check for missing browser features
      if (!(window as any).chrome && navigator.userAgent.includes('Chrome')) {
        anomalies.push('fake_chrome');
      }

      // Check for iframe embedding
      if (window.self !== window.top) {
        anomalies.push('iframe_embedded');
      }

      const hasAnomalies = anomalies.length > 0;
      threatChecks.push({
        type: 'browser_anomalies',
        severity: hasAnomalies ? 'high' : 'low',
        detected: hasAnomalies,
        description: `Browser anomalies: ${anomalies.join(', ')}`,
      });

      if (anomalies.includes('headless_chrome') || anomalies.includes('fake_chrome')) {
        blockAccess('Invalid browser environment detected');
      }
    };

    // Check 6: Timing attacks
    const checkTimingAttacks = () => {
      const start = performance.now();
      for (let i = 0; i < 1000000; i++) {
        // Intentional busy loop
      }
      const end = performance.now();
      const duration = end - start;

      // If loop takes too long, VM or throttled environment
      const suspicious = duration > 100;
      threatChecks.push({
        type: 'timing_anomaly',
        severity: 'medium',
        detected: suspicious,
        description: 'Unusual execution timing detected',
      });

      if (suspicious) {
        setThreatLevel(prev => prev + 10);
      }
    };

    // Run all checks
    checkAutomation();
    checkConsoleTampering();
    checkDebugger();
    checkProxy();
    checkBrowserAnomalies();
    checkTimingAttacks();

    setThreats(threatChecks);

    // Block if threat level exceeds threshold
    const totalThreatScore = threatChecks.reduce((score, threat) => {
      if (!threat.detected) return score;
      switch (threat.severity) {
        case 'critical': return score + 100;
        case 'high': return score + 50;
        case 'medium': return score + 25;
        case 'low': return score + 10;
        default: return score;
      }
    }, 0);

    if (totalThreatScore >= 100) {
      blockAccess('Multiple security threats detected');
    }

    // Continuous monitoring
    const monitoringInterval = setInterval(() => {
      // Re-run automation check
      if ((navigator as any).webdriver) {
        blockAccess('Automation detected during session');
      }

      // Check for DevTools
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        setThreatLevel(prev => Math.min(100, prev + 5));
      }
    }, 2000);

    return () => clearInterval(monitoringInterval);
  }, [blockAccess]);

  // Block screen
  if (blocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-red-950/50 border-red-500/50">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Ban className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">ACCESS BLOCKED</h2>
            <p className="text-red-300/80 mb-6">{blockReason}</p>
            
            <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/30 mb-6">
              <div className="flex items-center gap-2 text-red-300 text-sm">
                <AlertOctagon className="w-4 h-4" />
                <span>This incident has been logged and reported.</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Warning overlay if threat level is elevated
  if (threatLevel >= 50 && threatLevel < 100) {
    return (
      <div className="relative">
        {children}
        
        {/* Warning Banner */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 text-black px-4 py-2 flex items-center justify-center gap-2">
          <AlertOctagon className="w-4 h-4" />
          <span className="text-sm font-medium">
            Security Warning: Suspicious activity detected. Some features may be restricted.
          </span>
        </div>

        {/* Threat Level Indicator */}
        <div className="fixed bottom-4 left-4 z-50">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border backdrop-blur-sm",
            threatLevel >= 75 ? "bg-red-500/20 border-red-500/30 text-red-400" :
            "bg-amber-500/20 border-amber-500/30 text-amber-400"
          )}>
            <Zap className="w-4 h-4" />
            <span>Threat Level: {threatLevel}%</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default IntrusionBlocker;
