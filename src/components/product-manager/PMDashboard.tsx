import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Package,
  CheckCircle,
  PauseCircle,
  FileEdit,
  MonitorPlay,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Upload,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShoppingCart,
  DollarSign,
} from 'lucide-react';

interface PMDashboardProps {
  onNavigate: (section: string) => void;
  onAddProduct: () => void;
}

interface KPICard {
  id: string;
  label: string;
  value: number;
  trend: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  filterSection?: string;
  filterValue?: string;
}

const PMDashboard: React.FC<PMDashboardProps> = ({ onNavigate, onAddProduct }) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    parked: 0,
    draft: 0,
    totalDemos: 0,
    activeDemos: 0,
    conversionRate: 12.5,
    weeklyTrend: 8.3,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const { data: products } = await supabase
        .from('products')
        .select('status');

      const { data: demos } = await supabase
        .from('demos')
        .select('status');

      if (products) {
        setStats({
          total: products.length,
          active: products.filter(p => p.status === 'active').length,
          parked: products.filter(p => p.status === 'parked' || p.status === 'inactive').length,
          draft: products.filter(p => p.status === 'draft').length,
          totalDemos: demos?.length || 0,
          activeDemos: demos?.filter(d => d.status === 'active').length || 0,
          conversionRate: 12.5,
          weeklyTrend: 8.3,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpiCards: KPICard[] = [
    { id: 'total', label: 'Total Products', value: stats.total, trend: 12, icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-500/10', filterSection: 'all-products' },
    { id: 'active', label: 'Active Products', value: stats.active, trend: 5, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10', filterSection: 'all-products', filterValue: 'active' },
    { id: 'parked', label: 'Parked Products', value: stats.parked, trend: -3, icon: PauseCircle, color: 'text-amber-500', bgColor: 'bg-amber-500/10', filterSection: 'all-products', filterValue: 'parked' },
    { id: 'draft', label: 'Draft Products', value: stats.draft, trend: 2, icon: FileEdit, color: 'text-slate-400', bgColor: 'bg-slate-500/10', filterSection: 'all-products', filterValue: 'draft' },
    { id: 'demos', label: 'Total Demos', value: stats.totalDemos, trend: 15, icon: MonitorPlay, color: 'text-purple-500', bgColor: 'bg-purple-500/10', filterSection: 'demo-management' },
    { id: 'active-demos', label: 'Active Demos', value: stats.activeDemos, trend: 8, icon: MonitorPlay, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', filterSection: 'demo-management' },
    { id: 'conversion', label: 'Conversion %', value: stats.conversionRate, trend: 2.1, icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', filterSection: 'analytics' },
    { id: 'trend', label: 'Weekly Trend', value: stats.weeklyTrend, trend: stats.weeklyTrend, icon: BarChart3, color: 'text-pink-500', bgColor: 'bg-pink-500/10', filterSection: 'analytics' },
  ];

  const handleKPIClick = (kpi: KPICard) => {
    if (kpi.filterSection) {
      onNavigate(kpi.filterSection);
      toast.info(`Viewing ${kpi.label}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Product Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">Overview of all products, demos, and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('bulk-upload')}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={onAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Strip - Clickable Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`${kpi.bgColor} border-border/50 cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => handleKPIClick(kpi)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                    <div className={`flex items-center text-xs ${kpi.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {kpi.trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(kpi.trend)}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recent Products</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('all-products')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Loading...
                </div>
              ) : (
                <>
                  {[
                    { name: 'Enterprise CRM Suite', status: 'active', demos: 3, sales: 245 },
                    { name: 'HR Management Pro', status: 'active', demos: 2, sales: 189 },
                    { name: 'Inventory Tracker', status: 'parked', demos: 1, sales: 67 },
                    { name: 'POS System Ultra', status: 'draft', demos: 0, sales: 0 },
                  ].map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.demos} demos • {product.sales} sales</p>
                        </div>
                      </div>
                      <Badge variant={product.status === 'active' ? 'default' : product.status === 'parked' ? 'secondary' : 'outline'}>
                        {product.status}
                      </Badge>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs font-medium text-amber-500">Pricing Suggestion</p>
              <p className="text-xs text-muted-foreground mt-1">3 products may benefit from tier-based pricing based on market analysis.</p>
              <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => onNavigate('pricing-plans')}>
                Review <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs font-medium text-blue-500">Demo Performance</p>
              <p className="text-xs text-muted-foreground mt-1">2 demos have low engagement. Consider updating content.</p>
              <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => onNavigate('demo-management')}>
                View Demos <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-xs font-medium text-green-500">Inventory Alert</p>
              <p className="text-xs text-muted-foreground mt-1">All license allocations are healthy. No action needed.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Create Demo', icon: MonitorPlay, action: 'demo-management', color: 'text-purple-500' },
          { label: 'Manage Pricing', icon: DollarSign, action: 'pricing-plans', color: 'text-green-500' },
          { label: 'View Orders', icon: ShoppingCart, action: 'orders', color: 'text-blue-500' },
          { label: 'Analytics', icon: BarChart3, action: 'analytics', color: 'text-pink-500' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="cursor-pointer hover:bg-secondary/30 transition-colors"
              onClick={() => onNavigate(item.action)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`w-8 h-8 ${item.color}`} />
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">Quick action</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PMDashboard;
