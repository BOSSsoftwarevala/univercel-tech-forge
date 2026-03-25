import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, AlertTriangle, Shield, Power, RefreshCw,
  Clock, Zap, AlertOctagon, CheckCircle2, XCircle, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BlackboxPanel, useBlackbox } from '../engines/BlackboxEngine';

export function SystemLockModule() {
  const [lockdownActive, setLockdownActive] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);
  const { logEvent } = useBlackbox();

  const handleLockdown = () => {
    if (confirmStep < 3) {
      setConfirmStep(prev => prev + 1);
    } else {
      setLockdownActive(true);
      setConfirmStep(0);
      // Log to Blackbox
      logEvent({
        action: 'GLOBAL LOCKDOWN ACTIVATED',
        actor: 'MA-0001',
        actorRole: 'Master Admin',
        target: 'All Systems',
        module: 'System Lock',
        ip: '192.168.1.xxx',
        geo: 'Mumbai, IN',
        device: 'Chrome/Windows',
        riskScore: 100,
      });
    }
  };

  const cancelLockdown = () => {
    setConfirmStep(0);
  };

  const releaseLockdown = () => {
    setLockdownActive(false);
    logEvent({
      action: 'LOCKDOWN RELEASED',
      actor: 'MA-0001',
      actorRole: 'Master Admin',
      target: 'All Systems',
      module: 'System Lock',
      ip: '192.168.1.xxx',
      geo: 'Mumbai, IN',
      device: 'Chrome/Windows',
      riskScore: 50,
    });
  };

  return (
    <div className="space-y-6">
      {/* Critical Warning */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`relative p-6 backdrop-blur-xl overflow-hidden ${
          lockdownActive 
            ? 'bg-gradient-to-r from-red-950 to-red-900 border-red-500/50' 
            : 'bg-gradient-to-r from-black to-red-950/80 border-red-500/30'
        }`}>
          {/* Pulsing effect when locked */}
          {lockdownActive && (
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute inset-0 bg-red-500/10" />
            </div>
          )}

          {/* Heavy vault depth effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center ${
                lockdownActive ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-red-600 to-red-800'
              } shadow-2xl shadow-red-500/30`}>
                <Lock className="w-10 h-10 text-white" />
                {lockdownActive && (
                  <div className="absolute inset-0 rounded-2xl border-4 border-red-400 animate-ping opacity-50" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-300">System Lock Control</h2>
                <p className="text-red-200/60 mt-1">Emergency freeze • Kill-switch • Global lockdown</p>
                <Badge className={`mt-2 ${
                  lockdownActive 
                    ? 'bg-red-500/30 text-red-200 border-red-500/50 animate-pulse' 
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                }`}>
                  {lockdownActive ? '🔒 LOCKDOWN ACTIVE' : '✓ System Operational'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Last lockdown</p>
              <p className="text-lg font-mono text-white/60">47 days ago</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kill Switch Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-black to-red-950/50 border-red-500/30 backdrop-blur-xl h-full">
            <div className="flex items-center gap-3 mb-6">
              <AlertOctagon className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Global System Freeze</h3>
            </div>

            {!lockdownActive ? (
              <div className="space-y-4">
                {/* Confirmation Steps */}
                <div className="space-y-3">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`p-4 rounded-xl border transition-all ${
                        confirmStep >= step
                          ? 'bg-red-500/20 border-red-500/50'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            confirmStep >= step ? 'bg-red-500' : 'bg-white/10'
                          }`}>
                            {confirmStep >= step ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-sm font-bold text-white/50">{step}</span>
                            )}
                          </div>
                          <span className={`text-sm ${confirmStep >= step ? 'text-red-300' : 'text-white/50'}`}>
                            {step === 1 ? 'Confirm Identity' :
                             step === 2 ? 'Acknowledge Impact' :
                             'Final Confirmation'}
                          </span>
                        </div>
                        {confirmStep >= step && (
                          <Badge className="bg-red-500/30 text-red-300 text-[10px]">Verified</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {confirmStep > 0 && (
                    <Button
                      variant="outline"
                      className="flex-1 bg-white/5 border-white/20 text-white"
                      onClick={cancelLockdown}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    className={`flex-1 ${
                      confirmStep === 3
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
                    } text-white shadow-lg shadow-red-500/30`}
                    onClick={handleLockdown}
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {confirmStep === 0 ? 'Initiate Lockdown' :
                     confirmStep < 3 ? `Step ${confirmStep + 1} of 3` :
                     '⚠️ EXECUTE LOCKDOWN'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-red-500/20 border border-red-500/50 text-center">
                  <Lock className="w-16 h-16 text-red-400 mx-auto mb-4 animate-bounce" />
                  <h4 className="text-xl font-bold text-red-300 mb-2">SYSTEM LOCKED</h4>
                  <p className="text-sm text-red-200/60">All operations suspended</p>
                </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
                    onClick={releaseLockdown}
                  >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Release Lockdown
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Status Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-black to-red-950/50 border-red-500/30 backdrop-blur-xl h-full">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Live Lockdown Status
            </h3>

            <div className="space-y-4">
              {[
                { label: 'User Transactions', status: lockdownActive ? 'blocked' : 'active' },
                { label: 'API Endpoints', status: lockdownActive ? 'blocked' : 'active' },
                { label: 'Admin Actions', status: lockdownActive ? 'blocked' : 'active' },
                { label: 'Background Jobs', status: lockdownActive ? 'paused' : 'running' },
                { label: 'External Integrations', status: lockdownActive ? 'disconnected' : 'connected' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-white/80">{item.label}</span>
                  <Badge className={
                    item.status === 'active' || item.status === 'running' || item.status === 'connected'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>

            {/* SLA Recovery Timer */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-300">SLA Recovery Timer</p>
                    <p className="text-xs text-red-200/50">Emergency lock service rental</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-300 font-mono">
                    {lockdownActive ? '00:15:00' : '--:--:--'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Blackbox - Lock Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative">
          <div className="absolute -top-2 left-4 px-3 py-1 bg-red-500/30 rounded-full border border-red-500/50">
            <div className="flex items-center gap-2">
              <Box className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-red-300 uppercase tracking-wider font-bold">Lock Events - Sealed in Blackbox</span>
            </div>
          </div>
          <BlackboxPanel maxEvents={6} />
        </div>
      </motion.div>
    </div>
  );
}
