/**
 * RESELLER DASHBOARD - ACTION VIEW
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingUp,
  Clock,
  IndianRupee,
  Eye,
  Share2,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { RSSection } from '../RSFullSidebar';

interface RSDashboardScreenProps {
  onNavigate: (section: RSSection) => void;
}

export function RSDashboardScreen({ onNavigate }: RSDashboardScreenProps) {
  const stats = [
    { label: 'Today Leads', value: '8', icon: Users, color: 'emerald', change: '+3' },
    { label: 'Active Deals', value: '12', icon: TrendingUp, color: 'blue', change: '+2' },
    { label: 'Pending Payments', value: '₹45,000', icon: Clock, color: 'amber', change: '' },
    { label: 'Commission Earned', value: '₹1,25,000', icon: IndianRupee, color: 'green', change: '+₹15K' },
  ];

  const recentLeads = [
    { name: 'Rahul Sharma', source: 'WhatsApp', status: 'Hot', time: '2 min ago' },
    { name: 'Priya Patel', source: 'Website', status: 'Warm', time: '15 min ago' },
    { name: 'Amit Kumar', source: 'Google Ads', status: 'New', time: '1 hour ago' },
  ];

  const pendingApprovals = [
    { order: 'ORD-2024-001', product: 'School ERP', amount: '₹75,000', status: 'Awaiting' },
    { order: 'ORD-2024-002', product: 'Hospital HMS', amount: '₹1,20,000', status: 'Review' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome back, Reseller</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          Active Reseller
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                      <Icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                    {stat.change && (
                      <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs">
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => onNavigate('leads')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Leads
        </Button>
        <Button
          onClick={() => onNavigate('products')}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Product
        </Button>
        <Button
          onClick={() => onNavigate('leads')}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Phone className="h-4 w-4 mr-2" />
          Follow Up
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center justify-between">
              Recent Leads
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('leads')}
                className="text-emerald-400 hover:text-emerald-300"
              >
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.map((lead, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.source} • {lead.time}</p>
                </div>
                <Badge
                  className={
                    lead.status === 'Hot'
                      ? 'bg-red-500/20 text-red-400'
                      : lead.status === 'Warm'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }
                >
                  {lead.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center justify-between">
              Pending Approvals
              <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                {pendingApprovals.length} Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
              >
                <div>
                  <p className="text-white font-medium">{item.order}</p>
                  <p className="text-xs text-slate-400">{item.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-medium">{item.amount}</p>
                  <Badge className="bg-amber-500/20 text-amber-400 text-xs">{item.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
