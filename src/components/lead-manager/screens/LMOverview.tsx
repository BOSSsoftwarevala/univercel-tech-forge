import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, TrendingUp, Users, Calendar, BarChart3, Eye, Edit,
  Pause, Play, Trash2, FileSearch, Loader2, AlertCircle
} from 'lucide-react';
import { useLeadStats, useLeads } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const LMOverview = () => {
  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const { data: recentLeads, isLoading: leadsLoading } = useLeads();

  const metrics = [
    { label: 'Total Leads', value: stats?.total?.toLocaleString() || '0', change: '+12.5%', icon: Target, color: 'text-primary' },
    { label: 'Active Leads', value: ((stats?.total || 0) - (stats?.won || 0) - (stats?.lost || 0)).toLocaleString(), change: '+8.2%', icon: Users, color: 'text-green-500' },
    { label: 'Hot Leads', value: (stats?.byPriority?.hot || 0).toLocaleString(), change: '+15.3%', icon: TrendingUp, color: 'text-orange-500' },
    { label: 'Cold Leads', value: (stats?.byPriority?.cold || 0).toLocaleString(), change: '-2.1%', icon: Calendar, color: 'text-blue-500' },
    { label: "Today's Leads", value: (stats?.todayCount || 0).toString(), change: '+23.1%', icon: Calendar, color: 'text-purple-500' },
    { label: 'Conversion Rate', value: `${stats?.conversionRate || '0'}%`, change: '+3.2%', icon: BarChart3, color: 'text-green-500' },
  ];

  const recent = (recentLeads || []).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Dashboard</h1>
          <p className="text-muted-foreground">Complete overview of your lead ecosystem</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          {statsLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{statsLoading ? '...' : metric.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Leads</span>
            <Badge variant="secondary">{recent.length} Recent</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leadsLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-sm">No leads yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Source</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Score</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((lead, index) => (
                    <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent/30 transition-colors">
                      <td className="p-3">
                        <div>
                          <span className="font-medium text-foreground">{lead.name}</span>
                          {lead.company && <p className="text-xs text-muted-foreground">{lead.company}</p>}
                        </div>
                      </td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{lead.source}</Badge></td>
                      <td className="p-3">
                        <Badge variant="secondary" className={`text-xs ${
                          lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                          lead.status === 'contacted' ? 'bg-purple-500/20 text-purple-400' :
                          lead.status === 'closed_won' ? 'bg-emerald-500/20 text-emerald-400' :
                          lead.status === 'closed_lost' ? 'bg-red-500/20 text-red-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>{lead.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-accent rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${(lead.ai_score || 0) >= 80 ? 'bg-green-500' : (lead.ai_score || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${lead.ai_score || 0}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{lead.ai_score || '—'}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-red-400">Hot Leads</p>
              <p className="text-xs text-muted-foreground">{stats?.byPriority?.hot || 0} leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Follow-Up Required</p>
              <p className="text-xs text-muted-foreground">{stats?.byStatus?.follow_up || 0} leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-blue-400">New Unassigned</p>
              <p className="text-xs text-muted-foreground">{stats?.byStatus?.new || 0} leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-green-400">Won This Period</p>
              <p className="text-xs text-muted-foreground">{stats?.won || 0} converted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LMOverview;
