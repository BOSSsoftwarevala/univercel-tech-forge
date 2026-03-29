import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LogOut, 
  Activity,
  Target,
  AlertTriangle,
  Sparkles,
  BarChart3,
  ClipboardList,
  FileText,
  Clock,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { useProManagerGuard } from '@/hooks/useProManagerGuard';
import { PMSystemHealth } from '@/components/pro-manager/PMSystemHealth';
import { PMPromiseSLABoard } from '@/components/pro-manager/PMPromiseSLABoard';
import { PMEscalationsQueue } from '@/components/pro-manager/PMEscalationsQueue';
import { PMQualityAlerts } from '@/components/pro-manager/PMQualityAlerts';
import { PMManagerSnapshot } from '@/components/pro-manager/PMManagerSnapshot';
import { PMDecisionsPending } from '@/components/pro-manager/PMDecisionsPending';
import { PMReportsAudit } from '@/components/pro-manager/PMReportsAudit';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function SecureProManagerDashboard() {
  const navigate = useNavigate();
  const { isGuarded } = useProManagerGuard();
  const [sessionTime, setSessionTime] = useState(SESSION_TIMEOUT);
  const [proManagerId] = useState('PM-' + Math.random().toString(36).substr(2, 6).toUpperCase());

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
    console.log('[PRO-MANAGER] Session logout:', proManagerId);
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
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="font-bold text-lg">Pro Manager Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Quality Governor • AI-Assisted</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono">
                {proManagerId}
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
                AI: Suggestion Only
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
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-2">
        <div className="container mx-auto px-4">
          <p className="text-xs text-amber-400 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              NO money movement
            </span>
            <span>•</span>
            <span>NO pricing change</span>
            <span>•</span>
            <span>NO user deletion</span>
            <span>•</span>
            <span>AI = suggestion only</span>
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
              { icon: Activity, label: 'System Health', color: 'text-green-500' },
              { icon: Target, label: 'SLA Board', color: 'text-blue-500' },
              { icon: AlertTriangle, label: 'Escalations', color: 'text-orange-500' },
              { icon: Sparkles, label: 'AI Alerts', color: 'text-purple-500' },
              { icon: BarChart3, label: 'Managers', color: 'text-cyan-500' },
              { icon: ClipboardList, label: 'Decisions', color: 'text-yellow-500' },
              { icon: FileText, label: 'Reports', color: 'text-gray-400' }
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
            <PMSystemHealth />
            <PMPromiseSLABoard />
            <PMEscalationsQueue />

            {/* Row 2 */}
            <PMQualityAlerts />
            <PMManagerSnapshot />
            <PMDecisionsPending />

            {/* Row 3 - Full Width */}
            <div className="lg:col-span-2 xl:col-span-3">
              <PMReportsAudit />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Pro Manager Console v2035.1</span>
              <Badge variant="outline" className="text-xs">QUALITY GOVERNOR</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span>Session: {proManagerId}</span>
              <span>Blocked: /finance /wallet /pricing /server</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
