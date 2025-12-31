import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureControlGuard } from '@/hooks/useSecureControlGuard';
import { SecureWorkspaceHeader } from '@/components/secure-control/SecureWorkspaceHeader';
import { MasterAdminOverview } from '@/components/secure-control/MasterAdminOverview';
import { AppendOnlyLedger } from '@/components/secure-control/AppendOnlyLedger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, BookOpen, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock data
const generateValaId = () => {
  return `V${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

const mockSummary = {
  totalActions: 1247,
  pendingReview: 23,
  flaggedItems: 5,
  blockedItems: 2,
  systemHealth: 94
};

interface FlaggedItem {
  id: string;
  valaId: string;
  roleLevel: string;
  flagType: string;
  description: string;
  riskScore: number;
  detectedAt: string;
  status: 'pending' | 'reviewed' | 'overridden' | 'blocked';
  aiAnalysis: string;
  actionHistory: Array<{ action: string; timestamp: string; hash: string; }>;
}

const mockFlaggedItems: FlaggedItem[] = [
  {
    id: 'FLG-001',
    valaId: generateValaId(),
    roleLevel: 'Operation',
    flagType: 'Behavior Anomaly',
    description: 'Unusual pattern detected in action processing.',
    riskScore: 72,
    detectedAt: '2024-01-15 14:30:00',
    status: 'pending',
    aiAnalysis: 'Pattern suggests possible automated behavior.',
    actionHistory: [
      { action: 'Session started', timestamp: '2024-01-15 14:00:00', hash: 'A1B2C3D4' },
      { action: 'AI flag triggered', timestamp: '2024-01-15 14:30:00', hash: 'I9J0K1L2' }
    ]
  },
  {
    id: 'FLG-002',
    valaId: generateValaId(),
    roleLevel: 'Regional',
    flagType: 'Access Pattern',
    description: 'Multiple failed forward attempts detected.',
    riskScore: 85,
    detectedAt: '2024-01-15 12:45:00',
    status: 'pending',
    aiAnalysis: 'High confidence of intentional policy violation.',
    actionHistory: [
      { action: 'Forward attempt failed', timestamp: '2024-01-15 12:30:00', hash: 'M3N4O5P6' },
      { action: 'AI flag triggered', timestamp: '2024-01-15 12:45:00', hash: 'U1V2W3X4' }
    ]
  },
  {
    id: 'FLG-003',
    valaId: generateValaId(),
    roleLevel: 'AI Head',
    flagType: 'Data Integrity',
    description: 'Checksum mismatch detected in forwarded action.',
    riskScore: 95,
    detectedAt: '2024-01-15 10:20:00',
    status: 'blocked',
    aiAnalysis: 'Critical integrity violation. Checksum verification failed.',
    actionHistory: [
      { action: 'Action received', timestamp: '2024-01-15 10:00:00', hash: 'Y5Z6A7B8' },
      { action: 'Auto-block triggered', timestamp: '2024-01-15 10:20:00', hash: 'G3H4I5J6' }
    ]
  }
];

const mockLedgerEntries = [
  { id: 'L-001', timestamp: '2024-01-15 14:30:22', valaId: 'V1A2B3C4', action: 'Master override applied: FLG-004', actionHash: 'A7F2B9C1D4E8A2F6', status: 'verified' as const, blockNumber: 1001 },
  { id: 'L-002', timestamp: '2024-01-15 14:28:15', valaId: 'V5E6F7G8', action: 'AI flag reviewed and cleared', actionHash: 'B1C3D5E7F9A1B2C3', status: 'verified' as const, blockNumber: 1000 },
  { id: 'L-003', timestamp: '2024-01-15 14:25:00', valaId: 'V9H0I1J2', action: 'System unlock: Regional node R-12', actionHash: 'C2D4E6F8A0B1C2D3', status: 'verified' as const, blockNumber: 999 },
  { id: 'L-004', timestamp: '2024-01-15 14:20:30', valaId: 'VMASTER01', action: 'Master Admin session started', actionHash: 'D3E5F7A9B1C3D5E7', status: 'verified' as const, blockNumber: 998 },
  { id: 'L-005', timestamp: '2024-01-15 14:15:00', valaId: 'VK3L4M5N', action: 'Critical block: Integrity violation', actionHash: 'E4F6A8B0C2D4E6F8', status: 'flagged' as const, blockNumber: 997 }
];

export default function MasterAdminWorkspace() {
  const navigate = useNavigate();
  const { security, getRemainingTime, isFrozen, logSecurityEvent } = useSecureControlGuard();
  const [valaId] = useState('VMASTER' + Math.random().toString(36).substr(2, 4).toUpperCase());
  const [sessionTime, setSessionTime] = useState(getRemainingTime());
  const [activeTab, setActiveTab] = useState('overview');
  const [flaggedItems, setFlaggedItems] = useState(mockFlaggedItems);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(getRemainingTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [getRemainingTime]);

  useEffect(() => {
    logSecurityEvent('master_session_start', `Master Vala ID: ${valaId}`);
    toast.success('Master Admin Session', {
      description: 'Full system access enabled'
    });
  }, [valaId, logSecurityEvent]);

  const handleLogout = () => {
    logSecurityEvent('master_session_end', `Master Vala ID: ${valaId}`);
    toast.success('Master Session Terminated', {
      description: 'All data secured'
    });
    navigate('/auth');
  };

  const handleOverride = (itemId: string, reason: string) => {
    setFlaggedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: 'overridden' as const };
      }
      return item;
    }));
    logSecurityEvent('master_override', `${itemId}: ${reason}`);
  };

  const handleUnlock = (itemId: string, reason: string) => {
    setFlaggedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: 'reviewed' as const };
      }
      return item;
    }));
    logSecurityEvent('master_unlock', `${itemId}: ${reason}`);
  };

  const handleBlock = (itemId: string, reason: string) => {
    setFlaggedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: 'blocked' as const };
      }
      return item;
    }));
    logSecurityEvent('master_block', `${itemId}: ${reason}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 select-none">
      <SecureWorkspaceHeader
        valaId={valaId}
        roleLevel="MASTER ADMIN"
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
            <p className="text-red-300">Critical anomaly detected. System locked.</p>
          </div>
        </motion.div>
      )}

      <main className="h-[calc(100vh-56px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b border-neutral-800 bg-neutral-900/50">
            <div className="container mx-auto px-6">
              <TabsList className="h-12 bg-transparent gap-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200 text-neutral-500"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  System Overview
                </TabsTrigger>
                <TabsTrigger
                  value="ledger"
                  className="data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200 text-neutral-500"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Full Audit Ledger
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="container mx-auto px-6 py-6 h-[calc(100%-48px)] overflow-auto">
            <TabsContent value="overview" className="mt-0">
              <MasterAdminOverview
                summary={mockSummary}
                flaggedItems={flaggedItems}
                onOverride={handleOverride}
                onUnlock={handleUnlock}
                onBlock={handleBlock}
              />
            </TabsContent>

            <TabsContent value="ledger" className="mt-0">
              <AppendOnlyLedger
                entries={mockLedgerEntries}
                currentValaId={valaId}
                roleLevel="master"
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
