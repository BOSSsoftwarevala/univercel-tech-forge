import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Server, RotateCcw, Lock, Wrench, AlertTriangle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface MAInfraOverrideProps {
  onForceRollback: (version: string, reason: string) => Promise<boolean>;
  onLockCICD: (reason: string) => Promise<boolean>;
  onMaintenanceMode: (reason: string) => Promise<boolean>;
}

const MAInfraOverride = ({ onForceRollback, onLockCICD, onMaintenanceMode }: MAInfraOverrideProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'rollback' | 'cicd' | 'maintenance'>('rollback');
  const [reason, setReason] = useState('');
  const [targetVersion, setTargetVersion] = useState('');
  const [processing, setProcessing] = useState(false);

  const versions = [
    { id: 'v2.4.1', date: '2025-12-30', status: 'current' },
    { id: 'v2.4.0', date: '2025-12-28', status: 'stable' },
    { id: 'v2.3.9', date: '2025-12-25', status: 'stable' },
    { id: 'v2.3.8', date: '2025-12-20', status: 'stable' },
  ];

  const handleAction = async () => {
    if (reason.length < 20) return;
    
    setProcessing(true);
    let success = false;

    switch (actionType) {
      case 'rollback':
        success = await onForceRollback(targetVersion, reason);
        break;
      case 'cicd':
        success = await onLockCICD(reason);
        break;
      case 'maintenance':
        success = await onMaintenanceMode(reason);
        break;
    }

    if (success) {
      setShowDialog(false);
      setReason('');
      setTargetVersion('');
    }
    setProcessing(false);
  };

  const openAction = (type: typeof actionType) => {
    setActionType(type);
    setReason('');
    setTargetVersion('');
    setShowDialog(true);
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Infrastructure Override
            </CardTitle>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
              Server Manager Notified
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 cursor-pointer"
                onClick={() => openAction('rollback')}
              >
                <RotateCcw className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-medium text-purple-400">Force Rollback</h3>
                <p className="text-xs text-muted-foreground">
                  Rollback to previous version
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 cursor-pointer"
                onClick={() => openAction('cicd')}
              >
                <Lock className="w-8 h-8 text-red-400 mb-2" />
                <h3 className="font-medium text-red-400">Lock CI/CD</h3>
                <p className="text-xs text-muted-foreground">
                  Block all deployments
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer"
                onClick={() => openAction('maintenance')}
              >
                <Wrench className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="font-medium text-amber-400">Maintenance</h3>
                <p className="text-xs text-muted-foreground">
                  Enable maintenance mode
                </p>
              </motion.div>
            </div>

            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">Recent Versions</span>
              </div>
              <div className="space-y-2">
                {versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between text-sm">
                    <span className="font-mono">{version.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{version.date}</span>
                      <Badge variant="outline" className={
                        version.status === 'current' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-emerald-500/20 text-emerald-400'
                      }>
                        {version.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-400">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              All infrastructure actions are logged and Server Manager is automatically notified
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'rollback' && <RotateCcw className="w-5 h-5 text-purple-400" />}
              {actionType === 'cicd' && <Lock className="w-5 h-5 text-red-400" />}
              {actionType === 'maintenance' && <Wrench className="w-5 h-5 text-amber-400" />}
              {actionType === 'rollback' && 'Force Rollback'}
              {actionType === 'cicd' && 'Lock CI/CD Pipeline'}
              {actionType === 'maintenance' && 'Enable Maintenance Mode'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionType === 'rollback' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Target Version</label>
                <Select value={targetVersion} onValueChange={setTargetVersion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version..." />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.filter(v => v.status !== 'current').map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        {version.id} ({version.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="p-2 rounded bg-amber-500/10 text-xs text-amber-400 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Server Manager will be notified immediately
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                processing || 
                reason.length < 20 ||
                (actionType === 'rollback' && !targetVersion)
              }
            >
              {processing ? 'Processing...' : 'Execute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MAInfraOverride;
