import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ListTodo, 
  Wallet, 
  MessageSquare, 
  Bell,
  Settings,
  Clock,
  CheckCircle,
  PlayCircle,
  DollarSign,
  TrendingUp,
  Bot,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RoleDashboardProps {
  roleName: string;
  maskedId: string;
  roleIcon: ReactNode;
  roleColor: string;
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    earnings?: string;
  };
  slaMetrics?: {
    label: string;
    value: number;
    target: number;
  }[];
  children?: ReactNode;
}

const RoleDashboardTemplate = ({
  roleName,
  maskedId,
  roleIcon,
  roleColor,
  stats,
  slaMetrics,
  children
}: RoleDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const aiSuggestions = [
    'Complete Task #2847 to maintain your streak',
    'High-priority lead in your territory - act now',
    'SLA deadline approaching for 2 tasks',
  ];

  return (
    <div className="space-y-6">
      {/* Mini Header with Role Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl",
            `bg-gradient-to-br ${roleColor}`
          )}>
            {roleIcon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{roleName} Dashboard</h1>
            <p className="text-sm text-muted-foreground font-mono">{maskedId}</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Active
        </Badge>
      </div>

      {/* Left Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex gap-6">
        <TabsList className="flex-col h-auto bg-transparent space-y-1 p-0 w-48">
          {[
            { value: 'overview', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Overview' },
            { value: 'tasks', icon: <ListTodo className="h-4 w-4" />, label: 'Tasks' },
            { value: 'wallet', icon: <Wallet className="h-4 w-4" />, label: 'Wallet' },
            { value: 'chat', icon: <MessageSquare className="h-4 w-4" />, label: 'Chat' },
            { value: 'alerts', icon: <Bell className="h-4 w-4" />, label: 'Alerts' },
            { value: 'settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                "border border-transparent data-[state=active]:border-primary/20 rounded-lg"
              )}
            >
              {tab.icon}
              {tab.label}
              <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                      <p className="text-3xl font-bold text-blue-400">{stats.inProgress}</p>
                    </div>
                    <PlayCircle className="h-8 w-8 text-blue-400/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {stats.earnings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-purple-500/10 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="text-3xl font-bold text-purple-400">{stats.earnings}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-400/50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* SLA Metrics */}
          {slaMetrics && slaMetrics.length > 0 && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  SLA Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {slaMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className={cn(
                          "font-medium",
                          metric.value >= metric.target ? "text-green-400" : "text-yellow-400"
                        )}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className={cn(
                          "h-2",
                          metric.value >= metric.target 
                            ? "[&>div]:bg-green-500" 
                            : "[&>div]:bg-yellow-500"
                        )}
                      />
                      <p className="text-xs text-muted-foreground">Target: {metric.target}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pop-up Alerts Area */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400">Priority Alert</p>
                  <p className="text-xs text-muted-foreground">Task #2847 deadline in 2 hours</p>
                </div>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific Content */}
          <TabsContent value="overview" className="mt-0">
            {children}
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Task list content here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="mt-0">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Wallet content here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Bar */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Bot className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-cyan-400">AI Quick Suggestions</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="border-cyan-500/30 text-xs cursor-pointer hover:bg-cyan-500/10"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default RoleDashboardTemplate;
