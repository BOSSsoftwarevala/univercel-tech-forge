import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Wallet, Snowflake, RotateCcw, Lock, AlertTriangle, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

interface MAWalletEmergencyProps {
  onFreezeAll: (reason: string) => Promise<boolean>;
  onReverseTransaction: (txId: string, reason: string) => Promise<boolean>;
  onLockWithdrawals: (permanent: boolean, reason: string) => Promise<boolean>;
}

const MAWalletEmergency = ({ onFreezeAll, onReverseTransaction, onLockWithdrawals }: MAWalletEmergencyProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'freeze' | 'reverse' | 'lock'>('freeze');
  const [reason, setReason] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [permanentLock, setPermanentLock] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [allFrozen, setAllFrozen] = useState(false);
  const [withdrawalsLocked, setWithdrawalsLocked] = useState(false);

  const handleAction = async () => {
    if (reason.length < 20) return;
    
    setProcessing(true);
    let success = false;

    switch (actionType) {
      case 'freeze':
        success = await onFreezeAll(reason);
        if (success) setAllFrozen(true);
        break;
      case 'reverse':
        success = await onReverseTransaction(transactionId, reason);
        break;
      case 'lock':
        success = await onLockWithdrawals(permanentLock, reason);
        if (success) setWithdrawalsLocked(true);
        break;
    }

    if (success) {
      setShowDialog(false);
      setReason('');
      setTransactionId('');
    }
    setProcessing(false);
  };

  const openAction = (type: typeof actionType) => {
    setActionType(type);
    setReason('');
    setTransactionId('');
    setPermanentLock(false);
    setShowDialog(true);
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Emergency Wallet Control
            </CardTitle>
            <div className="flex gap-2">
              {allFrozen && (
                <Badge className="bg-blue-500/20 text-blue-400 animate-pulse">
                  ALL FROZEN
                </Badge>
              )}
              {withdrawalsLocked && (
                <Badge className="bg-red-500/20 text-red-400 animate-pulse">
                  WITHDRAWALS LOCKED
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 cursor-pointer"
                onClick={() => openAction('freeze')}
              >
                <Snowflake className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="font-medium text-blue-400">Freeze All</h3>
                <p className="text-xs text-muted-foreground">
                  Freeze all wallets instantly
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer"
                onClick={() => openAction('reverse')}
              >
                <RotateCcw className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="font-medium text-amber-400">Reverse TX</h3>
                <p className="text-xs text-muted-foreground">
                  Reverse any transaction
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 cursor-pointer"
                onClick={() => openAction('lock')}
              >
                <Lock className="w-8 h-8 text-red-400 mb-2" />
                <h3 className="font-medium text-red-400">Lock Withdrawals</h3>
                <p className="text-xs text-muted-foreground">
                  Block all withdrawals
                </p>
              </motion.div>
            </div>

            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">MASTER FLAG Operations</p>
                  <p className="text-xs text-red-400/80">
                    All actions marked with MASTER FLAG. Reason mandatory. Permanent audit log.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Ban className="w-4 h-4" />
              <span>Manual balance edit permanently blocked</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'freeze' && <Snowflake className="w-5 h-5 text-blue-400" />}
              {actionType === 'reverse' && <RotateCcw className="w-5 h-5 text-amber-400" />}
              {actionType === 'lock' && <Lock className="w-5 h-5 text-red-400" />}
              {actionType === 'freeze' && 'Freeze All Wallets'}
              {actionType === 'reverse' && 'Reverse Transaction'}
              {actionType === 'lock' && 'Lock Withdrawals'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              This action will be marked with MASTER FLAG and logged permanently
            </div>

            {actionType === 'reverse' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Transaction ID</label>
                <input
                  type="text"
                  className="w-full p-2 rounded border border-border bg-background font-mono"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
              </div>
            )}

            {actionType === 'lock' && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <input
                  type="checkbox"
                  id="permanent"
                  checked={permanentLock}
                  onChange={(e) => setPermanentLock(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="permanent" className="text-sm">
                  <span className="font-medium text-red-400">PERMANENT LOCK</span>
                  <p className="text-xs text-muted-foreground">Cannot be reversed</p>
                </label>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason (Required - min 20 characters)
              </label>
              <Textarea
                placeholder="Enter detailed reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={reason.length < 20 || processing || (actionType === 'reverse' && !transactionId)}
              variant="destructive"
            >
              {processing ? 'Processing...' : 'Execute with MASTER FLAG'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MAWalletEmergency;
