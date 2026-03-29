import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Lock, Unlock, AlertOctagon, ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface MAGlobalLockProps {
  isLocked: boolean;
  onLock: (reason: string) => Promise<boolean>;
  onUnlock: (reason: string) => Promise<boolean>;
}

const MAGlobalLock = ({ isLocked, onLock, onUnlock }: MAGlobalLockProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState<'lock' | 'unlock'>('lock');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleAction = async () => {
    if (reason.length < 20) return;
    
    setProcessing(true);
    const success = action === 'lock' 
      ? await onLock(reason)
      : await onUnlock(reason);
    
    if (success) {
      setShowConfirm(false);
      setReason('');
    }
    setProcessing(false);
  };

  const openConfirm = (type: 'lock' | 'unlock') => {
    setAction(type);
    setReason('');
    setShowConfirm(true);
  };

  return (
    <>
      <Card className={`border-2 ${isLocked ? 'border-red-500/50 bg-red-500/5' : 'border-border/50 bg-card/50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isLocked ? (
                <Lock className="w-5 h-5 text-red-400" />
              ) : (
                <ShieldOff className="w-5 h-5 text-emerald-400" />
              )}
              Global System Lock
            </CardTitle>
            <Badge 
              variant="outline" 
              className={isLocked 
                ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }
            >
              {isLocked ? 'SYSTEM LOCKED' : 'OPERATIONAL'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <div className="flex items-center gap-3 mb-3">
                <AlertOctagon className={`w-6 h-6 ${isLocked ? 'text-red-400' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-medium">
                    {isLocked 
                      ? 'All system operations are BLOCKED' 
                      : 'System is operational - All roles active'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isLocked 
                      ? 'Only Master Admin has access. All other sessions terminated.' 
                      : 'Lock will terminate all sessions and disable all role access.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isLocked ? (
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => openConfirm('unlock')}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock System
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => openConfirm('lock')}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Activate Global Lock
                </Button>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${action === 'lock' ? 'text-red-400' : 'text-emerald-400'}`}>
              {action === 'lock' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              {action === 'lock' ? 'Confirm Global System Lock' : 'Confirm System Unlock'}
            </DialogTitle>
            <DialogDescription>
              {action === 'lock' 
                ? 'This will immediately terminate ALL sessions and disable ALL role access except Master Admin.'
                : 'This will restore normal system operations and allow role access.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {action === 'lock' && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertOctagon className="w-4 h-4 inline mr-2" />
                WARNING: This action will immediately affect all users
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason (Required - min 20 characters)
              </label>
              <Textarea
                placeholder="Enter detailed reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reason.length}/20 characters minimum • Logged permanently
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={reason.length < 20 || processing}
              variant={action === 'lock' ? 'destructive' : 'default'}
              className={action === 'unlock' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {processing ? 'Processing...' : `Confirm ${action === 'lock' ? 'Lock' : 'Unlock'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MAGlobalLock;
