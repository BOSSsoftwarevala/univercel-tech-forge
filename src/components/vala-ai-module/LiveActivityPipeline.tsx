/**
 * VALA AI - LIVE ACTIVITY PIPELINE
 * Lovable-style real-time step-by-step activity feed
 * Shows: what's happening now, what happened, timestamps
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Loader2, Circle, Clock, Sparkles,
  Code2, Database, Server, Globe, Bug, Wrench,
  Package, Rocket, FileCode, Layout, Cpu, Shield,
  GitBranch, Zap, Eye
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface PipelineStep {
  id: string;
  label: string;
  detail?: string;
  status: 'pending' | 'active' | 'done' | 'error';
  icon: React.ElementType;
  timestamp?: Date;
  duration?: number; // ms
}

const DEFAULT_PIPELINE: Omit<PipelineStep, 'id' | 'status' | 'timestamp'>[] = [
  { label: 'Understanding Prompt', detail: 'Parsing requirements...', icon: Sparkles },
  { label: 'Analyzing Requirements', detail: 'Extracting features & constraints...', icon: Eye },
  { label: 'Mapping Features', detail: 'Identifying modules & components...', icon: Layout },
  { label: 'Generating Screens', detail: 'Creating UI components...', icon: Code2 },
  { label: 'Planning APIs', detail: 'Designing REST endpoints...', icon: Server },
  { label: 'Designing Database', detail: 'Creating schema & relations...', icon: Database },
  { label: 'Building Flows', detail: 'User workflows & state machines...', icon: GitBranch },
  { label: 'Packaging Build', detail: 'Compiling & bundling...', icon: Package },
];

interface LiveActivityPipelineProps {
  isActive: boolean;
  onStepsUpdate?: (steps: PipelineStep[]) => void;
}

export const LiveActivityPipeline: React.FC<LiveActivityPipelineProps> = ({
  isActive,
  onStepsUpdate,
}) => {
  const [steps, setSteps] = useState<PipelineStep[]>(
    DEFAULT_PIPELINE.map((s, i) => ({
      ...s,
      id: `step-${i}`,
      status: 'pending' as const,
    }))
  );
  const [activityLog, setActivityLog] = useState<Array<{
    text: string;
    time: Date;
    type: 'info' | 'success' | 'warning' | 'action';
  }>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepIndexRef = useRef(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Activity messages for each step
  const STEP_ACTIVITIES: Record<number, string[]> = {
    0: [
      'Reading user prompt...',
      'Identifying core requirements...',
      'Detecting software category...',
      'Extracting feature keywords...',
    ],
    1: [
      'Analyzing complexity level...',
      'Mapping business logic requirements...',
      'Identifying user roles & permissions...',
      'Determining tech stack requirements...',
    ],
    2: [
      'Creating feature dependency graph...',
      'Mapping CRUD operations...',
      'Identifying shared components...',
      'Planning module architecture...',
    ],
    3: [
      'Generating Dashboard layout...',
      'Creating navigation components...',
      'Building form components...',
      'Adding responsive breakpoints...',
      'Creating data table components...',
      'Building modal dialogs...',
    ],
    4: [
      'Designing authentication endpoints...',
      'Creating CRUD API routes...',
      'Adding input validation schemas...',
      'Implementing error handling...',
      'Adding rate limiting rules...',
    ],
    5: [
      'Creating primary tables...',
      'Adding foreign key relations...',
      'Implementing RLS policies...',
      'Creating indexes for performance...',
      'Adding trigger functions...',
    ],
    6: [
      'Mapping user registration flow...',
      'Creating approval workflows...',
      'Building notification pipeline...',
      'Implementing state transitions...',
    ],
    7: [
      'Running TypeScript compiler...',
      'Bundling with Vite...',
      'Optimizing assets...',
      'Generating build artifacts...',
      'Build complete ✓',
    ],
  };

  // Reset pipeline
  useEffect(() => {
    if (isActive) {
      stepIndexRef.current = 0;
      setSteps(DEFAULT_PIPELINE.map((s, i) => ({
        ...s,
        id: `step-${i}`,
        status: 'pending' as const,
      })));
      setActivityLog([{
        text: '🚀 VALA AI Engine started',
        time: new Date(),
        type: 'info',
      }]);
      startPipeline();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  // Scroll activity log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activityLog]);

  const startPipeline = () => {
    let currentStep = 0;
    let subStep = 0;

    intervalRef.current = setInterval(() => {
      if (currentStep >= DEFAULT_PIPELINE.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setActivityLog(prev => [...prev, {
          text: '✅ All pipeline stages complete',
          time: new Date(),
          type: 'success',
        }]);
        return;
      }

      const activities = STEP_ACTIVITIES[currentStep] || [];

      if (subStep === 0) {
        // Activate this step
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          status: i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending',
          timestamp: i === currentStep ? new Date() : s.timestamp,
        })));

        setActivityLog(prev => [...prev, {
          text: `▶ ${DEFAULT_PIPELINE[currentStep].label}`,
          time: new Date(),
          type: 'action',
        }]);
      }

      // Add sub-activity
      if (subStep < activities.length) {
        setActivityLog(prev => [...prev, {
          text: `  ${activities[subStep]}`,
          time: new Date(),
          type: 'info',
        }]);
        subStep++;
      } else {
        // Complete this step, move to next
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          status: i <= currentStep ? 'done' : 'pending',
          duration: i === currentStep ? (Date.now() - (s.timestamp?.getTime() || Date.now())) : s.duration,
        })));

        setActivityLog(prev => [...prev, {
          text: `  ✓ ${DEFAULT_PIPELINE[currentStep].label} complete`,
          time: new Date(),
          type: 'success',
        }]);

        currentStep++;
        subStep = 0;
      }
    }, 600);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="w-[220px] flex flex-col h-full" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d' }}>
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Zap className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
        <span className="text-xs font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>AI PIPELINE</span>
        {isActive && (
          <motion.div
            className="w-1.5 h-1.5 rounded-full ml-auto"
            style={{ background: '#10b981' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Pipeline Steps */}
      <div className="px-3 py-2 space-y-0.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              className="flex items-center gap-2 py-1 px-1 rounded"
              style={{
                background: step.status === 'active' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              }}
              animate={step.status === 'active' ? { x: [0, 1, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {/* Status Icon */}
              {step.status === 'done' ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#10b981' }} />
              ) : step.status === 'active' ? (
                <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" style={{ color: '#2563eb' }} />
              ) : (
                <Circle className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }} />
              )}
              
              <span className="text-[11px] truncate" style={{
                color: step.status === 'done' ? '#10b981' 
                  : step.status === 'active' ? '#60a5fa' 
                  : 'rgba(255,255,255,0.3)',
                fontWeight: step.status === 'active' ? 600 : 400,
              }}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Live Activity Log */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <Clock className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Activity Log
          </span>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-2 py-1.5 space-y-0.5">
            <AnimatePresence>
              {activityLog.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-1.5 py-0.5"
                >
                  <span className="text-[9px] font-mono shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {formatTime(log.time)}
                  </span>
                  <span className="text-[10px] leading-tight" style={{
                    color: log.type === 'success' ? '#10b981'
                      : log.type === 'action' ? '#60a5fa'
                      : log.type === 'warning' ? '#f59e0b'
                      : 'rgba(255,255,255,0.5)',
                  }}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={logEndRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LiveActivityPipeline;
