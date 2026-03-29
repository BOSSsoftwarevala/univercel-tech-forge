// ==============================================
// Admin User & Partner Status
// View Profiles - Activate/Suspend - Policy-Based
// Permanent Delete BLOCKED - Wallet Edit BLOCKED
// ==============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, Search, Eye, UserCheck, UserX, 
  Trash2, Wallet, AlertTriangle, Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  valaId: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
  lastActive: string;
  complianceScore: number;
  region: string;
}

export function AdminUserPartnerStatus() {
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: 'user-001',
      valaId: 'VL-****1234',
      role: 'franchise',
      status: 'active',
      joinedAt: '2023-06-15',
      lastActive: '2024-01-30 14:30',
      complianceScore: 95,
      region: 'US-East',
    },
    {
      id: 'user-002',
      valaId: 'VL-****5678',
      role: 'reseller',
      status: 'active',
      joinedAt: '2023-09-20',
      lastActive: '2024-01-30 12:15',
      complianceScore: 88,
      region: 'EU-West',
    },
    {
      id: 'user-003',
      valaId: 'VL-****9012',
      role: 'influencer',
      status: 'suspended',
      joinedAt: '2023-11-10',
      lastActive: '2024-01-25 09:00',
      complianceScore: 45,
      region: 'APAC',
    },
    {
      id: 'user-004',
      valaId: 'VL-****3456',
      role: 'client',
      status: 'pending',
      joinedAt: '2024-01-28',
      lastActive: '2024-01-30 10:45',
      complianceScore: 100,
      region: 'US-West',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [suspendReason, setSuspendReason] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'franchise': return 'bg-purple-500/20 text-purple-400';
      case 'reseller': return 'bg-blue-500/20 text-blue-400';
      case 'influencer': return 'bg-pink-500/20 text-pink-400';
      case 'client': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleActivate = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active' as const } : u
    ));
    toast.success('User activated');
  };

  const handleSuspend = (userId: string) => {
    if (!suspendReason.trim()) {
      toast.error('Suspension reason is required (policy-based)');
      return;
    }

    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'suspended' as const } : u
    ));
    setSuspendReason('');
    setSelectedUser(null);
    toast.success('User suspended with policy reference');
  };

  const handleDelete = () => {
    toast.error('BLOCKED: Permanent deletion not allowed for Admin. Escalate to Super Admin.');
  };

  const handleWalletEdit = () => {
    toast.error('BLOCKED: Wallet editing not allowed for Admin role.');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.valaId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          User & Partner Status
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            <Trash2 className="h-3 w-3 mr-1" />
            Delete Blocked
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            <Wallet className="h-3 w-3 mr-1" />
            Wallet Edit Blocked
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Vala ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="franchise">Franchise</SelectItem>
            <SelectItem value="reseller">Reseller</SelectItem>
            <SelectItem value="influencer">Influencer</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map(user => (
          <Card key={user.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{user.valaId}</span>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Region: {user.region}</span>
                      <span>Joined: {user.joinedAt}</span>
                      <span>Last Active: {user.lastActive}</span>
                      <span className={user.complianceScore < 60 ? 'text-red-400' : ''}>
                        Compliance: {user.complianceScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                      <DialogHeader>
                        <DialogTitle>Profile: {user.valaId}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-muted-foreground">Role:</span> {user.role}</div>
                          <div><span className="text-muted-foreground">Status:</span> {user.status}</div>
                          <div><span className="text-muted-foreground">Region:</span> {user.region}</div>
                          <div><span className="text-muted-foreground">Compliance:</span> {user.complianceScore}%</div>
                          <div><span className="text-muted-foreground">Joined:</span> {user.joinedAt}</div>
                          <div><span className="text-muted-foreground">Last Active:</span> {user.lastActive}</div>
                        </div>
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            Wallet information and PII are not visible to Admin role.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {user.status === 'suspended' ? (
                    <Button
                      size="sm"
                      onClick={() => handleActivate(user.id)}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                  ) : user.status === 'pending' ? (
                    <Button
                      size="sm"
                      onClick={() => handleActivate(user.id)}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  ) : (
                    <>
                      {selectedUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <Textarea
                            placeholder="Policy-based reason..."
                            value={suspendReason}
                            onChange={e => setSuspendReason(e.target.value)}
                            className="h-8 w-48 text-xs"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleSuspend(user.id)}
                            className="text-xs"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedUser(null)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user.id)}
                          className="text-xs"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Suspend
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled
                    className="text-xs text-muted-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
