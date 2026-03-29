/**
 * PRODUCT MANAGER DASHBOARD
 * Full-featured dashboard with all required cards and features
 * 
 * NO DEMO WORD ANYWHERE - LIVE SOFTWARE MODE
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Monitor, AlertTriangle, Clock, Rocket, Bot,
  Plus, Wrench, Eye, CheckCircle, X, Layers, Settings,
  GitBranch, BookOpen, MessageSquare, TrendingUp, Zap,
  Target, FileText, Shield, Users, ExternalLink, RefreshCw,
  BarChart3, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// ===== LOCKED THEME COLORS =====
const THEME = {
  bg: '#0a1628',
  cardBg: 'rgba(13, 27, 42, 0.95)',
  border: '#1e3a5f',
  accent: '#2563eb',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Stats for Product Manager
const productMetrics = [
  { label: 'Total Products', value: '48', icon: Package, color: 'from-violet-500 to-purple-600' },
  { label: 'Active Products', value: '42', icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
  { label: 'In Development', value: '5', icon: Wrench, color: 'from-amber-500 to-orange-600' },
  { label: 'Products Live', value: '38', icon: Rocket, color: 'from-blue-500 to-cyan-600' },
  { label: 'Pending Updates', value: '7', icon: Clock, color: 'from-rose-500 to-pink-600' },
  { label: 'AI Managed', value: '24', icon: Bot, color: 'from-indigo-500 to-violet-600' },
];

// Mock product list
const products = [
  { id: 1, name: 'School Management System', version: 'v3.2.1', status: 'live', modules: 12, features: 86 },
  { id: 2, name: 'Hospital HMS Pro', version: 'v2.8.0', status: 'live', modules: 15, features: 124 },
  { id: 3, name: 'Restaurant POS Suite', version: 'v4.1.0', status: 'live', modules: 8, features: 52 },
  { id: 4, name: 'Hotel Booking Engine', version: 'v1.9.5', status: 'development', modules: 10, features: 67 },
  { id: 5, name: 'Gym Management Elite', version: 'v2.0.0', status: 'live', modules: 6, features: 38 },
  { id: 6, name: 'Real Estate CRM', version: 'v3.0.0-beta', status: 'development', modules: 9, features: 54 },
];

// AI Features
const aiFeatures = [
  { id: 1, name: 'AI Feature Suggestion', status: 'active', accuracy: '94%' },
  { id: 2, name: 'AI Bug Detection', status: 'active', accuracy: '98%' },
  { id: 3, name: 'AI Performance Insight', status: 'active', accuracy: '91%' },
  { id: 4, name: 'AI Auto Documentation', status: 'active', accuracy: '89%' },
];

export const ProductDashboard: React.FC = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showVersionControl, setShowVersionControl] = useState(false);
  const [showUpdateManager, setShowUpdateManager] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div 
      className="min-h-full p-6 space-y-6"
      style={{ background: THEME.bg }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: THEME.text }}>PRODUCT MANAGER</h1>
          <p className="text-sm" style={{ color: THEME.textMuted }}>
            Enterprise Product Management System
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            RUNNING
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Bot className="w-3 h-3 mr-1" />
            AI ACTIVE
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            HEALTHY
          </Badge>
        </div>
      </div>

      {/* Stats Grid - 6 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {productMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card 
                className="border"
                style={{ background: THEME.cardBg, borderColor: THEME.border }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold" style={{ color: THEME.text }}>{metric.value}</p>
                      <p className="text-[10px]" style={{ color: THEME.textMuted }}>{metric.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList 
          className="grid w-full grid-cols-5 gap-1"
          style={{ background: THEME.cardBg, borderColor: THEME.border }}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold" style={{ color: THEME.text }}>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  onClick={() => setShowAddProduct(true)}
                  className="h-16 flex-col gap-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30"
                  variant="outline"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-xs">Add Product</span>
                </Button>
                <Button 
                  onClick={() => setShowVersionControl(true)}
                  className="h-16 flex-col gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                  variant="outline"
                >
                  <GitBranch className="w-5 h-5" />
                  <span className="text-xs">Version Control</span>
                </Button>
                <Button 
                  onClick={() => setShowUpdateManager(true)}
                  className="h-16 flex-col gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                  variant="outline"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-xs">Update Manager</span>
                </Button>
                <Button 
                  onClick={() => toast.success('Opening AI Configuration...')}
                  className="h-16 flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                  variant="outline"
                >
                  <Bot className="w-5 h-5" />
                  <span className="text-xs">AI Config</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Activity className="w-4 h-4 text-blue-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Product updated', target: 'School Management System v3.2.1', time: '5 min ago', icon: Package, color: 'emerald' },
                  { action: 'New feature added', target: 'AI Chatbot Integration', time: '1 hour ago', icon: Zap, color: 'blue' },
                  { action: 'Bug resolved', target: 'Payment gateway timeout fix', time: '2 hours ago', icon: CheckCircle, color: 'green' },
                  { action: 'Update pending', target: 'Hospital HMS Pro v2.9.0', time: '4 hours ago', icon: Clock, color: 'amber' },
                ].map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: 'rgba(30, 58, 95, 0.3)' }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium" style={{ color: THEME.text }}>{activity.action}</p>
                          <p className="text-xs" style={{ color: THEME.textMuted }}>{activity.target}</p>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: THEME.textMuted }}>{activity.time}</span>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                  <Package className="w-4 h-4 text-violet-400" />
                  Product List
                </CardTitle>
                <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        product.status === 'live' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                      }`}>
                        <Package className={`w-5 h-5 ${
                          product.status === 'live' ? 'text-emerald-400' : 'text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: THEME.text }}>{product.name}</p>
                        <p className="text-xs" style={{ color: THEME.textMuted }}>
                          {product.version} • {product.modules} modules • {product.features} features
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={
                        product.status === 'live' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }>
                        {product.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Layers className="w-3 h-3" />
                        Modules
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Features Tab */}
        <TabsContent value="ai-features" className="space-y-4">
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <Bot className="w-4 h-4 text-blue-400" />
                AI Features (Product)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {aiFeatures.map((feature, idx) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg border"
                    style={{ background: 'rgba(37, 99, 235, 0.1)', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm" style={{ color: THEME.text }}>{feature.name}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {feature.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: THEME.textMuted }}>Accuracy</span>
                      <span className="text-sm font-bold text-blue-400">{feature.accuracy}</span>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30" variant="outline">
                      Configure
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold" style={{ color: THEME.text }}>
                  Usage by Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.slice(0, 4).map((product, idx) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: THEME.text }}>{product.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${70 - idx * 15}%` }}
                          />
                        </div>
                        <span className="text-xs" style={{ color: THEME.textMuted }}>{70 - idx * 15}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold" style={{ color: THEME.text }}>
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-emerald-400">78%</p>
                  <p className="text-sm" style={{ color: THEME.textMuted }}>View → Purchase</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+12% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-4">
          <Card style={{ background: THEME.cardBg, borderColor: THEME.border }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2" style={{ color: THEME.text }}>
                <GitBranch className="w-4 h-4 text-amber-400" />
                Pending Updates (7)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { product: 'Hospital HMS Pro', version: 'v2.9.0', type: 'Feature Update', status: 'pending_approval' },
                  { product: 'School Management', version: 'v3.2.2', type: 'Bug Fix', status: 'pending_approval' },
                  { product: 'Restaurant POS', version: 'v4.1.1', type: 'Security Patch', status: 'ready' },
                ].map((update, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: THEME.text }}>{update.product}</p>
                      <p className="text-xs" style={{ color: THEME.textMuted }}>
                        {update.version} • {update.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        {update.status.replace('_', ' ')}
                      </Badge>
                      <Button size="sm" onClick={() => toast.success('Sent to Boss for approval')}>
                        Send to Boss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Product Sheet */}
      <Sheet open={showAddProduct} onOpenChange={setShowAddProduct}>
        <SheetContent style={{ background: THEME.bg, borderColor: THEME.border }}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2" style={{ color: THEME.text }}>
              <Plus className="w-5 h-5 text-violet-400" />
              Add New Product
            </SheetTitle>
            <SheetDescription style={{ color: THEME.textMuted }}>
              Add a new product to the catalog
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label style={{ color: THEME.text }}>Product Name</Label>
              <Input placeholder="Enter product name" style={{ background: 'rgba(30, 58, 95, 0.3)', borderColor: THEME.border, color: THEME.text }} />
            </div>
            <div className="space-y-2">
              <Label style={{ color: THEME.text }}>Category</Label>
              <Input placeholder="e.g., ERP, CRM, HRM" style={{ background: 'rgba(30, 58, 95, 0.3)', borderColor: THEME.border, color: THEME.text }} />
            </div>
            <div className="space-y-2">
              <Label style={{ color: THEME.text }}>Initial Version</Label>
              <Input placeholder="e.g., v1.0.0" style={{ background: 'rgba(30, 58, 95, 0.3)', borderColor: THEME.border, color: THEME.text }} />
            </div>
            <Button 
              className="w-full bg-violet-600 hover:bg-violet-700" 
              onClick={() => {
                toast.success('Product added successfully!');
                setShowAddProduct(false);
              }}
            >
              Add Product
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Version Control Sheet */}
      <Sheet open={showVersionControl} onOpenChange={setShowVersionControl}>
        <SheetContent style={{ background: THEME.bg, borderColor: THEME.border }}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2" style={{ color: THEME.text }}>
              <GitBranch className="w-5 h-5 text-emerald-400" />
              Version Control
            </SheetTitle>
            <SheetDescription style={{ color: THEME.textMuted }}>
              Manage product versions and releases
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[70vh] mt-4">
            <div className="space-y-3">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="p-3 rounded-lg border"
                  style={{ background: 'rgba(30, 58, 95, 0.2)', borderColor: THEME.border }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: THEME.text }}>{product.name}</span>
                    <Badge className="bg-blue-500/20 text-blue-400">{product.version}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Changelog</Button>
                    <Button size="sm" variant="outline" className="text-xs">Release Notes</Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Update Manager Sheet */}
      <Sheet open={showUpdateManager} onOpenChange={setShowUpdateManager}>
        <SheetContent style={{ background: THEME.bg, borderColor: THEME.border }}>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2" style={{ color: THEME.text }}>
              <RefreshCw className="w-5 h-5 text-amber-400" />
              Update Manager
            </SheetTitle>
            <SheetDescription style={{ color: THEME.textMuted }}>
              Draft and send updates for approval
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <p className="text-sm font-medium text-amber-400 mb-2">7 Updates Ready</p>
              <p className="text-xs" style={{ color: THEME.textMuted }}>
                Send all pending updates to Boss for approval
              </p>
            </div>
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                toast.success('All updates sent to Boss for approval');
                setShowUpdateManager(false);
              }}
            >
              Send All to Boss
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
