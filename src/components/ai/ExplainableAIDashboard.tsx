import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Cpu, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Zap,
  Shield,
  Eye,
  TrendingUp,
  BarChart3,
  Network,
  Lightbulb,
  RefreshCw,
  Power
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AIModel {
  id: string;
  name: string;
  type: 'routing' | 'detection' | 'prediction' | 'generation';
  status: 'active' | 'training' | 'standby' | 'error';
  accuracy: number;
  latency: number;
  requestsToday: number;
  lastUpdated: string;
  biasScore: number;
  explainability: number;
}

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'Sentiment-Aware Router',
    type: 'routing',
    status: 'active',
    accuracy: 94.5,
    latency: 45,
    requestsToday: 12450,
    lastUpdated: '2 hours ago',
    biasScore: 8,
    explainability: 92
  },
  {
    id: '2',
    name: 'Fraud Detection Engine',
    type: 'detection',
    status: 'active',
    accuracy: 99.2,
    latency: 23,
    requestsToday: 8900,
    lastUpdated: '30 mins ago',
    biasScore: 5,
    explainability: 88
  },
  {
    id: '3',
    name: 'Lead Scoring Predictor',
    type: 'prediction',
    status: 'active',
    accuracy: 87.3,
    latency: 78,
    requestsToday: 5670,
    lastUpdated: '1 hour ago',
    biasScore: 12,
    explainability: 95
  },
  {
    id: '4',
    name: 'Content Generator',
    type: 'generation',
    status: 'training',
    accuracy: 91.8,
    latency: 156,
    requestsToday: 2340,
    lastUpdated: '15 mins ago',
    biasScore: 15,
    explainability: 78
  },
  {
    id: '5',
    name: 'Voice Clone Prevention',
    type: 'detection',
    status: 'active',
    accuracy: 96.7,
    latency: 89,
    requestsToday: 1890,
    lastUpdated: '45 mins ago',
    biasScore: 3,
    explainability: 85
  }
];

const ExplainableAIDashboard = () => {
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [hallucinationMode, setHallucinationMode] = useState(true);
  const [killSwitchArmed, setKillSwitchArmed] = useState(false);
  const [modelLoad, setModelLoad] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setModelLoad(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(20, Math.min(90, prev + change));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: AIModel['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'training': return 'bg-blue-500/20 text-blue-400 animate-pulse';
      case 'standby': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
    }
  };

  const getTypeIcon = (type: AIModel['type']) => {
    switch (type) {
      case 'routing': return <Network className="h-4 w-4" />;
      case 'detection': return <Shield className="h-4 w-4" />;
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      case 'generation': return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Ecosystem Command
          </h1>
          <p className="text-muted-foreground mt-1">
            Explainable AI Dashboard with Multi-Agent Orchestration (Features 441-460)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zero-Hallucination</span>
            <Switch checked={hallucinationMode} onCheckedChange={setHallucinationMode} />
          </div>
          <Button 
            variant={killSwitchArmed ? "destructive" : "outline"}
            onClick={() => setKillSwitchArmed(!killSwitchArmed)}
          >
            <Power className="h-4 w-4 mr-2" />
            {killSwitchArmed ? 'Kill Switch Armed' : 'Emergency Kill'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Models</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {models.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <Brain className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {(models.reduce((a, m) => a + m.accuracy, 0) / models.length).toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Requests Today</p>
                  <p className="text-3xl font-bold text-green-400">
                    {(models.reduce((a, m) => a + m.requestsToday, 0) / 1000).toFixed(1)}K
                  </p>
                </div>
                <Activity className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Latency</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {Math.round(models.reduce((a, m) => a + m.latency, 0) / models.length)}ms
                  </p>
                </div>
                <Zap className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-500/20 to-pink-600/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Load</p>
                  <p className="text-3xl font-bold text-red-400">{Math.round(modelLoad)}%</p>
                </div>
                <Cpu className="h-10 w-10 text-red-400" />
              </div>
              <Progress value={modelLoad} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Models Grid */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Model Orchestra
              </CardTitle>
              <CardDescription>
                Multi-agent orchestration with explainable decision paths
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retrain All
              </Button>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/20">
                          {getTypeIcon(model.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{model.name}</h4>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-medium text-green-400">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-1.5" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Explainability</span>
                          <span className="font-medium text-blue-400">{model.explainability}%</span>
                        </div>
                        <Progress value={model.explainability} className="h-1.5" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Bias Score</span>
                          <span className={`font-medium ${model.biasScore < 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {model.biasScore}%
                          </span>
                        </div>
                        <Progress value={100 - model.biasScore} className="h-1.5" />
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>{model.requestsToday.toLocaleString()} requests</span>
                        <span>{model.latency}ms latency</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Safety Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              AI Safety Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Toxic Content Suppressor', enabled: true },
              { name: 'Zero-Hallucination Mode', enabled: hallucinationMode },
              { name: 'ML Bias Detector', enabled: true },
              { name: 'Voice Clone Prevention', enabled: true },
              { name: 'Anti-Fraud AI Guard', enabled: true }
            ].map((control, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span>{control.name}</span>
                <Switch checked={control.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Context-Aware Response Rate</span>
                  <span className="text-green-400">94.5%</span>
                </div>
                <div className="relative group">
                  <Slider defaultValue={[94.5]} max={100} step={0.1} disabled />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Read-only: System metric
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Self-Healing Success Rate</span>
                  <span className="text-blue-400">87.2%</span>
                </div>
                <div className="relative group">
                  <Slider defaultValue={[87.2]} max={100} step={0.1} disabled />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Read-only: System metric
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Multi-Agent Coordination</span>
                  <span className="text-purple-400">91.8%</span>
                </div>
                <div className="relative group">
                  <Slider defaultValue={[91.8]} max={100} step={0.1} disabled />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Read-only: System metric
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>API Failover Success</span>
                  <span className="text-orange-400">99.1%</span>
                </div>
                <div className="relative group">
                  <Slider defaultValue={[99.1]} max={100} step={0.1} disabled />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Read-only: System metric
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExplainableAIDashboard;
