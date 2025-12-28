import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, Key, Globe, Server, Package, CheckCircle, 
  XCircle, AlertTriangle, Eye, Rocket, FileCheck, Clock,
  Hash, Link2, Copy, RefreshCw, Search, Filter, ArrowRight,
  Zap, Database, ShieldCheck, Ban, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface DemoOrder {
  id: string;
  order_number: string;
  demo_id: string;
  daily_demo_id: string;
  client_name: string;
  client_email: string;
  client_domain: string;
  order_status: string;
  is_verified: boolean;
  is_promoted: boolean;
  is_live: boolean;
  created_at: string;
}

interface Deployment {
  id: string;
  order_id: string;
  daily_demo_id: string;
  license_key: string;
  approved_domain: string;
  deployment_status: string;
  is_domain_locked: boolean;
  is_encrypted: boolean;
  verification_count: number;
  blocked_attempts: number;
  is_active: boolean;
  created_at: string;
}

interface SecurityLog {
  id: string;
  deployment_id: string;
  license_key: string;
  request_domain: string;
  request_ip: string;
  is_authorized: boolean;
  block_reason: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  generated: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  tested: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  verified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  live: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  blocked: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const DemoOrderSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);
  
  // Form states
  const [newOrder, setNewOrder] = useState({
    demo_id: '',
    client_name: '',
    client_email: '',
    client_domain: '',
    requirements: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingVerification: 0,
    liveDeployments: 0,
    blockedAttempts: 0,
    todayDemoIds: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchOrders(),
      fetchDeployments(),
      fetchSecurityLogs(),
      fetchStats()
    ]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('demo_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setOrders(data as DemoOrder[]);
  };

  const fetchDeployments = async () => {
    const { data } = await supabase
      .from('demo_deployments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setDeployments(data as Deployment[]);
  };

  const fetchSecurityLogs = async () => {
    const { data } = await supabase
      .from('demo_security_locks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    
    if (data) setSecurityLogs(data as SecurityLog[]);
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const [ordersRes, deploymentsRes, securityRes, dailyIdsRes] = await Promise.all([
      supabase.from('demo_orders').select('id, is_verified', { count: 'exact' }),
      supabase.from('demo_deployments').select('id, deployment_status, blocked_attempts', { count: 'exact' }),
      supabase.from('demo_security_locks').select('id', { count: 'exact' }).eq('is_authorized', false),
      supabase.from('demo_daily_ids').select('id', { count: 'exact' }).gte('created_at', today)
    ]);
    
    const pending = ordersRes.data?.filter(o => !o.is_verified).length || 0;
    const live = deploymentsRes.data?.filter(d => d.deployment_status === 'live').length || 0;
    const blocked = deploymentsRes.data?.reduce((acc, d) => acc + (d.blocked_attempts || 0), 0) || 0;
    
    setStats({
      totalOrders: ordersRes.count || 0,
      pendingVerification: pending,
      liveDeployments: live,
      blockedAttempts: blocked,
      todayDemoIds: dailyIdsRes.count || 0
    });
  };

  const handleVerifyOrder = async (order: DemoOrder) => {
    const { error } = await supabase
      .from('demo_orders')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        order_status: 'verified',
        status_flow: ['generated', 'tested', 'verified']
      })
      .eq('id', order.id);
    
    if (error) {
      toast.error('Failed to verify order');
      return;
    }
    
    await supabase.from('audit_logs').insert({
      action: 'demo_order_verified',
      module: 'demo',
      meta_json: { order_id: order.id, daily_demo_id: order.daily_demo_id }
    });
    
    toast.success('Order verified successfully');
    fetchData();
  };

  const handlePromoteOrder = async (order: DemoOrder) => {
    if (!order.is_verified) {
      toast.error('Order must be verified before promotion');
      return;
    }
    
    const { error } = await supabase
      .from('demo_orders')
      .update({
        is_promoted: true,
        promoted_at: new Date().toISOString(),
        order_status: 'ready',
        status_flow: ['generated', 'tested', 'verified', 'ready']
      })
      .eq('id', order.id);
    
    if (error) {
      toast.error('Failed to promote order');
      return;
    }
    
    toast.success('Order promoted to READY status');
    fetchData();
  };

  const handleDeployLive = async (order: DemoOrder) => {
    if (!order.is_verified || !order.is_promoted) {
      toast.error('Order must be verified and promoted before deployment');
      return;
    }
    
    setSelectedOrder(order);
    setShowDeployDialog(true);
  };

  const confirmDeployment = async () => {
    if (!selectedOrder) return;
    
    // Generate license key
    const licenseKey = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Create deployment
    const { error: deployError } = await supabase
      .from('demo_deployments')
      .insert({
        order_id: selectedOrder.id,
        demo_id: selectedOrder.demo_id,
        daily_demo_id: selectedOrder.daily_demo_id,
        license_key: licenseKey,
        approved_domain: selectedOrder.client_domain,
        deployment_status: 'live',
        is_domain_locked: true,
        is_encrypted: true,
        is_obfuscated: true
      });
    
    if (deployError) {
      toast.error('Failed to create deployment');
      return;
    }
    
    // Update order
    await supabase
      .from('demo_orders')
      .update({
        is_live: true,
        deployed_at: new Date().toISOString(),
        order_status: 'live',
        status_flow: ['generated', 'tested', 'verified', 'ready', 'live']
      })
      .eq('id', selectedOrder.id);
    
    await supabase.from('audit_logs').insert({
      action: 'demo_deployed_live',
      module: 'demo',
      meta_json: { 
        order_id: selectedOrder.id, 
        daily_demo_id: selectedOrder.daily_demo_id,
        domain: selectedOrder.client_domain
      }
    });
    
    toast.success('Deployment successful! Domain-locked and secure.');
    setShowDeployDialog(false);
    setSelectedOrder(null);
    fetchData();
  };

  const createNewOrder = async () => {
    if (!newOrder.demo_id || !newOrder.client_domain) {
      toast.error('Demo ID and Domain are required');
      return;
    }
    
    // Generate daily demo ID
    const dateStr = format(new Date(), 'yyyyMMdd');
    const sequence = (orders.filter(o => 
      o.daily_demo_id.includes(dateStr)
    ).length + 1).toString().padStart(3, '0');
    const dailyDemoId = `DEMO-${dateStr}-${sequence}`;
    
    // Generate order number
    const orderNumber = `ORD-${format(new Date(), 'yyyyMMdd-HHmmss')}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
    
    const { error } = await supabase
      .from('demo_orders')
      .insert({
        order_number: orderNumber,
        demo_id: newOrder.demo_id,
        daily_demo_id: dailyDemoId,
        client_name: newOrder.client_name,
        client_email: newOrder.client_email,
        client_domain: newOrder.client_domain,
        requirements: { notes: newOrder.requirements },
        order_status: 'generated',
        auto_detected: true
      });
    
    if (error) {
      toast.error('Failed to create order');
      return;
    }
    
    toast.success(`Order created with Demo ID: ${dailyDemoId}`);
    setShowNewOrderDialog(false);
    setNewOrder({ demo_id: '', client_name: '', client_email: '', client_domain: '', requirements: '' });
    fetchData();
  };

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.daily_demo_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.client_domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeployments = deployments.filter(d =>
    d.daily_demo_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.approved_domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6" 
         onCopy={(e) => e.preventDefault()}
         onCut={(e) => e.preventDefault()}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            Demo Order & Security System
          </h1>
          <p className="text-slate-400 mt-1">Daily Demo ID • Auto Order • Domain-Locked Security</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-slate-700 text-slate-300"
            onClick={fetchData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowNewOrderDialog(true)}
          >
            <Package className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Today's Demo IDs</p>
                <p className="text-2xl font-bold text-blue-400">{stats.todayDemoIds}</p>
              </div>
              <Hash className="w-8 h-8 text-blue-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-purple-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendingVerification}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Live Deployments</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.liveDeployments}</p>
              </div>
              <Rocket className="w-8 h-8 text-emerald-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Blocked Attempts</p>
                <p className="text-2xl font-bold text-red-400">{stats.blockedAttempts}</p>
              </div>
              <Ban className="w-8 h-8 text-red-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by Demo ID, Order, Domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900/50 border border-slate-700">
          <TabsTrigger value="orders" className="data-[state=active]:bg-emerald-600">
            <Package className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="deployments" className="data-[state=active]:bg-emerald-600">
            <Rocket className="w-4 h-4 mr-2" />
            Deployments
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-emerald-600">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Security Logs
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Demo Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-slate-400">Loading...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No orders found</div>
                ) : (
                  filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Daily Demo ID</p>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
                              {order.daily_demo_id}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Order #</p>
                            <p className="text-white font-mono text-sm">{order.order_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Domain</p>
                            <p className="text-slate-300 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {order.client_domain || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Status</p>
                            <Badge className={statusColors[order.order_status] || statusColors.pending}>
                              {order.order_status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Status Flow Indicators */}
                          <div className="flex items-center gap-1 mr-4">
                            <div className={`w-2 h-2 rounded-full ${order.order_status !== 'generated' ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`} />
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                            <div className={`w-2 h-2 rounded-full ${order.is_verified ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                            <div className={`w-2 h-2 rounded-full ${order.is_promoted ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                            <div className={`w-2 h-2 rounded-full ${order.is_live ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          </div>
                          
                          {/* Action Buttons */}
                          {!order.is_verified && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                              onClick={() => handleVerifyOrder(order)}
                            >
                              <FileCheck className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                          )}
                          
                          {order.is_verified && !order.is_promoted && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                              onClick={() => handlePromoteOrder(order)}
                            >
                              <Zap className="w-4 h-4 mr-1" />
                              Promote
                            </Button>
                          )}
                          
                          {order.is_promoted && !order.is_live && (
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleDeployLive(order)}
                            >
                              <Rocket className="w-4 h-4 mr-1" />
                              Deploy Live
                            </Button>
                          )}
                          
                          {order.is_live && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              LIVE
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployments Tab */}
        <TabsContent value="deployments" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Domain-Locked Deployments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-slate-400">Loading...</div>
                ) : filteredDeployments.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No deployments found</div>
                ) : (
                  filteredDeployments.map((deployment) => (
                    <motion.div
                      key={deployment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Demo ID</p>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
                              {deployment.daily_demo_id}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Approved Domain</p>
                            <p className="text-emerald-400 flex items-center gap-1 font-mono">
                              <Lock className="w-3 h-3" />
                              {deployment.approved_domain}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">License Key</p>
                            <p className="text-slate-400 font-mono text-xs">
                              {deployment.license_key.slice(0, 16)}...
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Status</p>
                            <Badge className={statusColors[deployment.deployment_status] || statusColors.pending}>
                              {deployment.deployment_status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Security Indicators */}
                          <div className="flex items-center gap-2">
                            {deployment.is_domain_locked && (
                              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                                <Lock className="w-3 h-3 mr-1" />
                                Domain Lock
                              </Badge>
                            )}
                            {deployment.is_encrypted && (
                              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                                <Key className="w-3 h-3 mr-1" />
                                Encrypted
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Verifications</p>
                            <p className="text-emerald-400">{deployment.verification_count}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Blocked</p>
                            <p className={deployment.blocked_attempts > 0 ? 'text-red-400' : 'text-slate-400'}>
                              {deployment.blocked_attempts}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Logs Tab */}
        <TabsContent value="security" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                Security Verification Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-slate-400">Loading...</div>
                ) : securityLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No security logs found</div>
                ) : (
                  securityLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border ${
                        log.is_authorized 
                          ? 'bg-emerald-500/5 border-emerald-500/20' 
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {log.is_authorized ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-sm text-white font-mono">{log.request_domain}</p>
                            <p className="text-xs text-slate-500">IP: {log.request_ip}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                          </p>
                          {log.block_reason && (
                            <p className="text-xs text-red-400 mt-1">{log.block_reason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Order Dialog */}
      <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              Create New Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-slate-300">Demo ID (UUID)</Label>
              <Input
                value={newOrder.demo_id}
                onChange={(e) => setNewOrder({ ...newOrder, demo_id: e.target.value })}
                placeholder="Enter Demo UUID"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Client Name</Label>
              <Input
                value={newOrder.client_name}
                onChange={(e) => setNewOrder({ ...newOrder, client_name: e.target.value })}
                placeholder="Client Name"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Client Email</Label>
              <Input
                type="email"
                value={newOrder.client_email}
                onChange={(e) => setNewOrder({ ...newOrder, client_email: e.target.value })}
                placeholder="client@example.com"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Target Domain *</Label>
              <Input
                value={newOrder.client_domain}
                onChange={(e) => setNewOrder({ ...newOrder, client_domain: e.target.value })}
                placeholder="client-domain.com"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Software will be locked to this domain only
              </p>
            </div>
            <div>
              <Label className="text-slate-300">Requirements</Label>
              <Textarea
                value={newOrder.requirements}
                onChange={(e) => setNewOrder({ ...newOrder, requirements: e.target.value })}
                placeholder="Additional requirements..."
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={createNewOrder}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deploy Confirmation Dialog */}
      <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-400">
              <Rocket className="w-5 h-5" />
              Confirm Live Deployment
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Demo ID:</span>
                    <span className="text-blue-400 font-mono">{selectedOrder.daily_demo_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Domain:</span>
                    <span className="text-emerald-400 font-mono">{selectedOrder.client_domain}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Features Enabled
                </h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Domain-locked execution
                  </li>
                  <li className="flex items-center gap-2">
                    <Key className="w-3 h-3 text-emerald-400" />
                    Unique license key generated
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="w-3 h-3 text-emerald-400" />
                    Server-side verification
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    Encrypted & obfuscated code
                  </li>
                </ul>
              </div>
              
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Any unauthorized domain/IP will be auto-blocked
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeployDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={confirmDeployment}>
              <Rocket className="w-4 h-4 mr-2" />
              Deploy to Live
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoOrderSystem;
