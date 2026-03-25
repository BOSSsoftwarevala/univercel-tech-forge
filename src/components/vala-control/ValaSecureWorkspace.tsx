import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, AlertTriangle, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ValaSecureWorkspaceProps {
  children: React.ReactNode;
  roleTitle: string;
  valaId: string;
  onSessionExpire?: () => void;
}

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_VIOLATIONS = 3;
const FREEZE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function ValaSecureWorkspace({ 
  children, 
  roleTitle, 
  valaId,
  onSessionExpire 
}: ValaSecureWorkspaceProps) {
  const { user } = useAuth();
  const [sessionRemaining, setSessionRemaining] = useState(SESSION_DURATION_MS);
  const [violations, setViolations] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [sessionStart] = useState(Date.now());

  // Log security event
  const logEvent = useCallback(async (action: string, details: Record<string, unknown>) => {
    if (!user?.id) return;
    
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      module: 'vala_control',
      meta_json: {
        vala_id: valaId,
        role: roleTitle,
        timestamp: Date.now(),
        ...details
      }
    });
  }, [user?.id, valaId, roleTitle]);

  // Handle violation
  const handleViolation = useCallback((type: string, details: string) => {
    setViolations(prev => {
      const newCount = prev + 1;
      
      logEvent('security_violation', { type, details, count: newCount });
      
      if (newCount >= MAX_VIOLATIONS) {
        setIsFrozen(true);
        toast.error('SYSTEM FROZEN: Security violations exceeded limit');
        
        setTimeout(() => {
          setIsFrozen(false);
          setViolations(0);
        }, FREEZE_DURATION_MS);
      } else {
        toast.warning(`Security violation (${newCount}/${MAX_VIOLATIONS})`);
      }
      
      return newCount;
    });
  }, [logEvent]);

  // Block clipboard
  useEffect(() => {
    const block = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation('clipboard', e.type);
    };

    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('paste', block);

    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('paste', block);
    };
  }, [handleViolation]);

  // Block keyboard shortcuts
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation('keyboard', `Ctrl+${e.key.toUpperCase()}`);
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        handleViolation('screenshot', 'PrintScreen');
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        handleViolation('devtools', 'DevTools access');
      }
    };

    document.addEventListener('keydown', block, true);
    return () => document.removeEventListener('keydown', block, true);
  }, [handleViolation]);

  // Block context menu
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', block);
    return () => document.removeEventListener('contextmenu', block);
  }, []);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStart;
      const remaining = Math.max(0, SESSION_DURATION_MS - elapsed);
      setSessionRemaining(remaining);

      if (remaining === 0) {
        onSessionExpire?.();
        toast.error('Session expired');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStart, onSessionExpire]);

  // Add print protection styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print { body { display: none !important; } }
      .vala-workspace { user-select: none; -webkit-user-select: none; }
      .vala-workspace input, .vala-workspace textarea { user-select: text; -webkit-user-select: text; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const mins = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  if (isFrozen) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-mono font-bold text-red-500 mb-2">SYSTEM FROZEN</h1>
          <p className="text-zinc-400 font-mono text-sm">
            Security violations detected. Auto-unfreeze in 5 minutes.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="vala-workspace fixed inset-0 bg-black text-zinc-100 flex flex-col overflow-hidden">
      {/* Top Bar - Minimal */}
      <header className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-zinc-500" />
          <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
            {roleTitle}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Session Timer */}
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-900">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono text-xs text-zinc-400">
              {formatTime(sessionRemaining)}
            </span>
          </div>

          {/* Vala ID */}
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-900">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono text-xs text-zinc-400">{valaId}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>

      {/* Bottom Status */}
      <footer className="px-4 py-2 bg-zinc-950 border-t border-zinc-900">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
          <span>VALA CONTROL SYSTEM</span>
          <span>APPEND-ONLY LOGGING ACTIVE</span>
          <span>CNS CHECKSUM ENABLED</span>
        </div>
      </footer>
    </div>
  );
}
