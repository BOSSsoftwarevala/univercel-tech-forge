import React from 'react';
import { 
  Building2, MapPin, Users, Target, Wallet, Play, AlertTriangle,
  TrendingUp, BarChart3, Plus, ExternalLink, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WalletChip } from '../components/WalletChip';

export function FranchiseScreen() {
  const isDark = true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            Franchise Dashboard
          </h1>
          <p className="text-muted-foreground">FR***015 • Mumbai Region</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500">Territory: Maharashtra</Badge>
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Escalate Issue
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Leads', value: '245', icon: Target, color: 'bg-teal-500', change: '+12%' },
          { title: 'Active Resellers', value: '18', icon: Users, color: 'bg-cyan-500', change: '+3' },
          { title: 'Demos This Month', value: '34', icon: Play, color: 'bg-purple-500', change: '+8%' },
          { title: 'Conversion Rate', value: '24%', icon: TrendingUp, color: 'bg-emerald-500', change: '+2%' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-emerald-500">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Territory Map */}
        <div className={`lg:col-span-2 p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Territory Map
          </h3>
          <div className={`h-64 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-blue-500 mb-2" />
              <p className="text-muted-foreground">Maharashtra Territory Map</p>
              <p className="text-sm text-cyan-500">8 Cities • 18 Resellers</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {['Mumbai', 'Pune', 'Nagpur', 'Nashik'].map((city) => (
              <div key={city} className={`p-2 rounded-lg text-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <p className="font-medium">{city}</p>
                <p className="text-xs text-muted-foreground">5 resellers</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Commission */}
        <div className="space-y-4">
          <WalletChip balance={45230} pendingAmount={5600} isDark={isDark} />
          
          {/* AI Sales Helper */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">AI Sales Helper</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Get AI-powered insights for your sales strategy
            </p>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Lead Distribution Chart */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-500" />
            Lead Distribution by Reseller
          </h3>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'RES***001', leads: 45, conversion: 28 },
            { name: 'RES***002', leads: 38, conversion: 22 },
            { name: 'RES***003', leads: 32, conversion: 18 },
            { name: 'RES***004', leads: 28, conversion: 15 },
          ].map((reseller) => (
            <div key={reseller.name} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium">{reseller.name}</span>
              <div className="flex-1">
                <Progress value={(reseller.leads / 45) * 100} className="h-2" />
              </div>
              <div className="text-right w-32">
                <span className="text-sm">{reseller.leads} leads</span>
                <span className="text-xs text-muted-foreground ml-2">({reseller.conversion}% conv)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Request Modal Trigger */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold">Request Demo for Lead</h3>
              <p className="text-sm text-muted-foreground">Schedule product demo for qualified leads</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-violet-500">
            <Plus className="h-4 w-4 mr-2" />
            Request Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
