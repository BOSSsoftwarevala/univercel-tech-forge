import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShieldAlert,
  Brain,
  Eye,
  Zap,
  Send,
  Radio,
  Server,
  RefreshCw,
  Lightbulb,
  Target,
  BarChart3
} from "lucide-react";
import { useCEOSuggestions, type CEOSuggestion, type AIObservation, type ActivityEvent } from "@/hooks/useCEOSuggestions";
import { toast } from "sonner";

// Helper functions for styling
const getImpactStyle = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
};

const getSeverityStyle = (severity: string) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
    case 'warning': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' };
  }
};

const getEventImpactStyle = (impact: string) => {
  switch (impact) {
    case 'positive': return 'text-emerald-400';
    case 'negative': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    risk: 'bg-red-500/20 text-red-400',
    revenue: 'bg-emerald-500/20 text-emerald-400',
    operations: 'bg-blue-500/20 text-blue-400',
    security: 'bg-orange-500/20 text-orange-400',
    compliance: 'bg-violet-500/20 text-violet-400'
  };
  return colors[type] || 'bg-slate-500/20 text-slate-400';
};

const AICEODashboardMain = () => {
  const {
    suggestions,
    ecosystemMetrics,
    observations,
    activityEvents,
    isLoading,
    lastRefresh,
    sendToBoss,
    getObservationsByCategory,
    getEventsByType
  } = useCEOSuggestions();

  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());

  const handleSendToBoss = async (suggestion: CEOSuggestion) => {
    setSendingIds(prev => new Set(prev).add(suggestion.id));
    await sendToBoss(suggestion.id);
    setSendingIds(prev => {
      const next = new Set(prev);
      next.delete(suggestion.id);
      return next;
    });
  };

  const filteredEvents = activityFilter === 'all' 
    ? activityEvents 
    : getEventsByType(activityFilter as ActivityEvent['type']);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI CEO Dashboard</h1>
            <p className="text-cyan-400/80">Autonomous Observer • Real-time Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <Eye className="w-4 h-4 mr-2" />
            OBSERVING ALL SYSTEMS
          </Badge>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="w-3 h-3" />
            <span>Last: {lastRefresh.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Ecosystem Monitor - Live Metrics */}
      <div className="grid grid-cols-6 gap-4">
        {ecosystemMetrics && [
          { label: "System Activity", value: ecosystemMetrics.systemActivityRate, unit: "/day", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Deployments", value: ecosystemMetrics.deploymentFrequency, unit: "/week", icon: Server, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Error Rate", value: ecosystemMetrics.errorVelocity, unit: "/hr", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Active Users", value: ecosystemMetrics.activeUsers.toLocaleString(), unit: "", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Transactions", value: ecosystemMetrics.transactionsToday.toLocaleString(), unit: "/day", icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "API Latency", value: ecosystemMetrics.apiLatency, unit: "ms", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${metric.bg} flex items-center justify-center`}>
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <Radio className="w-2 h-2 text-emerald-400 animate-pulse" />
                </div>
                <p className={`text-xl font-bold ${metric.color}`}>
                  {metric.value}{metric.unit}
                </p>
                <p className="text-xs text-slate-400">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Observations + Suggestions */}
      <div className="grid grid-cols-3 gap-6">
        {/* AI Observation Panel */}
        <Card className="col-span-2 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              AI Observation Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="change" className="w-full">
              <TabsList className="bg-slate-800/50 border border-slate-700/30 mb-4">
                <TabsTrigger value="change" className="text-xs">What Changed Today</TabsTrigger>
                <TabsTrigger value="attention" className="text-xs">Needs Attention</TabsTrigger>
                <TabsTrigger value="revenue" className="text-xs">Revenue Impact</TabsTrigger>
              </TabsList>
              
              {(['change', 'attention', 'revenue'] as const).map(category => (
                <TabsContent key={category} value={category}>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {getObservationsByCategory(category).map((obs, i) => {
                        const style = getSeverityStyle(obs.severity);
                        return (
                          <motion.div
                            key={obs.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-3 rounded-lg ${style.bg} border ${style.border}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-white">{obs.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{obs.detail}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${style.bg} ${style.text} text-xs`}>
                                  {obs.severity}
                                </Badge>
                                <span className="text-xs text-slate-500">{obs.timestamp}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* CEO Suggestion Engine */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              CEO Suggestions
              <Badge className="ml-auto bg-yellow-500/20 text-yellow-400">
                {suggestions.filter(s => s.status === 'pending').length} Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {suggestions.slice(0, 4).map((suggestion, i) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-yellow-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-white line-clamp-1">{suggestion.title}</p>
                      <Badge className={getImpactStyle(suggestion.impact)}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Progress value={suggestion.confidence} className="h-1 w-16" />
                        <span className="text-xs text-cyan-400">{suggestion.confidence}%</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        onClick={() => handleSendToBoss(suggestion)}
                        disabled={sendingIds.has(suggestion.id) || suggestion.status !== 'pending'}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {suggestion.status === 'reviewed' ? 'Sent' : 'Send to Boss'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed with Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Live Activity Feed
            </CardTitle>
            <div className="flex gap-2">
              {['all', 'risk', 'revenue', 'operations', 'security', 'compliance'].map(filter => (
                <Button
                  key={filter}
                  size="sm"
                  variant="ghost"
                  className={`h-7 px-3 text-xs ${
                    activityFilter === filter 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  onClick={() => setActivityFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    <div>
                      <p className="text-sm text-white">
                        <span className="font-medium">{event.actor}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <span>{event.action}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <span className="text-slate-300">{event.target}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${getEventImpactStyle(event.impact)}`}>
                      {event.impact === 'positive' ? '↑' : event.impact === 'negative' ? '↓' : '—'}
                    </span>
                    <span className="text-xs text-slate-500">{event.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Observer Notice */}
      <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-cyan-400" />
          <p className="text-sm text-cyan-400/80">
            <strong>AI CEO Notice:</strong> All observations are read-only. Recommendations require Boss/CEO approval for execution. CEO suggestions are automatically forwarded when you click "Send to Boss".
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEODashboardMain;
