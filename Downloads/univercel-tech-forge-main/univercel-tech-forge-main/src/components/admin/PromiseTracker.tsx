import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Handshake, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingDown,
  TrendingUp,
  User,
  Filter,
  Search,
  Ban,
  Shield,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

interface PromiseLog {
  id: string;
  developer_id: string;
  task_id: string;
  promise_time: string;
  deadline: string;
  finished_time: string | null;
  breach_reason: string | null;
  score_effect: number;
  status: string;
  fine_amount: number;
  created_at: string;
}

interface PromiseFine {
  id: string;
  promise_id: string;
  developer_id: string;
  fine_amount: number;
  fine_reason: string;
  fine_type: string;
  status: string;
  applied_at: string;
  paid_at: string | null;
  waived_at: string | null;
  waiver_reason: string | null;
}

const PromiseTracker = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromise, setSelectedPromise] = useState<PromiseLog | null>(null);
  const [showFineDialog, setShowFineDialog] = useState(false);
  const [showWaiveDialog, setShowWaiveDialog] = useState(false);
  const [selectedFine, setSelectedFine] = useState<PromiseFine | null>(null);
  const [waiveReason, setWaiveReason] = useState('');
  const queryClient = useQueryClient();

  // Fetch all promises
  const { data: promises, isLoading } = useQuery({
    queryKey: ['promise-tracker', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('promise_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab === 'active') {
        query = query.in('status', ['promised', 'in_progress']);
      } else if (activeTab === 'completed') {
        query = query.eq('status', 'completed');
      } else if (activeTab === 'breached') {
        query = query.eq('status', 'breached');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PromiseLog[];
    }
  });

  // Fetch all fines
  const { data: fines } = useQuery({
    queryKey: ['promise-fines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_fines')
        .select('*')
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data as PromiseFine[];
    }
  });

  // Waive fine mutation
  const waiveFineMutation = useMutation({
    mutationFn: async ({ fineId, reason }: { fineId: string; reason: string }) => {
      const { error } = await supabase
        .from('promise_fines')
        .update({
          status: 'waived',
          waived_at: new Date().toISOString(),
          waiver_reason: reason
        })
        .eq('id', fineId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promise-fines'] });
      toast.success('Fine waived successfully');
      setShowWaiveDialog(false);
      setWaiveReason('');
    },
    onError: () => {
      toast.error('Failed to waive fine');
    }
  });

  // Calculate stats
  const totalPromises = promises?.length || 0;
  const activePromises = promises?.filter(p => ['promised', 'in_progress'].includes(p.status)).length || 0;
  const completedPromises = promises?.filter(p => p.status === 'completed').length || 0;
  const breachedPromises = promises?.filter(p => p.status === 'breached').length || 0;
  const completionRate = totalPromises > 0 ? Math.round((completedPromises / totalPromises) * 100) : 0;
  const totalFines = fines?.reduce((sum, f) => sum + (f.status === 'pending' ? f.fine_amount : 0), 0) || 0;
  const pendingFines = fines?.filter(f => f.status === 'pending').length || 0;

  // Get breach offenders
  const breachOffenders = promises
    ?.filter(p => p.status === 'breached')
    .reduce((acc, p) => {
      const existing = acc.find(x => x.developer_id === p.developer_id);
      if (existing) {
        existing.breachCount++;
        existing.totalFines += p.fine_amount || 0;
      } else {
        acc.push({
          developer_id: p.developer_id,
          breachCount: 1,
          totalFines: p.fine_amount || 0
        });
      }
      return acc;
    }, [] as { developer_id: string; breachCount: number; totalFines: number }[])
    .sort((a, b) => b.breachCount - a.breachCount)
    .slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'promised':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Promised</Badge>;
      case 'in_progress':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'breached':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Breached</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTimeStatus = (deadline: string, status: string) => {
    if (status === 'completed' || status === 'breached') return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) {
      return { text: 'Overdue', color: 'text-red-400', urgent: true };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 2) {
      return { text: `${Math.floor(diff / 60000)}m left`, color: 'text-red-400', urgent: true };
    }
    if (hours < 8) {
      return { text: `${hours}h left`, color: 'text-amber-400', urgent: false };
    }
    return { text: `${hours}h left`, color: 'text-green-400', urgent: false };
  };

  const filteredPromises = promises?.filter(p => 
    p.developer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.task_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Handshake className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Promises</p>
                <p className="text-2xl font-bold">{totalPromises}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activePromises}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedPromises}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Breached</p>
                <p className="text-2xl font-bold text-red-400">{breachedPromises}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <DollarSign className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Fines</p>
                <p className="text-2xl font-bold text-red-400">₹{totalFines}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Promise List */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-primary" />
                Promise Tracker
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48 h-8 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['promise-tracker'] })}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="breached" className="text-red-400">Breached</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Developer</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Fine</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : filteredPromises?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No promises found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPromises?.map((promise) => {
                        const timeStatus = getTimeStatus(promise.deadline, promise.status);
                        return (
                          <TableRow 
                            key={promise.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedPromise(promise)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-mono text-xs">
                                  {promise.developer_id.slice(0, 8)}...
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {promise.task_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(promise.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs">
                                  {format(new Date(promise.deadline), 'MMM d, HH:mm')}
                                </span>
                                {timeStatus && (
                                  <span className={`text-xs ${timeStatus.color}`}>
                                    {timeStatus.text}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {promise.fine_amount > 0 ? (
                                <Badge variant="destructive" className="text-xs">
                                  ₹{promise.fine_amount}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Breach Offenders & Fines */}
        <div className="space-y-6">
          {/* Top Breach Offenders */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Breach Offenders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {breachOffenders.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No breaches recorded
                </div>
              ) : (
                <div className="space-y-3">
                  {breachOffenders.map((offender, idx) => (
                    <motion.div
                      key={offender.developer_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="font-mono text-xs">
                            {offender.developer_id.slice(0, 12)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {offender.breachCount} breaches
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        ₹{offender.totalFines}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Fines */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Pending Fines ({pendingFines})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {fines?.filter(f => f.status === 'pending').length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No pending fines
                  </div>
                ) : (
                  <div className="space-y-2">
                    {fines?.filter(f => f.status === 'pending').map((fine) => (
                      <div
                        key={fine.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div>
                          <p className="font-mono text-xs">
                            {fine.developer_id.slice(0, 12)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fine.fine_reason.slice(0, 30)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">₹{fine.fine_amount}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFine(fine);
                              setShowWaiveDialog(true);
                            }}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Waive Fine Dialog */}
      <Dialog open={showWaiveDialog} onOpenChange={setShowWaiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waive Fine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm">
                You are about to waive a fine of <strong>₹{selectedFine?.fine_amount}</strong>
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Reason for waiving</label>
              <Textarea
                value={waiveReason}
                onChange={(e) => setWaiveReason(e.target.value)}
                placeholder="Enter reason..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWaiveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedFine && waiveReason) {
                  waiveFineMutation.mutate({ fineId: selectedFine.id, reason: waiveReason });
                }
              }}
              disabled={!waiveReason || waiveFineMutation.isPending}
            >
              Waive Fine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromiseTracker;
