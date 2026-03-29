import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Activity, 
  Lock, 
  Unlock,
  Globe,
  Monitor,
  Wifi,
  WifiOff,
  Bot,
  Skull,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ThreatEvent {
  id: string;
  type: 'bot' | 'ddos' | 'bruteforce' | 'injection' | 'anomaly' | 'insider';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'blocked' | 'monitoring' | 'investigating';
  timestamp: string;
  details: string;
}

const mockThreats: ThreatEvent[] = [
  {
    id: '1',
    type: 'bot',
    severity: 'high',
    source: '192.168.1.100',
    target: '/api/auth/login',
    status: 'blocked',
    timestamp: '2 mins ago',
    details: 'Automated bot attack detected - 500 requests/min'
  },
  {
    id: '2',
    type: 'bruteforce',
    severity: 'critical',
    source: '45.33.32.156',
    target: 'Admin Portal',
    status: 'blocked',
    timestamp: '5 mins ago',
    details: 'Brute force attack on admin credentials'
  },
  {
    id: '3',
    type: 'anomaly',
    severity: 'medium',
    source: 'Internal User',
    target: 'Database',
    status: 'investigating',
    timestamp: '15 mins ago',
    details: 'Unusual data access pattern detected'
  },
  {
    id: '4',
    type: 'injection',
    severity: 'high',
    source: '78.45.12.89',
    target: '/api/search',
    status: 'blocked',
    timestamp: '30 mins ago',
    details: 'SQL injection attempt blocked'
  },
  {
    id: '5',
    type: 'insider',
    severity: 'medium',
    source: 'developer@company.com',
    target: 'Sensitive Files',
    status: 'monitoring',
    timestamp: '1 hour ago',
    details: 'Elevated privilege usage after hours'
  }
];

const ThreatMonitoringDashboard = () => {
  const [threats, setThreats] = useState<ThreatEvent[]>(mockThreats);
  const [activeTab, setActiveTab] = useState('all');
  const [threatLevel, setThreatLevel] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getThreatIcon = (type: ThreatEvent['type']) => {
    switch (type) {
      case 'bot': return <Bot className="h-4 w-4" />;
      case 'ddos': return <Wifi className="h-4 w-4" />;
      case 'bruteforce': return <Lock className="h-4 w-4" />;
      case 'injection': return <Skull className="h-4 w-4" />;
      case 'anomaly': return <Activity className="h-4 w-4" />;
      case 'insider': return <Eye className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: ThreatEvent['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getStatusColor = (status: ThreatEvent['status']) => {
    switch (status) {
      case 'blocked': return 'bg-green-500/20 text-green-400';
      case 'monitoring': return 'bg-blue-500/20 text-blue-400';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const filteredThreats = activeTab === 'all' 
    ? threats 
    : threats.filter(t => t.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2"
        >
          <Card className="h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Threat Level</p>
                  <p className="text-4xl font-bold text-red-400">{Math.round(threatLevel)}%</p>
                </div>
                <div className={`p-4 rounded-full ${threatLevel > 70 ? 'bg-red-500/20 animate-pulse' : 'bg-orange-500/20'}`}>
                  <AlertTriangle className={`h-10 w-10 ${threatLevel > 70 ? 'text-red-400' : 'text-orange-400'}`} />
                </div>
              </div>
              <Progress 
                value={threatLevel} 
                className={`h-3 ${threatLevel > 70 ? 'bg-red-900' : 'bg-orange-900'}`}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {threatLevel > 70 ? 'Elevated threat activity detected' : 'Normal threat levels'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                  <p className="text-2xl font-bold text-green-400">
                    {threats.filter(t => t.status === 'blocked').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monitoring</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {threats.filter(t => t.status === 'monitoring').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investigating</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {threats.filter(t => t.status === 'investigating').length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Threat Feed */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                Real-time Threat Monitoring
              </CardTitle>
              <CardDescription>
                Live feed of security threats and anomalies
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Geo Map
              </Button>
              <Button variant="destructive" size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Lockdown Mode
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Threats</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="investigating">Investigating</TabsTrigger>
            </TabsList>

            <div className="space-y-3">
              {filteredThreats.map((threat, index) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(threat.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getSeverityColor(threat.severity)}`}>
                        {getThreatIcon(threat.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold capitalize">{threat.type} Attack</h4>
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge className={getStatusColor(threat.status)}>
                            {threat.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{threat.details}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Source: {threat.source}</span>
                          <span>Target: {threat.target}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {threat.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      {threat.status !== 'blocked' && (
                        <Button variant="destructive" size="sm">Block</Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Attack Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Attack Types (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Bot Attacks', count: 245, color: 'bg-red-500' },
                { type: 'Brute Force', count: 156, color: 'bg-orange-500' },
                { type: 'SQL Injection', count: 89, color: 'bg-yellow-500' },
                { type: 'Anomalies', count: 67, color: 'bg-blue-500' },
                { type: 'Insider Threats', count: 12, color: 'bg-purple-500' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                    <span className="text-sm">{stat.type}</span>
                  </div>
                  <span className="font-semibold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Top Attack Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { country: 'Unknown VPN', count: 456, flag: '🌐' },
                { country: 'China', count: 234, flag: '🇨🇳' },
                { country: 'Russia', count: 189, flag: '🇷🇺' },
                { country: 'United States', count: 145, flag: '🇺🇸' },
                { country: 'Internal', count: 23, flag: '🏢' }
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{source.flag}</span>
                    <span className="text-sm">{source.country}</span>
                  </div>
                  <span className="font-semibold">{source.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Protection Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Block Rate</span>
                  <span className="text-green-400">98.7%</span>
                </div>
                <Progress value={98.7} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Detection Rate</span>
                  <span className="text-blue-400">99.2%</span>
                </div>
                <Progress value={99.2} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span className="text-purple-400">&lt; 50ms</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatMonitoringDashboard;
