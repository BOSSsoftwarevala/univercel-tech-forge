import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, Rocket, TrendingUp, Brain, Zap, 
  BarChart3, Users, Clock, CheckCircle2, XCircle,
  Eye, Star, Target, Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for AI-operated R&D
const activeProjects = [
  { id: 'P001', name: 'AI Customer Support Bot', stage: 'Development', progress: 72, priority: 'high', aiScore: 89 },
  { id: 'P002', name: 'Blockchain Payment Gateway', stage: 'Research', progress: 35, priority: 'medium', aiScore: 76 },
  { id: 'P003', name: 'Mobile App v3.0', stage: 'Testing', progress: 88, priority: 'high', aiScore: 94 },
  { id: 'P004', name: 'Voice Recognition Module', stage: 'Prototype', progress: 45, priority: 'low', aiScore: 68 },
];

const aiInsights = [
  { id: 1, type: 'opportunity', message: 'AI suggests pivoting to microservices architecture for scalability', confidence: 92 },
  { id: 2, type: 'risk', message: 'Blockchain project may face regulatory hurdles in 3 regions', confidence: 78 },
  { id: 3, type: 'trend', message: 'Voice AI market growing 34% YoY - increase investment', confidence: 85 },
  { id: 4, type: 'efficiency', message: 'Merge testing teams for P001 and P003 to save 23% resources', confidence: 88 },
];

const teamMetrics = {
  totalResearchers: 24,
  activeProjects: 8,
  patentsPending: 3,
  aiAutomation: 67,
};

export function RnDControlModule() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Lightbulb className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">R&D Control Center</h2>
            <p className="text-sm text-violet-300/70">AI-Operated Research & Development</p>
          </div>
        </div>
        <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-sm px-4 py-2">
          <Brain className="w-4 h-4 mr-2" />
          AI OPERATED
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Researchers', value: teamMetrics.totalResearchers, icon: Users, color: 'blue' },
          { label: 'Active Projects', value: teamMetrics.activeProjects, icon: Rocket, color: 'violet' },
          { label: 'Patents Pending', value: teamMetrics.patentsPending, icon: Star, color: 'amber' },
          { label: 'AI Automation', value: `${teamMetrics.aiAutomation}%`, icon: Brain, color: 'green' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`p-4 bg-gradient-to-br from-${stat.color}-950/50 to-${stat.color}-900/30 border-${stat.color}-500/20`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Active Projects */}
        <div className="col-span-7">
          <Card className="p-4 bg-black/40 border-violet-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-violet-300 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Active Projects
              </h3>
              <Badge className="bg-violet-500/10 text-violet-300">
                {activeProjects.length} Projects
              </Badge>
            </div>

            <div className="space-y-3">
              {activeProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedProject(project.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProject === project.id 
                      ? 'bg-violet-500/10 border-violet-500/40' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        project.priority === 'high' ? 'bg-red-500/20' :
                        project.priority === 'medium' ? 'bg-amber-500/20' : 'bg-green-500/20'
                      }`}>
                        <Target className={`w-4 h-4 ${
                          project.priority === 'high' ? 'text-red-400' :
                          project.priority === 'medium' ? 'text-amber-400' : 'text-green-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{project.name}</p>
                        <p className="text-xs text-white/50">{project.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-violet-500/20 text-violet-300 text-xs">
                        {project.stage}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3 text-violet-400" />
                        <span className="text-xs text-violet-300">{project.aiScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-xs text-white/60">{project.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="col-span-5">
          <Card className="p-4 bg-gradient-to-br from-purple-950/50 to-violet-950/50 border-purple-500/20 backdrop-blur-xl h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-purple-300">AI INSIGHTS</h3>
                <p className="text-[10px] text-purple-400/60">Real-time Analysis</p>
              </div>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {aiInsights.map((insight, i) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`p-3 rounded-lg border ${
                      insight.type === 'risk' ? 'bg-red-500/10 border-red-500/30' :
                      insight.type === 'opportunity' ? 'bg-green-500/10 border-green-500/30' :
                      insight.type === 'trend' ? 'bg-blue-500/10 border-blue-500/30' :
                      'bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-[10px] ${
                        insight.type === 'risk' ? 'bg-red-500/20 text-red-300' :
                        insight.type === 'opportunity' ? 'bg-green-500/20 text-green-300' :
                        insight.type === 'trend' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {insight.type.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-white/40">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-xs text-white/80">{insight.message}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}