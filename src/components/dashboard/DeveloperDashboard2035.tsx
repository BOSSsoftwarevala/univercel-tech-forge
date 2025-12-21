import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Bug,
  MessageSquare,
  Zap,
  Tag,
  FileCode,
  TestTube,
  Truck,
  Hand,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const DeveloperDashboard2035 = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showPromiseModal, setShowPromiseModal] = useState(true);
  const [taskAccepted, setTaskAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState<'todo' | 'building' | 'testing' | 'deliver'>('todo');

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
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

  const handleAcceptTask = () => {
    setTaskAccepted(true);
    setShowPromiseModal(false);
    setTimerActive(true);
    setCurrentStep('building');
  };

  const steps = [
    { key: 'todo', label: 'To-Do', icon: <FileCode className="h-5 w-5" /> },
    { key: 'building', label: 'Building', icon: <Code2 className="h-5 w-5" /> },
    { key: 'testing', label: 'Testing', icon: <TestTube className="h-5 w-5" /> },
    { key: 'deliver', label: 'Deliver', icon: <Truck className="h-5 w-5" /> },
  ];

  const techTags = ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind'];

  return (
    <div className="space-y-6">
      {/* Promise/Accept Modal */}
      <Dialog open={showPromiseModal && !taskAccepted} onOpenChange={setShowPromiseModal}>
        <DialogContent className="bg-gradient-to-br from-[#0d1025] to-[#0a0a1a] border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Hand className="h-6 w-6 text-yellow-400" />
              Task Assignment
            </DialogTitle>
            <DialogDescription>
              A new task has been assigned to you. Please review and accept.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold">Task #DEV-2847</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Implement payment gateway integration with Razorpay
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {techTags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="text-muted-foreground">Deadline: 4 hours</span>
                  <span className="text-green-400">Reward: ₹2,500</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-400">Promise Acknowledgment</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    By accepting, you promise to complete this task within the deadline. 
                    Late delivery may result in penalties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPromiseModal(false)}>
              Refuse Task
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              onClick={handleAcceptTask}
            >
              <Zap className="h-4 w-4 mr-2" />
              I Agree & Start Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timer Module - Top Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <Card className={cn(
          "w-full max-w-md",
          timerActive 
            ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30"
            : "bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/30"
        )}>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Active Timer</p>
              <div className="text-5xl font-mono font-bold tracking-wider">
                <span className={timerActive ? "text-green-400" : "text-muted-foreground"}>
                  {formatTime(timerSeconds)}
                </span>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setTimerActive(!timerActive)}
                  className={cn(
                    "gap-2",
                    timerActive && "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  )}
                >
                  {timerActive ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Code Status Steps */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Task Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.key === currentStep;
              const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={cn(
                      "flex flex-col items-center gap-2 cursor-pointer transition-all",
                      isActive && "scale-110"
                    )}
                    onClick={() => setCurrentStep(step.key as any)}
                  >
                    <div className={cn(
                      "p-3 rounded-xl transition-all",
                      isCompleted && "bg-green-500/20 text-green-400",
                      isActive && "bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/50",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.icon}
                    </div>
                    <span className={cn(
                      "text-xs",
                      isActive && "text-cyan-400 font-medium",
                      isCompleted && "text-green-400"
                    )}>
                      {step.label}
                    </span>
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 h-0.5 mx-2",
                      isCompleted ? "bg-green-500" : "bg-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {techTags.map(tag => (
              <Badge 
                key={tag}
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bug Report Panel */}
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="h-4 w-4 text-red-400" />
              Bug Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: '#BUG-142', desc: 'Payment timeout on slow networks', severity: 'high' },
                { id: '#BUG-143', desc: 'Mobile layout overflow', severity: 'medium' },
              ].map(bug => (
                <div 
                  key={bug.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{bug.id}</span>
                    <p className="text-sm">{bug.desc}</p>
                  </div>
                  <Badge className={cn(
                    bug.severity === 'high' ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {bug.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Masked Chat Thread */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              Task Chat
              <Badge variant="outline" className="text-[10px] ml-auto">
                <Shield className="h-3 w-3 mr-1" />
                Masked
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { sender: 'LM-****-8845', msg: 'Please prioritize payment integration', time: '2m ago' },
                { sender: 'You', msg: 'Working on it now', time: '1m ago' },
              ].map((chat, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-3 rounded-lg",
                    chat.sender === 'You' ? "bg-cyan-500/10 ml-8" : "bg-white/5 mr-8"
                  )}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-muted-foreground">{chat.sender}</span>
                    <span className="text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm">{chat.msg}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Widget */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month's Earnings</p>
              <p className="text-4xl font-bold text-purple-400">₹45,200</p>
              <p className="text-xs text-muted-foreground mt-1">18 tasks completed</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">₹2,500</p>
              <p className="text-xs text-muted-foreground mt-1">Current task</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard2035;
