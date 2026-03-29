import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  Search, CreditCard, Calendar, TrendingUp, RefreshCw, 
  CheckCircle, XCircle, Clock, AlertTriangle, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

interface Subscription {
  sub_id: string;
  user_id: string;
  plan: string;
  amount: number;
  validity: number;
  status: string;
  activated_at: string;
  expired_at: string;
  created_at: string;
}

export function SubscriptionManager() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    user_id: '',
    plan: 'monthly',
    amount: 4999
  });

  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions', searchQuery, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Subscription[];
    }
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: typeof newSubscription) => {
      const validity = data.plan === 'monthly' ? 30 : data.plan === 'yearly' ? 365 : 36500;
      const { error } = await supabase.from('subscriptions').insert({
        user_id: data.user_id,
        plan: data.plan,
        amount: data.amount,
        validity,
        status: 'active',
        activated_at: new Date().toISOString(),
        expired_at: new Date(Date.now() + validity * 24 * 60 * 60 * 1000).toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Subscription created successfully');
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['prime-stats'] });
      setShowCreateDialog(false);
    },
    onError: (error) => {
      toast.error(`Failed to create subscription: ${error.message}`);
    }
  });

  // Update subscription status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('sub_id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Subscription status updated');
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: typeof CheckCircle }> = {
      active: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
      expired: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      cancelled: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: XCircle },
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock }
    };
    const { color, icon: Icon } = config[status] || config.pending;
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      monthly: 'bg-blue-500/20 text-blue-400',
      yearly: 'bg-amber-500/20 text-amber-400',
      lifetime: 'bg-purple-500/20 text-purple-400'
    };
    return colors[plan] || colors.monthly;
  };

  const getDaysRemaining = (expiredAt: string) => {
    const days = differenceInDays(new Date(expiredAt), new Date());
    if (days < 0) return { text: 'Expired', color: 'text-red-400' };
    if (days <= 7) return { text: `${days} days`, color: 'text-yellow-400' };
    return { text: `${days} days`, color: 'text-emerald-400' };
  };

  // Calculate summary stats
  const stats = {
    totalActive: subscriptions?.filter(s => s.status === 'active').length || 0,
    totalRevenue: subscriptions?.reduce((sum, s) => sum + Number(s.amount || 0), 0) || 0,
    expiringWeek: subscriptions?.filter(s => {
      const days = differenceInDays(new Date(s.expired_at), new Date());
      return s.status === 'active' && days >= 0 && days <= 7;
    }).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.totalActive}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500/50" />
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-amber-400">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-500/50" />
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring This Week</p>
              <p className="text-2xl font-bold text-red-400">{stats.expiringWeek}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500/50" />
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/30 border-amber-500/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Subscription
        </Button>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-card/50 border-amber-500/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-500/10">
                <TableHead>Subscription ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Days Remaining</TableHead>
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
              ) : subscriptions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions?.map((sub) => {
                  const remaining = getDaysRemaining(sub.expired_at);
                  return (
                    <TableRow key={sub.sub_id} className="border-amber-500/10 hover:bg-amber-500/5">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-500" />
                          <span className="font-mono text-sm">{sub.sub_id.slice(0, 8)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanBadge(sub.plan)}>
                          {sub.plan?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{Number(sub.amount).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {sub.activated_at ? format(new Date(sub.activated_at), 'MMM dd, yyyy') : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={remaining.color}>{remaining.text}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status === 'active' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateStatusMutation.mutate({ id: sub.sub_id, status: 'cancelled' })}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              Cancel
                            </Button>
                          )}
                          {sub.status === 'expired' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateStatusMutation.mutate({ id: sub.sub_id, status: 'active' })}
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            >
                              Renew
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Subscription Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              Create Subscription
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                value={newSubscription.user_id}
                onChange={(e) => setNewSubscription({ ...newSubscription, user_id: e.target.value })}
                placeholder="Enter user UUID"
              />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select 
                value={newSubscription.plan} 
                onValueChange={(v) => {
                  const amounts: Record<string, number> = { monthly: 4999, yearly: 49999, lifetime: 199999 };
                  setNewSubscription({ ...newSubscription, plan: v, amount: amounts[v] });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly - ₹4,999</SelectItem>
                  <SelectItem value="yearly">Yearly - ₹49,999</SelectItem>
                  <SelectItem value="lifetime">Lifetime - ₹1,99,999</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={newSubscription.amount}
                onChange={(e) => setNewSubscription({ ...newSubscription, amount: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createSubscriptionMutation.mutate(newSubscription)}
              disabled={createSubscriptionMutation.isPending || !newSubscription.user_id}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
            >
              {createSubscriptionMutation.isPending ? 'Creating...' : 'Create Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
