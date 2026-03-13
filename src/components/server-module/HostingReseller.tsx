/**
 * HOSTING RESELLER MARKETPLACE
 * Sell hosting, local providers can sell through you with 30-40% commission
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, DollarSign, Users, TrendingUp, Package, Plus,
  Edit, Eye, CheckCircle, Clock, BarChart3, Globe,
  Server, Shield, Zap, Star, ArrowUpRight, Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface HostingPlan {
  id: string;
  name: string;
  type: 'shared' | 'vps' | 'dedicated' | 'cloud';
  price: number;
  sellingPrice: number;
  commission: number;
  disk: string;
  bandwidth: string;
  domains: number;
  ssl: boolean;
  activeSales: number;
  status: 'active' | 'draft';
}

interface ResellerPartner {
  id: string;
  name: string;
  company: string;
  region: string;
  totalSales: number;
  revenue: number;
  commission: number;
  commissionRate: number;
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
}

const mockPlans: HostingPlan[] = [
  { id: '1', name: 'Starter Hosting', type: 'shared', price: 5, sellingPrice: 9, commission: 40, disk: '5 GB SSD', bandwidth: '50 GB', domains: 1, ssl: true, activeSales: 124, status: 'active' },
  { id: '2', name: 'Business Pro', type: 'shared', price: 10, sellingPrice: 19, commission: 35, disk: '25 GB SSD', bandwidth: '200 GB', domains: 5, ssl: true, activeSales: 89, status: 'active' },
  { id: '3', name: 'Cloud VPS Basic', type: 'vps', price: 15, sellingPrice: 29, commission: 35, disk: '50 GB NVMe', bandwidth: 'Unlimited', domains: 10, ssl: true, activeSales: 45, status: 'active' },
  { id: '4', name: 'Enterprise VPS', type: 'vps', price: 30, sellingPrice: 49, commission: 30, disk: '100 GB NVMe', bandwidth: 'Unlimited', domains: 50, ssl: true, activeSales: 22, status: 'active' },
  { id: '5', name: 'Dedicated Server', type: 'dedicated', price: 60, sellingPrice: 99, commission: 30, disk: '500 GB SSD', bandwidth: 'Unlimited', domains: 100, ssl: true, activeSales: 8, status: 'active' },
];

const mockPartners: ResellerPartner[] = [
  { id: '1', name: 'Rahul Sharma', company: 'WebHost India', region: 'India - Mumbai', totalSales: 156, revenue: 4680, commission: 1638, commissionRate: 35, status: 'active', joinDate: '2025-09-15' },
  { id: '2', name: 'Priya Patel', company: 'CloudServe.in', region: 'India - Delhi', totalSales: 89, revenue: 2670, commission: 934, commissionRate: 35, status: 'active', joinDate: '2025-11-01' },
  { id: '3', name: 'Ahmed Khan', company: 'HostKaro', region: 'India - Bangalore', totalSales: 67, revenue: 2010, commission: 703, commissionRate: 35, status: 'active', joinDate: '2026-01-10' },
  { id: '4', name: 'Suresh Kumar', company: 'NetSolutions', region: 'India - Chennai', totalSales: 12, revenue: 360, commission: 126, commissionRate: 35, status: 'pending', joinDate: '2026-03-01' },
];

export const HostingReseller: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'partners' | 'create-plan'>('overview');

  const totalRevenue = mockPartners.reduce((s, p) => s + p.revenue, 0);
  const totalCommission = mockPartners.reduce((s, p) => s + p.commission, 0);
  const totalSales = mockPartners.reduce((s, p) => s + p.totalSales, 0);
  const yourEarnings = totalRevenue - totalCommission;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Hosting Reseller Marketplace</h2>
          <p className="text-sm text-muted-foreground">Sell hosting & earn 30-40% commission from local providers</p>
        </div>
        <Button onClick={() => setActiveTab('create-plan')} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Create Plan
        </Button>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Your Earnings', value: `$${yourEarnings.toLocaleString()}`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Partner Commission', value: `$${totalCommission.toLocaleString()}`, icon: Percent, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Active Partners', value: mockPartners.filter(p => p.status === 'active').length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-bold text-foreground mt-1">{kpi.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'plans', label: `Plans (${mockPlans.length})` },
          { id: 'partners', label: `Partners (${mockPartners.length})` },
        ].map(tab => (
          <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(tab.id as any)}
            className={activeTab === tab.id ? 'bg-blue-600' : ''}>
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" /> Business Model</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
                  <p className="text-3xl font-bold text-emerald-400">30-40%</p>
                  <p className="text-sm text-muted-foreground mt-1">Your Commission</p>
                  <p className="text-xs text-muted-foreground mt-0.5">On every hosting sale</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
                  <p className="text-3xl font-bold text-blue-400">${totalSales * 19}</p>
                  <p className="text-sm text-muted-foreground mt-1">Monthly Projected</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Based on current sales</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 text-center">
                  <p className="text-3xl font-bold text-purple-400">{mockPartners.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Local Providers</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Selling through you</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base">How It Works</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Create Plans', desc: 'Set hosting plans with your pricing', icon: Package },
                  { step: '2', title: 'Partners Sell', desc: 'Local providers sell to their clients', icon: Users },
                  { step: '3', title: 'Auto Provision', desc: 'cPanel accounts created instantly', icon: Zap },
                  { step: '4', title: 'Earn 30-40%', desc: 'Commission auto-credited to wallet', icon: DollarSign },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="text-center p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                        <span className="text-xs font-bold text-blue-400">{item.step}</span>
                      </div>
                      <Icon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hosting Plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 gap-3">
          {mockPlans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-emerald-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{plan.name}</p>
                          <Badge variant="outline" className="text-[10px] uppercase">{plan.type}</Badge>
                          <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-none text-[10px]">
                            {plan.commission}% commission
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{plan.disk} • {plan.bandwidth} BW • {plan.domains} domain{plan.domains > 1 ? 's' : ''} • {plan.ssl ? 'Free SSL' : 'No SSL'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Your Cost</p>
                        <p className="text-sm font-semibold text-foreground">${plan.price}/mo</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Sell At</p>
                        <p className="text-sm font-bold text-emerald-400">${plan.sellingPrice}/mo</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Profit/Sale</p>
                        <p className="text-sm font-bold text-cyan-400">${plan.sellingPrice - plan.price}/mo</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Active</p>
                        <p className="text-sm font-semibold text-foreground">{plan.activeSales}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Partners List */}
      {activeTab === 'partners' && (
        <div className="space-y-3">
          {mockPartners.map((partner, i) => (
            <motion.div key={partner.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-purple-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{partner.name}</p>
                          <Badge variant="outline" className={`text-[10px] ${partner.status === 'active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'} border-none capitalize`}>{partner.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{partner.company} • {partner.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Sales</p>
                        <p className="text-sm font-semibold text-foreground">{partner.totalSales}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-semibold text-emerald-400">${partner.revenue}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Commission ({partner.commissionRate}%)</p>
                        <p className="text-sm font-semibold text-amber-400">${partner.commission}</p>
                      </div>
                      <Button variant="outline" size="sm"><Eye className="w-3 h-3 mr-1" /> View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Plan Form */}
      {activeTab === 'create-plan' && (
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-400" /> Create Hosting Plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Plan Name *</Label><Input placeholder="e.g. Business Pro" className="bg-background border-border" /></div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select><SelectTrigger className="bg-background border-border"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">Shared Hosting</SelectItem>
                    <SelectItem value="vps">VPS</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Your Cost ($/mo) *</Label><Input type="number" placeholder="10" className="bg-background border-border" /></div>
              <div className="space-y-2"><Label>Selling Price ($/mo) *</Label><Input type="number" placeholder="19" className="bg-background border-border" /></div>
              <div className="space-y-2"><Label>Commission Rate (%)</Label><Input type="number" placeholder="35" className="bg-background border-border" /></div>
              <div className="space-y-2"><Label>Disk Space</Label><Input placeholder="25 GB SSD" className="bg-background border-border" /></div>
              <div className="space-y-2"><Label>Bandwidth</Label><Input placeholder="200 GB" className="bg-background border-border" /></div>
              <div className="space-y-2"><Label>Max Domains</Label><Input type="number" placeholder="5" className="bg-background border-border" /></div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full" onClick={() => toast.success('Hosting plan created!')}>
              <Plus className="w-4 h-4 mr-2" /> Create Hosting Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HostingReseller;
