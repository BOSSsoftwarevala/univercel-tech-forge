/**
 * FRANCHISE OWNER - TEAM MONITORING & PERFORMANCE
 * KPIs, Sales Graphs, Individual Performance
 */

import React from 'react';
import { 
  TrendingUp, Users, Target, Clock, Zap, Award,
  BarChart3, LineChart, DollarSign, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const teamMembers = [
  { 
    id: 1, 
    name: 'Rahul Sharma', 
    role: 'Sales Lead',
    avatar: 'RS',
    sales: 156000,
    leads: 45,
    conversions: 15,
    conversionRate: 33,
    responseTime: '2.5 min',
    performance: 95,
    trend: '+12%'
  },
  { 
    id: 2, 
    name: 'Priya Patel', 
    role: 'Sales Executive',
    avatar: 'PP',
    sales: 98000,
    leads: 38,
    conversions: 11,
    conversionRate: 29,
    responseTime: '3.2 min',
    performance: 88,
    trend: '+8%'
  },
  { 
    id: 3, 
    name: 'Amit Kumar', 
    role: 'Field Agent',
    avatar: 'AK',
    sales: 125000,
    leads: 52,
    conversions: 18,
    conversionRate: 35,
    responseTime: '1.8 min',
    performance: 98,
    trend: '+15%'
  },
  { 
    id: 4, 
    name: 'Sneha Gupta', 
    role: 'Support Lead',
    avatar: 'SG',
    sales: 45000,
    leads: 28,
    conversions: 8,
    conversionRate: 28,
    responseTime: '4.1 min',
    performance: 82,
    trend: '+5%'
  },
];

const kpiCards = [
  { title: 'Team Revenue', value: '₹8.5L', icon: DollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { title: 'Avg Conversion', value: '31%', icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { title: 'Lead Response', value: '2.9 min', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { title: 'Team Score', value: '92%', icon: Zap, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
];

export function FOTeamPerformance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Team Monitoring & Performance
          </h1>
          <p className="text-muted-foreground">Individual KPIs • Sales Graphs • Revenue Contribution</p>
        </div>
        <Badge className="bg-emerald-500">Live Tracking</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <Card key={idx} className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <span className="text-sm text-muted-foreground">{kpi.title}</span>
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Performance Dashboard */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 bg-background/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {member.trend}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Full Profile
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg">
                    <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                    <p className="text-lg font-bold">₹{(member.sales / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Sales</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <Target className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                    <p className="text-lg font-bold">{member.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <Zap className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                    <p className="text-lg font-bold">{member.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                    <p className="text-lg font-bold">{member.responseTime}</p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>
                  <div className="p-3 bg-card rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Award className="h-5 w-5 text-cyan-500" />
                      <span className="text-lg font-bold">{member.performance}%</span>
                    </div>
                    <Progress value={member.performance} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-center">Performance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Revenue by Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <span className="text-sm w-24 truncate">{member.name.split(' ')[0]}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-cyan-500 transition-all"
                      style={{ width: `${(member.sales / 160000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">₹{(member.sales / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-emerald-500" />
              Conversion Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <span className="text-sm w-24 truncate">{member.name.split(' ')[0]}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all"
                      style={{ width: `${member.conversionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{member.conversionRate}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
