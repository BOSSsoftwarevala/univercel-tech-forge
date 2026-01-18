import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, TrendingUp, Users, Calendar, BarChart3, Eye, Edit,
  Pause, Play, Trash2, FileSearch
} from 'lucide-react';

const metrics = [
  { label: 'Total Leads', value: '3,717', change: '+12.5%', icon: Target, color: 'text-primary' },
  { label: 'Active Leads', value: '1,892', change: '+8.2%', icon: Users, color: 'text-green-500' },
  { label: 'Hot Leads', value: '234', change: '+15.3%', icon: TrendingUp, color: 'text-orange-500' },
  { label: 'Cold Leads', value: '891', change: '-2.1%', icon: Calendar, color: 'text-blue-500' },
  { label: 'Today\'s Leads', value: '47', change: '+23.1%', icon: Calendar, color: 'text-purple-500' },
  { label: 'Conversion Rate', value: '24.8%', change: '+3.2%', icon: BarChart3, color: 'text-green-500' },
];

const recentLeads = [
  { id: 1, name: 'Rahul Sharma', source: 'Google Ads', status: 'New', score: 85, time: '2 mins ago' },
  { id: 2, name: 'Priya Patel', source: 'Website', status: 'Contacted', score: 72, time: '15 mins ago' },
  { id: 3, name: 'Amit Kumar', source: 'Facebook', status: 'Interested', score: 91, time: '32 mins ago' },
  { id: 4, name: 'Sneha Gupta', source: 'Referral', status: 'Follow-Up', score: 68, time: '1 hour ago' },
  { id: 5, name: 'Vikram Singh', source: 'LinkedIn', status: 'New', score: 78, time: '2 hours ago' },
];

const LMOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Dashboard</h1>
          <p className="text-muted-foreground">Complete overview of your lead ecosystem</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Live Data
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Leads Table */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Leads</span>
            <Badge variant="secondary">{recentLeads.length} New</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                {recentLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-accent/30 transition-colors"
                  >
                    <td className="p-3">
                      <span className="font-medium text-foreground">{lead.name}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant="secondary"
                        className={`text-xs ${
                          lead.status === 'New' ? 'bg-blue-500/20 text-blue-400' :
                          lead.status === 'Interested' ? 'bg-green-500/20 text-green-400' :
                          lead.status === 'Contacted' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-accent rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              lead.score >= 80 ? 'bg-green-500' :
                              lead.score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{lead.score}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{lead.time}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Pause className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <FileSearch className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alert System */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-red-400">Over-Permission Detected</p>
              <p className="text-xs text-muted-foreground">3 alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Pending Approval</p>
              <p className="text-xs text-muted-foreground">12 leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-blue-400">AI Suggestion Available</p>
              <p className="text-xs text-muted-foreground">5 suggestions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">System-Locked Leads</p>
              <p className="text-xs text-muted-foreground">8 locked</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LMOverview;
