import React, { useEffect, useCallback, useState } from 'react';
import { Shield, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AdvancedProtectionShieldProps {
  children: React.ReactNode;
  level?: 'standard' | 'high' | 'maximum';
  showIndicator?: boolean;
}

const AdvancedProtectionShield: React.FC<AdvancedProtectionShieldProps> = ({
  children,
  level = 'high',
  showIndicator = true,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [threatCount, setThreatCount] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Anti-debugging protection
  useEffect(() => {
    if (level === 'maximum') {
      const detectDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
          toast.warning('Developer tools detected', {
            description: 'Some features may be restricted.',
          });
        }
      };

      const interval = setInterval(detectDevTools, 1000);
      return () => clearInterval(interval);
    }
  }, [level]);

  // Idle timeout protection
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    const checkIdle = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      const maxIdle = level === 'maximum' ? 300000 : 600000; // 5 or 10 minutes
      
      if (idleTime > maxIdle) {
        setIsActive(false);
        toast.error('Session locked due to inactivity');
      }
    }, 30000);
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(checkIdle);
    };
  }, [lastActivity, level]);

  // Context menu protection
  useEffect(() => {
    if (level === 'high' || level === 'maximum') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        setThreatCount(prev => prev + 1);
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      return () => document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [level]);

  // Print protection
  useEffect(() => {
    if (level === 'maximum') {
      const handleBeforePrint = () => {
        document.body.style.visibility = 'hidden';
        toast.warning('Printing is restricted');
      };
      
      const handleAfterPrint = () => {
        document.body.style.visibility = 'visible';
      };
      
      window.addEventListener('beforeprint', handleBeforePrint);
      window.addEventListener('afterprint', handleAfterPrint);
      
      return () => {
        window.removeEventListener('beforeprint', handleBeforePrint);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [level]);

  // Screenshot protection (CSS-based)
  useEffect(() => {
    if (level === 'maximum') {
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          body * { visibility: hidden !important; }
          body::after {
            content: 'Printing is not allowed';
            visibility: visible;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [level]);

  if (!isActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-900 rounded-2xl border border-red-500/50">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Session Locked</h2>
          <p className="text-slate-400 mb-4">Your session was locked due to inactivity.</p>
          <button
            onClick={() => {
              setIsActive(true);
              setLastActivity(Date.now());
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Unlock Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      
      {/* Security Indicator */}
      {showIndicator && (
        <div className={cn(
          "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          level === 'maximum' 
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : level === 'high'
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
        )}>
          <Shield className="w-3.5 h-3.5" />
          <span>
            {level === 'maximum' ? 'Maximum' : level === 'high' ? 'High' : 'Standard'} Protection
          </span>
          {threatCount > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px]">
              {threatCount} blocked
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedProtectionShield;
