/**
 * RESELLER MANAGER FULL CONTENT
 * Dynamic content renderer for all 12 sections
 */
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users, UserCheck, UserX, Clock, DollarSign, Target, Package,
  FileText, HeadphonesIcon, History, Bell, BarChart3, Settings,
  MapPin, Eye, Edit, CheckCircle, XCircle, Ban, Play, Trash2, TrendingUp,
  Activity, AlertTriangle, Store, Globe, Shield, Wallet, ArrowUpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface ResellerManagerFullContentProps {
  activeSection: string;
}

const sectionConfig: Record<string, { title: string; subtitle: string; icon: React.ElementType }> = {
  'dashboard-overview': { title: 'Dashboard Overview', subtitle: 'Real-time overview of your reseller network', icon: Activity },
  'dashboard-live-activity': { title: 'Live Activity', subtitle: 'Monitor real-time reseller actions', icon: Activity },
  'dashboard-performance': { title: 'Performance Snapshot', subtitle: 'Key performance indicators', icon: TrendingUp },
  'dashboard-alerts': { title: 'Pending Alerts', subtitle: 'Action required items', icon: AlertTriangle },
  'all-resellers': { title: 'All Resellers', subtitle: 'Complete reseller directory', icon: Users },
  'resellers-active': { title: 'Active Resellers', subtitle: 'Currently active partners', icon: UserCheck },
  'resellers-pending': { title: 'Pending Approval', subtitle: 'Awaiting verification', icon: Clock },
  'resellers-suspended': { title: 'Suspended Resellers', subtitle: 'Temporarily disabled accounts', icon: UserX },
  'resellers-terminated': { title: 'Terminated Resellers', subtitle: 'Permanently closed accounts', icon: Ban },
  'territory-country': { title: 'Country Allocation', subtitle: 'Manage country assignments', icon: Globe },
  'territory-state': { title: 'State / Region Allocation', subtitle: 'Regional territory management', icon: MapPin },
  'sales-total': { title: 'Total Sales', subtitle: 'Complete sales overview', icon: DollarSign },
  'sales-monthly': { title: 'Monthly Sales', subtitle: 'Current month performance', icon: BarChart3 },
  'payout-pending': { title: 'Pending Payout', subtitle: 'Awaiting clearance', icon: Wallet },
  'payout-approval': { title: 'Payout Request Approval', subtitle: 'Review and approve payouts', icon: CheckCircle },
  'leads-all': { title: 'All Leads', subtitle: 'Complete lead database', icon: Target },
  'leads-assigned': { title: 'Assigned Leads', subtitle: 'Distributed to resellers', icon: UserCheck },
  'products-allowed': { title: 'Allowed Products', subtitle: 'Products available for resale', icon: Package },
  'docs-agreements': { title: 'Agreements', subtitle: 'Contract documents', icon: FileText },
  'docs-kyc': { title: 'KYC Documents', subtitle: 'Identity verification files', icon: Shield },
  'support-tickets': { title: 'Support Tickets', subtitle: 'Open support requests', icon: HeadphonesIcon },
  'support-priority': { title: 'Priority Issues', subtitle: 'Critical escalations', icon: ArrowUpCircle },
  'audit-login': { title: 'Login History', subtitle: 'Authentication logs', icon: History },
  'audit-action': { title: 'Action History', subtitle: 'Complete activity trail', icon: History },
  'notif-system': { title: 'System Alerts', subtitle: 'Platform notifications', icon: Bell },
  'notif-broadcast': { title: 'Broadcast Message', subtitle: 'Send to all resellers', icon: Bell },
  'report-sales': { title: 'Sales Report', subtitle: 'Revenue analytics', icon: BarChart3 },
  'report-performance': { title: 'Reseller Performance', subtitle: 'Partner metrics', icon: TrendingUp },
  'settings-profile': { title: 'Profile Settings', subtitle: 'Your account details', icon: Settings },
  'settings-security': { title: 'Password / Security', subtitle: 'Authentication settings', icon: Shield },
};

const mockStats = [
  { key: 'total', label: 'Total Resellers', icon: Users, color: 'from-amber-500 to-orange-600' },
  { key: 'active', label: 'Active', icon: UserCheck, color: 'from-emerald-500 to-green-600' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'from-yellow-500 to-amber-600' },
  { key: 'suspended', label: 'Suspended', icon: UserX, color: 'from-red-500 to-rose-600' },
  { key: 'revenue', label: 'Total Revenue', icon: DollarSign, color: 'from-blue-500 to-indigo-600' },
] as const;

const initialMockItems = [
  { id: '1', name: 'TechDistro India', owner: 'Vikram Singh', status: 'active' as const, country: 'India', revenue: '$125,000' },
  { id: '2', name: 'Digital Partners UK', owner: 'Charlotte Brown', status: 'active' as const, country: 'UK', revenue: '$210,000' },
  { id: '3', name: 'CloudNet Nigeria', owner: 'Chinedu Okafor', status: 'pending' as const, country: 'Nigeria', revenue: '$67,000' },
  { id: '4', name: 'TechBridge UAE', owner: 'Omar Al-Rashid', status: 'suspended' as const, country: 'UAE', revenue: '$95,000' },
  { id: '5', name: 'Pacific Solutions', owner: 'David Wong', status: 'active' as const, country: 'Australia', revenue: '$285,000' },
];

export function ResellerManagerFullContent({ activeSection }: ResellerManagerFullContentProps) {
  const [items, setItems] = useState(() => initialMockItems);

  const config = sectionConfig[activeSection] || {
    title: 'Dashboard',
    subtitle: 'Reseller Manager Control Panel',
    icon: Store,
  };

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter(i => i.status === 'active').length;
    const pending = items.filter(i => i.status === 'pending').length;
    const suspended = items.filter(i => i.status === 'suspended').length;

    // demo total revenue sum (parse simple numbers)
    const revenue = items
      .map(i => Number(String(i.revenue).replace(/[^0-9.]/g, '')) || 0)
      .reduce((a, b) => a + b, 0);

    return { total, active, pending, suspended, revenue };
  }, [items]);

  const logAction = (action: string, target: string) => {
    console.log(`[AUDIT] ${new Date().toISOString()} - ${action}: ${target}`);
    toast.success(`${action} executed`, {
      description: target,
      duration: 2000,
    });
  };

  const updateStatus = (id: string, nextStatus: (typeof items)[number]['status']) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status: nextStatus } : i)));
  };

  const confirmDelete = (id: string, name: string) => {
    toast(`Delete ${name}?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => {
          setItems(prev => prev.filter(i => i.id !== id));
          logAction('Delete', name);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => logAction('Delete Cancelled', name),
      },
      duration: 6000,
    });
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <config.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
              <p className="text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AI ACTIVE</Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">HEALTHY</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4">
          {mockStats.map((stat, idx) => {
            const value =
              stat.key === 'total'
                ? stats.total
                : stat.key === 'active'
                  ? stats.active
                  : stat.key === 'pending'
                    ? stats.pending
                    : stat.key === 'suspended'
                      ? stats.suspended
                      : `₹${(stats.revenue / 1000).toFixed(1)}K`;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className="bg-card/50 border-border/50 hover:border-amber-500/30 transition-all cursor-pointer"
                  onClick={() => logAction('View', stat.label)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                      >
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Data Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              {config.title} List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.owner} • {item.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge className={
                      item.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {item.status}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{item.revenue}</span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', item.name)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Edit', item.name)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {item.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300"
                            onClick={() => {
                              updateStatus(item.id, 'active');
                              logAction('Approve', item.name);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            onClick={() => logAction('Reject', item.name)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {item.status === 'active' && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300"
                          onClick={() => logAction('Suspend', item.name)}>
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                      {item.status === 'suspended' && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300"
                          onClick={() => logAction('Activate', item.name)}>
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        onClick={() => confirmDelete(item.id, item.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                        onClick={() => logAction('History', item.name)}>
                        <History className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-all"
            onClick={() => logAction('View', 'Add New Reseller')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-amber-400" />
              <div>
                <p className="font-medium text-foreground">Add New Reseller</p>
                <p className="text-xs text-muted-foreground">Manual or invite</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20 cursor-pointer hover:border-emerald-500/40 transition-all"
            onClick={() => logAction('Approve', 'Bulk Pending Approvals')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="font-medium text-foreground">Approve Pending</p>
                <p className="text-xs text-muted-foreground">32 awaiting</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all"
            onClick={() => logAction('Approve', 'Process Payouts')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-400" />
              <div>
                <p className="font-medium text-foreground">Process Payouts</p>
                <p className="text-xs text-muted-foreground">₹4.2L pending</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}

export default ResellerManagerFullContent;
