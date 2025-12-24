import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Search, Plus, Edit, Crown, Star, Zap, Shield, 
  Calendar, User, RefreshCw, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PrimeUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  masked_email: string;
  subscription_tier: string;
  subscription_status: string;
  subscription_start_date: string;
  subscription_end_date: string;
  auto_renewal: boolean;
  vip_badge_enabled: boolean;
  priority_level: number;
  region: string;
  created_at: string;
}

export function PrimeUsersList() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PrimeUser | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subscription_tier: 'monthly',
    region: 'india',
    priority_level: 1,
    vip_badge_enabled: true,
    auto_renewal: true
  });

  // Fetch prime users
  const { data: primeUsers, isLoading } = useQuery({
    queryKey: ['prime-users', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('prime_user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PrimeUser[];
    }
  });

  // Add prime user mutation
  const addUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const validityDays = data.subscription_tier === 'monthly' ? 30 : data.subscription_tier === 'yearly' ? 365 : 36500;
      const { error } = await supabase.from('prime_user_profiles').insert([{
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        subscription_tier: data.subscription_tier,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString(),
        auto_renewal: data.auto_renewal,
        vip_badge_enabled: data.vip_badge_enabled,
        priority_level: data.priority_level,
        region: data.region
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Prime user added successfully');
      queryClient.invalidateQueries({ queryKey: ['prime-users'] });
      queryClient.invalidateQueries({ queryKey: ['prime-stats'] });
      setShowAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to add user: ${error.message}`);
    }
  });

  // Update prime user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<PrimeUser> }) => {
      const { error } = await supabase
        .from('prime_user_profiles')
        .update(data.updates)
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Prime user updated successfully');
      queryClient.invalidateQueries({ queryKey: ['prime-users'] });
      setShowEditDialog(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      subscription_tier: 'monthly',
      region: 'india',
      priority_level: 1,
      vip_badge_enabled: true,
      auto_renewal: true
    });
  };

  const handleEdit = (user: PrimeUser) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      monthly: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      yearly: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      lifetime: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      trial: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[tier] || colors.monthly;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      expired: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search prime users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/30 border-amber-500/20"
          />
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Prime User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="bg-card/50 border-amber-500/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-500/10 hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>VIP Badge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                  </TableCell>
                </TableRow>
              ) : primeUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No prime users found
                  </TableCell>
                </TableRow>
              ) : (
                primeUsers?.map((user) => (
                  <TableRow key={user.id} className="border-amber-500/10 hover:bg-amber-500/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <Crown className="w-5 h-5 text-stone-900" />
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{user.masked_email || user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierBadge(user.subscription_tier)}>
                        {user.subscription_tier?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(user.subscription_status)}>
                        {user.subscription_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: user.priority_level || 1 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.subscription_end_date ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {format(new Date(user.subscription_end_date), 'MMM dd, yyyy')}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {user.vip_badge_enabled ? (
                        <Badge className="bg-amber-500/20 text-amber-400">
                          <Shield className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          className="hover:bg-amber-500/10 hover:text-amber-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-amber-500/10 hover:text-amber-400"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Add Prime User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <Select 
                  value={formData.subscription_tier} 
                  onValueChange={(v) => setFormData({ ...formData, subscription_tier: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select 
                  value={formData.priority_level.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, priority_level: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select 
                value={formData.region} 
                onValueChange={(v) => setFormData({ ...formData, region: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="uae">UAE</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>VIP Badge</Label>
              <Switch
                checked={formData.vip_badge_enabled}
                onCheckedChange={(v) => setFormData({ ...formData, vip_badge_enabled: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto Renewal</Label>
              <Switch
                checked={formData.auto_renewal}
                onCheckedChange={(v) => setFormData({ ...formData, auto_renewal: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => addUserMutation.mutate(formData)}
              disabled={addUserMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
            >
              {addUserMutation.isPending ? 'Adding...' : 'Add User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-amber-500" />
              Edit Prime User
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subscription Tier</Label>
                  <Select 
                    value={selectedUser.subscription_tier} 
                    onValueChange={(v) => setSelectedUser({ ...selectedUser, subscription_tier: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={selectedUser.subscription_status} 
                    onValueChange={(v) => setSelectedUser({ ...selectedUser, subscription_status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select 
                  value={selectedUser.priority_level?.toString() || '1'} 
                  onValueChange={(v) => setSelectedUser({ ...selectedUser, priority_level: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>VIP Badge</Label>
                <Switch
                  checked={selectedUser.vip_badge_enabled}
                  onCheckedChange={(v) => setSelectedUser({ ...selectedUser, vip_badge_enabled: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto Renewal</Label>
                <Switch
                  checked={selectedUser.auto_renewal}
                  onCheckedChange={(v) => setSelectedUser({ ...selectedUser, auto_renewal: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedUser && updateUserMutation.mutate({
                id: selectedUser.id,
                updates: {
                  subscription_tier: selectedUser.subscription_tier,
                  subscription_status: selectedUser.subscription_status,
                  priority_level: selectedUser.priority_level,
                  vip_badge_enabled: selectedUser.vip_badge_enabled,
                  auto_renewal: selectedUser.auto_renewal
                }
              })}
              disabled={updateUserMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
