import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Brain, 
  Cpu, 
  Zap, 
  DollarSign,
  Activity,
  Shield,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Settings,
  Users,
  Clock
} from "lucide-react";

interface AIUsageLog {
  id: string;
  user_id: string;
  module: string;
  provider: string;
  tokens_used: number;
  base_cost: number;
  final_cost: number;
  management_fee: number;
  created_at: string;
}

const AIManagementCenter = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiEnabled, setAiEnabled] = useState(true);

  // Fetch AI usage logs
  const { data: usageLogs, isLoading } = useQuery({
    queryKey: ['ai-usage-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AIUsageLog[];
    }
  });

  // Fetch AI billing statements
  const { data: billingStatements } = useQuery({
    queryKey: ['ai-billing-statements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_billing_statements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch AI fraud detection
  const { data: fraudAlerts } = useQuery({
    queryKey: ['ai-fraud-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_fraud_detection')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate stats
  const totalTokens = usageLogs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;
  const totalCost = usageLogs?.reduce((sum, log) => sum + (log.final_cost || 0), 0) || 0;
  const totalFees = usageLogs?.reduce((sum, log) => sum + (log.management_fee || 0), 0) || 0;
  const pendingFraudAlerts = fraudAlerts?.length || 0;

  const moduleStats = usageLogs?.reduce((acc, log) => {
    if (!acc[log.module]) {
      acc[log.module] = { count: 0, tokens: 0, cost: 0 };
    }
    acc[log.module].count++;
    acc[log.module].tokens += log.tokens_used || 0;
    acc[log.module].cost += log.final_cost || 0;
    return acc;
  }, {} as Record<string, { count: number; tokens: number; cost: number }>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI Management Center
          </h2>
          <p className="text-muted-foreground">Monitor and control AI usage across the platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">AI System</span>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
            <Badge variant={aiEnabled ? 'default' : 'destructive'}>
              {aiEnabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                  <p className="text-2xl font-bold">{formatNumber(totalTokens)}</p>
                </div>
                <Cpu className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(totalCost)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mgmt Fees</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalFees)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Calls</p>
                  <p className="text-2xl font-bold text-cyan-400">{usageLogs?.length || 0}</p>
                </div>
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className={`bg-card/50 ${pendingFraudAlerts > 0 ? 'border-red-500/30' : 'border-white/10'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fraud Alerts</p>
                  <p className={`text-2xl font-bold ${pendingFraudAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {pendingFraudAlerts}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Module Usage */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            AI Usage by Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(moduleStats || {}).map(([module, stats]) => (
              <div key={module} className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{module.replace('_', ' ')}</span>
                  <Badge variant="outline">{stats.count} calls</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Tokens: {formatNumber(stats.tokens)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cost: {formatCurrency(stats.cost)}
                  </p>
                </div>
                <Progress 
                  value={(stats.tokens / totalTokens) * 100} 
                  className="mt-2 h-1" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" />
            Live Usage
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="fraud" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="limits" className="gap-2">
            <Settings className="w-4 h-4" />
            Limits & Quotas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : usageLogs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No AI usage logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    usageLogs?.slice(0, 20).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {log.user_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {log.module.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {log.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatNumber(log.tokens_used || 0)}</TableCell>
                        <TableCell className="text-green-400">
                          {formatCurrency(log.final_cost || 0)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle>Billing Statements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingStatements?.map((statement: any) => (
                  <div key={statement.id} className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{statement.statement_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(statement.period_start).toLocaleDateString()} - {new Date(statement.period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">{formatCurrency(statement.total_final_cost)}</p>
                        <Badge variant={statement.status === 'processed' ? 'default' : 'secondary'}>
                          {statement.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">No billing statements</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Fraud Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fraudAlerts?.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-green-400 mb-2" />
                  <p className="text-muted-foreground">No fraud alerts detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fraudAlerts?.map((alert: any) => (
                    <div key={alert.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-400">{alert.detection_type}</p>
                          <p className="text-sm text-muted-foreground">{alert.details?.message || 'Suspicious activity detected'}</p>
                        </div>
                        <Badge variant="destructive">{alert.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Token Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { role: 'Developer', daily: 10000, used: 4500 },
                  { role: 'Reseller', daily: 5000, used: 2100 },
                  { role: 'Franchise', daily: 15000, used: 8900 },
                  { role: 'Client', daily: 1000, used: 350 },
                ].map((limit) => (
                  <div key={limit.role} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{limit.role}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(limit.used)} / {formatNumber(limit.daily)}
                      </span>
                    </div>
                    <Progress value={(limit.used / limit.daily) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Rate Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { endpoint: 'Chat Completion', rpm: 60, current: 23 },
                  { endpoint: 'Embeddings', rpm: 100, current: 45 },
                  { endpoint: 'Analysis', rpm: 30, current: 12 },
                  { endpoint: 'Generation', rpm: 20, current: 8 },
                ].map((limit) => (
                  <div key={limit.endpoint} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm">{limit.endpoint}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {limit.current}/{limit.rpm} RPM
                      </span>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIManagementCenter;
