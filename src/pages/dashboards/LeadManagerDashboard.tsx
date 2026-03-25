import { motion } from 'framer-motion';
import { 
  Users, Target, Briefcase, AlertTriangle, TrendingUp,
  Clock, CheckCircle, XCircle, ArrowUpRight, MapPin
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const LeadManagerDashboard = () => {
  const leadStats = {
    totalLeads: 2847,
    newToday: 156,
    assigned: 2341,
    unassigned: 506,
    conversionRate: 34.2,
    avgResponseTime: '2.4h'
  };

  const pipelineStages = [
    { stage: 'New', count: 506, color: 'bg-neon-cyan' },
    { stage: 'Contacted', count: 892, color: 'bg-neon-blue' },
    { stage: 'Qualified', count: 634, color: 'bg-neon-purple' },
    { stage: 'Proposal', count: 423, color: 'bg-neon-orange' },
    { stage: 'Negotiation', count: 245, color: 'bg-neon-teal' },
    { stage: 'Closed Won', count: 147, color: 'bg-neon-green' },
  ];

  const recentLeads = [
    { id: 1, name: 'Tech****rp', region: 'Mumbai', score: 92, status: 'hot', assignee: 'Fra***01' },
    { id: 2, name: 'Glob****ns', region: 'Delhi', score: 78, status: 'warm', assignee: 'Res***12' },
    { id: 3, name: 'Star****td', region: 'Bangalore', score: 65, status: 'cold', assignee: null },
    { id: 4, name: 'Digi****bs', region: 'Chennai', score: 88, status: 'hot', assignee: 'Fra***03' },
    { id: 5, name: 'Inno****ch', region: 'Hyderabad', score: 71, status: 'warm', assignee: null },
  ];

  const regionData = [
    { region: 'North India', leads: 892, conversion: 38 },
    { region: 'South India', leads: 756, conversion: 42 },
    { region: 'West India', leads: 634, conversion: 35 },
    { region: 'East India', leads: 345, conversion: 29 },
    { region: 'International', leads: 220, conversion: 45 },
  ];

  return (
    <DashboardLayout roleOverride="lead_manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">Lead Command Center</h1>
            <p className="text-muted-foreground">Real-time lead pipeline management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Target className="w-4 h-4" />
              Assign Leads
            </Button>
            <Button className="gap-2 bg-primary/20 text-primary border border-primary/50">
              <ArrowUpRight className="w-4 h-4" />
              Import Leads
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Leads', value: leadStats.totalLeads.toLocaleString(), icon: Users, trend: '+12%' },
            { label: 'New Today', value: leadStats.newToday, icon: TrendingUp, trend: '+8%' },
            { label: 'Assigned', value: leadStats.assigned.toLocaleString(), icon: CheckCircle, trend: null },
            { label: 'Unassigned', value: leadStats.unassigned, icon: AlertTriangle, trend: null, alert: true },
            { label: 'Conversion', value: `${leadStats.conversionRate}%`, icon: Target, trend: '+2.1%' },
            { label: 'Avg Response', value: leadStats.avgResponseTime, icon: Clock, trend: '-15m' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`glass-panel ${stat.alert ? 'border-neon-orange/50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.alert ? 'text-neon-orange' : 'text-primary'}`} />
                    {stat.trend && (
                      <span className={`text-xs ${stat.trend.startsWith('+') ? 'text-neon-green' : 'text-neon-cyan'}`}>
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-mono font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Stages */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg font-mono">Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 h-16 mb-4">
              {pipelineStages.map((stage) => (
                <div
                  key={stage.stage}
                  className={`${stage.color} rounded-lg flex-1 flex items-center justify-center`}
                  style={{ flex: stage.count / 200 }}
                >
                  <span className="text-xs font-bold text-background">{stage.count}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {pipelineStages.map((stage) => (
                <span key={stage.stage}>{stage.stage}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        lead.status === 'hot' ? 'bg-neon-red' :
                        lead.status === 'warm' ? 'bg-neon-orange' : 'bg-muted-foreground'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {lead.region}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        Score: {lead.score}
                      </Badge>
                      {lead.assignee ? (
                        <span className="text-xs text-muted-foreground">{lead.assignee}</span>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Region Performance */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Region Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region) => (
                  <div key={region.region} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{region.region}</span>
                      <span className="text-muted-foreground">
                        {region.leads} leads • {region.conversion}% conv.
                      </span>
                    </div>
                    <Progress value={region.conversion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Alerts */}
        <Card className="glass-panel border-neon-orange/30">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2 text-neon-orange">
              <AlertTriangle className="w-5 h-5" />
              SLA Alerts (5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { lead: 'Tech****rp', sla: 'Response Overdue', time: '4h 23m' },
                { lead: 'Glob****ns', sla: 'Follow-up Due', time: '2h 15m' },
                { lead: 'Digi****bs', sla: 'Proposal Pending', time: '1h 45m' },
                { lead: 'Star****td', sla: 'Assignment Needed', time: '3h 10m' },
                { lead: 'Inno****ch', sla: 'Demo Scheduled', time: '30m' },
              ].map((alert, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/30"
                >
                  <p className="font-medium text-foreground text-sm">{alert.lead}</p>
                  <p className="text-xs text-neon-orange">{alert.sla}</p>
                  <p className="text-xs text-muted-foreground mt-1">Overdue: {alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeadManagerDashboard;
