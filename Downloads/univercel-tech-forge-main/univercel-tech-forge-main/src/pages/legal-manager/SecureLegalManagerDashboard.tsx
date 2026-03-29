import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Shield, 
  Clock, 
  Brain,
  FileText,
  Stamp,
  AlertTriangle,
  Lock,
  History,
  Scale
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import useLegalManagerGuard from '@/hooks/useLegalManagerGuard';
import LMLegalAlerts from '@/components/legal-manager/LMLegalAlerts';
import LMPolicyCompliance from '@/components/legal-manager/LMPolicyCompliance';
import LMTrademarkMonitor from '@/components/legal-manager/LMTrademarkMonitor';
import LMViolations from '@/components/legal-manager/LMViolations';
import LMDocumentVault from '@/components/legal-manager/LMDocumentVault';
import LMLegalLogs from '@/components/legal-manager/LMLegalLogs';

const SecureLegalManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logAction } = useLegalManagerGuard();
  const [sessionTime, setSessionTime] = useState(0);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    logAction('session_started', { timestamp: new Date().toISOString() });

    return () => {
      clearInterval(interval);
      logAction('session_ended', { 
        timestamp: new Date().toISOString(),
        duration: sessionTime 
      });
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logAction('logout', { timestamp: new Date().toISOString() });
    toast.success('Session ended securely');
    navigate('/');
  };

  // Summary stats
  const stats = {
    aiAlerts: 3,
    policies: 4,
    trademarks: 3,
    violations: 3,
    documents: 4
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Legal Manager</span>
              </div>
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Shield className="h-3 w-3" />
                BRAND SHIELD
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Session: {formatTime(sessionTime)}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
        >
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <Brain className="h-5 w-5 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold">{stats.aiAlerts}</p>
            <p className="text-xs text-muted-foreground">AI Alerts</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <FileText className="h-5 w-5 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{stats.policies}</p>
            <p className="text-xs text-muted-foreground">Policies</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <Stamp className="h-5 w-5 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold">{stats.trademarks}</p>
            <p className="text-xs text-muted-foreground">Trademarks</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-bold">{stats.violations}</p>
            <p className="text-xs text-muted-foreground">Violations</p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <Lock className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold">{stats.documents}</p>
            <p className="text-xs text-muted-foreground">Documents</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="alerts" className="gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Policies</span>
            </TabsTrigger>
            <TabsTrigger value="trademark" className="gap-1">
              <Stamp className="h-4 w-4" />
              <span className="hidden sm:inline">Trademark</span>
            </TabsTrigger>
            <TabsTrigger value="violations" className="gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Violations</span>
            </TabsTrigger>
            <TabsTrigger value="vault" className="gap-1">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Vault</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-1">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <LMLegalAlerts />
          </TabsContent>

          <TabsContent value="policies">
            <LMPolicyCompliance />
          </TabsContent>

          <TabsContent value="trademark">
            <LMTrademarkMonitor />
          </TabsContent>

          <TabsContent value="violations">
            <LMViolations />
          </TabsContent>

          <TabsContent value="vault">
            <LMDocumentVault />
          </TabsContent>

          <TabsContent value="logs">
            <LMLegalLogs />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Legal Manager Role • AI = Suggestion Only • No Money Movement • No Direct Suspension
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecureLegalManagerDashboard;
