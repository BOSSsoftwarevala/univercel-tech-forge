/**
 * LEAD SOURCES
 * All supported lead sources
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, Globe, Monitor, ShoppingCart, Building2, Handshake,
  Briefcase, Search, Target, Instagram, PenLine
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const sources = [
  { id: 'website', name: 'Website Forms', icon: Globe, leads: 234, active: true, color: 'from-blue-500 to-cyan-600' },
  { id: 'demo', name: 'Demo Requests', icon: Monitor, leads: 156, active: true, color: 'from-violet-500 to-purple-600' },
  { id: 'order', name: 'Order Page', icon: ShoppingCart, leads: 89, active: true, color: 'from-emerald-500 to-teal-600' },
  { id: 'franchise', name: 'Franchise Apply', icon: Building2, leads: 45, active: true, color: 'from-amber-500 to-orange-600' },
  { id: 'reseller', name: 'Reseller Apply', icon: Handshake, leads: 32, active: true, color: 'from-rose-500 to-pink-600' },
  { id: 'job', name: 'Job Apply', icon: Briefcase, leads: 78, active: true, color: 'from-indigo-500 to-blue-600' },
  { id: 'seo', name: 'SEO Organic', icon: Search, leads: 412, active: true, color: 'from-green-500 to-emerald-600' },
  { id: 'google', name: 'Google Ads', icon: Target, leads: 189, active: true, color: 'from-red-500 to-orange-600' },
  { id: 'meta', name: 'Meta Ads', icon: Instagram, leads: 134, active: true, color: 'from-pink-500 to-rose-600' },
  { id: 'influencer', name: 'Influencer Links', icon: Instagram, leads: 67, active: true, color: 'from-fuchsia-500 to-purple-600' },
  { id: 'manual', name: 'Manual Entry', icon: PenLine, leads: 56, active: true, color: 'from-gray-500 to-slate-600' },
];

export const LeadSources: React.FC = () => {
  const totalLeads = sources.reduce((sum, s) => sum + s.leads, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400" />
          Lead Sources
        </h1>
        <p className="text-sm text-muted-foreground">All supported lead capture sources</p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Leads from All Sources</p>
              <p className="text-3xl font-bold text-foreground">{totalLeads.toLocaleString()}</p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {sources.filter(s => s.active).length} Active Sources
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sources Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sources.map((source, idx) => {
          const Icon = source.icon;
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card/80 border-border/50 hover:border-emerald-500/30 transition-all group cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${source.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant={source.active ? 'default' : 'secondary'} className="text-[10px]">
                      {source.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{source.name}</h3>
                  <p className="text-2xl font-bold text-foreground mt-1">{source.leads}</p>
                  <p className="text-xs text-muted-foreground">leads captured</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
