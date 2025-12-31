import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Skull, Power, RefreshCw, AlertOctagon, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface MAKillSwitchProps {
  onActivateKillSwitch: (reason: string) => Promise<boolean>;
  onKillAllSessions: (reason: string) => Promise<boolean>;
  onForceRecovery: (reason: string) => Promise<boolean>;
}

const MAKillSwitch = ({ onActivateKillSwitch, onKillAllSessions, onForceRecovery }: MAKillSwitchProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<'kill' | 'sessions' | 'recovery'>('kill');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const CONFIRM_PHRASE = 'CONFIRM SYSTEM SHUTDOWN';

  const handleAction = async () => {
    if (actionType === 'kill' && confirmText !== CONFIRM_PHRASE) {
      return;
    }
    if (reason.length < (actionType === 'kill' ? 30 : 20)) {
      return;
    }
    
    setProcessing(true);
    let success = false;

    switch (actionType) {
      case 'kill':
        success = await onActivateKillSwitch(reason);
        if (success) setKillSwitchActive(true);
        break;
      case 'sessions':
        success = await onKillAllSessions(reason);
        break;
      case 'recovery':
        success = await onForceRecovery(reason);
        break;
    }

    if (success) {
      setShowConfirm(false);
      setReason('');
      setConfirmText('');
    }
    setProcessing(false);
  };

  const openAction = (type: typeof actionType) => {
    setActionType(type);
    setReason('');
    setConfirmText('');
    setShowConfirm(true);
  };

  return (
    <>
      <Card className={`border-2 ${killSwitchActive ? 'border-red-500 bg-red-500/10 animate-pulse' : 'border-border/50 bg-card/50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Skull className="w-5 h-5 text-red-400" />
              Kill Switch & Recovery
            </CardTitle>
            {killSwitchActive && (
              <Badge className="bg-red-500 text-white animate-pulse">
                SYSTEM SHUTDOWN ACTIVE
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 cursor-pointer"
                onClick={() => openAction('kill')}
              >
                <Power className="w-8 h-8 text-red-400 mb-2" />
                <h3 className="font-medium text-red-400">Kill Switch</h3>
                <p className="text-xs text-muted-foreground">
                  Complete system shutdown
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer"
                onClick={() => openAction('sessions')}
              >
                <Zap className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="font-medium text-amber-400">Kill Sessions</h3>
                <p className="text-xs text-muted-foreground">
                  Terminate all active sessions
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 cursor-pointer"
                onClick={() => openAction('recovery')}
              >
                <RefreshCw className="w-8 h-8 text-emerald-400 mb-2" />
                <h3 className="font-medium text-emerald-400">Force Recovery</h3>
                <p className="text-xs text-muted-foreground">
                  Initiate system recovery
                </p>
              </motion.div>
            </div>

            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-400">CATASTROPHIC CONTROLS</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kill Switch = Complete system shutdown. All services stopped.
                    All data access blocked. Recovery requires Master Admin presence.
                  </p>
                  <p className="text-xs text-red-400/80 mt-2">
                    If compromised → system lost. NO convenience features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              actionType === 'kill' ? 'text-red-400' :
              actionType === 'sessions' ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {actionType === 'kill' && <Power className="w-5 h-5" />}
              {actionType === 'sessions' && <Zap className="w-5 h-5" />}
              {actionType === 'recovery' && <RefreshCw className="w-5 h-5" />}
              {actionType === 'kill' && 'Activate Kill Switch'}
              {actionType === 'sessions' && 'Kill All Sessions'}
              {actionType === 'recovery' && 'Force System Recovery'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'kill' && 'This will completely shut down the system. ALL services will be stopped.'}
              {actionType === 'sessions' && 'This will terminate ALL active sessions except Master Admin.'}
              {actionType === 'recovery' && 'This will initiate system recovery procedures.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionType === 'kill' && (
              <>
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
                  <AlertOctagon className="w-6 h-6 inline mr-2" />
                  <span className="font-bold">CATASTROPHIC ACTION</span>
                  <p className="text-sm mt-2">
                    This will shut down ALL system services. Recovery requires physical Master Admin presence.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Type "{CONFIRM_PHRASE}" to confirm
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded border border-red-500/50 bg-background font-mono"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason (Required - min {actionType === 'kill' ? '30' : '20'} characters)
              </label>
              <Textarea
                placeholder="Enter detailed reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="p-2 rounded bg-muted/50 text-xs text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              This action will be logged permanently with encrypted audit trail
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                processing || 
                reason.length < (actionType === 'kill' ? 30 : 20) ||
                (actionType === 'kill' && confirmText !== CONFIRM_PHRASE)
              }
              variant={actionType === 'recovery' ? 'default' : 'destructive'}
              className={actionType === 'recovery' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {processing ? 'Processing...' : 'Execute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MAKillSwitch;
