import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users,
  UserPlus,
  AlertTriangle,
  TrendingUp,
  Scale,
  Bot,
  ArrowUpRight,
  FileText,
  LogOut,
  Clock,
  Lock
} from 'lucide-react';
import { useResellerManagerGuard } from '@/hooks/useResellerManagerGuard';
import { RMApplicationsQueue } from '@/components/reseller-manager/RMApplicationsQueue';
import { RMActiveResellers } from '@/components/reseller-manager/RMActiveResellers';
import { RMLeadQualityAlerts } from '@/components/reseller-manager/RMLeadQualityAlerts';
import { RMComplianceStatus } from '@/components/reseller-manager/RMComplianceStatus';
import { RMAIFraudFlags } from '@/components/reseller-manager/RMAIFraudFlags';
import { RMEscalations } from '@/components/reseller-manager/RMEscalations';
import { RMReportsAudit } from '@/components/reseller-manager/RMReportsAudit';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const SecureResellerManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  useResellerManagerGuard();
  
  const [activeTab, setActiveTab] = useState('applications');
  const [sessionTime, setSessionTime] = useState(SESSION_TIMEOUT);
  const [valaId] = useState('VL-RM-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  // Session timeout management
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1000) {
          toast.error('Session expired - logging out');
          navigate('/auth');
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Reset session on activity
  useEffect(() => {
    const resetSession = () => setSessionTime(SESSION_TIMEOUT);
    window.addEventListener('click', resetSession);
    window.addEventListener('keydown', resetSession);
    return () => {
      window.removeEventListener('click', resetSession);
      window.removeEventListener('keydown', resetSession);
    };
  }, []);

  const handleLogout = () => {
    toast.success('Session cleared securely');
    navigate('/auth');
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const tabItems = [
    { id: 'applications', label: 'Applications', icon: UserPlus },
    { id: 'active', label: 'Active Resellers', icon: Users },
    { id: 'quality', label: 'Lead Quality', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: Scale },
    { id: 'fraud', label: 'AI Fraud Flags', icon: Bot },
    { id: 'escalations', label: 'Escalations', icon: ArrowUpRight },
    { id: 'audit', label: 'Reports & Audit', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Security Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              <Shield className="h-3 w-3 mr-1" />
              RESELLER MANAGER
            </Badge>
            <span className="text-sm font-mono text-muted-foreground">{valaId}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                <Lock className="h-3 w-3 mr-1" />
                Finance BLOCKED
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                <Lock className="h-3 w-3 mr-1" />
                Pricing BLOCKED
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`font-mono ${sessionTime < 300000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {formatTime(sessionTime)}
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Reseller Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Sales Quality Guard • Manage People, Not Money • Lead Quality &gt; Volume
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Pending Applications</span>
            </div>
            <span className="text-2xl font-bold text-foreground">7</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Active Resellers</span>
            </div>
            <span className="text-2xl font-bold text-foreground">142</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Quality Alerts</span>
            </div>
            <span className="text-2xl font-bold text-foreground">12</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">AI Fraud Flags</span>
            </div>
            <span className="text-2xl font-bold text-foreground">4</span>
          </motion.div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1 flex flex-wrap gap-1">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="applications">
            <RMApplicationsQueue />
          </TabsContent>

          <TabsContent value="active">
            <RMActiveResellers />
          </TabsContent>

          <TabsContent value="quality">
            <RMLeadQualityAlerts />
          </TabsContent>

          <TabsContent value="compliance">
            <RMComplianceStatus />
          </TabsContent>

          <TabsContent value="fraud">
            <RMAIFraudFlags />
          </TabsContent>

          <TabsContent value="escalations">
            <RMEscalations />
          </TabsContent>

          <TabsContent value="audit">
            <RMReportsAudit />
          </TabsContent>
        </Tabs>

        {/* Role Separation Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-muted/30 border border-border rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Role Separation Enforced</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manages PEOPLE, not payouts - Commission edit BLOCKED</li>
                <li>• Lead quality metrics are READ-ONLY - Manual edit BLOCKED</li>
                <li>• AI flags require human decision - Auto-suspend BLOCKED</li>
                <li>• All actions logged immutably</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecureResellerManagerDashboard;
