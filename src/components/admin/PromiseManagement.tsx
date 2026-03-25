import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Handshake, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Timer,
  Target,
  RefreshCw,
  Eye
} from "lucide-react";

interface PromiseLog {
  id: string;
  developer_id: string;
  task_id: string;
  deadline: string;
  status: string;
  breach_reason: string | null;
  score_effect: number;
  created_at: string;
  updated_at: string;
}

const PromiseManagement = () => {
  const [activeTab, setActiveTab] = useState("active");

  // Fetch promise logs
  const { data: promises, isLoading, refetch } = useQuery({
    queryKey: ['promise-management', activeTab],
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

  // Calculate stats
  const totalPromises = promises?.length || 0;
  const completedPromises = promises?.filter(p => p.status === 'completed').length || 0;
  const breachedPromises = promises?.filter(p => p.status === 'breached').length || 0;
  const activePromises = promises?.filter(p => ['promised', 'in_progress'].includes(p.status)).length || 0;
  const completionRate = totalPromises > 0 ? Math.round((completedPromises / totalPromises) * 100) : 0;

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

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) return { text: 'Overdue', color: 'text-red-400' };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h`, color: 'text-green-400' };
    }
    if (hours > 2) {
      return { text: `${hours}h ${minutes}m`, color: 'text-yellow-400' };
    }
    return { text: `${hours}h ${minutes}m`, color: 'text-orange-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Handshake className="w-6 h-6 text-primary" />
            Promise Management
          </h2>
          <p className="text-muted-foreground">Track and manage all developer task promises</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Promises</p>
                  <p className="text-2xl font-bold">{totalPromises}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-cyan-400">{activePromises}</p>
                </div>
                <Timer className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{completedPromises}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Breached</p>
                  <p className="text-2xl font-bold text-red-400">{breachedPromises}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-primary">{completionRate}%</p>
                <Progress value={completionRate} className="mt-2 h-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'Dev-001', rate: 98, promises: 45 },
                { name: 'Dev-003', rate: 95, promises: 32 },
                { name: 'Dev-007', rate: 92, promises: 28 },
              ].map((dev, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{dev.name}</span>
                    <Badge variant="outline" className="text-xs">{dev.promises} promises</Badge>
                  </div>
                  <span className="text-green-400 font-medium">{dev.rate}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'Dev-012', rate: 65, breaches: 5 },
                { name: 'Dev-008', rate: 72, breaches: 3 },
                { name: 'Dev-015', rate: 78, breaches: 2 },
              ].map((dev, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{dev.name}</span>
                    <Badge variant="destructive" className="text-xs">{dev.breaches} breaches</Badge>
                  </div>
                  <span className="text-red-400 font-medium">{dev.rate}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="active" className="gap-2">
            <Timer className="w-4 h-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="breached" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Breached
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Handshake className="w-4 h-4" />
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Developer</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Time Remaining</TableHead>
                    <TableHead>Score Effect</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : promises?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No promises found
                      </TableCell>
                    </TableRow>
                  ) : (
                    promises?.map((promise) => {
                      const timeInfo = getTimeRemaining(promise.deadline);
                      return (
                        <TableRow key={promise.id}>
                          <TableCell className="font-mono text-xs">
                            {promise.developer_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {promise.task_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{getStatusBadge(promise.status)}</TableCell>
                          <TableCell className="text-xs">
                            {new Date(promise.deadline).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {promise.status === 'completed' || promise.status === 'breached' ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className={`font-medium ${timeInfo.color}`}>
                                {timeInfo.text}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={promise.score_effect >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {promise.score_effect > 0 ? '+' : ''}{promise.score_effect}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromiseManagement;
