import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

// Types
export type ValaRole = "operation" | "regional" | "ai_head" | "master_admin";
export type ActionStatus = "pending" | "debug" | "check" | "locked" | "forwarded" | "blocked" | "frozen";

export interface ControlAction {
  id: string;
  valaId: string;
  role: ValaRole;
  actionType: string;
  payload: Record<string, unknown>;
  status: ActionStatus;
  checksum: string;
  timestamp: string;
  debugAt?: string;
  checkAt?: string;
  lockAt?: string;
  forwardAt?: string;
  forwardedTo?: ValaRole;
}

export interface AIReport {
  id: string;
  targetValaId: string;
  targetRole: ValaRole;
  behaviorScore: number;
  riskFlag: "low" | "medium" | "high" | "critical";
  observations: string[];
  timestamp: string;
  forwardedToMaster: boolean;
}

export interface AuditLogEntry {
  id: string;
  valaId: string;
  actionHash: string;
  timestamp: string;
  roleLevel: ValaRole;
  isVisibleToLower: boolean;
}

interface EnterpriseControlState {
  valaId: string;
  currentRole: ValaRole | null;
  sessionStart: number;
  sessionTimeout: number; // in seconds
  isFrozen: boolean;
  freezeReason?: string;
  actions: ControlAction[];
  aiReports: AIReport[];
  auditLog: AuditLogEntry[];
}

interface EnterpriseControlContextType extends EnterpriseControlState {
  authenticateRole: (role: ValaRole) => void;
  submitAction: (actionType: string, payload: Record<string, unknown>) => Promise<void>;
  processAutoDebug: (actionId: string) => Promise<void>;
  processAutoCheck: (actionId: string) => Promise<void>;
  processAutoLock: (actionId: string) => Promise<void>;
  forwardAction: (actionId: string) => Promise<void>;
  freezeSession: (reason: string) => void;
  unfreezeSession: (masterId: string) => void;
  overrideAction: (actionId: string, masterId: string) => void;
  getActionsForRole: (role: ValaRole) => ControlAction[];
  getAIReportsForMaster: () => AIReport[];
  logout: () => void;
  getRemainingSessionTime: () => number;
}

const EnterpriseControlContext = createContext<EnterpriseControlContextType | null>(null);

// Utility functions
const generateValaId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `V${timestamp}${random}`.toUpperCase();
};

const generateChecksum = (data: unknown): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `CHK-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
};

const generateActionId = (): string => {
  return `ACT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
};

const getNextRole = (current: ValaRole): ValaRole | null => {
  const hierarchy: ValaRole[] = ["operation", "regional", "ai_head", "master_admin"];
  const currentIndex = hierarchy.indexOf(current);
  if (currentIndex < hierarchy.length - 1) {
    return hierarchy[currentIndex + 1];
  }
  return null;
};

export const EnterpriseControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EnterpriseControlState>({
    valaId: generateValaId(),
    currentRole: null,
    sessionStart: Date.now(),
    sessionTimeout: 1800, // 30 minutes
    isFrozen: false,
    actions: [],
    aiReports: [],
    auditLog: [],
  });

  // Security: Block clipboard, screenshot, context menu
  useEffect(() => {
    const blockClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({ title: "Blocked", description: "Clipboard operations disabled.", variant: "destructive" });
    };

    const blockKeyboard = (e: KeyboardEvent) => {
      // Block PrintScreen, Ctrl+P, Ctrl+S, Ctrl+C, Ctrl+V
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["p", "s", "c", "v"].includes(e.key.toLowerCase())) ||
        (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key))
      ) {
        e.preventDefault();
        toast({ title: "Blocked", description: "This action is not allowed.", variant: "destructive" });
      }
    };

    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("copy", blockClipboard);
    document.addEventListener("paste", blockClipboard);
    document.addEventListener("cut", blockClipboard);
    document.addEventListener("keydown", blockKeyboard);
    document.addEventListener("contextmenu", blockContextMenu);

    return () => {
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("paste", blockClipboard);
      document.removeEventListener("cut", blockClipboard);
      document.removeEventListener("keydown", blockKeyboard);
      document.removeEventListener("contextmenu", blockContextMenu);
    };
  }, []);

  // Session timeout check
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - state.sessionStart) / 1000;
      if (elapsed >= state.sessionTimeout && !state.isFrozen) {
        freezeSession("Session timeout exceeded");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.sessionStart, state.sessionTimeout, state.isFrozen]);

  const authenticateRole = useCallback((role: ValaRole) => {
    setState(prev => ({
      ...prev,
      currentRole: role,
      sessionStart: Date.now(),
      valaId: generateValaId(),
    }));
    
    // Add to audit log
    const logEntry: AuditLogEntry = {
      id: generateActionId(),
      valaId: state.valaId,
      actionHash: generateChecksum({ action: "authenticate", role }),
      timestamp: new Date().toISOString(),
      roleLevel: role,
      isVisibleToLower: false,
    };
    
    setState(prev => ({ ...prev, auditLog: [...prev.auditLog, logEntry] }));
  }, [state.valaId]);

  const submitAction = useCallback(async (actionType: string, payload: Record<string, unknown>) => {
    if (state.isFrozen) {
      toast({ title: "Session Frozen", description: "Cannot submit actions while frozen.", variant: "destructive" });
      return;
    }

    const action: ControlAction = {
      id: generateActionId(),
      valaId: state.valaId,
      role: state.currentRole!,
      actionType,
      payload,
      status: "pending",
      checksum: generateChecksum({ actionType, payload, valaId: state.valaId }),
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({ ...prev, actions: [...prev.actions, action] }));
    
    // Auto-trigger debug
    setTimeout(() => processAutoDebug(action.id), 500);
  }, [state.isFrozen, state.valaId, state.currentRole]);

  const processAutoDebug = useCallback(async (actionId: string) => {
    setState(prev => ({
      ...prev,
      actions: prev.actions.map(a => 
        a.id === actionId ? { ...a, status: "debug" as ActionStatus, debugAt: new Date().toISOString() } : a
      ),
    }));
    
    // Simulate debug process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Auto-trigger check
    processAutoCheck(actionId);
  }, []);

  const processAutoCheck = useCallback(async (actionId: string) => {
    const action = state.actions.find(a => a.id === actionId);
    if (!action) return;

    // Verify checksum
    const expectedChecksum = generateChecksum({ 
      actionType: action.actionType, 
      payload: action.payload, 
      valaId: action.valaId 
    });

    if (action.checksum !== expectedChecksum) {
      freezeSession("Checksum mismatch detected");
      return;
    }

    setState(prev => ({
      ...prev,
      actions: prev.actions.map(a => 
        a.id === actionId ? { ...a, status: "check" as ActionStatus, checkAt: new Date().toISOString() } : a
      ),
    }));
    
    // Simulate check process
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Auto-trigger lock
    processAutoLock(actionId);
  }, [state.actions]);

  const processAutoLock = useCallback(async (actionId: string) => {
    setState(prev => ({
      ...prev,
      actions: prev.actions.map(a => 
        a.id === actionId ? { ...a, status: "locked" as ActionStatus, lockAt: new Date().toISOString() } : a
      ),
    }));

    // Add to audit log
    const action = state.actions.find(a => a.id === actionId);
    if (action) {
      const logEntry: AuditLogEntry = {
        id: generateActionId(),
        valaId: action.valaId,
        actionHash: action.checksum,
        timestamp: new Date().toISOString(),
        roleLevel: action.role,
        isVisibleToLower: false,
      };
      setState(prev => ({ ...prev, auditLog: [...prev.auditLog, logEntry] }));
    }

    toast({ title: "Action Locked", description: "Ready to forward. No further edits allowed." });
  }, [state.actions]);

  const forwardAction = useCallback(async (actionId: string) => {
    const action = state.actions.find(a => a.id === actionId);
    if (!action || action.status !== "locked") {
      toast({ title: "Cannot Forward", description: "Action must be locked first.", variant: "destructive" });
      return;
    }

    const nextRole = getNextRole(action.role);
    if (!nextRole) {
      toast({ title: "Final Level", description: "Action already at Master Admin level." });
      return;
    }

    setState(prev => ({
      ...prev,
      actions: prev.actions.map(a => 
        a.id === actionId ? { 
          ...a, 
          status: "forwarded" as ActionStatus, 
          forwardAt: new Date().toISOString(),
          forwardedTo: nextRole,
        } : a
      ),
    }));

    // If forwarded to AI Head, generate behavior report
    if (nextRole === "ai_head") {
      const aiReport: AIReport = {
        id: generateActionId(),
        targetValaId: action.valaId,
        targetRole: action.role,
        behaviorScore: Math.floor(Math.random() * 30) + 70, // 70-100
        riskFlag: Math.random() > 0.8 ? "high" : Math.random() > 0.5 ? "medium" : "low",
        observations: [
          "Action pattern within normal parameters",
          "Timing consistent with role expectations",
          "No anomalous data access detected",
        ],
        timestamp: new Date().toISOString(),
        forwardedToMaster: false,
      };
      setState(prev => ({ ...prev, aiReports: [...prev.aiReports, aiReport] }));
    }

    toast({ title: "Forwarded", description: `Action forwarded to ${nextRole.replace("_", " ").toUpperCase()}.` });
  }, [state.actions]);

  const freezeSession = useCallback((reason: string) => {
    setState(prev => ({ ...prev, isFrozen: true, freezeReason: reason }));
    
    // Log freeze event
    const logEntry: AuditLogEntry = {
      id: generateActionId(),
      valaId: state.valaId,
      actionHash: generateChecksum({ action: "freeze", reason }),
      timestamp: new Date().toISOString(),
      roleLevel: state.currentRole || "operation",
      isVisibleToLower: false,
    };
    setState(prev => ({ ...prev, auditLog: [...prev.auditLog, logEntry] }));
    
    toast({ title: "Session Frozen", description: reason, variant: "destructive" });
  }, [state.valaId, state.currentRole]);

  const unfreezeSession = useCallback((masterId: string) => {
    setState(prev => ({ ...prev, isFrozen: false, freezeReason: undefined, sessionStart: Date.now() }));
    
    toast({ title: "Session Unfrozen", description: `Authorized by Master Admin ${masterId}.` });
  }, []);

  const overrideAction = useCallback((actionId: string, masterId: string) => {
    setState(prev => ({
      ...prev,
      actions: prev.actions.map(a => 
        a.id === actionId ? { ...a, status: "forwarded" as ActionStatus } : a
      ),
    }));
    
    toast({ title: "Override Applied", description: `Action overridden by ${masterId}.` });
  }, []);

  const getActionsForRole = useCallback((role: ValaRole): ControlAction[] => {
    const hierarchy: ValaRole[] = ["operation", "regional", "ai_head", "master_admin"];
    const roleIndex = hierarchy.indexOf(role);
    
    // Master admin sees all, others see only their level or forwarded to them
    if (role === "master_admin") {
      return state.actions;
    }
    
    return state.actions.filter(a => 
      a.role === role || a.forwardedTo === role
    );
  }, [state.actions]);

  const getAIReportsForMaster = useCallback((): AIReport[] => {
    return state.aiReports;
  }, [state.aiReports]);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setState({
      valaId: generateValaId(),
      currentRole: null,
      sessionStart: Date.now(),
      sessionTimeout: 1800,
      isFrozen: false,
      actions: [],
      aiReports: [],
      auditLog: [],
    });
  }, []);

  const getRemainingSessionTime = useCallback((): number => {
    const elapsed = (Date.now() - state.sessionStart) / 1000;
    return Math.max(0, state.sessionTimeout - elapsed);
  }, [state.sessionStart, state.sessionTimeout]);

  return (
    <EnterpriseControlContext.Provider value={{
      ...state,
      authenticateRole,
      submitAction,
      processAutoDebug,
      processAutoCheck,
      processAutoLock,
      forwardAction,
      freezeSession,
      unfreezeSession,
      overrideAction,
      getActionsForRole,
      getAIReportsForMaster,
      logout,
      getRemainingSessionTime,
    }}>
      {children}
    </EnterpriseControlContext.Provider>
  );
};

export const useEnterpriseControl = () => {
  const context = useContext(EnterpriseControlContext);
  if (!context) {
    throw new Error("useEnterpriseControl must be used within EnterpriseControlProvider");
  }
  return context;
};
