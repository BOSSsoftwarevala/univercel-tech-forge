import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Shield, Clock, Fingerprint, Wifi, AlertOctagon, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMasterAdminGuard } from '@/hooks/useMasterAdminGuard';
import MAGlobalLock from '@/components/master-admin/MAGlobalLock';
import MASuperAdminControl from '@/components/master-admin/MASuperAdminControl';
import MAWalletEmergency from '@/components/master-admin/MAWalletEmergency';
import MAOwnershipVault from '@/components/master-admin/MAOwnershipVault';
import MAKillSwitch from '@/components/master-admin/MAKillSwitch';
import MAInfraOverride from '@/components/master-admin/MAInfraOverride';
import MAFullAuditLedger from '@/components/master-admin/MAFullAuditLedger';

// ============================================
// MASTER ADMIN COMMAND CENTER
// HIDDEN ENDPOINT - NO PUBLIC ACCESS
// ABSOLUTE AUTHORITY - SYSTEM OWNER
// ============================================

const MasterAdminVault = () => {
  const navigate = useNavigate();
  const {
    securityState,
    isGlobalLocked,
    isEmergencyMode,
    globalSystemLock,
    unlockSystem,
    suspendSuperAdmin,
    restoreSuperAdmin,
    overrideSuperAdminDecision,
    freezeAllWallets,
    reverseTransaction,
    lockWithdrawals,
    activateKillSwitch,
    killAllSessions,
    forceRollback,
    lockCICD,
    enableMaintenanceMode,
    exportVaultKeys,
    deleteLogs,
  } = useMasterAdminGuard();

  const [sessionTimer, setSessionTimer] = useState(600); // 10 minutes aggressive timeout
  const [stealthMode, setStealthMode] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimer(prev => {
        if (prev <= 1) {
          navigate('/');
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Mode Overlay */}
      {isEmergencyMode && (
        <div className="fixed inset-0 bg-red-500/10 pointer-events-none z-40 animate-pulse" />
      )}

      {/* Security Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-purple-500/20">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-purple-400">Master Admin Vault</h1>
                  <p className="text-xs text-muted-foreground">System Owner • Root of Trust</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Stealth Mode */}
              <button
                onClick={() => setStealthMode(!stealthMode)}
                className={`p-2 rounded-lg transition-colors ${
                  stealthMode 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stealthMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Security Badges */}
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <Shield className="w-3 h-3 mr-1" />
                MFA Active
              </Badge>
              
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                <Fingerprint className="w-3 h-3 mr-1" />
                Device Bound
              </Badge>

              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                <Wifi className="w-3 h-3 mr-1" />
                IP Verified
              </Badge>
              
              {/* Aggressive Session Timer */}
              <Badge 
                variant="outline" 
                className={`${
                  sessionTimer < 120 
                    ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse' 
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(sessionTimer)}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Master Admin Warning Banner */}
        <div className="px-6 py-2 bg-purple-500/10 border-t border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400 text-xs">
            <AlertOctagon className="w-4 h-4" />
            <span>MASTER ADMIN: All actions irreversible unless self-reverted • Encrypted logging • No convenience features</span>
          </div>
        </div>

        {/* Global Lock Status */}
        {isGlobalLocked && (
          <div className="px-6 py-2 bg-red-500/20 border-t border-red-500/30">
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold animate-pulse">
              <Shield className="w-4 h-4" />
              <span>GLOBAL SYSTEM LOCK ACTIVE - MASTER ONLY ACCESS</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Row 1: Global Lock + Kill Switch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MAGlobalLock
              isLocked={isGlobalLocked}
              onLock={globalSystemLock}
              onUnlock={unlockSystem}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MAKillSwitch
              onActivateKillSwitch={activateKillSwitch}
              onKillAllSessions={killAllSessions}
              onForceRecovery={async (reason) => {
                // Recovery logic
                return true;
              }}
            />
          </motion.div>
        </div>

        {/* Row 2: Super Admin Control + Wallet Emergency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MASuperAdminControl
              onSuspend={suspendSuperAdmin}
              onRestore={restoreSuperAdmin}
              onOverride={overrideSuperAdminDecision}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <MAWalletEmergency
              onFreezeAll={freezeAllWallets}
              onReverseTransaction={reverseTransaction}
              onLockWithdrawals={lockWithdrawals}
            />
          </motion.div>
        </div>

        {/* Row 3: Ownership Vault + Infra Override */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MAOwnershipVault
              onExportAttempt={exportVaultKeys}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <MAInfraOverride
              onForceRollback={forceRollback}
              onLockCICD={lockCICD}
              onMaintenanceMode={enableMaintenanceMode}
            />
          </motion.div>
        </div>

        {/* Row 4: Full Audit Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MAFullAuditLedger
            onDeleteAttempt={deleteLogs}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default MasterAdminVault;
