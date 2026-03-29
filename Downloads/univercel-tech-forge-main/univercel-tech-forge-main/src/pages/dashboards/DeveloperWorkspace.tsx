import { motion } from 'framer-motion';
import { 
  Code2, Clock, Play, Pause, CheckCircle, AlertTriangle,
  MessageSquare, DollarSign, Zap, Timer
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

const DeveloperWorkspace = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentTask = {
    id: 'TASK-2847',
    title: 'Build Real-time Dashboard Components',
    client: 'CLI***45',
    priority: 'high',
    deadline: '2024-01-20 18:00',
    promisedHours: 8,
    slaHours: 24,
    status: 'in_progress',
    payment: 15000
  };

  const taskQueue = [
    { id: 'TASK-2848', title: 'API Integration for Payment Gateway', priority: 'medium', eta: '4h' },
    { id: 'TASK-2849', title: 'Bug Fix - User Authentication Flow', priority: 'high', eta: '2h' },
    { id: 'TASK-2850', title: 'Mobile Responsive Optimization', priority: 'low', eta: '3h' },
  ];

  const walletStats = {
    available: 45000,
    pending: 15000,
    totalEarned: 234500,
    penalties: 2500
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout roleOverride="developer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">Developer Workspace</h1>
            <p className="text-muted-foreground">Task management & timer system</p>
          </div>
          <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/50 px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-neon-green mr-2 animate-pulse" />
            Online
          </Badge>
        </div>

        {/* Active Task Timer */}
        <Card className="glass-panel-glow border-primary/30">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-neon-red/20 text-neon-red">{currentTask.priority.toUpperCase()}</Badge>
                  <span className="text-muted-foreground font-mono text-sm">{currentTask.id}</span>
                </div>
                <h2 className="text-xl font-mono font-bold text-foreground mb-2">{currentTask.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Client: {currentTask.client}</span>
                  <span>SLA: {currentTask.slaHours}h</span>
                  <span>Payment: {formatCurrency(currentTask.payment)}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                {/* Timer Display */}
                <div className="text-center">
                  <motion.div
                    className="text-5xl font-mono font-bold text-primary"
                    animate={{ scale: timerActive ? [1, 1.02, 1] : 1 }}
                    transition={{ repeat: timerActive ? Infinity : 0, duration: 1 }}
                  >
                    {formatTime(elapsedTime)}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Promised: {currentTask.promisedHours}h
                  </p>
                </div>
                
                {/* Timer Controls */}
                <div className="flex gap-3">
                  {!timerActive ? (
                    <Button 
                      onClick={() => setTimerActive(true)}
                      className="gap-2 bg-neon-green/20 text-neon-green border border-neon-green/50 hover:bg-neon-green/30"
                    >
                      <Play className="w-4 h-4" />
                      Start Timer
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setTimerActive(false)}
                      className="gap-2 bg-neon-orange/20 text-neon-orange border border-neon-orange/50 hover:bg-neon-orange/30"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  <Button variant="outline" className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Submit Work
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round((elapsedTime / (currentTask.promisedHours * 3600)) * 100)}%</span>
              </div>
              <Progress 
                value={(elapsedTime / (currentTask.promisedHours * 3600)) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Promise Button & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="glass-panel cursor-pointer hover:border-neon-cyan/50 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-neon-cyan" />
                </div>
                <h3 className="font-mono font-bold text-foreground mb-2">Promise Delivery</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Commit to delivery time and start timer
                </p>
                <Button className="w-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50">
                  Make Promise
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="glass-panel cursor-pointer hover:border-neon-purple/50 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-neon-purple" />
                </div>
                <h3 className="font-mono font-bold text-foreground mb-2">Request Clarification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask questions about the task
                </p>
                <Button className="w-full bg-neon-purple/20 text-neon-purple border border-neon-purple/50">
                  Open Chat
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="glass-panel cursor-pointer hover:border-neon-orange/50 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-neon-orange/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-neon-orange" />
                </div>
                <h3 className="font-mono font-bold text-foreground mb-2">Report Blocker</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Escalate issues blocking progress
                </p>
                <Button className="w-full bg-neon-orange/20 text-neon-orange border border-neon-orange/50">
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Queue */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Task Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taskQueue.map((task, i) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{task.title}</p>
                        <Badge variant="outline" className={`text-xs mt-1 ${
                          task.priority === 'high' ? 'border-neon-red/50 text-neon-red' :
                          task.priority === 'medium' ? 'border-neon-orange/50 text-neon-orange' :
                          'border-muted-foreground'
                        }`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">ETA: {task.eta}</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Accept
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wallet Summary */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Available', value: walletStats.available, color: 'text-neon-green' },
                  { label: 'Pending', value: walletStats.pending, color: 'text-neon-orange' },
                  { label: 'Total Earned', value: walletStats.totalEarned, color: 'text-primary' },
                  { label: 'Penalties', value: walletStats.penalties, color: 'text-neon-red' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={`text-lg font-mono font-bold ${item.color}`}>
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline">
                Request Payout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperWorkspace;
