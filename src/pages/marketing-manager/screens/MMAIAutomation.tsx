import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useSystemActions } from '@/hooks/useSystemActions';
import {
  Sparkles, Brain, TrendingUp, DollarSign, Target, Shield,
  AlertTriangle, CheckCircle2, Loader2, RefreshCw, Zap,
  BarChart3, Eye, Settings, Bot, Activity
} from 'lucide-react';

interface AIModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  status: 'running' | 'idle' | 'error';
  lastRun: string;
  actions: number;
  savings: number;
}

interface AIInsight {
  id: string;
  type: 'optimization' | 'warning' | 'fraud' | 'suggestion';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  timestamp: string;
}

const MMAIAutomation: React.FC = () => {
  const { executeAction, actions } = useSystemActions();
  const [modules, setModules] = useState<AIModule[]>([
    {
      id: 'campaign-opt',
      name: 'Campaign Optimization',
      description: 'Auto-optimize campaigns based on real-time performance data',
      icon: TrendingUp,
      enabled: true,
      status: 'running',
      lastRun: '2 mins ago',
      actions: 47,
      savings: 2340,
    },
    {
      id: 'spend-redis',
      name: 'Spend Redistribution',
      description: 'Automatically redistribute budget to high-performing ads',
      icon: DollarSign,
      enabled: true,
      status: 'running',
      lastRun: '5 mins ago',
      actions: 23,
      savings: 1890,
    },
    {
      id: 'keyword-exp',
      name: 'Keyword Expansion',
      description: 'Discover and add new high-potential keywords',
      icon: Target,
      enabled: true,
      status: 'idle',
      lastRun: '1 hour ago',
      actions: 156,
      savings: 890,
    },
    {
      id: 'creative-score',
      name: 'Creative Scoring',
      description: 'AI scores creatives and suggests improvements',
      icon: Sparkles,
      enabled: false,
      status: 'idle',
      lastRun: 'Never',
      actions: 0,
      savings: 0,
    },
    {
      id: 'fraud-detect',
      name: 'Fraud / Bot Detection',
      description: 'Detect and block fraudulent clicks and bot traffic',
      icon: Shield,
      enabled: true,
      status: 'running',
      lastRun: '30 secs ago',
      actions: 892,
      savings: 5670,
    },
  ]);

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'optimization',
      title: 'High-performing ad variant detected',
      description: 'Variant A in Summer Sale campaign has 35% higher CTR. Consider pausing Variant B.',
      impact: 'high',
      action: 'Pause Variant B',
      timestamp: '5 mins ago',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Budget nearly exhausted',
      description: 'Q3 Lead Generation campaign has used 92% of monthly budget with 8 days remaining.',
      impact: 'high',
      action: 'Increase Budget',
      timestamp: '15 mins ago',
    },
    {
      id: '3',
      type: 'fraud',
      title: 'Suspicious click pattern detected',
      description: '247 clicks blocked from IP range 192.168.x.x - suspected bot activity.',
      impact: 'medium',
      action: 'View Details',
      timestamp: '32 mins ago',
    },
    {
      id: '4',
      type: 'suggestion',
      title: 'New keyword opportunity',
      description: '"enterprise software solutions" has high volume and low competition. Consider adding to campaigns.',
      impact: 'medium',
      action: 'Add Keyword',
      timestamp: '1 hour ago',
    },
  ]);

  const [aiConfidence, setAiConfidence] = useState([75]);
  const [autoApply, setAutoApply] = useState(false);
  const [running, setRunning] = useState(false);

  const toggleModule = useCallback(async (id: string, name: string) => {
    setModules(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
    const module = modules.find(m => m.id === id);
    await executeAction({
      module: "marketing",
      action: module?.enabled ? "disable" : "enable",
      entityType: "ai_module",
      entityId: id,
      entityName: name,
    });
    toast.success('AI module setting updated');
  }, [executeAction, modules]);

  const runAllAI = useCallback(async () => {
    setRunning(true);
    await executeAction({
      module: "marketing",
      action: "sync",
      entityType: "ai_automation",
      entityId: "all",
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setModules(prev => prev.map(m => ({
      ...m,
      status: m.enabled ? 'running' : 'idle',
      lastRun: m.enabled ? 'Just now' : m.lastRun,
      actions: m.enabled ? m.actions + Math.floor(Math.random() * 10) : m.actions,
    })));
    toast.success('AI analysis complete - 3 new insights generated');
    setRunning(false);
  }, [executeAction]);

  const handleInsightAction = useCallback(async (insight: AIInsight) => {
    await executeAction({
      module: "marketing",
      action: "update",
      entityType: "ai_insight",
      entityId: insight.id,
      entityName: insight.title,
      data: { action: insight.action }
    });
    toast.success(`Action executed: ${insight.action}`);
    setInsights(prev => prev.filter(i => i.id !== insight.id));
  }, [executeAction]);

  const dismissInsight = useCallback(async (id: string) => {
    await actions.softDelete("marketing", "ai_insight", id);
    setInsights(prev => prev.filter(i => i.id !== id));
  }, [actions]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'fraud': return <Shield className="w-4 h-4 text-red-400" />;
      case 'suggestion': return <Sparkles className="w-4 h-4 text-blue-400" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const totalSavings = modules.reduce((sum, m) => sum + m.savings, 0);
  const totalActions = modules.reduce((sum, m) => sum + m.actions, 0);
  const activeModules = modules.filter(m => m.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-400" />
            AI Automation
          </h2>
          <p className="text-slate-400 text-sm">Automated optimization, fraud detection & insights</p>
        </div>
        <Button 
          onClick={runAllAI} 
          disabled={running}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {running ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          Run All AI
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Bot className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">{activeModules}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Active Modules</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Activity className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{totalActions}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Actions Taken</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">${totalSavings.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Total Savings</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Shield className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">{modules.find(m => m.id === 'fraud-detect')?.actions || 0}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Fraud Blocked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* AI Modules */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm text-white flex items-center justify-between">
              <span>AI Modules</span>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-slate-400">Auto-Apply</Label>
                <Switch checked={autoApply} onCheckedChange={setAutoApply} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {modules.map(module => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        module.enabled 
                          ? 'bg-slate-900/50 border-emerald-500/30' 
                          : 'bg-slate-900/30 border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${module.enabled ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                            <Icon className={`w-5 h-5 ${module.enabled ? 'text-emerald-400' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-white">{module.name}</p>
                            <p className="text-xs text-slate-400">{module.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={module.enabled}
                          onCheckedChange={() => toggleModule(module.id, module.name)}
                        />
                      </div>
                      
                      {module.enabled && (
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-700">
                          <div className="text-center">
                            <Badge 
                              variant="outline" 
                              className={
                                module.status === 'running' ? 'text-green-400 border-green-500/30' :
                                module.status === 'error' ? 'text-red-400 border-red-500/30' :
                                'text-slate-400 border-slate-500/30'
                              }
                            >
                              {module.status === 'running' && <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />}
                              {module.status}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-white">{module.actions}</p>
                            <p className="text-[10px] text-slate-500">Actions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-400">${module.savings}</p>
                            <p className="text-[10px] text-slate-500">Saved</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm text-white flex items-center justify-between">
              <span>AI Insights & Recommendations</span>
              <Badge variant="outline">{insights.length} pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {insights.map(insight => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-lg bg-slate-900/50 border border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-white text-sm">{insight.title}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              insight.impact === 'high' ? 'text-red-400 border-red-500/30' :
                              insight.impact === 'medium' ? 'text-yellow-400 border-yellow-500/30' :
                              'text-slate-400 border-slate-500/30'
                            }`}
                          >
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">{insight.timestamp}</span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-xs"
                              onClick={() => dismissInsight(insight.id)}
                            >
                              Dismiss
                            </Button>
                            {insight.action && (
                              <Button 
                                size="sm" 
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleInsightAction(insight)}
                              >
                                {insight.action}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {insights.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">All caught up! No pending insights.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* AI Confidence Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Settings className="w-4 h-4" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm mb-3 block">AI Confidence Threshold ({aiConfidence[0]}%)</Label>
              <Slider
                value={aiConfidence}
                onValueChange={setAiConfidence}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-2">
                AI will only take action when confidence exceeds this threshold
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Require human approval for high-impact changes</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send notifications for AI actions</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable experimental features</Label>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MMAIAutomation;
