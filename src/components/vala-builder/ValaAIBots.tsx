import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Code2, MessageSquare, TestTube, Shield, Activity,
  CheckCircle2, AlertTriangle, Clock, Settings, Power
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';
import { toast } from 'sonner';

interface AIBot {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'idle' | 'busy' | 'offline';
  tasksCompleted: number;
  successRate: number;
  currentTask: string | null;
  lastActive: string;
  color: string;
}

const bots: AIBot[] = [
  {
    id: 'vala-dev',
    name: 'VALA-DEV',
    role: 'Builder Bot',
    description: 'Builds software, fixes bugs, optimizes performance',
    icon: Code2,
    status: 'busy',
    tasksCompleted: 1247,
    successRate: 98.5,
    currentTask: 'Building Restaurant POS module',
    lastActive: 'Now',
    color: 'purple'
  },
  {
    id: 'vala-support',
    name: 'VALA-SUPPORT',
    role: 'Support Bot',
    description: 'Reads issues, applies fixes, communicates like human',
    icon: MessageSquare,
    status: 'busy',
    tasksCompleted: 3421,
    successRate: 96.2,
    currentTask: 'Resolving login crash issue',
    lastActive: 'Now',
    color: 'teal'
  },
  {
    id: 'vala-qa',
    name: 'VALA-QA',
    role: 'Quality Bot',
    description: 'Tests buttons, tests flows, flags broken UI',
    icon: TestTube,
    status: 'active',
    tasksCompleted: 5678,
    successRate: 99.1,
    currentTask: null,
    lastActive: '2 min ago',
    color: 'amber'
  },
  {
    id: 'vala-security',
    name: 'VALA-SECURITY',
    role: 'Security Bot',
    description: 'Checks misuse, detects anomalies, prevents leaks',
    icon: Shield,
    status: 'active',
    tasksCompleted: 890,
    successRate: 99.9,
    currentTask: null,
    lastActive: '1 min ago',
    color: 'red'
  },
];

const ValaAIBots = () => {
  const { logAction } = useEnterpriseAudit();
  const [botStates, setBotStates] = useState<Record<string, boolean>>(
    Object.fromEntries(bots.map(b => [b.id, b.status !== 'offline']))
  );

  const handleToggleBot = async (botId: string, enabled: boolean) => {
    await logAction({
      action: enabled ? 'enable_ai_bot' : 'disable_ai_bot',
      module: 'vala_builder',
      severity: 'high',
      target_id: botId
    });
    setBotStates(prev => ({ ...prev, [botId]: enabled }));
    toast.success(`${botId.toUpperCase()} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' };
      case 'busy': return { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', dot: 'bg-purple-400 animate-pulse' };
      case 'idle': return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' };
      case 'offline': return { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' };
      default: return { color: 'bg-slate-500/20 text-slate-400', dot: 'bg-slate-400' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            AI Bots
          </h2>
          <p className="text-slate-400 text-sm">Internal AI workforce - all actions require Boss approval</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">
              {bots.reduce((acc, b) => acc + b.tasksCompleted, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">
              {bots.filter(b => b.status === 'busy').length}
            </div>
            <div className="text-xs text-slate-400">Active Now</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-teal-500/20">
          <CardContent className="p-4 text-center">
            <Bot className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-teal-100">{bots.length}</div>
            <div className="text-xs text-slate-400">Total Bots</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">
              {Math.round(bots.reduce((acc, b) => acc + b.successRate, 0) / bots.length)}%
            </div>
            <div className="text-xs text-slate-400">Avg Success</div>
          </CardContent>
        </Card>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-2 gap-4">
        {bots.map((bot, index) => {
          const statusConfig = getStatusConfig(bot.status);
          const BotIcon = bot.icon;

          return (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-${bot.color}-500/20 hover:border-${bot.color}-500/40 transition-colors`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-${bot.color}-500/20`}>
                        <BotIcon className={`w-8 h-8 text-${bot.color}-400`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{bot.name}</h3>
                        <p className="text-sm text-slate-400">{bot.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig.color}>
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig.dot}`} />
                        {bot.status}
                      </Badge>
                      <Switch
                        checked={botStates[bot.id]}
                        onCheckedChange={(checked) => handleToggleBot(bot.id, checked)}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">{bot.description}</p>

                  {/* Current Task */}
                  {bot.currentTask && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 mb-4">
                      <div className="flex items-center gap-2 text-xs text-purple-400 mb-1">
                        <Clock className="w-3 h-3" />
                        Current Task
                      </div>
                      <p className="text-sm text-white">{bot.currentTask}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Tasks Completed</div>
                      <div className="text-xl font-bold text-white">{bot.tasksCompleted.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Success Rate</div>
                      <div className="flex items-center gap-2">
                        <div className={`text-xl font-bold text-${bot.color}-400`}>{bot.successRate}%</div>
                        <Progress value={bot.successRate} className="flex-1 h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                    <span className="text-xs text-slate-500">Last active: {bot.lastActive}</span>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Important Notice */}
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <h4 className="font-medium text-red-400">No AI can deploy without Boss approval</h4>
            <p className="text-sm text-red-300/70">
              All AI actions are logged and audited. Critical actions require explicit Boss approval.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValaAIBots;
