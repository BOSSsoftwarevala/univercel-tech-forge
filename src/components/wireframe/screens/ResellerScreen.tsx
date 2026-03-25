import React from 'react';
import { 
  Users, Link, BarChart3, TrendingUp, Copy, ExternalLink,
  Target, DollarSign, ArrowRight, Sparkles, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { WalletChip } from '../components/WalletChip';

export function ResellerScreen() {
  const isDark = true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-500" />
            Reseller Dashboard
          </h1>
          <p className="text-muted-foreground">RES***042 • Mumbai West</p>
        </div>
        <WalletChip balance={8750} compact isDark={isDark} />
      </div>

      {/* Referral Link Generator */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Link className="h-5 w-5 text-cyan-500" />
          <h3 className="font-semibold">Referral Link Generator</h3>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            value="https://softwarevala.com/demo?ref=RES042&camp=summer24"
            readOnly
            className="flex-1 font-mono text-sm"
          />
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span>Campaign: Summer 2024</span>
          <span>•</span>
          <span>Commission: 10%</span>
          <span>•</span>
          <span>Active: Yes</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Clicks', value: '1,234', icon: Link, color: 'bg-cyan-500', change: '+156 today' },
          { title: 'Conversions', value: '89', icon: Target, color: 'bg-emerald-500', change: '7.2% rate' },
          { title: 'Commission Earned', value: '₹24,500', icon: DollarSign, color: 'bg-purple-500', change: '+₹3,200' },
          { title: 'Active Leads', value: '23', icon: Users, color: 'bg-amber-500', change: '5 hot' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-cyan-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Click & Conversion Chart */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Click & Conversion Trends
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Last 7 Days</Badge>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className={`h-48 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-emerald-500 mb-2" />
            <p className="text-muted-foreground">Conversion Rate Chart</p>
            <p className="text-sm text-emerald-500">+15% this week</p>
          </div>
        </div>
      </div>

      {/* Commission Tracker */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          Commission Tracker
        </h3>
        <div className="space-y-4">
          {[
            { lead: 'L-2845', product: 'School ERP', amount: 5000, status: 'paid' },
            { lead: 'L-2840', product: 'Hospital CRM', amount: 7500, status: 'pending' },
            { lead: 'L-2838', product: 'POS System', amount: 3500, status: 'processing' },
          ].map((comm, idx) => (
            <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{comm.lead}</Badge>
                  <span className="font-medium">{comm.product}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-emerald-500">₹{comm.amount.toLocaleString()}</span>
                <Badge className={
                  comm.status === 'paid' ? 'bg-emerald-500' :
                  comm.status === 'pending' ? 'bg-amber-500' : 'bg-cyan-500'
                }>
                  {comm.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Forwarding & AI Script */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-cyan-500" />
            Lead Forwarding
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Forward qualified leads to franchise for demo scheduling</p>
          <Button className="w-full">Forward Lead to Franchise</Button>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Script Helper
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Get AI-powered sales scripts for different scenarios</p>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">Open AI Chatbot</Button>
        </div>
      </div>
    </div>
  );
}
