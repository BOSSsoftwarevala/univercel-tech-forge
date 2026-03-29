import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flame,
  ThermometerSun,
  Snowflake,
  Activity,
  BarChart3
} from "lucide-react";

const LeadDashboard = () => {
  const metrics = [
    { label: "Total Leads", value: "1,247", change: "+47", icon: Users, color: "text-primary" },
    { label: "New Today", value: "38", change: "+12", icon: TrendingUp, color: "text-neon-green" },
    { label: "Converted", value: "234", change: "+8", icon: Target, color: "text-emerald-400" },
    { label: "Pending Follow-up", value: "156", change: "-23", icon: Clock, color: "text-orange-400" },
    { label: "Hot Leads", value: "42", change: "+5", icon: Flame, color: "text-red-400" },
    { label: "Escalated", value: "7", change: "-2", icon: AlertTriangle, color: "text-yellow-400" },
  ];

  const statusBreakdown = [
    { status: "New", count: 89, percentage: 28, color: "bg-primary" },
    { status: "Assigned", count: 156, percentage: 45, color: "bg-neon-teal" },
    { status: "Follow-up", count: 78, percentage: 15, color: "bg-orange-400" },
    { status: "Qualified", count: 45, percentage: 8, color: "bg-neon-green" },
    { status: "Closed Won", count: 234, percentage: 4, color: "bg-emerald-400" },
  ];

  const priorityLeads = [
    { name: "Rajesh Kumar", company: "TechCorp India", score: 92, priority: "hot", source: "Demo", region: "Mumbai" },
    { name: "Priya Sharma", company: "HealthPlus", score: 87, priority: "hot", source: "Referral", region: "Delhi" },
    { name: "Amit Patel", company: "RetailMax", score: 78, priority: "warm", source: "Website", region: "Ahmedabad" },
    { name: "Sneha Reddy", company: "EduTech", score: 75, priority: "warm", source: "Influencer", region: "Bangalore" },
    { name: "Vikram Singh", company: "LogiFlow", score: 65, priority: "cold", source: "Direct", region: "Jaipur" },
  ];

  const sourcePerformance = [
    { source: "Website", leads: 420, conversion: 18, color: "text-primary" },
    { source: "Demo", leads: 312, conversion: 32, color: "text-neon-green" },
    { source: "Influencer", leads: 245, conversion: 24, color: "text-orange-400" },
    { source: "Reseller", leads: 189, conversion: 28, color: "text-neon-teal" },
    { source: "Referral", leads: 81, conversion: 45, color: "text-emerald-400" },
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "hot": return <Flame className="w-4 h-4 text-red-400" />;
      case "warm": return <ThermometerSun className="w-4 h-4 text-orange-400" />;
      case "cold": return <Snowflake className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "hot": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warm": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Dashboard</h1>
          <p className="text-muted-foreground">Real-time lead performance overview</p>
        </div>
        <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30 animate-pulse">
          <Activity className="w-3 h-3 mr-1" />
          LIVE
        </Badge>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <Badge variant="outline" className={`text-xs ${metric.change.startsWith('+') ? 'text-neon-green' : 'text-red-400'}`}>
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Lead Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statusBreakdown.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.status}</span>
                    <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                High Priority Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priorityLeads.map((lead, index) => (
                  <motion.div
                    key={lead.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getPriorityIcon(lead.priority)}
                      <div>
                        <p className="text-sm font-medium text-foreground">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.company} • {lead.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <Progress value={lead.score} className="h-1.5" />
                        </div>
                        <Badge className={getPriorityBadge(lead.priority)}>
                          {lead.score}%
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Source Performance & Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Source Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sourcePerformance.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center text-sm font-bold ${source.color}`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{source.source}</p>
                      <p className="text-xs text-muted-foreground">{source.leads} leads</p>
                    </div>
                  </div>
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    {source.conversion}% conv.
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-full bg-primary/20 rounded-full h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">1,247 Total Leads</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-4">
                  <div className="w-[90%] bg-neon-teal/20 rounded-full h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">892 Qualified</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-8">
                  <div className="w-[70%] bg-orange-400/20 rounded-full h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">456 Negotiation</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-12">
                  <div className="w-[50%] bg-neon-green/20 rounded-full h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">234 Converted</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span className="text-2xl font-bold text-neon-green">18.7%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Overall Conversion</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-2xl font-bold text-red-400">156</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Lost This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadDashboard;
