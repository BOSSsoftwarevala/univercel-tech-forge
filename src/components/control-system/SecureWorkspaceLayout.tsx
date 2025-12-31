/**
 * Secure Workspace Layout
 * 
 * Full-screen focused workspace with:
 * - No sidebar showing other roles
 * - Single-action buttons only
 * - Clear step indicator (Debug → Check → Lock → Forward)
 * - Status badge: Pending / Locked / Forwarded / Blocked
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Clock, AlertTriangle, Lock, 
  CheckCircle, XCircle, ArrowUp, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useValaId from '@/hooks/useValaId';
import useControlSecurity from '@/hooks/useControlSecurity';

interface SecureWorkspaceLayoutProps {
  children: React.ReactNode;
  roleLabel: string;
  currentStage?: 'pending' | 'debug' | 'check' | 'lock' | 'forward' | 'completed' | 'blocked';
  status?: 'Pending' | 'Locked' | 'Forwarded' | 'Blocked';
}

const STAGE_CONFIG = {
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
  debug: { icon: Activity, color: 'text-primary', label: 'Debug' },
  check: { icon: CheckCircle, color: 'text-primary', label: 'Check' },
  lock: { icon: Lock, color: 'text-amber-400', label: 'Lock' },
  forward: { icon: ArrowUp, color: 'text-emerald-400', label: 'Forward' },
  completed: { icon: CheckCircle, color: 'text-emerald-400', label: 'Complete' },
  blocked: { icon: XCircle, color: 'text-destructive', label: 'Blocked' }
};

const STATUS_CONFIG = {
  Pending: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' },
  Locked: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50' },
  Forwarded: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  Blocked: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/50' }
};

export function SecureWorkspaceLayout({ 
  children, 
  roleLabel,
  currentStage = 'pending',
  status = 'Pending'
}: SecureWorkspaceLayoutProps) {
  const { maskedValaId, isLoading: valaLoading } = useValaId();
  const { 
    isFrozen, 
    violationCount, 
    sessionTimeRemaining, 
    maxViolations 
  } = useControlSecurity();

  const stages: Array<'debug' | 'check' | 'lock' | 'forward'> = ['debug', 'check', 'lock', 'forward'];
  const currentStageIndex = stages.indexOf(currentStage as any);

  if (isFrozen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 glass-panel max-w-md"
        >
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-mono font-bold text-destructive mb-2">
            Account Frozen
          </h1>
          <p className="text-muted-foreground mb-4">
            Security violations detected. Contact administrator for assistance.
          </p>
          <div className="text-sm text-muted-foreground">
            Violations: {violationCount}/{maxViolations}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Security Header Bar */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40">
        {/* Left: Role & Vala ID */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm font-medium">{roleLabel}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-mono">VALA:</span>
            <span className="font-mono text-xs text-foreground">
              {valaLoading ? '***-****-****' : maskedValaId}
            </span>
          </div>
        </div>

        {/* Center: Flow Progress Indicator */}
        <div className="hidden md:flex items-center gap-1">
          {stages.map((stage, index) => {
            const config = STAGE_CONFIG[stage];
            const Icon = config.icon;
            const isActive = stage === currentStage;
            const isCompleted = currentStageIndex > index || currentStage === 'completed';
            const isBlocked = currentStage === 'blocked' && index >= currentStageIndex;

            return (
              <React.Fragment key={stage}>
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-md transition-all',
                    isActive && 'bg-primary/20 border border-primary/50',
                    isCompleted && 'text-emerald-400',
                    isBlocked && 'text-destructive opacity-50',
                    !isActive && !isCompleted && !isBlocked && 'text-muted-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono uppercase">{config.label}</span>
                </div>
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      'w-4 h-px',
                      isCompleted ? 'bg-emerald-400' : 'bg-border'
                    )} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Status & Session */}
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className={cn(
            'px-3 py-1 rounded-full border text-xs font-mono font-medium',
            STATUS_CONFIG[status].bg,
            STATUS_CONFIG[status].text,
            STATUS_CONFIG[status].border
          )}>
            {status}
          </div>

          {/* Violation Counter */}
          {violationCount > 0 && (
            <div className="flex items-center gap-1 text-destructive text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-mono">{violationCount}/{maxViolations}</span>
            </div>
          )}

          {/* Session Timer */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-xs">{sessionTimeRemaining}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Screen Focused */}
      <main className="flex-1 pt-14 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default SecureWorkspaceLayout;
