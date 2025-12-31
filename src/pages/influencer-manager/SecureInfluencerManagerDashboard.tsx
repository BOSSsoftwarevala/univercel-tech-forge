import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, AlertTriangle, Shield, Scale, ArrowUpRight, FileText, 
  LogOut, Clock, Lock, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useInfluencerManagerGuard } from '@/hooks/useInfluencerManagerGuard';
import { IMApplicationsQueue } from '@/components/influencer-manager/IMApplicationsQueue';
import { IMActiveInfluencers } from '@/components/influencer-manager/IMActiveInfluencers';
import { IMPerformanceAlerts } from '@/components/influencer-manager/IMPerformanceAlerts';
import { IMComplianceStatus } from '@/components/influencer-manager/IMComplianceStatus';
import { IMAIFraudFlags } from '@/components/influencer-manager/IMAIFraudFlags';
import { IMEscalations } from '@/components/influencer-manager/IMEscalations';
import { IMReportsAudit } from '@/components/influencer-manager/IMReportsAudit';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function SecureInfluencerManagerDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [sessionTime, setSessionTime] = useState(SESSION_TIMEOUT);
  
  // Apply security guard
  useInfluencerManagerGuard();

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
    { id: 'applications', label: 'Applications', icon: UserPlus },
    { id: 'active', label: 'Active Influencers', icon: Users },
    { id: 'performance', label: 'Performance Alerts', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: Scale },
    { id: 'fraud', label: 'AI Fraud Flags', icon: Shield },
    { id: 'escalations', label: 'Escalations', icon: ArrowUpRight },
    { id: 'audit', label: 'Reports & Audit', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Security Header */}
      <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">
              SECURE WORKSPACE • Clipboard/Screenshot Disabled • No Finance/Admin Access
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
              <h1 className="text-2xl font-bold text-foreground">Influencer Manager Dashboard</h1>
              <p className="text-muted-foreground">Partner Quality Control • Anti-Fraud • Brand Gatekeeper</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <Shield className="w-3 h-3 mr-1" />
                AI Fraud Detection Active
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Role Restrictions Notice */}
        <Card className="bg-muted/30 border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Manages PEOPLE, not payouts</Badge>
                <Badge variant="outline">No commission edit</Badge>
                <Badge variant="outline">No payout approval</Badge>
                <Badge variant="outline">AI flags → Human decision</Badge>
                <Badge variant="outline">Everything logged</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-6">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="applications">
            <IMApplicationsQueue />
          </TabsContent>

          <TabsContent value="active">
            <IMActiveInfluencers />
          </TabsContent>

          <TabsContent value="performance">
            <IMPerformanceAlerts />
          </TabsContent>

          <TabsContent value="compliance">
            <IMComplianceStatus />
          </TabsContent>

          <TabsContent value="fraud">
            <IMAIFraudFlags />
          </TabsContent>

          <TabsContent value="escalations">
            <IMEscalations />
          </TabsContent>

          <TabsContent value="audit">
            <IMReportsAudit />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
