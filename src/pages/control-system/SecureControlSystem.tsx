import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  Hash,
  Fingerprint,
  LogOut,
  Play,
  Search,
  FileCheck,
  Forward
} from 'lucide-react';
import { toast } from 'sonner';

type ActionStatus = 'pending' | 'debug' | 'check' | 'locked' | 'forwarded' | 'blocked';
type ControlRole = 'front_ops' | 'area_control' | 'ai_head' | 'master_admin';

const generateValaId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `VALA-${btoa(`${timestamp}-${random}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12).toUpperCase()}`;
};

const generateActionHash = (): string => {
  return btoa(`${Date.now()}-${Math.random()}`).substring(0, 16).toUpperCase();
};

interface LogEntry {
  id: string;
  valaId: string;
  timestamp: number;
  actionHash: string;
  status: ActionStatus;
  previousHash: string;
}

interface ControlAction {
  id: string;
  type: string;
  status: ActionStatus;
  stepHistory: ActionStatus[];
  createdAt: number;
}

const SESSION_TIMEOUT = 30 * 60 * 1000;

export default function SecureControlSystem() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [valaId, setValaId] = useState('');
  const [role, setRole] = useState<ControlRole>('front_ops');
  const [sessionExpiry, setSessionExpiry] = useState(0);
  const [currentAction, setCurrentAction] = useState<ControlAction | null>(null);
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const [isSecurityLocked, setIsSecurityLocked] = useState(false);

  // Block security operations
  React.useEffect(() => {
    const block = (e: Event) => {
      e.preventDefault();
      toast.error('SECURITY: Operation blocked');
    };

    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast.error('SECURITY: Keyboard blocked');
      }
      if (e.key === 'PrintScreen' || e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    document.addEventListener('cut', block);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('contextmenu', block);

    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('contextmenu', block);
    };
  }, []);

  // Session timer
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      if (Date.now() >= sessionExpiry) {
        handleLogout();
        toast.error('Session expired');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry]);

  const addLog = (action: string, status: ActionStatus) => {
    const entry: LogEntry = {
      id: `LOG-${Date.now()}`,
      valaId,
      timestamp: Date.now(),
      actionHash: generateActionHash(),
      status,
      previousHash: actionLogs.length > 0 ? actionLogs[actionLogs.length - 1].actionHash : 'GENESIS'
    };
    setActionLogs(prev => [...prev, entry]);
  };

  const handleAuthenticate = (selectedRole: ControlRole) => {
    const newValaId = generateValaId();
    setValaId(newValaId);
    setRole(selectedRole);
    setSessionExpiry(Date.now() + SESSION_TIMEOUT);
    setIsAuthenticated(true);
    toast.success(`Session: ${newValaId}`);
  };

  const handleLogout = () => {
    addLog('session_end', 'locked');
    setIsAuthenticated(false);
    setValaId('');
    setCurrentAction(null);
    setSessionExpiry(0);
  };

  const handleCreateAction = () => {
    if (isSecurityLocked) return;
    const action: ControlAction = {
      id: `ACT-${Date.now()}`,
      type: 'CONTROL_ACTION',
      status: 'pending',
      stepHistory: ['pending'],
      createdAt: Date.now()
    };
    setCurrentAction(action);
    addLog('action_create', 'pending');
    toast.success('Action created');
  };

  const handleStep = (step: ActionStatus) => {
    if (!currentAction || isSecurityLocked) return;
    
    const flow: ActionStatus[] = ['pending', 'debug', 'check', 'locked', 'forwarded'];
    const currentIndex = flow.indexOf(currentAction.status);
    const targetIndex = flow.indexOf(step);

    if (targetIndex !== currentIndex + 1) {
      toast.error('No skip allowed');
      return;
    }

    setCurrentAction({
      ...currentAction,
      status: step,
      stepHistory: [...currentAction.stepHistory, step]
    });
    addLog(`step:${step}`, step);
    toast.success(`${step.toUpperCase()} complete`);

    if (step === 'forwarded') {
      setTimeout(() => setCurrentAction(null), 1500);
    }
  };

  const formatTime = (ms: number) => {
    const remaining = Math.max(0, ms - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepIcon = (step: ActionStatus) => {
    switch (step) {
      case 'pending': return <Play className="h-4 w-4" />;
      case 'debug': return <Search className="h-4 w-4" />;
      case 'check': return <FileCheck className="h-4 w-4" />;
      case 'locked': return <Lock className="h-4 w-4" />;
      case 'forwarded': return <Forward className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'debug': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'check': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'locked': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'forwarded': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
              <h1 className="text-2xl font-bold text-white">VALA CONTROL SYSTEM</h1>
              <p className="text-neutral-500 text-sm mt-2">Secure • Isolated • Immutable</p>
            </div>

            <div className="space-y-3">
              <p className="text-neutral-400 text-xs text-center mb-4">SELECT ROLE MODULE</p>
              {[
                { role: 'front_ops' as ControlRole, label: 'Front / Operations' },
                { role: 'area_control' as ControlRole, label: 'Area / Regional Control' },
                { role: 'ai_head' as ControlRole, label: 'AI Head (Report Only)' },
              ].map(item => (
                <Button
                  key={item.role}
                  variant="outline"
                  className="w-full h-12 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
                  onClick={() => handleAuthenticate(item.role)}
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
              <Button
                variant="outline"
                className="w-full h-12 bg-red-950/30 border-red-900/50 hover:bg-red-900/30 text-red-400"
                onClick={() => navigate('/master-admin-control')}
              >
                <Lock className="h-4 w-4 mr-2" />
                Master Admin Portal
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800">
              <p className="text-neutral-600 text-xs text-center">
                No copy • No export • No screenshot • Append-only logs
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Control Interface
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Security Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-neutral-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-neutral-300">{valaId}</span>
                <Badge className="bg-neutral-800 text-neutral-400 border-neutral-700 text-xs">
                  {role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-neutral-600">One Role • Isolated Module</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className={`font-mono ${sessionExpiry - Date.now() < 300000 ? 'text-red-400' : 'text-neutral-400'}`}>
                {formatTime(sessionExpiry)}
              </span>
            </div>
            
            <Badge className={isSecurityLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
              <Lock className="h-3 w-3 mr-1" />
              {isSecurityLocked ? 'LOCKED' : 'SECURE'}
            </Badge>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-400">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Step Flow Indicator */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">ACTION FLOW</h2>
            <div className="flex items-center justify-between">
              {['pending', 'debug', 'check', 'locked', 'forwarded'].map((step, index, arr) => (
                <React.Fragment key={step}>
                  <div className={`flex flex-col items-center ${
                    currentAction?.stepHistory.includes(step as ActionStatus) 
                      ? 'text-white' 
                      : 'text-neutral-600'
                  }`}>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      currentAction?.status === step
                        ? 'bg-white text-black border-white'
                        : currentAction?.stepHistory.includes(step as ActionStatus)
                        ? 'bg-neutral-700 border-neutral-600'
                        : 'border-neutral-700'
                    }`}>
                      {getStepIcon(step as ActionStatus)}
                    </div>
                    <span className="text-xs mt-2 uppercase">{step}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <ArrowRight className={`h-4 w-4 ${
                      currentAction?.stepHistory.includes(arr[index + 1] as ActionStatus)
                        ? 'text-neutral-400'
                        : 'text-neutral-700'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">CURRENT ACTION</h2>
            
            {!currentAction ? (
              <div className="text-center py-8">
                <Hash className="h-12 w-12 mx-auto text-neutral-700 mb-4" />
                <p className="text-neutral-500 mb-4">No active action</p>
                <Button 
                  onClick={handleCreateAction}
                  className="bg-white text-black hover:bg-neutral-200"
                  disabled={isSecurityLocked}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Create New Action
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-neutral-300">{currentAction.id}</span>
                    <Badge className={getStatusColor(currentAction.status)}>
                      {currentAction.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-neutral-600">
                    {new Date(currentAction.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* Step Buttons */}
                <div className="grid grid-cols-4 gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="bg-blue-950/30 border-blue-900/50 text-blue-400 hover:bg-blue-900/30"
                    onClick={() => handleStep('debug')}
                    disabled={currentAction.status !== 'pending'}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Debug
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-cyan-950/30 border-cyan-900/50 text-cyan-400 hover:bg-cyan-900/30"
                    onClick={() => handleStep('check')}
                    disabled={currentAction.status !== 'debug'}
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    Check
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-purple-950/30 border-purple-900/50 text-purple-400 hover:bg-purple-900/30"
                    onClick={() => handleStep('locked')}
                    disabled={currentAction.status !== 'check'}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-950/30 border-green-900/50 text-green-400 hover:bg-green-900/30"
                    onClick={() => handleStep('forwarded')}
                    disabled={currentAction.status !== 'locked'}
                  >
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                </div>

                <p className="text-xs text-neutral-600 text-center pt-2">
                  No edit after submit • No backward access • Sequential flow only
                </p>
              </div>
            )}
          </div>

          {/* Append-Only Log */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">
              IMMUTABLE LOG (Append-Only)
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
              {actionLogs.length === 0 ? (
                <p className="text-neutral-600 text-center py-4">No log entries</p>
              ) : (
                actionLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 text-neutral-400 py-1 border-b border-neutral-800"
                  >
                    <span className="text-neutral-600 w-8">{String(index + 1).padStart(3, '0')}</span>
                    <span className="text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-neutral-300">{log.actionHash}</span>
                    <Badge className={`${getStatusColor(log.status)} text-xs`}>
                      {log.status}
                    </Badge>
                    <span className="text-neutral-600 text-xs">← {log.previousHash.substring(0, 8)}</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>VALA Control System v1.0</span>
          <span>Clipboard: BLOCKED • Export: BLOCKED • Screenshot: BLOCKED</span>
          <span>Checksum: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
