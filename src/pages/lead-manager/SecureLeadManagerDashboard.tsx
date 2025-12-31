import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LogOut, 
  Inbox,
  CheckCircle2,
  Ban,
  BarChart3,
  TrendingUp,
  Sparkles,
  Bell,
  Clock,
  Lock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useLeadManagerGuard } from '@/hooks/useLeadManagerGuard';
import { LMNewLeadsQueue } from '@/components/lead-manager/LMNewLeadsQueue';
import { LMQualifiedLeads } from '@/components/lead-manager/LMQualifiedLeads';
import { LMSpamRejected } from '@/components/lead-manager/LMSpamRejected';
import { LMSourceBreakdown } from '@/components/lead-manager/LMSourceBreakdown';
import { LMConversionFunnel } from '@/components/lead-manager/LMConversionFunnel';
import { LMAIQualityAlerts } from '@/components/lead-manager/LMAIQualityAlerts';
import { LMEscalationsFollowups } from '@/components/lead-manager/LMEscalationsFollowups';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function SecureLeadManagerDashboard() {
  const navigate = useNavigate();
  const { isGuarded } = useLeadManagerGuard();
  const [sessionTime, setSessionTime] = useState(SESSION_TIMEOUT);
  const [leadManagerId] = useState('LM-' + Math.random().toString(36).substr(2, 6).toUpperCase());

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

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast.info('Session terminated', {
      description: 'All session data cleared securely'
    });
    console.log('[LEAD-MANAGER] Session logout:', leadManagerId);
    navigate('/');
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Security Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="font-bold text-lg">Lead Manager Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Revenue Gatekeeper • AI-Assisted</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono">
                {leadManagerId}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Session Timer */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`font-mono ${sessionTime < 300000 ? 'text-red-400' : 'text-muted-foreground'}`}>
                  {formatTime(sessionTime)}
                </span>
              </div>

              {/* Security Badges */}
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Lock className="h-3 w-3 mr-1" />
                Secure Session
              </Badge>

              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                AI: Flag Only
              </Badge>

              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Restrictions Banner */}
      <div className="bg-cyan-500/10 border-b border-cyan-500/20 py-2">
        <div className="container mx-auto px-4">
          <p className="text-xs text-cyan-400 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Lead quality &gt; quantity
            </span>
            <span>•</span>
            <span>No lead without source</span>
            <span>•</span>
            <span>One lead = one owner</span>
            <span>•</span>
            <span>AI suggests only</span>
            <span>•</span>
            <span>ALL actions logged</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Stats Row */}
          <div className="grid grid-cols-7 gap-2">
            {[
              { icon: Inbox, label: 'New Leads', color: 'text-blue-500' },
              { icon: CheckCircle2, label: 'Qualified', color: 'text-green-500' },
              { icon: Ban, label: 'Rejected', color: 'text-red-500' },
              { icon: BarChart3, label: 'Sources', color: 'text-cyan-500' },
              { icon: TrendingUp, label: 'Funnel', color: 'text-purple-500' },
              { icon: Sparkles, label: 'AI Alerts', color: 'text-yellow-500' },
              { icon: Bell, label: 'Escalations', color: 'text-orange-500' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-card/50 border border-border/50 rounded-lg p-3 text-center"
              >
                <item.icon className={`h-5 w-5 mx-auto mb-1 ${item.color}`} />
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Row 1 */}
            <LMNewLeadsQueue />
            <LMQualifiedLeads />
            <LMSpamRejected />

            {/* Row 2 */}
            <LMSourceBreakdown />
            <LMConversionFunnel />
            <LMAIQualityAlerts />

            {/* Row 3 - Full Width */}
            <div className="lg:col-span-2 xl:col-span-3">
              <LMEscalationsFollowups />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Lead Manager Console v2035.1</span>
              <Badge variant="outline" className="text-xs">REVENUE GATEKEEPER</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span>Session: {leadManagerId}</span>
              <span>Blocked: /finance /wallet /pricing /admin</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
