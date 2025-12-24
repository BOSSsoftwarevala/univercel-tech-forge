import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, Calendar, Clock, AlertTriangle, CheckCircle, Phone, 
  Mail, MessageSquare, RefreshCw, Plus, Crown, Send, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays, addDays } from 'date-fns';
import { motion } from 'framer-motion';

interface FollowUp {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subscription_tier: string;
  expiry_date: string;
  days_remaining: number;
  follow_up_type: 'expiring' | 'expired' | 'renewal' | 'upgrade';
  status: 'pending' | 'contacted' | 'converted' | 'declined';
  notes: string;
  last_contacted_at: string | null;
  next_follow_up: string | null;
}

export function FollowUpTracker() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('expiring');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [contactMethod, setContactMethod] = useState('email');
  const [contactNotes, setContactNotes] = useState('');

  // Fetch subscriptions and generate follow-ups
  const { data: followUps, isLoading } = useQuery({
    queryKey: ['prime-followups'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('prime_user_profiles')
        .select('*')
        .not('subscription_end_date', 'is', null)
        .order('subscription_end_date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      return profiles?.map(profile => {
        const expiryDate = new Date(profile.subscription_end_date);
        const daysRemaining = differenceInDays(expiryDate, now);
        
        let followUpType: FollowUp['follow_up_type'] = 'renewal';
        if (daysRemaining < 0) followUpType = 'expired';
        else if (daysRemaining <= 7) followUpType = 'expiring';
        else if (profile.subscription_tier === 'monthly') followUpType = 'upgrade';

        return {
          id: profile.id,
          user_id: profile.user_id,
          user_name: profile.full_name || 'Unknown',
          user_email: profile.masked_email || profile.email,
          subscription_tier: profile.subscription_tier,
          expiry_date: profile.subscription_end_date,
          days_remaining: daysRemaining,
          follow_up_type: followUpType,
          status: 'pending' as const,
          notes: '',
          last_contacted_at: null,
          next_follow_up: addDays(now, daysRemaining < 0 ? 1 : Math.min(daysRemaining, 3)).toISOString()
        };
      }).filter(f => f.days_remaining <= 30) as FollowUp[] || [];
    }
  });

  // Filter follow-ups by type
  const filteredFollowUps = followUps?.filter(f => {
    switch (activeTab) {
      case 'expiring': return f.days_remaining > 0 && f.days_remaining <= 7;
      case 'expired': return f.days_remaining < 0;
      case 'upgrade': return f.follow_up_type === 'upgrade';
      case 'all': return true;
      default: return true;
    }
  }) || [];

  // Stats calculation
  const stats = {
    expiringThisWeek: followUps?.filter(f => f.days_remaining > 0 && f.days_remaining <= 7).length || 0,
    expired: followUps?.filter(f => f.days_remaining < 0).length || 0,
    upgradeOpportunities: followUps?.filter(f => f.follow_up_type === 'upgrade').length || 0,
    contacted: followUps?.filter(f => f.status === 'contacted').length || 0
  };

  const handleContact = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setShowContactDialog(true);
  };

  const handleSendFollowUp = () => {
    toast.success(`Follow-up sent via ${contactMethod} to ${selectedFollowUp?.user_email}`);
    setShowContactDialog(false);
    setContactNotes('');
  };

  const getUrgencyBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) return { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (daysRemaining <= 3) return { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (daysRemaining <= 7) return { label: 'Urgent', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'Normal', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring This Week</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.expiringThisWeek}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upgrade Opportunities</p>
                <p className="text-2xl font-bold text-purple-400">{stats.upgradeOpportunities}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-500/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacted Today</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.contacted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500/50" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Follow-ups Tabs */}
      <Card className="bg-card/50 border-amber-500/10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Follow-up Queue
              </CardTitle>
              <TabsList className="bg-muted/30">
                <TabsTrigger value="expiring" className="data-[state=active]:bg-yellow-500/20">
                  Expiring ({stats.expiringThisWeek})
                </TabsTrigger>
                <TabsTrigger value="expired" className="data-[state=active]:bg-red-500/20">
                  Expired ({stats.expired})
                </TabsTrigger>
                <TabsTrigger value="upgrade" className="data-[state=active]:bg-purple-500/20">
                  Upgrade ({stats.upgradeOpportunities})
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-amber-500/20">
                  All
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="border-amber-500/10">
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Next Follow-up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                    </TableCell>
                  </TableRow>
                ) : filteredFollowUps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No follow-ups in this category
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFollowUps.map((followUp) => {
                    const urgency = getUrgencyBadge(followUp.days_remaining);
                    return (
                      <TableRow key={followUp.id} className="border-amber-500/10 hover:bg-amber-500/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                              <Crown className="w-5 h-5 text-stone-900" />
                            </div>
                            <div>
                              <p className="font-medium">{followUp.user_name}</p>
                              <p className="text-xs text-muted-foreground">{followUp.user_email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500/20 text-amber-400">
                            {followUp.subscription_tier?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {format(new Date(followUp.expiry_date), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={urgency.color}>
                            {urgency.label}
                            {followUp.days_remaining >= 0 && ` (${followUp.days_remaining}d)`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {followUp.next_follow_up && (
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(followUp.next_follow_up), 'MMM dd')}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleContact(followUp)}
                              className="hover:bg-amber-500/10 hover:text-amber-400"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Contact
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Tabs>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Bulk Email</h3>
              <p className="text-sm text-muted-foreground">Send renewal reminders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">Call Queue</h3>
              <p className="text-sm text-muted-foreground">Priority call list</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">WhatsApp Blast</h3>
              <p className="text-sm text-muted-foreground">Send offer messages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-500" />
              Contact {selectedFollowUp?.user_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="font-medium">{selectedFollowUp?.user_name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedFollowUp?.user_email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-amber-500/20 text-amber-400">
                  {selectedFollowUp?.subscription_tier}
                </Badge>
                <Badge className={getUrgencyBadge(selectedFollowUp?.days_remaining || 0).color}>
                  {selectedFollowUp?.days_remaining}d remaining
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact Method</Label>
              <Select value={contactMethod} onValueChange={setContactMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Call
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                rows={4}
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                placeholder="Add notes about this follow-up..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendFollowUp}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
