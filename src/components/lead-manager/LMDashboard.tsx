import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Target, AlertTriangle, Clock, CheckCircle,
  XCircle, Zap, Globe, Brain, Phone, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { leadSourcesConfig, pipelineStages, sampleLeads } from './data/leadData';

const LMDashboard = () => {
  const totalLeads = leadSourcesConfig.reduce((sum, src) => sum + src.totalLeads, 0);
  const avgConversion = leadSourcesConfig.reduce((sum, src) => sum + src.conversionRate, 0) / leadSourcesConfig.length;

  const stats = [
    { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: Users, color: 'primary', change: '+12.5%' },
    { label: 'Conversion Rate', value: `${avgConversion.toFixed(1)}%`, icon: TrendingUp, color: 'green', change: '+3.2%' },
    { label: 'Active Pipeline', value: '₹18.05L', icon: Target, color: 'blue', change: '+8.7%' },
    { label: 'Pending Follow-ups', value: '47', icon: Clock, color: 'orange', change: '-5' },
    { label: 'Won This Month', value: '28', icon: CheckCircle, color: 'emerald', change: '+4' },
    { label: 'At Risk', value: '12', icon: AlertTriangle, color: 'red', change: '+2' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  <Badge variant="secondary" className={`text-xs ${
                    stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Overview */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Sales Pipeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-9 gap-2">
            {pipelineStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className={`p-3 rounded-lg bg-${stage.color}-500/10 border border-${stage.color}-500/20 mb-2`}>
                  <p className="text-xl font-bold text-foreground">{stage.count}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{stage.name}</p>
                {stage.value > 0 && (
                  <p className="text-xs font-medium text-primary mt-1">
                    ₹{(stage.value / 1000).toFixed(0)}K
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Performance & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Performance */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Lead Sources Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leadSourcesConfig.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg bg-${source.color}-500/20 flex items-center justify-center`}>
                  <Globe className={`w-4 h-4 text-${source.color}-500`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{source.name}</span>
                    <span className="text-xs text-muted-foreground">{source.totalLeads} leads</span>
                  </div>
                  <Progress value={source.conversionRate} className="h-1.5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {source.conversionRate}%
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent High-Priority Leads */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              High Priority Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-accent/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                  </div>
                  <Badge className={`${
                    lead.priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    lead.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {lead.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    AI: {lead.aiScore}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Conv: {lead.conversionProbability}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lead.lastActivityTime}
                  </span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium text-foreground">Best Performing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                WhatsApp leads have 28.7% conversion rate - highest this month
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-foreground">Attention Needed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                12 high-priority leads haven't been contacted in 48+ hours
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-foreground">Best Time to Call</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Peak conversion hours: 10AM-12PM and 3PM-5PM IST
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMDashboard;
