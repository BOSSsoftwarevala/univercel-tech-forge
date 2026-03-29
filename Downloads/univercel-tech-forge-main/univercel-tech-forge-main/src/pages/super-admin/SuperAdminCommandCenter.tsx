import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, Clock, Fingerprint, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSuperAdminGuard } from '@/hooks/useSuperAdminGuard';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import SALiveSystemStatus from '@/components/super-admin/SALiveSystemStatus';
import SAHighRiskApprovals from '@/components/super-admin/SAHighRiskApprovals';
import SAWalletQueue from '@/components/super-admin/SAWalletQueue';
import SARoleMonitor from '@/components/super-admin/SARoleMonitor';
import SAIncidentCommand from '@/components/super-admin/SAIncidentCommand';
import SAAIFraudAlerts from '@/components/super-admin/SAAIFraudAlerts';
import SAAuditLogs from '@/components/super-admin/SAAuditLogs';

const SuperAdminCommandCenter = () => {
  const {
    securityState,
    approveWithdrawal,
    rejectWithdrawal,
    freezeWallet,
    reversePendingPayout,
    activateRole,
    suspendRole,
    declareIncident,
    freezeModule,
    extendSession,
  } = useSuperAdminGuard();

  const [sessionTimer, setSessionTimer] = useState(1800); // 30 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimer(prev => {
        if (prev <= 1) {
          return 1800; // Reset on expiry (guard handles redirect)
        }
        return prev - 1;
      });
    }, 1000);

    // Extend session on user activity
    const handleActivity = () => {
      extendSession();
      setSessionTimer(1800);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [extendSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-background">
        {/* Security Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  <div>
                    <h1 className="text-lg font-bold">Super Admin Command Center</h1>
                    <p className="text-xs text-muted-foreground">Platform Commander • Final Authority</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* MFA Status */}
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  MFA Active
                </Badge>
                
                {/* Device Binding */}
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  <Fingerprint className="w-3 h-3 mr-1" />
                  Device Bound
                </Badge>
                
                {/* Session Timer */}
                <Badge 
                  variant="outline" 
                  className={`${
                    sessionTimer < 300 
                      ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(sessionTimer)}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Zero Silent Actions Banner */}
          <div className="px-6 py-2 bg-amber-500/10 border-t border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Zero Silent Actions Policy: All operations are logged and require mandatory reason</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SALiveSystemStatus />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SAHighRiskApprovals
                onApprove={async (id, reason) => {
                  return await approveWithdrawal(id, reason);
                }}
                onReject={async (id, reason) => {
                  return await rejectWithdrawal(id, reason);
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SAWalletQueue
                onApprove={approveWithdrawal}
                onReject={rejectWithdrawal}
                onFreeze={freezeWallet}
                onReverse={reversePendingPayout}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SARoleMonitor
                onActivate={activateRole}
                onSuspend={suspendRole}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SAIncidentCommand
                onDeclare={declareIncident}
                onFreezeModule={freezeModule}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SAAIFraudAlerts />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SAAuditLogs />
          </motion.div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminCommandCenter;
