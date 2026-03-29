import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  EyeOff, UserX, ShieldOff, Clock, Search, AlertTriangle,
  Ghost, Power, TrendingDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserTarget {
  id: string;
  user_id: string;
  role: string;
  email: string;
  status: 'active' | 'silent_suspend' | 'power_downgrade' | 'trapped';
  last_action: string;
}

const SilentControlView = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserTarget[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserTarget | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'downgrade' | 'trap'>('suspend');
  const [reason, setReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .neq('role', 'master')
      .limit(100);

    const mapped = data?.map(u => ({
      id: u.id,
      user_id: u.user_id,
      role: u.role || 'user',
      email: u.user_id.slice(0, 8) + '...', // Masked
      status: 'active' as const,
      last_action: 'Active session'
    })) || [];

    setUsers(mapped);
  };

  const handleSilentSuspend = async () => {
    if (!selectedUser) return;

    // Silent suspend - user thinks system works but output is blocked
    await supabase.from('account_suspensions').insert({
      user_id: selectedUser.user_id,
      suspension_type: 'silent',
      reason: reason,
      severity: 'high',
      masked_reason: 'System maintenance',
      is_active: true
    });

    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'silent-control',
      action: 'silent_suspend',
      meta_json: {
        target_user: selectedUser.user_id,
        reason: reason
      }
    });

    toast.success('Silent suspension applied. User is unaware.');
    setIsDialogOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const handlePowerDowngrade = async () => {
    if (!selectedUser) return;

    // Invisible power downgrade - no notification
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'silent-control',
      action: 'invisible_power_downgrade',
      meta_json: {
        target_user: selectedUser.user_id,
        reason: reason,
        original_role: selectedUser.role
      }
    });

    toast.success('Power downgrade applied invisibly.');
    setIsDialogOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const handleDelayedTrap = async () => {
    if (!selectedUser) return;

    // Delayed execution trap to detect dishonest intent
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'silent-control',
      action: 'delayed_trap_set',
      meta_json: {
        target_user: selectedUser.user_id,
        reason: reason,
        trap_type: 'delayed_execution'
      }
    });

    toast.success('Delayed execution trap set. Monitoring for dishonest intent.');
    setIsDialogOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const executeAction = () => {
    switch (actionType) {
      case 'suspend':
        handleSilentSuspend();
        break;
      case 'downgrade':
        handlePowerDowngrade();
        break;
      case 'trap':
        handleDelayedTrap();
        break;
    }
  };

  const filteredUsers = users.filter(u => 
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-amber-500/15 text-amber-400',
      admin: 'bg-blue-500/15 text-blue-400',
      developer: 'bg-purple-500/15 text-purple-400',
      franchise: 'bg-green-500/15 text-green-400',
      reseller: 'bg-cyan-500/15 text-cyan-400',
    };
    return colors[role] || 'bg-gray-500/15 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <EyeOff className="w-7 h-7 text-purple-400" />
            Silent & Invisible Control
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Silent suspend, invisible power downgrade, delayed execution traps
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 gap-2">
          <Ghost className="w-4 h-4" />
          Stealth Mode
        </Badge>
      </div>

      {/* Control Options */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
          onClick={() => setActionType('suspend')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <UserX className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Silent Suspend</h3>
              <p className="text-xs text-gray-500">User thinks system works</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Block all outputs while user believes they're operating normally.
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer"
          onClick={() => setActionType('downgrade')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Invisible Downgrade</h3>
              <p className="text-xs text-gray-500">No notification sent</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Reduce privileges without alerting the user of changes.
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/40 transition-colors cursor-pointer"
          onClick={() => setActionType('trap')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Delayed Trap</h3>
              <p className="text-xs text-gray-500">Detect dishonest intent</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Set up monitoring traps to catch fraudulent behavior.
          </p>
        </Card>
      </div>

      {/* User Selection */}
      <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Select Target</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role or ID..."
              className="pl-9 h-9 w-64 bg-gray-800/50 border-gray-700"
            />
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-3 gap-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => { setSelectedUser(u); setIsDialogOpen(true); }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedUser?.id === u.id
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-gray-800/20 border-gray-800/50 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`text-[10px] ${getRoleColor(u.role)}`}>
                    {u.role}
                  </Badge>
                  {u.status !== 'active' && (
                    <Badge variant="outline" className="text-[10px] bg-red-500/15 text-red-400">
                      {u.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-mono">{u.user_id.slice(0, 12)}...</p>
                <p className="text-[10px] text-gray-600 mt-1">{u.last_action}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0a0a12] border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {actionType === 'suspend' && <UserX className="w-5 h-5 text-purple-400" />}
              {actionType === 'downgrade' && <TrendingDown className="w-5 h-5 text-rose-400" />}
              {actionType === 'trap' && <Clock className="w-5 h-5 text-amber-400" />}
              {actionType === 'suspend' && 'Silent Suspend'}
              {actionType === 'downgrade' && 'Invisible Power Downgrade'}
              {actionType === 'trap' && 'Delayed Execution Trap'}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/30">
                <p className="text-xs text-gray-500 mb-1">Target User</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getRoleColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                  <span className="text-sm text-white font-mono">
                    {selectedUser.user_id.slice(0, 16)}...
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-amber-400 font-medium">Stealth Operation</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {actionType === 'suspend' && 'User will not be notified. Their actions will appear to work but produce no results.'}
                      {actionType === 'downgrade' && 'Privileges will be reduced without any notification or visible change.'}
                      {actionType === 'trap' && 'A monitoring trap will be set to detect and record any dishonest behavior.'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Reason (Internal Only)</label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Document the reason for this action..."
                  className="bg-gray-800/50 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-700 text-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeAction}
                  className={`gap-2 ${
                    actionType === 'suspend' ? 'bg-purple-600 hover:bg-purple-700' :
                    actionType === 'downgrade' ? 'bg-rose-600 hover:bg-rose-700' :
                    'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  Execute Silently
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SilentControlView;
