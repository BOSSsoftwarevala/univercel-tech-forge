import React, { useState } from 'react';
import { 
  TrendingUp, Users, Target, Award, Clock, BarChart3, Calendar,
  ArrowUpRight, ArrowDownRight, Star, Zap, Trophy, AlertTriangle,
  Filter, Search, Download, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const teamMembers = [
  { id: 'DEV***042', name: 'Developer 1', role: 'developer', score: 94, tasks: 28, onTime: 96, quality: 92, trend: 'up' },
  { id: 'DEV***018', name: 'Developer 2', role: 'developer', score: 87, tasks: 22, onTime: 88, quality: 85, trend: 'down' },
  { id: 'CSM***001', name: 'CS Manager 1', role: 'client_success', score: 91, tasks: 45, onTime: 94, quality: 90, trend: 'up' },
  { id: 'SEO***003', name: 'SEO Specialist', role: 'seo_manager', score: 89, tasks: 18, onTime: 92, quality: 88, trend: 'stable' },
];

const kpis = [
  { label: 'Overall Score', value: 90.2, target: 85, unit: '%', color: 'emerald' },
  { label: 'Task Completion', value: 94, target: 90, unit: '%', color: 'cyan' },
  { label: 'Avg Response Time', value: 2.4, target: 3, unit: 'h', color: 'violet' },
  { label: 'Client Satisfaction', value: 4.6, target: 4.5, unit: '/5', color: 'amber' },
];

const leaderboard = [
  { rank: 1, id: 'DEV***042', score: 94, badge: 'Gold', streak: 12 },
  { rank: 2, id: 'CSM***001', score: 91, badge: 'Silver', streak: 8 },
  { rank: 3, id: 'SEO***003', score: 89, badge: 'Bronze', streak: 5 },
  { rank: 4, id: 'DEV***018', score: 87, badge: null, streak: 3 },
];

const alerts = [
  { id: 1, type: 'underperforming', message: 'DEV***018 below target for 3 consecutive weeks', severity: 'warning' },
  { id: 2, type: 'excellence', message: 'DEV***042 achieved 12-week streak', severity: 'success' },
];

export function PerformanceManagerScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const isDark = true;

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-red-400" />;
    return <span className="h-4 w-4 text-slate-400">—</span>;
  };

  const getBadgeColor = (badge: string | null) => {
    if (badge === 'Gold') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (badge === 'Silver') return 'bg-slate-400/20 text-slate-300 border-slate-400/30';
    if (badge === 'Bronze') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-rose-500" />
            Performance Manager
          </h1>
          <p className="text-muted-foreground">Team metrics, KPIs, and performance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 text-emerald-500 border-emerald-500">
            <Trophy className="h-3 w-3" />
            Team Score: 90.2
          </Badge>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Review
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const isAboveTarget = kpi.label === 'Avg Response Time' 
            ? kpi.value < kpi.target 
            : kpi.value >= kpi.target;
          return (
            <div 
              key={kpi.label}
              className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{kpi.label}</span>
                {isAboveTarget ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold text-${kpi.color}-400`}>{kpi.value}</span>
                <span className="text-sm text-muted-foreground">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Target: {kpi.target}{kpi.unit}</span>
                <Badge className={isAboveTarget ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                  {isAboveTarget ? 'On Track' : 'Below'}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Team Overview
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Individual Metrics
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
            {alerts.length > 0 && <Badge variant="destructive" className="text-[10px] h-4 px-1">{alerts.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* Team Overview */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-500" />
                Performance Distribution
              </h3>
              <div className={`h-48 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-cyan-500 mb-2" />
                  <p className="text-muted-foreground">Team performance chart</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-rose-500" />
                Weekly Trend
              </h3>
              <div className={`h-48 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-rose-500 mb-2" />
                  <p className="text-muted-foreground">Performance trend over time</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Individual Metrics */}
        <TabsContent value="individual" className="mt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search team members..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Role
            </Button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className={`p-4 rounded-xl border transition-all hover:border-rose-500/50 ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      member.score >= 90 ? 'bg-emerald-500/20' :
                      member.score >= 80 ? 'bg-cyan-500/20' : 'bg-amber-500/20'
                    }`}>
                      <span className={`text-lg font-bold ${
                        member.score >= 90 ? 'text-emerald-400' :
                        member.score >= 80 ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        {member.score}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.id}</h3>
                        {getTrendIcon(member.trend)}
                      </div>
                      <Badge variant="outline" className="text-xs">{member.role.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Tasks</p>
                      <p className="font-bold">{member.tasks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">On-Time</p>
                      <p className="font-bold text-cyan-400">{member.onTime}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Quality</p>
                      <p className="font-bold text-violet-400">{member.quality}%</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="mt-4">
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            {leaderboard.map((entry, idx) => (
              <div 
                key={entry.id}
                className={`p-4 flex items-center justify-between ${
                  idx !== leaderboard.length - 1 ? 'border-b' : ''
                } ${isDark ? 'border-slate-700' : 'border-gray-200'} ${
                  entry.rank === 1 ? 'bg-amber-500/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    entry.rank === 1 ? 'bg-amber-500/20' :
                    entry.rank === 2 ? 'bg-slate-400/20' :
                    entry.rank === 3 ? 'bg-orange-500/20' : 'bg-slate-700/50'
                  }`}>
                    <span className="font-bold">#{entry.rank}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{entry.id}</h3>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{entry.streak} week streak</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {entry.badge && (
                    <Badge className={getBadgeColor(entry.badge)}>
                      <Trophy className="h-3 w-3 mr-1" />
                      {entry.badge}
                    </Badge>
                  )}
                  <div className="text-right">
                    <p className="text-2xl font-bold">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts" className="mt-4">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  alert.severity === 'warning' 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.severity === 'warning' ? (
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  ) : (
                    <Star className="h-6 w-6 text-emerald-500" />
                  )}
                  <div>
                    <Badge className={alert.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}>
                      {alert.type.replace('_', ' ')}
                    </Badge>
                    <p className="font-medium mt-1">{alert.message}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Take Action
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
