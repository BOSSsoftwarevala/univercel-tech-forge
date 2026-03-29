import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Shield, 
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { cn } from '@/lib/utils';
import type { 
  IssueStats, 
  IssueTrend, 
  CategoryDistribution, 
  OperationalHealth,
  FinancialSignals,
  ComplianceRisk,
  FranchiseProfile 
} from './types';

interface FranchiseDataDashboardProps {
  franchise: FranchiseProfile | null;
  stats: IssueStats;
  issueTrends: IssueTrend[];
  categoryDistribution: CategoryDistribution[];
  operationalHealth: OperationalHealth;
  financialSignals: FinancialSignals;
  complianceRisk: ComplianceRisk;
}

const CATEGORY_COLORS = {
  operations: '#3b82f6',
  finance: '#10b981',
  staff: '#f59e0b',
  supply: '#8b5cf6',
  tech: '#06b6d4',
  compliance: '#ef4444',
  customer: '#ec4899'
};

export function FranchiseDataDashboard({
  franchise,
  stats,
  issueTrends,
  categoryDistribution,
  operationalHealth,
  financialSignals,
  complianceRisk
}: FranchiseDataDashboardProps) {
  if (!franchise) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Select a Franchise</h3>
          <p className="text-sm text-muted-foreground/70">Choose a franchise from the sidebar to view intelligence data</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Open Issues', value: stats.totalOpen, icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Critical Issues', value: stats.critical, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Avg Resolution', value: stats.avgResolutionTime, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Revenue Impact', value: `₹${stats.revenueImpact.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Compliance', value: `${stats.complianceScore}%`, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Performance', value: `${stats.performanceScore}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="flex-1 overflow-auto p-6 bg-background/50">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {franchise.franchiseCode} - Intelligence Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">{franchise.businessName} • {franchise.city}, {franchise.region}</p>
      </div>

      {/* Top Row - KPI Stats */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="p-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", kpi.bg)}>
                  <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Issue Trend - Time Based (Span 8) */}
        <Card className="col-span-8 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Issue Trend (Open vs Closed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={issueTrends}>
                <defs>
                  <linearGradient id="openGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="open" stroke="#ef4444" fill="url(#openGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="closed" stroke="#10b981" fill="url(#closedGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution (Span 4) */}
        <Card className="col-span-4 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Issue Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="count"
                  nameKey="category"
                  label={({ category, percentage }) => `${category.slice(0, 3)} ${percentage}%`}
                  labelLine={false}
                >
                  {categoryDistribution.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operational Health (Span 4) */}
        <Card className="col-span-4 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Operational Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Daily Activity Volume</span>
                <span className="font-medium">{operationalHealth.dailyActivityVolume}</span>
              </div>
              <Progress value={Math.min(operationalHealth.dailyActivityVolume, 100)} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xl font-bold text-amber-400">{operationalHealth.missedTasks}</p>
                <p className="text-xs text-muted-foreground">Missed Tasks</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xl font-bold text-red-400">{operationalHealth.slaBreaches}</p>
                <p className="text-xs text-muted-foreground">SLA Breaches</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xl font-bold text-emerald-400">{operationalHealth.uptime}%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance vs Target (Span 4) */}
        <Card className="col-span-4 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Performance vs Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={[
                { metric: 'Sales', actual: 78, target: 100 },
                { metric: 'Footfall', actual: 85, target: 100 },
                { metric: 'Growth', actual: 65, target: 100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#374151" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Financial Signals (Span 4) */}
        <Card className="col-span-4 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Financial Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue Trend</span>
              <div className="flex items-center gap-1">
                {financialSignals.revenueTrend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={cn(
                  "font-medium",
                  financialSignals.revenueTrend >= 0 ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {financialSignals.revenueTrend >= 0 ? '+' : ''}{financialSignals.revenueTrend}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expense Anomalies</span>
              <Badge variant={financialSignals.expenseAnomalies > 0 ? 'destructive' : 'secondary'}>
                {financialSignals.expenseAnomalies}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Delays</span>
              <Badge variant={financialSignals.paymentDelays > 2 ? 'destructive' : 'secondary'}>
                {financialSignals.paymentDelays}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Projected Revenue</span>
              <span className="font-medium text-foreground">₹{financialSignals.projectedRevenue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Risk (Span 6) */}
        <Card className="col-span-6 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              Compliance & Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="35" 
                      stroke={complianceRisk.auditScore >= 80 ? '#10b981' : complianceRisk.auditScore >= 60 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="6" 
                      fill="none"
                      strokeDasharray={`${complianceRisk.auditScore * 2.2} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {complianceRisk.auditScore}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Audit Score</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-muted/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-400">{complianceRisk.violations}</p>
                <p className="text-xs text-muted-foreground">Violations</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-muted/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-amber-400">{complianceRisk.escalationRisk}%</p>
                <p className="text-xs text-muted-foreground">Escalation Risk</p>
              </div>
              <div className="flex flex-col justify-center items-center bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium text-foreground">{complianceRisk.lastAuditDate}</p>
                <p className="text-xs text-muted-foreground">Last Audit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions (Span 6) */}
        <Card className="col-span-6 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Recurring Staff Issues Detected</p>
                  <p className="text-xs text-muted-foreground">3 similar complaints in last 30 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Revenue Drop Risk: High</p>
                  <p className="text-xs text-muted-foreground">Probability of 15% drop in next 30 days: 72%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Shield className="h-4 w-4 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Compliance Audit Due</p>
                  <p className="text-xs text-muted-foreground">Next scheduled audit in 15 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
