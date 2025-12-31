import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Key, Gauge, Bot, Brain, Power, AlertTriangle, FileText,
  LogOut, Clock, Lock, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAPIAIManagerGuard } from '@/hooks/useAPIAIManagerGuard';
import { APIStatusMonitor } from '@/components/api-ai-manager/APIStatusMonitor';
import { APIKeysRegistry } from '@/components/api-ai-manager/APIKeysRegistry';
import { RateLimitMonitor } from '@/components/api-ai-manager/RateLimitMonitor';
import { AIModelsAgents } from '@/components/api-ai-manager/AIModelsAgents';
import { AIDecisionLogs } from '@/components/api-ai-manager/AIDecisionLogs';
import { IntegrationControls } from '@/components/api-ai-manager/IntegrationControls';
import { SecurityAlerts } from '@/components/api-ai-manager/SecurityAlerts';
import { APIAuditLogs } from '@/components/api-ai-manager/APIAuditLogs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function SecureAPIAIManagerDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('status');
  const [sessionTime, setSessionTime] = useState(SESSION_TIMEOUT);
  
  // Apply security guard
  useAPIAIManagerGuard();

  // Session timeout management
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1000) {
          handleLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    const resetTimer = () => setSessionTime(SESSION_TIMEOUT);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, []);

  const handleLogout = () => {
    toast({
      title: "Session Ended",
      description: "You have been logged out. Session cleared.",
    });
    navigate('/auth');
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'status', label: 'API Status', icon: Activity },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'ratelimit', label: 'Rate Limits', icon: Gauge },
    { id: 'models', label: 'AI Models', icon: Bot },
    { id: 'decisions', label: 'AI Decisions', icon: Brain },
    { id: 'integrations', label: 'Integrations', icon: Power },
    { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
    { id: 'audit', label: 'Audit', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Security Header */}
      <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">
              SECURE WORKSPACE • Zero Trust • No Hardcoded Keys • Clipboard Disabled
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Session: {formatTime(sessionTime)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">API / AI Manager Dashboard</h1>
              <p className="text-muted-foreground">System Brain • Zero Trust • Govern APIs & AI Safely</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Zero Trust Active
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Role Restrictions Notice */}
        <Card className="bg-muted/30 border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-sm">
              <Shield className="w-5 h-5 text-primary" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">No hardcoded keys</Badge>
                <Badge variant="outline">Least privilege only</Badge>
                <Badge variant="outline">No AI auto-execution</Badge>
                <Badge variant="outline">Human-in-loop required</Badge>
                <Badge variant="outline">Everything logged</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-8 mb-6">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
                <tab.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="status">
            <APIStatusMonitor />
          </TabsContent>

          <TabsContent value="keys">
            <APIKeysRegistry />
          </TabsContent>

          <TabsContent value="ratelimit">
            <RateLimitMonitor />
          </TabsContent>

          <TabsContent value="models">
            <AIModelsAgents />
          </TabsContent>

          <TabsContent value="decisions">
            <AIDecisionLogs />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationControls />
          </TabsContent>

          <TabsContent value="alerts">
            <SecurityAlerts />
          </TabsContent>

          <TabsContent value="audit">
            <APIAuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
