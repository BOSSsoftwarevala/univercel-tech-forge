import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Lock, 
  Unlock,
  AlertTriangle,
  Brain,
  Clock,
  Hash,
  Eye,
  CheckCircle,
  XCircle,
  LogOut,
  Activity,
  TrendingDown,
  Users,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

type ActionStatus = 'pending' | 'debug' | 'check' | 'locked' | 'forwarded' | 'blocked';

interface ForwardedAction {
  id: string;
  valaId: string;
  fromRole: string;
  type: string;
  status: ActionStatus;
  forwardedAt: number;
  aiFlag: 'low' | 'medium' | 'high' | 'critical';
  behaviorScore: number;
  requiresOverride: boolean;
}

interface AIReport {
  id: string;
  valaId: string;
  behaviorScore: number;
  riskFlag: 'low' | 'medium' | 'high' | 'critical';
  anomalyCount: number;
  timestamp: number;
}

const generateValaId = (): string => {
  return `VALA-${btoa(`${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12).toUpperCase()}`;
};

// Mock data for demo
const mockForwardedActions: ForwardedAction[] = [
  {
    id: 'ACT-001',
    valaId: 'VALA-X7K9M2P4',
    fromRole: 'area_control',
    type: 'CONTROL_ACTION',
    status: 'forwarded',
    forwardedAt: Date.now() - 3600000,
    aiFlag: 'high',
    behaviorScore: 42,
    requiresOverride: true
  },
  {
    id: 'ACT-002',
    valaId: 'VALA-B3N8Q1R6',
    fromRole: 'front_ops',
    type: 'CONTROL_ACTION',
    status: 'forwarded',
    forwardedAt: Date.now() - 7200000,
    aiFlag: 'low',
    behaviorScore: 89,
    requiresOverride: false
  },
  {
    id: 'ACT-003',
    valaId: 'VALA-F5T2Y9Z1',
    fromRole: 'ai_head',
    type: 'RISK_REPORT',
    status: 'forwarded',
    forwardedAt: Date.now() - 1800000,
    aiFlag: 'critical',
    behaviorScore: 18,
    requiresOverride: true
  }
];

const mockAIReports: AIReport[] = [
  { id: 'AI-001', valaId: 'VALA-X7K9M2P4', behaviorScore: 42, riskFlag: 'high', anomalyCount: 3, timestamp: Date.now() - 3600000 },
  { id: 'AI-002', valaId: 'VALA-F5T2Y9Z1', behaviorScore: 18, riskFlag: 'critical', anomalyCount: 7, timestamp: Date.now() - 1800000 },
  { id: 'AI-003', valaId: 'VALA-K2M8N4P1', behaviorScore: 65, riskFlag: 'medium', anomalyCount: 1, timestamp: Date.now() - 5400000 },
];

const SESSION_TIMEOUT = 30 * 60 * 1000;

export default function MasterAdminControl() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [valaId, setValaId] = useState('');
  const [sessionExpiry, setSessionExpiry] = useState(0);
  const [selectedAction, setSelectedAction] = useState<ForwardedAction | null>(null);
  const [actionLogs, setActionLogs] = useState<string[]>([]);

  // Block security operations
  useEffect(() => {
    const block = (e: Event) => {
      e.preventDefault();
      toast.error('SECURITY: Operation blocked');
    };

    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'PrintScreen' || e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('contextmenu', block);

    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('contextmenu', block);
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      if (Date.now() >= sessionExpiry) {
        handleLogout();
        toast.error('Session expired');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry]);

  const addLog = (action: string) => {
    const entry = `[${new Date().toISOString()}] ${valaId} | ${action}`;
    setActionLogs(prev => [...prev, entry]);
  };

  const handleAuthenticate = () => {
    const newValaId = generateValaId();
    setValaId(newValaId);
    setSessionExpiry(Date.now() + SESSION_TIMEOUT);
    setIsAuthenticated(true);
    toast.success(`Master Admin: ${newValaId}`);
  };

  const handleLogout = () => {
    addLog('session_end');
    setIsAuthenticated(false);
    setValaId('');
    setSessionExpiry(0);
    navigate('/control-system');
  };

  const handleUnlock = (action: ForwardedAction) => {
    addLog(`unlock:${action.id}`);
    toast.success(`Action ${action.id} unlocked`);
    setSelectedAction(null);
  };

  const handleOverride = (action: ForwardedAction, decision: 'approve' | 'reject') => {
    addLog(`override:${action.id}:${decision}`);
    toast.success(`Action ${action.id} ${decision}d`);
    setSelectedAction(null);
  };

  const formatTime = (ms: number) => {
    const remaining = Math.max(0, ms - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskColor = (flag: string) => {
    switch (flag) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
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
          <div className="bg-neutral-900 border-2 border-red-900/50 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-red-950/50 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">MASTER ADMIN</h1>
              <p className="text-red-400/70 text-sm mt-2">Final Authority • Override Access</p>
            </div>

            <div className="space-y-4">
              <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4">
                <p className="text-xs text-red-400/80 text-center">
                  This portal provides unrestricted override access.
                  All actions are permanently logged.
                </p>
              </div>

              <Button
                className="w-full h-12 bg-red-900 hover:bg-red-800 text-white"
                onClick={handleAuthenticate}
              >
                <Lock className="h-4 w-4 mr-2" />
                Authenticate as Master Admin
              </Button>

              <Button
                variant="ghost"
                className="w-full text-neutral-500"
                onClick={() => navigate('/control-system')}
              >
                Back to Control System
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Master Admin Interface
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Security Header */}
      <header className="bg-red-950/30 border-b border-red-900/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-red-500" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-neutral-300">{valaId}</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  MASTER ADMIN
                </Badge>
              </div>
              <p className="text-xs text-neutral-600">Final Authority • Summary View</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className={`font-mono ${sessionExpiry - Date.now() < 300000 ? 'text-red-400' : 'text-neutral-400'}`}>
                {formatTime(sessionExpiry)}
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-400">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Pending Actions', value: mockForwardedActions.length, icon: Activity, color: 'text-yellow-400' },
              { label: 'AI Flags', value: mockAIReports.filter(r => r.riskFlag === 'critical' || r.riskFlag === 'high').length, icon: AlertTriangle, color: 'text-red-400' },
              { label: 'Active Sessions', value: 12, icon: Users, color: 'text-blue-400' },
              { label: 'Avg Behavior Score', value: '67%', icon: TrendingDown, color: 'text-green-400' },
            ].map((stat, index) => (
              <Card key={index} className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Forwarded Actions - Summary Only */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-neutral-400 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FORWARDED ACTIONS (Summary)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockForwardedActions.map((action) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      action.aiFlag === 'critical' || action.aiFlag === 'high'
                        ? 'bg-red-950/20 border-red-900/50 hover:bg-red-950/30'
                        : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'
                    }`}
                    onClick={() => setSelectedAction(action)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Hash className="h-4 w-4 text-neutral-500" />
                        <span className="font-mono text-sm">{action.id}</span>
                        <Badge className={getRiskColor(action.aiFlag)}>
                          {action.aiFlag.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Score: {action.behaviorScore}</span>
                        {action.requiresOverride && (
                          <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">
                            Override
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      From: {action.fromRole} • {new Date(action.forwardedAt).toLocaleTimeString()}
                    </p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* AI Reports - Drill-down on Flag */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-neutral-400 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI BEHAVIOR & RISK REPORTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockAIReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      report.riskFlag === 'critical'
                        ? 'bg-red-950/30 border-red-900/50'
                        : report.riskFlag === 'high'
                        ? 'bg-orange-950/20 border-orange-900/30'
                        : 'bg-neutral-800/50 border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-500">{report.valaId}</span>
                        <Badge className={getRiskColor(report.riskFlag)}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {report.riskFlag.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-xs text-neutral-600">
                        {new Date(report.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-neutral-500">
                        Behavior: <span className={report.behaviorScore < 50 ? 'text-red-400' : 'text-green-400'}>
                          {report.behaviorScore}%
                        </span>
                      </span>
                      <span className="text-neutral-500">
                        Anomalies: <span className={report.anomalyCount > 3 ? 'text-red-400' : 'text-neutral-300'}>
                          {report.anomalyCount}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                ))}
                <p className="text-xs text-neutral-600 text-center pt-2">
                  AI observes silently • Cannot execute, approve, or edit
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Override Panel */}
          {selectedAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-red-950/20 border-red-900/50">
                <CardHeader>
                  <CardTitle className="text-sm text-red-400 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    MASTER OVERRIDE PANEL - {selectedAction.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-neutral-900 rounded p-3">
                      <p className="text-xs text-neutral-500">Vala ID</p>
                      <p className="font-mono text-sm">{selectedAction.valaId}</p>
                    </div>
                    <div className="bg-neutral-900 rounded p-3">
                      <p className="text-xs text-neutral-500">From Role</p>
                      <p className="text-sm">{selectedAction.fromRole}</p>
                    </div>
                    <div className="bg-neutral-900 rounded p-3">
                      <p className="text-xs text-neutral-500">AI Risk</p>
                      <Badge className={getRiskColor(selectedAction.aiFlag)}>
                        {selectedAction.aiFlag.toUpperCase()} ({selectedAction.behaviorScore})
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      onClick={() => handleUnlock(selectedAction)}
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Action
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleOverride(selectedAction, 'approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Override: Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleOverride(selectedAction, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Override: Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="border-neutral-700"
                      onClick={() => setSelectedAction(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Append-Only Master Log */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-neutral-400 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                MASTER AUDIT LOG (Immutable)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded p-4 font-mono text-xs max-h-32 overflow-y-auto">
                {actionLogs.length === 0 ? (
                  <p className="text-neutral-600">No master actions logged</p>
                ) : (
                  actionLogs.map((log, index) => (
                    <div key={index} className="text-neutral-500 py-0.5">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-red-950/30 border-t border-red-900/50 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>MASTER ADMIN CONTROL v1.0</span>
          <span>All overrides permanently logged • No delete history</span>
          <span>Session: {valaId}</span>
        </div>
      </footer>
    </div>
  );
}
