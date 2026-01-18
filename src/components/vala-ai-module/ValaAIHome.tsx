/**
 * VALA AI HOME
 * Main dashboard for VALA AI - AI Command Center
 * Cards: New Build Requests, Running Builds, Failed/Blocked, Waiting Approval, Deployed Today, Auto-Fixed Issues
 * Primary Action: START PROJECT button
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Plus, PlayCircle, XCircle, Clock, Rocket, Wrench,
  Activity, FileText, Video, Mic, Image, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface DashboardCard {
  id: string;
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: string;
}

const dashboardCards: DashboardCard[] = [
  { id: 'new-requests', label: 'New Build Requests', value: 8, icon: Plus, color: 'text-blue-500', bgColor: 'bg-blue-500/10', trend: '+3' },
  { id: 'running-builds', label: 'Running Builds', value: 4, icon: PlayCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { id: 'failed-blocked', label: 'Failed / Blocked', value: 2, icon: XCircle, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  { id: 'waiting-approval', label: 'Waiting Approval', value: 5, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { id: 'deployed-today', label: 'Deployed Today', value: 12, icon: Rocket, color: 'text-purple-500', bgColor: 'bg-purple-500/10', trend: '+4' },
  { id: 'auto-fixed', label: 'Auto-Fixed Issues', value: 23, icon: Wrench, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', trend: '+7' },
];

// Mock live builds for real-time progress display
const liveBuilds = [
  { id: 'build-001', name: 'E-Commerce Dashboard', progress: 80, stage: 'Testing' },
  { id: 'build-002', name: 'Analytics Module', progress: 40, stage: 'Features Applied' },
  { id: 'build-003', name: 'User Auth System', progress: 60, stage: 'AI / API Linked' },
  { id: 'build-004', name: 'Mobile App UI', progress: 20, stage: 'Structure Ready' },
];

const getStageFromProgress = (progress: number): string => {
  if (progress <= 0) return 'Project Initialized';
  if (progress <= 20) return 'Structure Ready';
  if (progress <= 40) return 'Features Applied';
  if (progress <= 60) return 'AI / API Linked';
  if (progress <= 80) return 'Testing';
  return 'Ready';
};

export const ValaAIHome: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectPrompt, setProjectPrompt] = useState('');

  const handleStartProject = () => {
    if (!projectPrompt.trim()) {
      toast.error('Please describe what you want to build or fix');
      return;
    }
    toast.success('Project queued for AI processing');
    setProjectPrompt('');
    setIsDialogOpen(false);
  };

  const handleCardClick = (cardId: string) => {
    toast.info(`Opening ${cardId.replace('-', ' ')} view...`);
    // In real implementation, this would navigate to the corresponding section
  };

  return (
    <div className="space-y-6">
      {/* Header with Primary Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            VALA AI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI Command Center — Build, Fix, Deploy
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50">
            <Activity className="w-3 h-3 mr-1" />
            AI Online
          </Badge>
          
          {/* PRIMARY ACTION: Start Project */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <PlayCircle className="w-4 h-4" />
                START PROJECT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Tell what to build or fix
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your project, feature, or issue..."
                  value={projectPrompt}
                  onChange={(e) => setProjectPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Attach:</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                    <FileText className="w-3 h-3" />
                    PDF/DOC
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                    <Image className="w-3 h-3" />
                    Image
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                    <Video className="w-3 h-3" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                    <Mic className="w-3 h-3" />
                    Voice
                  </Button>
                </div>
                <Button onClick={handleStartProject} className="w-full gap-2">
                  <Rocket className="w-4 h-4" />
                  Submit to AI
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dashboardCards.map((card, idx) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card 
                className="bg-card/50 border-border/50 hover:bg-card/80 transition-all cursor-pointer group"
                onClick={() => handleCardClick(card.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    {card.trend && (
                      <Badge 
                        variant="outline" 
                        className="text-xs text-emerald-500 border-emerald-500/30"
                      >
                        {card.trend}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Live Build Progress */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-emerald-500" />
            Live Build Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {liveBuilds.map((build) => (
            <div key={build.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{build.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {build.stage}
                  </Badge>
                  <span className="text-muted-foreground">{build.progress}%</span>
                </div>
              </div>
              <div className="relative">
                <Progress value={build.progress} className="h-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress Legend */}
      <Card className="bg-card/30 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span>0% Project Initialized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>20% Structure Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>40% Features Applied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>60% AI / API Linked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>80% Testing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>100% Ready</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
