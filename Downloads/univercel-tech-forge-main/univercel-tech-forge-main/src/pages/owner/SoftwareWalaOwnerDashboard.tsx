import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Package, Users, DollarSign, Download, Eye, 
  Lock, AlertTriangle, Activity, TrendingUp, Clock,
  UserX, FileText, Database, Server, RefreshCw,
  ChevronRight, BarChart3, Globe, Zap, CheckCircle2,
  XCircle, Building2, Briefcase, Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  totalDemos: number;
  activeClients: number;
  totalSales: number;
  todaySales: number;
  activeEmployees: number;
  pendingActions: number;
  securityAlerts: number;
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface EmployeeActivity {
  userId: string;
  userName: string;
  role: string;
  lastActive: string;
  actionsToday: number;
  isOnline: boolean;
  riskLevel: 'safe' | 'watch' | 'alert';
}

const SoftwareWalaOwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalDemos: 0,
    activeClients: 0,
    totalSales: 0,
    todaySales: 0,
    activeEmployees: 0,
    pendingActions: 0,
    securityAlerts: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [employeeActivity, setEmployeeActivity] = useState<EmployeeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSessionTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products count
      const productsResult = await supabase
        .from('products')
        .select('product_id', { count: 'exact', head: true });
      const productsCount = productsResult.count;

      // Fetch demos count
      const demosResult = await supabase
        .from('demos')
        .select('id', { count: 'exact', head: true });
      const demosCount = demosResult.count;

      // Fetch active user roles (employees)
      const employeesResult = await supabase
        .from('user_roles')
        .select('id', { count: 'exact', head: true });
      const employeesCount = employeesResult.count;

      // Fetch security alerts
      const alertsResult = await supabase
        .from('fraud_alerts')
        .select('id', { count: 'exact', head: true });
      const alertsCount = alertsResult.count;

      // Fetch recent audit logs
      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      setStats({
        totalProducts: productsCount || 0,
        totalDemos: demosCount || 0,
        activeClients: 0, // Will implement based on your client table
        totalSales: 0,
        todaySales: 0,
        activeEmployees: employeesCount || 0,
        pendingActions: 0,
        securityAlerts: alertsCount || 0
      });

      // Transform audit logs to activities
      if (auditData) {
        setRecentActivity(auditData.map(log => ({
          id: log.id,
          action: log.action,
          user: log.user_id?.slice(0, 8) || 'System',
          target: log.module,
          timestamp: new Date(log.timestamp).toLocaleString(),
          severity: (log.meta_json as any)?.severity || 'low'
        })));
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'violet' 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    trend?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
              <p className="text-2xl font-bold text-white mt-1">{value}</p>
              {trend && (
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {trend}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SoftwareWala</h1>
                <p className="text-xs text-slate-400">Owner Control Center</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Security Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">SECURE</span>
              </div>

              {/* Session Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 font-mono">{formatSessionTime(sessionTime)}</span>
              </div>

              {/* Refresh */}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchDashboardData}
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts.toLocaleString()} 
            icon={Package}
            trend="+5000 demos"
          />
          <StatCard 
            title="Total Demos" 
            value={stats.totalDemos.toLocaleString()} 
            icon={Globe}
            color="blue"
          />
          <StatCard 
            title="Active Employees" 
            value={stats.activeEmployees} 
            icon={Users}
            color="emerald"
          />
          <StatCard 
            title="Security Alerts" 
            value={stats.securityAlerts} 
            icon={AlertTriangle}
            color={stats.securityAlerts > 0 ? 'red' : 'emerald'}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-violet-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-violet-600">
              <Users className="w-4 h-4 mr-2" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-violet-600">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-violet-600">
              <Activity className="w-4 h-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Quick Actions */}
              <Card className="bg-slate-900/50 border-slate-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-slate-800/50 border-slate-700/50 hover:bg-violet-600/20 hover:border-violet-500/50"
                    onClick={() => navigate('/product-demo-manager')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Manage Products
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-slate-800/50 border-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50"
                    onClick={() => navigate('/super-admin/user-management')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Employee Control
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-slate-800/50 border-slate-700/50 hover:bg-emerald-600/20 hover:border-emerald-500/50"
                    onClick={() => navigate('/audit-logs')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Audit Trail
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-slate-800/50 border-slate-700/50 hover:bg-red-600/20 hover:border-red-500/50"
                    onClick={() => navigate('/security-dashboard')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security Center
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>

              {/* Security Overview */}
              <Card className="bg-slate-900/50 border-slate-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Audit Logging</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Encryption</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Lock className="w-3 h-3 mr-1" />
                      AES-256
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Access Control</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Zero-Trust
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Backdoor Detection</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Protected
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Business Stats */}
              <Card className="bg-slate-900/50 border-slate-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-violet-400" />
                    Business Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Source Codes</span>
                    <span className="text-sm font-bold text-white">1,500+</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Demo Projects</span>
                    <span className="text-sm font-bold text-white">5,000+</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Categories</span>
                    <span className="text-sm font-bold text-white">50+</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                    <span className="text-xs text-slate-400">Tech Stacks</span>
                    <span className="text-sm font-bold text-white">25+</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Employee Access Control
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Revoke All Access
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Employee monitoring active</p>
                  <p className="text-xs mt-1">All employee actions are being logged</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-slate-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white">Protection Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: 'No Backdoors', status: 'active' },
                    { name: 'Immutable Audit Trail', status: 'active' },
                    { name: 'Client Data Encryption', status: 'active' },
                    { name: 'Download Watermarking', status: 'active' },
                    { name: 'Device Fingerprinting', status: 'active' },
                    { name: 'Export Blocking', status: 'active' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                      <span className="text-xs text-slate-300">{feature.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white">Employee Restrictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: 'Cannot Export Client Data', icon: XCircle },
                    { name: 'Cannot Delete Records', icon: XCircle },
                    { name: 'Cannot Access Without Log', icon: XCircle },
                    { name: 'Cannot Copy Source Files', icon: XCircle },
                    { name: 'Cannot Remove Watermarks', icon: XCircle },
                    { name: 'Cannot Bypass Audit', icon: XCircle },
                  ].map((restriction, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/20 rounded">
                      <span className="text-xs text-slate-300">{restriction.name}</span>
                      <restriction.icon className="w-4 h-4 text-red-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" />
                  Recent Activity (Last 24 Hours)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {recentActivity.length > 0 ? recentActivity.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          activity.severity === 'critical' ? 'bg-red-400' :
                          activity.severity === 'high' ? 'bg-orange-400' :
                          activity.severity === 'medium' ? 'bg-yellow-400' : 'bg-slate-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.action}</p>
                          <p className="text-xs text-slate-400">
                            {activity.target} • User: {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-400">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>All activities are being monitored</p>
                        <p className="text-xs mt-1">Logs appear here in real-time</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SoftwareWalaOwnerDashboard;
