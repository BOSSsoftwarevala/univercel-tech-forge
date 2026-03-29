import { motion } from 'framer-motion';
import { 
  Star, MessageSquare, Clock, CheckCircle, Headphones,
  AlertTriangle, Zap, TrendingUp, Users, Heart
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PrimeUserDashboard = () => {
  const primeStats = {
    activeProjects: 3,
    completedProjects: 12,
    avgResponseTime: '15m',
    satisfactionScore: 98,
    dedicatedDev: 'Dev***08',
    supportPriority: 'VIP'
  };

  const activeProjects = [
    { 
      id: 'PROJ-001', 
      name: 'E-commerce Platform', 
      progress: 75, 
      status: 'in_progress',
      developer: 'Dev***08',
      eta: '3 days'
    },
    { 
      id: 'PROJ-002', 
      name: 'Mobile App Integration', 
      progress: 45, 
      status: 'in_progress',
      developer: 'Dev***12',
      eta: '5 days'
    },
    { 
      id: 'PROJ-003', 
      name: 'Dashboard Analytics', 
      progress: 90, 
      status: 'review',
      developer: 'Dev***08',
      eta: '1 day'
    },
  ];

  const recentMessages = [
    { id: 1, from: 'Support Team', preview: 'Your project update is ready...', time: '5m ago', unread: true },
    { id: 2, from: 'Dev***08', preview: 'Completed the payment module...', time: '2h ago', unread: false },
    { id: 3, from: 'Project Manager', preview: 'Weekly progress report attached...', time: '1d ago', unread: false },
  ];

  return (
    <DashboardLayout roleOverride="prime">
      <div className="space-y-6">
        {/* VIP Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-orange to-neon-red flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-8 h-8 text-background" fill="currentColor" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">Prime Dashboard</h1>
              <Badge className="bg-gradient-to-r from-neon-orange to-neon-red text-background">
                VIP Priority Access
              </Badge>
            </div>
          </div>
          <Button className="gap-2 bg-neon-orange/20 text-neon-orange border border-neon-orange/50">
            <Headphones className="w-4 h-4" />
            Priority Support
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Active Projects', value: primeStats.activeProjects, icon: Zap, color: 'text-neon-cyan' },
            { label: 'Completed', value: primeStats.completedProjects, icon: CheckCircle, color: 'text-neon-green' },
            { label: 'Avg Response', value: primeStats.avgResponseTime, icon: Clock, color: 'text-neon-purple' },
            { label: 'Satisfaction', value: `${primeStats.satisfactionScore}%`, icon: Heart, color: 'text-neon-red' },
            { label: 'Dedicated Dev', value: primeStats.dedicatedDev, icon: Users, color: 'text-primary' },
            { label: 'Support Tier', value: primeStats.supportPriority, icon: Star, color: 'text-neon-orange' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-panel">
                <CardContent className="p-4">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-xl font-mono font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Projects */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div 
                  key={project.id}
                  className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
                        <Badge className={`text-xs ${
                          project.status === 'review' ? 'bg-neon-green/20 text-neon-green' :
                          'bg-neon-cyan/20 text-neon-cyan'
                        }`}>
                          {project.status === 'review' ? 'Under Review' : 'In Progress'}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-medium text-foreground mt-1">{project.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Developer: {project.developer}</p>
                      <p className="text-xs text-neon-cyan">ETA: {project.eta}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-neon-teal"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Chat Lane */}
          <Card className="glass-panel border-neon-orange/30">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neon-orange" />
                Dedicated Support Chat
                <Badge className="ml-2 bg-neon-green/20 text-neon-green text-xs">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {recentMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-3 rounded-lg ${msg.unread ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground text-sm">{msg.from}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.preview}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Open Chat
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Headphones, label: 'Priority Support', color: 'bg-neon-orange/20 text-neon-orange' },
                  { icon: Zap, label: 'Request Demo', color: 'bg-neon-cyan/20 text-neon-cyan' },
                  { icon: TrendingUp, label: 'View Analytics', color: 'bg-neon-green/20 text-neon-green' },
                  { icon: AlertTriangle, label: 'Report Issue', color: 'bg-neon-red/20 text-neon-red' },
                ].map((action, i) => (
                  <motion.div
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      className={`w-full h-20 flex-col gap-2 ${action.color} border-current/30`}
                    >
                      <action.icon className="w-6 h-6" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrimeUserDashboard;
