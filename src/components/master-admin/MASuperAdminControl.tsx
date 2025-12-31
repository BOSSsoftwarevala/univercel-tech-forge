import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Crown, UserX, UserCheck, RotateCcw, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuperAdmin {
  id: string;
  valaId: string;
  status: 'active' | 'suspended';
  lastActivity: Date;
  pendingDecisions: number;
}

interface MASuperAdminControlProps {
  onSuspend: (id: string, reason: string) => Promise<boolean>;
  onRestore: (id: string, reason: string) => Promise<boolean>;
  onOverride: (decisionId: string, original: string, override: string, reason: string) => Promise<boolean>;
}

const MASuperAdminControl = ({ onSuspend, onRestore, onOverride }: MASuperAdminControlProps) => {
  const [superAdmins] = useState<SuperAdmin[]>([
    {
      id: 'sa-001',
      valaId: 'VALA-SA-0001',
      status: 'active',
      lastActivity: new Date(Date.now() - 3600000),
      pendingDecisions: 3,
    },
  ]);

  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'restore' | 'override'>('suspend');
  const [selectedAdmin, setSelectedAdmin] = useState<SuperAdmin | null>(null);
  const [reason, setReason] = useState('');
  const [overrideDetails, setOverrideDetails] = useState({ decisionId: '', original: '', override: '' });
  const [processing, setProcessing] = useState(false);

  const handleAction = async () => {
    if (reason.length < 20) return;
    
    setProcessing(true);
    let success = false;

    if (actionType === 'suspend' && selectedAdmin) {
      success = await onSuspend(selectedAdmin.id, reason);
    } else if (actionType === 'restore' && selectedAdmin) {
      success = await onRestore(selectedAdmin.id, reason);
    } else if (actionType === 'override') {
      success = await onOverride(
        overrideDetails.decisionId,
        overrideDetails.original,
        overrideDetails.override,
        reason
      );
    }

    if (success) {
      setShowActionDialog(false);
      setReason('');
    }
    setProcessing(false);
  };

  const openAction = (admin: SuperAdmin, type: 'suspend' | 'restore') => {
    setSelectedAdmin(admin);
    setActionType(type);
    setReason('');
    setShowActionDialog(true);
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Super Admin Control
            </CardTitle>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
              Master Override Authority
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {superAdmins.map((admin) => (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-mono">{admin.valaId}</span>
                      <Badge 
                        variant="outline" 
                        className={admin.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/20 text-red-400'
                        }
                      >
                        {admin.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Last activity: {admin.lastActivity.toLocaleString()}</p>
                      <p className="text-amber-400">
                        {admin.pendingDecisions} pending decisions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {admin.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => openAction(admin, 'suspend')}
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => openAction(admin, 'restore')}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => {
                        setActionType('override');
                        setSelectedAdmin(admin);
                        setShowActionDialog(true);
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Override
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-2 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Override Authority</p>
                  <p className="text-xs text-amber-400/80">
                    All actions logged permanently. Reason mandatory. Cannot be undone except by self-revert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'suspend' && <UserX className="w-5 h-5 text-red-400" />}
              {actionType === 'restore' && <UserCheck className="w-5 h-5 text-emerald-400" />}
              {actionType === 'override' && <RotateCcw className="w-5 h-5 text-purple-400" />}
              {actionType === 'suspend' && 'Suspend Super Admin'}
              {actionType === 'restore' && 'Restore Super Admin'}
              {actionType === 'override' && 'Override Decision'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAdmin && (
              <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                <span className="font-mono">{selectedAdmin.valaId}</span>
              </div>
            )}

            {actionType === 'override' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Decision ID</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded border border-border bg-background"
                    value={overrideDetails.decisionId}
                    onChange={(e) => setOverrideDetails(prev => ({ ...prev, decisionId: e.target.value }))}
                    placeholder="Enter decision ID to override"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Original Action</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-border bg-background"
                      value={overrideDetails.original}
                      onChange={(e) => setOverrideDetails(prev => ({ ...prev, original: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Override To</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-border bg-background"
                      value={overrideDetails.override}
                      onChange={(e) => setOverrideDetails(prev => ({ ...prev, override: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason (Required - min 20 characters) - PERMANENT LOG
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
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={reason.length < 20 || processing}
              variant={actionType === 'suspend' ? 'destructive' : 'default'}
            >
              {processing ? 'Processing...' : 'Confirm Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MASuperAdminControl;
