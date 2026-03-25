import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Fingerprint, 
  MapPin, 
  Monitor, 
  AlertTriangle, 
  Eye, 
  Lock,
  Smartphone,
  Globe,
  Key,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  lastTriggered?: string;
  triggeredCount: number;
}

const mockPolicies: SecurityPolicy[] = [
  {
    id: '1',
    name: 'Zero-Trust Network Access',
    description: 'Verify every user and device before granting access',
    enabled: true,
    riskLevel: 'critical',
    category: 'access',
    lastTriggered: '2 mins ago',
    triggeredCount: 156
  },
  {
    id: '2',
    name: 'Biometric 2FA Fallback',
    description: 'Require biometric verification when standard 2FA fails',
    enabled: true,
    riskLevel: 'high',
    category: 'authentication',
    lastTriggered: '15 mins ago',
    triggeredCount: 89
  },
  {
    id: '3',
    name: 'Device Fingerprinting',
    description: 'Track and validate device signatures across sessions',
    enabled: true,
    riskLevel: 'medium',
    category: 'device',
    lastTriggered: '1 hour ago',
    triggeredCount: 234
  },
  {
    id: '4',
    name: 'Geo-IP Lock',
    description: 'Restrict access based on geographical location',
    enabled: true,
    riskLevel: 'high',
    category: 'location',
    triggeredCount: 45
  },
  {
    id: '5',
    name: 'Browser Integrity Validation',
    description: 'Verify browser environment for tampering',
    enabled: false,
    riskLevel: 'medium',
    category: 'browser',
    triggeredCount: 12
  },
  {
    id: '6',
    name: 'Suspicious Session Sandbox',
    description: 'Isolate suspicious sessions in restricted environment',
    enabled: true,
    riskLevel: 'critical',
    category: 'session',
    lastTriggered: '30 mins ago',
    triggeredCount: 28
  },
  {
    id: '7',
    name: 'Insider Threat Monitor',
    description: 'Detect anomalous behavior from authorized users',
    enabled: true,
    riskLevel: 'critical',
    category: 'behavior',
    triggeredCount: 7
  },
  {
    id: '8',
    name: 'Auto-Revocation Tokens',
    description: 'Automatically revoke tokens on suspicious activity',
    enabled: true,
    riskLevel: 'high',
    category: 'tokens',
    lastTriggered: '5 mins ago',
    triggeredCount: 67
  }
];

const ZeroTrustPolicyEngine = () => {
  const [policies, setPolicies] = useState<SecurityPolicy[]>(mockPolicies);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const getRiskColor = (level: SecurityPolicy['riskLevel']) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'access': return <Shield className="h-4 w-4" />;
      case 'authentication': return <Fingerprint className="h-4 w-4" />;
      case 'device': return <Monitor className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'browser': return <Globe className="h-4 w-4" />;
      case 'session': return <Key className="h-4 w-4" />;
      case 'behavior': return <Eye className="h-4 w-4" />;
      case 'tokens': return <Lock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const filteredPolicies = selectedCategory === 'all' 
    ? policies 
    : policies.filter(p => p.category === selectedCategory);

  const securityScore = Math.round(
    (policies.filter(p => p.enabled).length / policies.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <p className="text-3xl font-bold text-green-400">{securityScore}%</p>
                </div>
                <ShieldCheck className="h-10 w-10 text-green-400" />
              </div>
              <Progress value={securityScore} className="mt-2 h-2" />
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
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {policies.filter(p => p.enabled).length}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Threats Blocked</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {policies.reduce((acc, p) => acc + p.triggeredCount, 0)}
                  </p>
                </div>
                <ShieldAlert className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Real-time Monitoring</p>
                  <p className="text-3xl font-bold text-purple-400">Active</p>
                </div>
                <Activity className="h-10 w-10 text-purple-400 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Policy Management */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Zero-Trust Policy Engine
              </CardTitle>
              <CardDescription>
                Configure and manage security policies across all access points
              </CardDescription>
            </div>
            <Button className="bg-primary">
              <Zap className="h-4 w-4 mr-2" />
              Deploy All Policies
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-5 lg:grid-cols-9 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="authentication">Auth</TabsTrigger>
              <TabsTrigger value="device">Device</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="browser">Browser</TabsTrigger>
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {filteredPolicies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border ${policy.enabled ? 'border-green-500/30 bg-green-500/5' : 'border-border/50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getRiskColor(policy.riskLevel)}`}>
                            {getCategoryIcon(policy.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{policy.name}</h4>
                              <Badge className={getRiskColor(policy.riskLevel)}>
                                {policy.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {policy.lastTriggered && (
                                <span>Last triggered: {policy.lastTriggered}</span>
                              )}
                              <span>Triggered {policy.triggeredCount} times</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm">Configure</Button>
                          <Switch
                            checked={policy.enabled}
                            onCheckedChange={() => togglePolicy(policy.id)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZeroTrustPolicyEngine;
