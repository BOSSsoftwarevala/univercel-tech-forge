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
import { supabase } from '@/integrations/supabase/client';

// VALA ID generation utility
const generateValaId = () => {
  return `V${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
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

export default function MasterAdminWorkspace() {
  const navigate = useNavigate();
  const { security, getRemainingTime, isFrozen, logSecurityEvent } = useSecureControlGuard();
  const [valaId] = useState('VMASTER' + Math.random().toString(36).substr(2, 4).toUpperCase());
  const [sessionTime, setSessionTime] = useState(getRemainingTime());
  const [activeTab, setActiveTab] = useState('overview');
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [summary, setSummary] = useState({
    totalActions: 0,
    pendingReview: 0,
    flaggedItems: 0,
    blockedItems: 0,
    systemHealth: 0,
  });
  const [ledgerEntries, setLedgerEntries] = useState<Array<{ id: string; timestamp: string; valaId: string; action: string; actionHash: string; status: 'verified' | 'flagged'; blockNumber: number }>>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const { count: totalActions } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      const { count: pendingReview } = await supabase
        .from('approvals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { data: flaggedData, error: flaggedError } = await supabase
        .from('flagged_items')
        .select('id, vala_id, role_level, flag_type, description, risk_score, detected_at, status, ai_analysis, action_history')
        .order('detected_at', { ascending: false })
        .limit(20);

      if (!flaggedError && flaggedData) {
        const mapped: FlaggedItem[] = flaggedData.map((f: { id: string; vala_id?: string; role_level?: string; flag_type?: string; description?: string; risk_score?: number; detected_at?: string; status?: string; ai_analysis?: string; action_history?: Array<{ action: string; timestamp: string; hash: string }> }) => ({
          id: f.id,
          valaId: f.vala_id || generateValaId(),
          roleLevel: f.role_level || '—',
          flagType: f.flag_type || '—',
          description: f.description || '—',
          riskScore: f.risk_score || 0,
          detectedAt: f.detected_at || new Date().toISOString(),
          status: (f.status as FlaggedItem['status']) || 'pending',
          aiAnalysis: f.ai_analysis || '—',
          actionHistory: f.action_history || [],
        }));
        setFlaggedItems(mapped);
        const flaggedCount = mapped.length;
        const blockedCount = mapped.filter(i => i.status === 'blocked').length;
        setSummary({
          totalActions: totalActions || 0,
          pendingReview: pendingReview || 0,
          flaggedItems: flaggedCount,
          blockedItems: blockedCount,
          systemHealth: 0,
        });
      } else {
        setSummary({
          totalActions: totalActions || 0,
          pendingReview: pendingReview || 0,
          flaggedItems: 0,
          blockedItems: 0,
          systemHealth: 0,
        });
      }
    };

    const fetchLedger = async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, created_at, user_id, action, meta_json')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) {
        setLedgerEntries(data.map((l: { id: string; created_at: string; user_id?: string; action: string; meta_json?: { hash?: string; block_number?: number; status?: string } }, idx: number) => ({
          id: l.id,
          timestamp: l.created_at,
          valaId: l.user_id || generateValaId(),
          action: l.action,
          actionHash: l.meta_json?.hash || `${l.id.substring(0, 16).toUpperCase()}`,
          status: (l.meta_json?.status as 'verified' | 'flagged') || 'verified',
          blockNumber: l.meta_json?.block_number || (1000 + idx),
        })));
      }
    };

    fetchSummary();
    fetchLedger();
  }, []);

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
                summary={summary}
                flaggedItems={flaggedItems}
                onOverride={handleOverride}
                onUnlock={handleUnlock}
                onBlock={handleBlock}
              />
            </TabsContent>

            <TabsContent value="ledger" className="mt-0">
              <AppendOnlyLedger
                entries={ledgerEntries}
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
