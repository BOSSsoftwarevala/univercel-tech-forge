import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureControlGuard } from '@/hooks/useSecureControlGuard';
import { SecureWorkspaceHeader } from '@/components/secure-control/SecureWorkspaceHeader';
import { IsolatedActionPanel } from '@/components/secure-control/IsolatedActionPanel';
import { AIObservationPanel } from '@/components/secure-control/AIObservationPanel';
import { AppendOnlyLedger } from '@/components/secure-control/AppendOnlyLedger';
import { ActionStep } from '@/components/secure-control/ActionStepIndicator';
import { ActionStatus } from '@/components/secure-control/ActionStatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Brain, BookOpen, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock data
const generateValaId = () => {
  return `V${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

const mockActions = [
  {
    id: 'ACT-001',
    type: 'Data Processing Request',
    description: 'Request to process batch data for regional analysis. Requires verification of data integrity and compliance check before forwarding.',
    receivedAt: '2024-01-15 14:30:22',
    fromValaId: generateValaId(),
    checksum: 'A7F2B9C1',
    status: 'pending' as ActionStatus,
    currentStep: 'pending' as ActionStep
  },
  {
    id: 'ACT-002',
    type: 'Configuration Update',
    description: 'System configuration update request. All parameters verified. Awaiting lock confirmation.',
    receivedAt: '2024-01-15 13:15:00',
    fromValaId: generateValaId(),
    checksum: 'D4E8A2F6',
    status: 'pending' as ActionStatus,
    currentStep: 'check' as ActionStep
  },
  {
    id: 'ACT-003',
    type: 'Access Modification',
    description: 'Request to modify access parameters for regional node. Forwarded to upper role for final approval.',
    receivedAt: '2024-01-15 10:45:30',
    fromValaId: generateValaId(),
    checksum: 'B1C3D5E7',
    status: 'forwarded' as ActionStatus,
    currentStep: 'forward' as ActionStep
  }
];

const mockBehaviorScores = [
  { category: 'Session Consistency', score: 92, trend: 'stable' as const, flags: [] },
  { category: 'Action Patterns', score: 78, trend: 'improving' as const, flags: ['Minor deviation detected'] },
  { category: 'Response Time', score: 85, trend: 'stable' as const, flags: [] },
  { category: 'Compliance Score', score: 95, trend: 'stable' as const, flags: [] }
];

const mockRiskFlags = [
  {
    id: 'RF-001',
    level: 'medium' as const,
    description: 'Unusual access pattern detected during off-hours session',
    detectedAt: '2024-01-15 02:30:00',
    actionRequired: false
  }
];

const mockLedgerEntries = [
  { id: 'L-001', timestamp: '2024-01-15 14:30:22', valaId: 'V1A2B3C4', action: 'Action processed: Debug', actionHash: 'A7F2B9C1D4E8A2F6', status: 'verified' as const, blockNumber: 1001 },
  { id: 'L-002', timestamp: '2024-01-15 14:28:15', valaId: 'V5E6F7G8', action: 'Action forwarded to upper role', actionHash: 'B1C3D5E7F9A1B2C3', status: 'verified' as const, blockNumber: 1000 },
  { id: 'L-003', timestamp: '2024-01-15 14:25:00', valaId: 'V9H0I1J2', action: 'Security check passed', actionHash: 'C2D4E6F8A0B1C2D3', status: 'verified' as const, blockNumber: 999 },
  { id: 'L-004', timestamp: '2024-01-15 14:20:30', valaId: 'V1A2B3C4', action: 'Session started', actionHash: 'D3E5F7A9B1C3D5E7', status: 'verified' as const, blockNumber: 998 },
  { id: 'L-005', timestamp: '2024-01-15 14:15:00', valaId: 'VK3L4M5N', action: 'Anomaly detected - under review', actionHash: 'E4F6A8B0C2D4E6F8', status: 'flagged' as const, blockNumber: 997 }
];

export default function SecureControlWorkspace() {
  const navigate = useNavigate();
  const { security, getRemainingTime, isFrozen, logSecurityEvent } = useSecureControlGuard();
  const [valaId] = useState(generateValaId());
  const [roleLevel] = useState('OPERATION LEVEL');
  const [actions, setActions] = useState(mockActions);
  const [sessionTime, setSessionTime] = useState(getRemainingTime());
  const [activeTab, setActiveTab] = useState('actions');

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(getRemainingTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [getRemainingTime]);

  useEffect(() => {
    logSecurityEvent('session_start', `Vala ID: ${valaId}`);
    toast.success('Secure Session Initialized', {
      description: 'All security protocols active'
    });
  }, [valaId, logSecurityEvent]);

  const handleLogout = () => {
    logSecurityEvent('session_end', `Vala ID: ${valaId}`);
    toast.success('Session Terminated', {
      description: 'All data cleared'
    });
    navigate('/auth');
  };

  const handleProcess = (actionId: string, step: ActionStep) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return { ...action, currentStep: step };
      }
      return action;
    }));
    logSecurityEvent('action_processed', `${actionId}:${step}`);
  };

  const handleForward = (actionId: string) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return { ...action, status: 'forwarded' as ActionStatus, currentStep: 'complete' as ActionStep };
      }
      return action;
    }));
    logSecurityEvent('action_forwarded', actionId);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 select-none">
      <SecureWorkspaceHeader
        valaId={valaId}
        roleLevel={roleLevel}
        sessionTime={sessionTime}
        isFrozen={isFrozen}
        onLogout={handleLogout}
      />

      {/* Frozen State Overlay */}
      {isFrozen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-red-950/90 flex items-center justify-center"
        >
          <div className="text-center">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">SYSTEM FROZEN</h2>
            <p className="text-red-300">Anomaly detected. Contact Master Admin.</p>
          </div>
        </motion.div>
      )}

      <main className="h-[calc(100vh-56px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b border-neutral-800 bg-neutral-900/50">
            <div className="container mx-auto px-6">
              <TabsList className="h-12 bg-transparent gap-1">
                <TabsTrigger
                  value="actions"
                  className="data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200 text-neutral-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Pending Actions
                </TabsTrigger>
                <TabsTrigger
                  value="observation"
                  className="data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200 text-neutral-500"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Observation
                </TabsTrigger>
                <TabsTrigger
                  value="ledger"
                  className="data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200 text-neutral-500"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Audit Ledger
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="container mx-auto px-6 py-6 h-[calc(100%-48px)]">
            <TabsContent value="actions" className="h-full mt-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {actions.map((action) => (
                    <IsolatedActionPanel
                      key={action.id}
                      action={action}
                      valaId={valaId}
                      onProcess={handleProcess}
                      onForward={handleForward}
                      disabled={isFrozen}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="observation" className="h-full mt-0">
              <AIObservationPanel
                valaId={valaId}
                behaviorScores={mockBehaviorScores}
                riskFlags={mockRiskFlags}
                overallRiskScore={25}
              />
            </TabsContent>

            <TabsContent value="ledger" className="h-full mt-0">
              <AppendOnlyLedger
                entries={mockLedgerEntries}
                currentValaId={valaId}
                roleLevel="operation"
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
