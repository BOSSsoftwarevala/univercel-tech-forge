import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Building2, 
  Wallet,
  Monitor,
  Headphones,
  TrendingUp,
  Zap,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  UserPlus,
  Map,
  Shield,
  ShieldAlert,
  Activity,
  Target,
  BarChart3,
  Brain,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Widget {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color: string;
  progress?: number;
  priority?: boolean;
}

const initialWidgets: Widget[] = [
  { id: 'leads', title: 'Live Leads', icon: <Target className="h-5 w-5" />, value: 247, subValue: '+12 this hour', trend: 'up', trendValue: '+8%', color: 'from-red-500/20 to-orange-500/20', progress: 78 },
  { id: 'devTimers', title: 'Developer Timers', icon: <Clock className="h-5 w-5" />, value: '12 Active', subValue: '3 Paused', color: 'from-cyan-500/20 to-blue-500/20' },
  { id: 'taskProgress', title: 'Task Progress', icon: <CheckCircle className="h-5 w-5" />, value: '89%', subValue: '45/51 completed', trend: 'up', color: 'from-green-500/20 to-emerald-500/20', progress: 89 },
  { id: 'franchiseHealth', title: 'Franchise Health', icon: <Building2 className="h-5 w-5" />, value: '94.5%', subValue: '12 branches active', color: 'from-blue-500/20 to-indigo-500/20', progress: 94.5 },
  { id: 'walletLedger', title: 'Wallet Ledger', icon: <Wallet className="h-5 w-5" />, value: '₹12.4L', subValue: 'Available balance', trend: 'up', trendValue: '+₹45K today', color: 'from-green-500/20 to-lime-500/20' },
  { id: 'demoUptime', title: 'Demo Uptime', icon: <Monitor className="h-5 w-5" />, value: '99.8%', subValue: '2 need attention', color: 'from-purple-500/20 to-violet-500/20', progress: 99.8 },
  { id: 'supportQueue', title: 'Support Queue', icon: <Headphones className="h-5 w-5" />, value: 23, subValue: 'Avg wait: 4m', trend: 'down', trendValue: '-15%', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'seoRanking', title: 'SEO Ranking', icon: <TrendingUp className="h-5 w-5" />, value: '#3', subValue: 'Target keywords', trend: 'up', color: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'performanceHeat', title: 'Performance Heat', icon: <Zap className="h-5 w-5" />, value: '87.2', subValue: 'Team avg score', color: 'from-orange-500/20 to-red-500/20', progress: 87.2 },
  { id: 'financeSummary', title: 'Finance Summary', icon: <DollarSign className="h-5 w-5" />, value: '₹2.8Cr', subValue: 'MTD Revenue', trend: 'up', trendValue: '+23%', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'rndSuggestions', title: 'R&D Suggestions', icon: <Lightbulb className="h-5 w-5" />, value: 14, subValue: '5 high priority', color: 'from-amber-500/20 to-yellow-500/20' },
  { id: 'legalAlerts', title: 'Legal Alerts', icon: <AlertTriangle className="h-5 w-5" />, value: 2, subValue: 'Contracts expiring', color: 'from-red-500/20 to-pink-500/20', priority: true },
  { id: 'hiringPipeline', title: 'Hiring Pipeline', icon: <UserPlus className="h-5 w-5" />, value: 34, subValue: 'Candidates in review', color: 'from-indigo-500/20 to-purple-500/20' },
  { id: 'territoryMap', title: 'Territory Map', icon: <Map className="h-5 w-5" />, value: '8 Regions', subValue: '3 expanding', color: 'from-teal-500/20 to-cyan-500/20' },
  { id: 'apiStatus', title: 'API Status', icon: <Activity className="h-5 w-5" />, value: 'Healthy', subValue: '99.99% uptime', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'securityThreat', title: 'Security Threat', icon: <ShieldAlert className="h-5 w-5" />, value: 'Low', subValue: '0 active threats', color: 'from-green-500/20 to-teal-500/20' },
  { id: 'activeUsers', title: 'Active Users', icon: <Users className="h-5 w-5" />, value: 1247, subValue: 'Online now', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'marketingROI', title: 'Marketing ROI', icon: <BarChart3 className="h-5 w-5" />, value: '340%', subValue: 'This quarter', trend: 'up', color: 'from-violet-500/20 to-purple-500/20' },
  { id: 'aiInsights', title: 'AI Insights', icon: <Brain className="h-5 w-5" />, value: 8, subValue: 'New recommendations', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'systemConfig', title: 'System Config', icon: <Settings className="h-5 w-5" />, value: 'Optimized', subValue: 'All systems go', color: 'from-gray-500/20 to-slate-500/20' },
];

const SuperAdminDashboard2035 = () => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgets(items);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            WELCOME BOSS
          </h1>
          <p className="text-muted-foreground mt-1">
            SOFTWARE VALA Command Center • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="h-3 w-3 mr-1" />
              All Systems Operational
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Security: Maximum
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Priority Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400">Priority Attention Required</h3>
                  <p className="text-sm text-muted-foreground">2 Legal Alerts • 3 Demo Issues • 5 Pending Approvals</p>
                </div>
              </div>
              <Badge className="bg-yellow-500 text-black">
                10 Items
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Draggable Widget Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "cursor-grab active:cursor-grabbing transition-all duration-200",
                        snapshot.isDragging && "z-50 scale-105"
                      )}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.9 : 1,
                      }}
                    >
                      <Card className={cn(
                        "h-full transition-all duration-200 hover:border-primary/30",
                        `bg-gradient-to-br ${widget.color}`,
                        "border-white/10 backdrop-blur-sm",
                        snapshot.isDragging && "ring-2 ring-primary shadow-2xl",
                        widget.priority && "ring-1 ring-yellow-500/50"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2 rounded-lg bg-white/10">
                              {widget.icon}
                            </div>
                            {widget.trend && (
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-[10px]",
                                  widget.trend === 'up' && "border-green-500/30 text-green-400",
                                  widget.trend === 'down' && "border-red-500/30 text-red-400"
                                )}
                              >
                                {widget.trendValue}
                              </Badge>
                            )}
                          </div>
                          
                          <h4 className="text-xs text-muted-foreground mb-1">{widget.title}</h4>
                          <p className="text-2xl font-bold">{widget.value}</p>
                          {widget.subValue && (
                            <p className="text-xs text-muted-foreground mt-1">{widget.subValue}</p>
                          )}
                          
                          {widget.progress !== undefined && (
                            <Progress 
                              value={widget.progress} 
                              className="h-1.5 mt-3"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (YTD)', value: '₹18.5 Cr', change: '+34%' },
          { label: 'Active Clients', value: '2,847', change: '+12%' },
          { label: 'Tasks Delivered', value: '12,456', change: '+28%' },
          { label: 'Avg Response Time', value: '4.2 min', change: '-15%' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px]",
                      stat.change.startsWith('+') ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard2035;
