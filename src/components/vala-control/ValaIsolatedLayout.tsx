import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Clock, AlertTriangle } from 'lucide-react';
import { useValaSecurity } from '@/contexts/ValaSecurityContext';
import { cn } from '@/lib/utils';

interface ValaIsolatedLayoutProps {
  children: ReactNode;
  roleLabel: string;
  currentStep?: 'debug' | 'check' | 'lock' | 'forward';
  status?: 'pending' | 'locked' | 'forwarded' | 'blocked';
}

const STEPS = [
  { id: 'debug', label: 'Debug' },
  { id: 'check', label: 'Check' },
  { id: 'lock', label: 'Lock' },
  { id: 'forward', label: 'Forward' },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50', icon: Clock },
  locked: { label: 'Locked', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', icon: Lock },
  forwarded: { label: 'Forwarded', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50', icon: Shield },
  blocked: { label: 'Blocked', color: 'bg-red-500/20 text-red-400 border-red-500/50', icon: AlertTriangle },
};

const ValaIsolatedLayout = ({ 
  children, 
  roleLabel, 
  currentStep = 'debug',
  status = 'pending' 
}: ValaIsolatedLayoutProps) => {
  const { valaId, sessionActive, isLocked, lastActivity, refreshSession } = useValaSecurity();

  // Block all external access
  useEffect(() => {
    // Prevent drag and drop
    const preventDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener('dragstart', preventDrag);
    document.addEventListener('drop', preventDrag);

    return () => {
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('drop', preventDrag);
    };
  }, []);

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const StatusIcon = STATUS_CONFIG[status].icon;

  // Calculate session time remaining
  const getSessionTime = () => {
    const elapsed = Date.now() - lastActivity;
    const remaining = Math.max(0, 30 - Math.floor(elapsed / 60000));
    return remaining;
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Session Locked</h1>
          <p className="text-slate-400 mb-6">Your session has been locked due to inactivity or security policy.</p>
          <button
            onClick={refreshSession}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Unlock Session
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 select-none" style={{ userSelect: 'none' }}>
      {/* Top Security Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Role Label */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-400">{roleLabel}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-xs font-mono text-slate-500">{valaId || 'VALA-UNKNOWN'}</span>
          </div>

          {/* Center: Step Indicator */}
          <div className="flex items-center gap-1">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'px-3 py-1 rounded text-xs font-medium transition-colors',
                    index < currentStepIndex && 'bg-emerald-500/20 text-emerald-400',
                    index === currentStepIndex && 'bg-blue-500/30 text-blue-300 border border-blue-500/50',
                    index > currentStepIndex && 'bg-slate-800 text-slate-500'
                  )}
                >
                  {step.label}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={cn(
                    'w-4 h-px mx-1',
                    index < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-700'
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Right: Status & Session */}
          <div className="flex items-center gap-4">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded border text-xs font-medium',
              STATUS_CONFIG[status].color
            )}>
              <StatusIcon className="w-3 h-3" />
              {STATUS_CONFIG[status].label}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{getSessionTime()}m</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Screen, No Sidebar */}
      <main className="pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Security Watermark */}
      <div className="fixed bottom-4 right-4 text-[10px] text-slate-700 font-mono pointer-events-none">
        SECURE • {valaId} • {new Date().toISOString().split('T')[0]}
      </div>
    </div>
  );
};

export default ValaIsolatedLayout;
