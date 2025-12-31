import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

// Vala ID Generation (numeric hash)
const generateValaId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const hash = btoa(`${timestamp}-${random}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  return `VALA-${hash.toUpperCase()}`;
};

// Generate action hash for immutable logging
const generateActionHash = (action: string, timestamp: number): string => {
  const data = `${action}-${timestamp}`;
  return btoa(data).substring(0, 16).toUpperCase();
};

// Role Types - Completely Isolated
type ControlRole = 'front_ops' | 'area_control' | 'ai_head' | 'master_admin';

// Action Status
type ActionStatus = 'pending' | 'debug' | 'check' | 'locked' | 'forwarded' | 'blocked';

// Immutable Log Entry
interface LogEntry {
  id: string;
  valaId: string;
  timestamp: number;
  actionHash: string;
  status: ActionStatus;
  previousHash: string;
  role: ControlRole;
}

// AI Report (Behavior & Risk Only)
interface AIReport {
  id: string;
  valaId: string;
  behaviorScore: number;
  riskFlag: 'low' | 'medium' | 'high' | 'critical';
  anomalyDetected: boolean;
  timestamp: number;
  reportHash: string;
}

// Control Action
interface ControlAction {
  id: string;
  valaId: string;
  type: string;
  data: Record<string, unknown>;
  status: ActionStatus;
  createdAt: number;
  lockedAt?: number;
  forwardedAt?: number;
  checksumValid: boolean;
  stepHistory: ActionStatus[];
}

interface ValaControlContextType {
  // Identity
  valaId: string;
  role: ControlRole;
  sessionExpiry: number;
  
  // Security State
  isSessionValid: boolean;
  isSecurityLocked: boolean;
  anomalyDetected: boolean;
  
  // Actions
  currentAction: ControlAction | null;
  actionLogs: LogEntry[];
  aiReports: AIReport[];
  
  // Methods
  initSession: (role: ControlRole) => void;
  terminateSession: () => void;
  createAction: (type: string, data: Record<string, unknown>) => void;
  processStep: (step: ActionStatus) => void;
  forwardAction: () => void;
  
  // AI Methods (Report Only)
  generateAIReport: () => AIReport;
  
  // Master Admin Only
  unlockAction: (actionId: string) => void;
  overrideAction: (actionId: string, decision: 'approve' | 'reject') => void;
}

const ValaControlContext = createContext<ValaControlContextType | undefined>(undefined);

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const CHECKSUM_INTERVAL = 10000; // 10 seconds

export const ValaControlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [valaId, setValaId] = useState<string>('');
  const [role, setRole] = useState<ControlRole>('front_ops');
  const [sessionExpiry, setSessionExpiry] = useState<number>(0);
  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
  const [isSecurityLocked, setIsSecurityLocked] = useState<boolean>(false);
  const [anomalyDetected, setAnomalyDetected] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<ControlAction | null>(null);
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const [aiReports, setAIReports] = useState<AIReport[]>([]);

  // Disable clipboard, screenshot, and keyboard shortcuts
  useEffect(() => {
    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('SECURITY: Copy operation blocked');
      logSecurityEvent('clipboard_block');
    };

    const blockPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('SECURITY: Paste operation blocked');
      logSecurityEvent('clipboard_block');
    };

    const blockKeys = (e: KeyboardEvent) => {
      // Block copy, paste, cut, print, screenshot
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast.error('SECURITY: Keyboard shortcut blocked');
        logSecurityEvent('keyboard_block');
      }
      if (e.key === 'PrintScreen' || e.key === 'F12') {
        e.preventDefault();
        toast.error('SECURITY: Action blocked');
        logSecurityEvent('screenshot_block');
      }
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logSecurityEvent('context_menu_block');
    };

    document.addEventListener('copy', blockCopy);
    document.addEventListener('paste', blockPaste);
    document.addEventListener('cut', blockCopy);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('contextmenu', blockContextMenu);

    return () => {
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('paste', blockPaste);
      document.removeEventListener('cut', blockCopy);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (!isSessionValid) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= sessionExpiry) {
        terminateSession();
        toast.error('Session expired - auto logout');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionValid, sessionExpiry]);

  // Checksum verification interval
  useEffect(() => {
    if (!isSessionValid) return;

    const interval = setInterval(() => {
      verifyChecksum();
    }, CHECKSUM_INTERVAL);

    return () => clearInterval(interval);
  }, [isSessionValid]);

  const logSecurityEvent = (event: string) => {
    console.log(`[SECURITY] ${valaId} | ${event} | ${Date.now()}`);
  };

  const verifyChecksum = () => {
    // Simulate checksum verification
    const isValid = Math.random() > 0.02; // 98% pass rate
    if (!isValid) {
      setAnomalyDetected(true);
      setIsSecurityLocked(true);
      toast.error('ANOMALY DETECTED: Session frozen');
      addLogEntry('anomaly_detected', 'blocked');
    }
  };

  const addLogEntry = (action: string, status: ActionStatus) => {
    const timestamp = Date.now();
    const previousHash = actionLogs.length > 0 
      ? actionLogs[actionLogs.length - 1].actionHash 
      : 'GENESIS';
    
    const entry: LogEntry = {
      id: `LOG-${timestamp}`,
      valaId,
      timestamp,
      actionHash: generateActionHash(action, timestamp),
      status,
      previousHash,
      role
    };

    setActionLogs(prev => [...prev, entry]);
  };

  const initSession = useCallback((selectedRole: ControlRole) => {
    const newValaId = generateValaId();
    setValaId(newValaId);
    setRole(selectedRole);
    setSessionExpiry(Date.now() + SESSION_DURATION);
    setIsSessionValid(true);
    setIsSecurityLocked(false);
    setAnomalyDetected(false);
    addLogEntry('session_init', 'pending');
    toast.success(`Session initialized: ${newValaId}`);
  }, []);

  const terminateSession = useCallback(() => {
    addLogEntry('session_terminate', 'locked');
    setIsSessionValid(false);
    setCurrentAction(null);
    setValaId('');
    setSessionExpiry(0);
  }, []);

  const createAction = useCallback((type: string, data: Record<string, unknown>) => {
    if (isSecurityLocked) {
      toast.error('Session is security locked');
      return;
    }

    const action: ControlAction = {
      id: `ACT-${Date.now()}`,
      valaId,
      type,
      data,
      status: 'pending',
      createdAt: Date.now(),
      checksumValid: true,
      stepHistory: ['pending']
    };

    setCurrentAction(action);
    addLogEntry(`action_create:${type}`, 'pending');
  }, [valaId, isSecurityLocked]);

  const processStep = useCallback((step: ActionStatus) => {
    if (!currentAction || isSecurityLocked) return;

    // Enforce sequential flow: pending → debug → check → locked → forwarded
    const flowOrder: ActionStatus[] = ['pending', 'debug', 'check', 'locked', 'forwarded'];
    const currentIndex = flowOrder.indexOf(currentAction.status);
    const targetIndex = flowOrder.indexOf(step);

    if (targetIndex !== currentIndex + 1) {
      toast.error('Invalid step sequence - no skip allowed');
      return;
    }

    setCurrentAction(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: step,
        stepHistory: [...prev.stepHistory, step],
        ...(step === 'locked' ? { lockedAt: Date.now() } : {}),
        ...(step === 'forwarded' ? { forwardedAt: Date.now() } : {})
      };
    });

    addLogEntry(`step:${step}`, step);
    toast.success(`Step completed: ${step.toUpperCase()}`);
  }, [currentAction, isSecurityLocked]);

  const forwardAction = useCallback(() => {
    if (!currentAction || currentAction.status !== 'locked') {
      toast.error('Action must be locked before forwarding');
      return;
    }

    processStep('forwarded');
    toast.success('Action forwarded to next role');
    
    // Clear current action after forward
    setTimeout(() => {
      setCurrentAction(null);
    }, 1000);
  }, [currentAction, processStep]);

  const generateAIReport = useCallback((): AIReport => {
    const behaviorScore = Math.floor(Math.random() * 100);
    const riskFlag: AIReport['riskFlag'] = 
      behaviorScore < 30 ? 'critical' :
      behaviorScore < 50 ? 'high' :
      behaviorScore < 75 ? 'medium' : 'low';

    const report: AIReport = {
      id: `AI-${Date.now()}`,
      valaId,
      behaviorScore,
      riskFlag,
      anomalyDetected: behaviorScore < 30,
      timestamp: Date.now(),
      reportHash: generateActionHash('ai_report', Date.now())
    };

    setAIReports(prev => [...prev, report]);
    addLogEntry('ai_report_generated', 'forwarded');
    
    return report;
  }, [valaId]);

  const unlockAction = useCallback((actionId: string) => {
    if (role !== 'master_admin') {
      toast.error('Only Master Admin can unlock');
      return;
    }
    addLogEntry(`master_unlock:${actionId}`, 'pending');
    toast.success('Action unlocked by Master Admin');
  }, [role]);

  const overrideAction = useCallback((actionId: string, decision: 'approve' | 'reject') => {
    if (role !== 'master_admin') {
      toast.error('Only Master Admin can override');
      return;
    }
    addLogEntry(`master_override:${actionId}:${decision}`, decision === 'approve' ? 'forwarded' : 'blocked');
    toast.success(`Action ${decision}d by Master Admin`);
  }, [role]);

  return (
    <ValaControlContext.Provider value={{
      valaId,
      role,
      sessionExpiry,
      isSessionValid,
      isSecurityLocked,
      anomalyDetected,
      currentAction,
      actionLogs,
      aiReports,
      initSession,
      terminateSession,
      createAction,
      processStep,
      forwardAction,
      generateAIReport,
      unlockAction,
      overrideAction
    }}>
      {children}
    </ValaControlContext.Provider>
  );
};

export const useValaControl = () => {
  const context = useContext(ValaControlContext);
  if (!context) {
    throw new Error('useValaControl must be used within ValaControlProvider');
  }
  return context;
};
