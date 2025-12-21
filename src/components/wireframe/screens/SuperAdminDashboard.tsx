import React from 'react';
import { 
  Target, Users, Code2, Building2, Headphones, DollarSign, 
  TrendingUp, Globe, Clock, Zap, AlertTriangle, CheckCircle,
  ArrowUp, ArrowDown, Activity, Map
} from 'lucide-react';
import { KPITile } from '../components/KPITile';
import { ModuleTile } from '../components/ModuleTile';
import { BuzzerAlert } from '../components/BuzzerAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function SuperAdminDashboard() {
  const isDark = true;

  const topKPIs = [
    { title: 'Total Revenue', value: '₹12.5M', icon: DollarSign, trend: 'up' as const, trendValue: '+12%', color: 'bg-emerald-500' },
    { title: 'Active Leads', value: '2,847', icon: Target, trend: 'up' as const, trendValue: '+8%', color: 'bg-cyan-500' },
    { title: 'Performance', value: '94.2%', icon: TrendingUp, trend: 'up' as const, trendValue: '+3%', color: 'bg-purple-500' },
    { title: 'System Uptime', value: '99.9%', icon: Activity, trend: 'neutral' as const, trendValue: '0%', color: 'bg-blue-500' },
  ];

  const moduleTiles = [
    { title: 'Leads', icon: Target, color: 'bg-teal-500', stats: { pending: 45, active: 128, done: 892 }, trend: 'up' as const, trendValue: '+15%' },
    { title: 'Developers', icon: Code2, color: 'bg-purple-500', stats: { pending: 12, active: 38, done: 156 }, trend: 'up' as const, trendValue: '+5%' },
    { title: 'Tasks', icon: Clock, color: 'bg-indigo-500', stats: { pending: 67, active: 23, done: 445 }, trend: 'down' as const, trendValue: '-2%' },
    { title: 'Franchise', icon: Building2, color: 'bg-blue-500', stats: { pending: 8, active: 45, done: 12 }, trend: 'up' as const, trendValue: '+10%' },
    { title: 'Resellers', icon: Users, color: 'bg-cyan-500', stats: { pending: 15, active: 89, done: 234 }, trend: 'up' as const, trendValue: '+22%' },
    { title: 'Support', icon: Headphones, color: 'bg-sky-500', stats: { pending: 23, active: 12, done: 567 }, trend: 'down' as const, trendValue: '-5%' },
    { title: 'Finance', icon: DollarSign, color: 'bg-emerald-500', stats: { pending: 5, active: 2, done: 89 }, trend: 'up' as const, trendValue: '+8%' },
    { title: 'SEO', icon: Globe, color: 'bg-green-500', stats: { pending: 3, active: 15, done: 45 }, trend: 'up' as const, trendValue: '+18%' },
    { title: 'Performance', icon: TrendingUp, color: 'bg-rose-500', stats: { pending: 0, active: 21, done: 21 }, trend: 'up' as const, trendValue: '+3%' },
    { title: 'Demos', icon: Zap, color: 'bg-violet-500', stats: { pending: 4, active: 67, done: 0 }, trend: 'neutral' as const, trendValue: '0%' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            WELCOME BOSS
          </h1>
          <p className="text-muted-foreground">Super Admin Dashboard • Live Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            All Systems Online
          </Badge>
          <Button variant="outline">
            <Map className="h-4 w-4 mr-2" />
            View Branch Map
          </Button>
        </div>
      </div>

      {/* Buzzer Alert (if active) */}
      <BuzzerAlert
        type="lead"
        title="Hot Lead Waiting"
        description="Lead #L-2847 from Mumbai region needs immediate attention"
        priority="high"
        countdown={45}
        isDark={isDark}
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topKPIs.map((kpi, idx) => (
          <KPITile key={idx} {...kpi} isDark={isDark} />
        ))}
      </div>

      {/* Developer Timer Preview */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-500" />
            Active Developer Timers
          </h3>
          <Badge variant="outline">12 Running</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'DEV***042', task: 'API Integration', time: '02:34:12', progress: 65 },
            { name: 'DEV***018', task: 'UI Fixes', time: '01:15:45', progress: 40 },
            { name: 'DEV***089', task: 'Bug Fix', time: '00:45:30', progress: 80 },
            { name: 'DEV***034', task: 'Feature Dev', time: '03:12:00', progress: 25 },
            { name: 'DEV***056', task: 'Testing', time: '00:30:15', progress: 90 },
            { name: 'DEV***071', task: 'Documentation', time: '01:00:00', progress: 55 },
          ].map((dev, idx) => (
            <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">{dev.name}</span>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-muted-foreground truncate mb-1">{dev.task}</p>
              <p className="text-sm font-mono font-bold text-cyan-500">{dev.time}</p>
              <Progress value={dev.progress} className="h-1 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Module Tiles Grid (10 tiles) */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          Module Activity Overview
          <Badge variant="outline" className="text-xs ml-2">Drag to reorder</Badge>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {moduleTiles.map((tile, idx) => (
            <ModuleTile key={idx} {...tile} isDark={isDark} />
          ))}
        </div>
      </div>

      {/* World Map + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* World Map */}
        <div className={`lg:col-span-2 p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-500" />
            Global Branch Network
          </h3>
          <div className={`h-64 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className="text-center">
              <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Interactive World Map</p>
              <p className="text-sm text-cyan-500">45 Active Branches</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { region: 'India', branches: 25, leads: 1245 },
              { region: 'USA', branches: 8, leads: 456 },
              { region: 'UK', branches: 12, leads: 678 },
            ].map((r, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <p className="font-semibold">{r.region}</p>
                <p className="text-xs text-muted-foreground">{r.branches} branches • {r.leads} leads</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {[
              { icon: ArrowUp, color: 'text-emerald-500', text: 'Lead conversion up 15% this week' },
              { icon: AlertTriangle, color: 'text-amber-500', text: '3 demos need health check' },
              { icon: CheckCircle, color: 'text-cyan-500', text: 'All SLAs met for 7 days straight' },
              { icon: TrendingUp, color: 'text-purple-500', text: 'Developer productivity at peak' },
              { icon: ArrowDown, color: 'text-red-500', text: 'Support tickets higher than usual' },
            ].map((insight, idx) => (
              <div key={idx} className={`p-3 rounded-lg flex items-start gap-3 ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <insight.icon className={`h-4 w-4 mt-0.5 ${insight.color}`} />
                <p className="text-sm">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
