import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shield, UserCheck, UserX, Search, AlertTriangle, Ban, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface RoleEntry {
  id: string;
  userId: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  activatedAt?: Date;
  lastActivity: Date;
  permissions: string[];
}

interface SARoleMonitorProps {
  onActivate: (userId: string, role: string, reason: string) => Promise<boolean>;
  onSuspend: (userId: string, role: string, reason: string) => Promise<boolean>;
}

const SARoleMonitor = ({ onActivate, onSuspend }: SARoleMonitorProps) => {
  const [roles, setRoles] = useState<RoleEntry[]>([
    {
      id: '1',
      userId: 'VALA-1234',
      role: 'admin',
      status: 'active',
      activatedAt: new Date(Date.now() - 86400000 * 30),
      lastActivity: new Date(Date.now() - 3600000),
      permissions: ['user_mgmt', 'approval', 'reports'],
    },
    {
      id: '2',
      userId: 'VALA-5678',
      role: 'franchise',
      status: 'pending',
      lastActivity: new Date(Date.now() - 7200000),
      permissions: ['sales', 'leads', 'commissions'],
    },
    {
      id: '3',
      userId: 'VALA-9999',
      role: 'master_admin',
      status: 'active',
      activatedAt: new Date(Date.now() - 86400000 * 365),
      lastActivity: new Date(),
      permissions: ['full_access'],
    },
    {
      id: '4',
      userId: 'VALA-4455',
      role: 'influencer',
      status: 'suspended',
      activatedAt: new Date(Date.now() - 86400000 * 60),
      lastActivity: new Date(Date.now() - 86400000 * 5),
      permissions: ['referrals', 'commissions'],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleEntry | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'suspend' | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const filteredRoles = roles.filter(role => 
    role.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleAction = async () => {
    if (!selectedRole || !actionType || reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    setProcessing(true);

    const success = actionType === 'activate'
      ? await onActivate(selectedRole.userId, selectedRole.role, reason)
      : await onSuspend(selectedRole.userId, selectedRole.role, reason);

    if (success) {
      setRoles(prev => prev.map(r => 
        r.id === selectedRole.id 
          ? { ...r, status: actionType === 'activate' ? 'active' : 'suspended' }
          : r
      ));
    }

    setSelectedRole(null);
    setReason('');
    setActionType(null);
    setProcessing(false);
  };

  const openActionDialog = (role: RoleEntry, action: 'activate' | 'suspend') => {
    if (role.role === 'master_admin') {
      toast.error('Cannot modify Master Admin role');
      return;
    }
    setSelectedRole(role);
    setActionType(action);
    setReason('');
  };

  const handleCreateRoleLevel = () => {
    toast.error('BLOCKED: Creating new role levels is not permitted');
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Role & Permission Monitor
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground opacity-50 cursor-not-allowed"
              onClick={handleCreateRoleLevel}
            >
              <Ban className="w-4 h-4 mr-1" />
              Create Role Level
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by Vala ID or role..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm">{role.userId}</span>
                      <Badge variant="outline" className="capitalize">
                        {role.role.replace('_', ' ')}
                      </Badge>
                      {getStatusBadge(role.status)}
                      {role.role === 'master_admin' && (
                        <Lock className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {role.permissions.map((perm, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] bg-muted/50">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last active: {role.lastActivity.toLocaleString()}
                    </div>
                  </div>
                  
                  {role.role !== 'master_admin' && (
                    <div className="flex gap-2">
                      {role.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => openActionDialog(role, 'activate')}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      {role.status !== 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => openActionDialog(role, 'suspend')}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRole && !!actionType} onOpenChange={() => {
        setSelectedRole(null);
        setActionType(null);
      }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'activate' ? (
                <UserCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <UserX className="w-5 h-5 text-red-400" />
              )}
              {actionType === 'activate' ? 'Activate Role' : 'Suspend Role'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <div className="flex justify-between items-center">
                <span className="font-mono">{selectedRole?.userId}</span>
                <Badge variant="outline" className="capitalize">
                  {selectedRole?.role.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason (Required - min 10 characters)
              </label>
              <Textarea
                placeholder="Enter detailed reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {actionType === 'suspend' && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Suspending will immediately revoke all permissions
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedRole(null);
              setActionType(null);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={reason.trim().length < 10 || processing}
              className={actionType === 'activate' 
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              {processing ? 'Processing...' : `Confirm ${actionType === 'activate' ? 'Activation' : 'Suspension'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SARoleMonitor;
