import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Power, Zap, Lock, PlayCircle } from 'lucide-react';
import {
  killAll,
  killAiOnly,
  lockWallet,
  resume,
  getEmergencyState,
} from '@/routes/emergency';

interface EmergencyState {
  killAll: boolean;
  killAi: boolean;
  walletLocked: boolean;
  isEmergency: boolean;
}

interface Props {
  tenantId: string;
  userId: string;
}

export default function EmergencyControl({ tenantId, userId }: Props) {
  const [state, setState] = useState<EmergencyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [executing, setExecuting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await getEmergencyState(tenantId);
    if (err) { setError(err.message); setLoading(false); return; }
    setState(data as EmergencyState);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const openConfirm = (action: string) => {
    setPendingAction(action);
    setReason('');
    setConfirmText('');
  };

  const handleExecute = async () => {
    if (confirmText !== 'CONFIRM') { alert('Type CONFIRM to proceed'); return; }
    if (!reason.trim()) { alert('Reason is required'); return; }
    setExecuting(true);
    try {
      if (pendingAction === 'kill_all') await killAll(tenantId, userId, reason);
      else if (pendingAction === 'kill_ai') await killAiOnly(tenantId, userId, reason);
      else if (pendingAction === 'lock_wallet') await lockWallet(tenantId, userId, reason);
      else if (pendingAction === 'resume') await resume(tenantId, userId, reason);
    } catch (e: any) {
      alert(e.message);
    }
    setExecuting(false);
    setPendingAction(null);
    load();
  };

  if (loading) return (
    <Card><CardContent className="p-6 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</CardContent></Card>
  );

  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  const isEmergency = state?.isEmergency ?? false;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className={`w-7 h-7 ${isEmergency ? 'text-red-600 animate-pulse' : 'text-muted-foreground'}`} />
        <h2 className="text-2xl font-bold">Emergency Control</h2>
        <Badge variant={isEmergency ? 'destructive' : 'default'} className="ml-2">
          {isEmergency ? 'EMERGENCY MODE' : 'Normal'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={state?.killAll ? 'border-red-400 bg-red-50' : ''}>
          <CardContent className="p-4 flex items-center gap-3">
            <Power className={`w-5 h-5 ${state?.killAll ? 'text-red-600' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-semibold text-sm">Kill All</p>
              <Badge variant={state?.killAll ? 'destructive' : 'secondary'}>{state?.killAll ? 'ACTIVE' : 'OFF'}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className={state?.killAi ? 'border-orange-400 bg-orange-50' : ''}>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className={`w-5 h-5 ${state?.killAi ? 'text-orange-600' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-semibold text-sm">Kill AI</p>
              <Badge variant={state?.killAi ? 'destructive' : 'secondary'}>{state?.killAi ? 'ACTIVE' : 'OFF'}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className={state?.walletLocked ? 'border-yellow-400 bg-yellow-50' : ''}>
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className={`w-5 h-5 ${state?.walletLocked ? 'text-yellow-600' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-semibold text-sm">Wallet</p>
              <Badge variant={state?.walletLocked ? 'secondary' : 'default'}>{state?.walletLocked ? 'LOCKED' : 'UNLOCKED'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="destructive"
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white font-bold"
          onClick={() => openConfirm('kill_all')}
        >
          <Power className="w-5 h-5 mr-2" />KILL ALL
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => openConfirm('kill_ai')}
        >
          <Zap className="w-5 h-5 mr-2" />Kill AI Only
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
          onClick={() => openConfirm('lock_wallet')}
        >
          <Lock className="w-4 h-4 mr-2" />Lock Wallet
        </Button>
        {isEmergency && (
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={() => openConfirm('resume')}
          >
            <PlayCircle className="w-5 h-5 mr-2" />RESUME
          </Button>
        )}
      </div>

      <Dialog open={pendingAction !== null} onOpenChange={open => { if (!open) setPendingAction(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm: {pendingAction?.replace('_', ' ').toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This action will affect all active services. Please provide a reason and confirm.</p>
            <div>
              <Label>Reason <span className="text-red-500">*</span></Label>
              <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the reason for this action" />
            </div>
            <div>
              <Label>Type <span className="font-mono font-bold">CONFIRM</span> to proceed</Label>
              <Input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="CONFIRM" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingAction(null)}>Cancel</Button>
            <Button
              variant={pendingAction === 'resume' ? 'default' : 'destructive'}
              onClick={handleExecute}
              disabled={executing || confirmText !== 'CONFIRM' || !reason.trim()}
              className={pendingAction === 'resume' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {executing ? 'Executing…' : `Execute ${pendingAction?.replace('_', ' ').toUpperCase()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
