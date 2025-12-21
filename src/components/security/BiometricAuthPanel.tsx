import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Fingerprint, 
  Scan, 
  Eye, 
  Mic, 
  Smartphone, 
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BiometricMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  enrolledUsers: number;
  successRate: number;
  lastUsed?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const BiometricAuthPanel = () => {
  const [methods, setMethods] = useState<BiometricMethod[]>([
    {
      id: 'fingerprint',
      name: 'Fingerprint Recognition',
      icon: <Fingerprint className="h-6 w-6" />,
      enabled: true,
      enrolledUsers: 1245,
      successRate: 99.2,
      lastUsed: '2 mins ago',
      status: 'active'
    },
    {
      id: 'face',
      name: 'Face Recognition',
      icon: <Scan className="h-6 w-6" />,
      enabled: true,
      enrolledUsers: 987,
      successRate: 97.8,
      lastUsed: '5 mins ago',
      status: 'active'
    },
    {
      id: 'iris',
      name: 'Iris Scanning',
      icon: <Eye className="h-6 w-6" />,
      enabled: false,
      enrolledUsers: 234,
      successRate: 99.9,
      status: 'inactive'
    },
    {
      id: 'voice',
      name: 'Voice Print Verification',
      icon: <Mic className="h-6 w-6" />,
      enabled: true,
      enrolledUsers: 567,
      successRate: 95.4,
      lastUsed: '15 mins ago',
      status: 'active'
    },
    {
      id: 'device',
      name: 'Device Trust Score',
      icon: <Smartphone className="h-6 w-6" />,
      enabled: true,
      enrolledUsers: 2340,
      successRate: 98.1,
      lastUsed: '1 min ago',
      status: 'active'
    }
  ]);

  const toggleMethod = (id: string) => {
    setMethods(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const getStatusIcon = (status: BiometricMethod['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: BiometricMethod['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Methods</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {methods.filter(m => m.enabled).length}
                  </p>
                </div>
                <Shield className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Users</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {methods.reduce((acc, m) => acc + m.enrolledUsers, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                  <p className="text-3xl font-bold text-green-400">
                    {(methods.reduce((acc, m) => acc + m.successRate, 0) / methods.length).toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Auth Today</p>
                  <p className="text-3xl font-bold text-orange-400">12.4K</p>
                </div>
                <Fingerprint className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Biometric Methods */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            Biometric Authentication Methods
          </CardTitle>
          <CardDescription>
            Configure multi-factor biometric authentication for enhanced security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border ${method.enabled ? 'border-primary/30 bg-primary/5' : 'border-border/50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${method.enabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {method.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{method.name}</h4>
                          <Badge className={getStatusColor(method.status)}>
                            {getStatusIcon(method.status)}
                            <span className="ml-1">{method.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={method.enabled}
                        onCheckedChange={() => toggleMethod(method.id)}
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Success Rate</span>
                          <span className="font-medium">{method.successRate}%</span>
                        </div>
                        <Progress value={method.successRate} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Enrolled Users</span>
                        <span className="font-medium">{method.enrolledUsers.toLocaleString()}</span>
                      </div>

                      {method.lastUsed && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Last used: {method.lastUsed}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Configure</Button>
                      <Button variant="outline" size="sm" className="flex-1">View Logs</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'warning', message: 'Multiple failed biometric attempts detected', user: 'user@example.com', time: '2 mins ago' },
              { type: 'success', message: 'New device enrolled with fingerprint', user: 'admin@company.com', time: '15 mins ago' },
              { type: 'danger', message: 'Potential spoofing attempt blocked', user: 'unknown', time: '1 hour ago' },
              { type: 'info', message: 'Voice print verification completed', user: 'developer@team.com', time: '2 hours ago' }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  event.type === 'danger' ? 'border-red-500/30 bg-red-500/10' :
                  event.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
                  event.type === 'success' ? 'border-green-500/30 bg-green-500/10' :
                  'border-blue-500/30 bg-blue-500/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.message}</p>
                    <p className="text-sm text-muted-foreground">User: {event.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{event.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricAuthPanel;
