import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  Cpu, MemoryStick, HardDrive, Network, Zap, RefreshCw, ArrowRight,
  Lightbulb, Target, Clock, DollarSign, Shield, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface AIInsight {
  id: string;
  type: 'critical' | 'warning' | 'optimization' | 'info';
  title: string;
  description: string;
  impact: string;
  action: string;
  savings?: string;
  priority: number;
  resource: 'cpu' | 'ram' | 'storage' | 'network' | 'general';
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'critical',
    title: 'RAM Usage Critical on Server EU-01',
    description: 'Memory usage has been above 90% for the last 2 hours. Risk of OOM killer activation.',
    impact: 'High risk of service disruption',
    action: 'Upgrade RAM to 16GB or optimize memory-heavy processes',
    resource: 'ram',
    priority: 1,
  },
  {
    id: '2',
    type: 'warning',
    title: 'CPU Spike Pattern Detected',
    description: 'Daily CPU spikes at 2 PM correlate with cron job execution. Consider distributing load.',
    impact: 'Potential slowdown during peak hours',
    action: 'Redistribute cron jobs or scale horizontally',
    resource: 'cpu',
    priority: 2,
  },
  {
    id: '3',
    type: 'optimization',
    title: 'Storage Optimization Available',
    description: 'Found 45GB of log files older than 30 days. Safe to archive or delete.',
    impact: 'Recover 45GB storage space',
    action: 'Run log rotation and cleanup script',
    savings: '$12/month',
    resource: 'storage',
    priority: 3,
  },
  {
    id: '4',
    type: 'optimization',
    title: 'Right-size Recommendation',
    description: 'Server AP-Mumbai-02 averages 15% CPU usage. Consider downgrading plan.',
    impact: 'Reduce infrastructure costs',
    action: 'Migrate to smaller instance type',
    savings: '$40/month',
    resource: 'cpu',
    priority: 4,
  },
  {
    id: '5',
    type: 'info',
    title: 'Network Latency Improvement',
    description: 'Enable HTTP/2 on nginx to reduce latency by ~20ms average.',
    impact: 'Improved user experience',
    action: 'Update nginx configuration',
    resource: 'network',
    priority: 5,
  },
];

const serverHealth = [
  { name: 'US-East-Primary', cpu: 45, ram: 62, disk: 38, score: 92, status: 'healthy' },
  { name: 'EU-Frankfurt-01', cpu: 78, ram: 91, disk: 45, score: 58, status: 'critical' },
  { name: 'AP-Tokyo-Main', cpu: 32, ram: 48, disk: 67, score: 85, status: 'healthy' },
  { name: 'AP-Mumbai-02', cpu: 15, ram: 28, disk: 22, score: 95, status: 'optimal' },
];

const SMAIHealthSuggestions = () => {
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    toast.info('AI analyzing server metrics...');
    
    // Simulate AI analysis
    await new Promise(r => setTimeout(r, 3000));
    
    setIsAnalyzing(false);
    toast.success('Analysis complete! New insights available.');
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: AlertTriangle };
      case 'warning':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle };
      case 'optimization':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: TrendingUp };
      default:
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Lightbulb };
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'cpu': return Cpu;
      case 'ram': return MemoryStick;
      case 'storage': return HardDrive;
      case 'network': return Network;
      default: return Activity;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              AI Health Suggestions
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h2>
            <p className="text-slate-400">Smart recommendations to optimize your infrastructure</p>
          </div>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* AI Loading Animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-12 h-12 text-purple-400" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Analysis in Progress</h3>
                <p className="text-slate-400">Analyzing CPU patterns, memory usage, disk I/O, network traffic...</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processing metrics</span>
                <span className="text-purple-400">67%</span>
              </div>
              <Progress value={67} className="h-2 bg-slate-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server Health Overview */}
      <div className="grid grid-cols-4 gap-4">
        {serverHealth.map((server) => (
          <Card key={server.name} className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-medium text-slate-300 truncate">{server.name}</h4>
                <div className={`text-2xl font-bold ${getHealthColor(server.score)}`}>{server.score}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu className="w-3 h-3 text-blue-400" />
                  <span className="text-slate-500">CPU</span>
                  <Progress value={server.cpu} className="h-1 flex-1" />
                  <span className="text-slate-400">{server.cpu}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MemoryStick className="w-3 h-3 text-purple-400" />
                  <span className="text-slate-500">RAM</span>
                  <Progress value={server.ram} className="h-1 flex-1" />
                  <span className={server.ram > 85 ? 'text-red-400' : 'text-slate-400'}>{server.ram}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <HardDrive className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-500">Disk</span>
                  <Progress value={server.disk} className="h-1 flex-1" />
                  <span className="text-slate-400">{server.disk}%</span>
                </div>
              </div>
              <Badge className={`mt-3 ${
                server.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                server.status === 'healthy' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {server.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Insights List */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, idx) => {
              const styles = getTypeStyles(insight.type);
              const ResourceIcon = getResourceIcon(insight.resource);
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedInsight(insight)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${styles.bg} ${styles.border} border hover:scale-[1.02] ${
                    selectedInsight?.id === insight.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${styles.bg}`}>
                      <ResourceIcon className={`w-4 h-4 ${styles.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white text-sm">{insight.title}</h4>
                        <Badge className={`${styles.bg} ${styles.text} text-xs`}>
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{insight.description}</p>
                      {insight.savings && (
                        <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs">
                          <DollarSign className="w-3 h-3" />
                          Save {insight.savings}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Insight Detail */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Recommendation Detail
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInsight ? (
              <motion.div
                key={selectedInsight.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className={`p-4 rounded-xl ${getTypeStyles(selectedInsight.type).bg} ${getTypeStyles(selectedInsight.type).border} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const Icon = getTypeStyles(selectedInsight.type).icon;
                      return <Icon className={`w-5 h-5 ${getTypeStyles(selectedInsight.type).text}`} />;
                    })()}
                    <span className={`font-semibold ${getTypeStyles(selectedInsight.type).text}`}>
                      {selectedInsight.type.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{selectedInsight.title}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Issue Description</h4>
                    <p className="text-white">{selectedInsight.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Impact</h4>
                    <p className="text-amber-400">{selectedInsight.impact}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Recommended Action</h4>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <p className="text-emerald-400">{selectedInsight.action}</p>
                    </div>
                  </div>

                  {selectedInsight.savings && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Potential Savings: {selectedInsight.savings}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Apply Fix
                    </Button>
                    <Button variant="outline" className="border-slate-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Brain className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400">Select an insight to view details</p>
                <p className="text-xs text-slate-500 mt-1">Click on any recommendation from the list</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SMAIHealthSuggestions;
