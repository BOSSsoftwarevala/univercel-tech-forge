/**
 * ACTIVE BUILDS
 * Shows all ongoing builds with status and actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  Eye, 
  Pause, 
  RotateCcw, 
  XCircle,
  Clock,
  Bot,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Build {
  id: string;
  name: string;
  type: 'demo' | 'product';
  progress: number;
  status: 'building' | 'testing' | 'waiting' | 'paused';
  aiScore: number;
  startedAt: string;
}

const mockBuilds: Build[] = [
  {
    id: '1',
    name: 'CRM Dashboard Pro',
    type: 'product',
    progress: 75,
    status: 'building',
    aiScore: 92,
    startedAt: '10 min ago'
  },
  {
    id: '2',
    name: 'Restaurant POS Demo',
    type: 'demo',
    progress: 100,
    status: 'waiting',
    aiScore: 88,
    startedAt: '1 hour ago'
  },
  {
    id: '3',
    name: 'E-Commerce Starter',
    type: 'demo',
    progress: 45,
    status: 'testing',
    aiScore: 85,
    startedAt: '25 min ago'
  },
  {
    id: '4',
    name: 'Inventory System',
    type: 'product',
    progress: 30,
    status: 'paused',
    aiScore: 78,
    startedAt: '2 hours ago'
  },
];

const statusConfig = {
  building: { label: 'Building', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  testing: { label: 'Testing', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  waiting: { label: 'Waiting Approval', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  paused: { label: 'Paused', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

export const ActiveBuilds: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Active Builds
          </h1>
          <p className="text-sm text-muted-foreground">{mockBuilds.length} builds in progress</p>
        </div>
      </div>

      {/* Build Cards */}
      <div className="space-y-4">
        {mockBuilds.map((build, index) => (
          <motion.div
            key={build.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card/80 border-border/50 hover:border-border transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      build.type === 'demo' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    )}>
                      <Code className={cn(
                        "w-5 h-5",
                        build.type === 'demo' ? 'text-purple-400' : 'text-blue-400'
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{build.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {build.type === 'demo' ? 'Demo' : 'Product'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {build.startedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", statusConfig[build.status].color)}>
                      {statusConfig[build.status].label}
                    </Badge>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{build.progress}%</span>
                  </div>
                  <Progress value={build.progress} className="h-2" />
                </div>

                {/* AI Score & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">AI Quality Score:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-foreground">{build.aiScore}/100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {build.status === 'paused' ? (
                      <Button variant="ghost" size="sm" className="h-8 text-emerald-400">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-8 text-amber-400">
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 text-blue-400">
                      <Bot className="w-4 h-4 mr-1" />
                      Send to AI
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-red-400">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
