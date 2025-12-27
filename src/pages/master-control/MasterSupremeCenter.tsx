import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Eye, Gavel, EyeOff, DollarSign, Zap, Scale, ShieldOff, 
  FileSearch, Globe2, LogOut, Clock, Crown, AlertTriangle,
  Activity, Lock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MasterThroneIcon from '@/components/icons/MasterThroneIcon';

// Supreme Views
import GlobalVisibilityView from './supreme/GlobalVisibilityView';
import AIVerdictAuthorityView from './supreme/AIVerdictAuthorityView';
import SilentControlView from './supreme/SilentControlView';
import FinancialTruthView from './supreme/FinancialTruthView';
import EmergencyActionsView from './supreme/EmergencyActionsView';
import JusticeDisciplineView from './supreme/JusticeDisciplineView';
import NoLeakSecurityView from './supreme/NoLeakSecurityView';
import AuditComplianceView from './supreme/AuditComplianceView';
import GlobalStructureView from './supreme/GlobalStructureView';

type SupremeViewType = 
  | 'visibility' | 'ai-verdict' | 'silent-control' | 'financial-truth'
  | 'emergency' | 'justice' | 'security' | 'audit' | 'structure';

const supremeMenuItems: { id: SupremeViewType; label: string; icon: any; color: string }[] = [
  { id: 'visibility', label: 'Global Visibility', icon: Eye, color: 'text-cyan-400' },
  { id: 'ai-verdict', label: 'AI Verdict Authority', icon: Gavel, color: 'text-amber-400' },
  { id: 'silent-control', label: 'Silent Control', icon: EyeOff, color: 'text-purple-400' },
  { id: 'financial-truth', label: 'Financial Truth', icon: DollarSign, color: 'text-green-400' },
  { id: 'emergency', label: 'Emergency Actions', icon: Zap, color: 'text-red-400' },
  { id: 'justice', label: 'Justice & Discipline', icon: Scale, color: 'text-orange-400' },
  { id: 'security', label: 'No-Leak Security', icon: ShieldOff, color: 'text-rose-400' },
  { id: 'audit', label: 'Audit & Compliance', icon: FileSearch, color: 'text-blue-400' },
  { id: 'structure', label: 'Global Structure', icon: Globe2, color: 'text-teal-400' },
];

const MasterSupremeCenter = () => {
  const [activeView, setActiveView] = useState<SupremeViewType>('visibility');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [systemStatus, setSystemStatus] = useState<'normal' | 'alert' | 'critical'>('normal');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Disable all copy/paste/screenshot functionality
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => e.preventDefault();
    const preventKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'PrintScreen' || e.key === 'F12') {
        e.preventDefault();
      }
    };
    
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('keydown', preventKeyboard);
    
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('keydown', preventKeyboard);
    };
  }, []);

  // Session timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch online users count
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      const { count } = await supabase
        .from('user_online_status')
        .select('*', { count: 'exact', head: true })
        .eq('is_online', true);
      setOnlineUsers(count || 0);
    };
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSecureLogout = async () => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'master-supreme',
      action: 'secure_logout',
      meta_json: { session_duration: sessionTime }
    });
    await supabase.auth.signOut();
    toast.success('Secure logout complete');
    navigate('/sv-master-control');
  };

  const renderView = () => {
    switch (activeView) {
      case 'visibility': return <GlobalVisibilityView />;
      case 'ai-verdict': return <AIVerdictAuthorityView />;
      case 'silent-control': return <SilentControlView />;
      case 'financial-truth': return <FinancialTruthView />;
      case 'emergency': return <EmergencyActionsView />;
      case 'justice': return <JusticeDisciplineView />;
      case 'security': return <NoLeakSecurityView />;
      case 'audit': return <AuditComplianceView />;
      case 'structure': return <GlobalStructureView />;
      default: return <GlobalVisibilityView />;
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/25';
      case 'alert': return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
      default: return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-[#050508] flex flex-col overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* SUPREME HEADER */}
      <header className="h-16 bg-gradient-to-r from-[#0a0a12] via-[#12121f] to-[#0a0a12] flex items-center justify-between px-6 flex-shrink-0 border-b border-amber-500/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            <MasterThroneIcon size="lg" showTooltip className="relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              MASTER ADMIN SUPREME
            </h1>
            <span className="text-[10px] text-amber-500/60 uppercase tracking-[0.3em]">
              Absolute Authority Control
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Users */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">{onlineUsers} Live</span>
          </div>

          {/* System Status */}
          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-medium gap-1.5 ${getStatusColor()}`}>
            {systemStatus === 'normal' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
            {systemStatus === 'alert' && <AlertTriangle className="w-3 h-3" />}
            {systemStatus === 'critical' && <Lock className="w-3 h-3" />}
            {systemStatus.toUpperCase()}
          </Badge>

          {/* Scope */}
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium gap-1 bg-amber-500/10 text-amber-400 border-amber-500/20">
            <Crown className="w-3 h-3" />
            Supreme
          </Badge>

          {/* Session Timer */}
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{sessionTime}</span>
          </div>

          {/* Secure Logout */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSecureLogout}
            className="text-gray-400 hover:text-white hover:bg-red-500/10 gap-1.5 text-xs font-medium border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Secure Exit
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Supreme Menu */}
        <aside className="w-64 bg-gradient-to-b from-[#0a0a12] to-[#050508] flex-shrink-0 border-r border-gray-800/30">
          <ScrollArea className="h-full py-6">
            <div className="px-4 mb-6">
              <h2 className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium mb-1">
                Control Modules
              </h2>
              <div className="h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
            </div>
            <nav className="space-y-1 px-3">
              {supremeMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-white border-l-2 border-amber-500'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/20 border-l-2 border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeView === item.id ? item.color : 'text-gray-600 group-hover:text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Power Indicator */}
            <div className="mt-8 mx-4 p-4 bg-gradient-to-b from-amber-500/5 to-transparent rounded-lg border border-amber-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-amber-400 font-medium">Authority Level</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse" />
              </div>
              <span className="text-[10px] text-amber-500/60 mt-1 block">MAXIMUM</span>
            </div>
          </ScrollArea>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-[#050508] p-6">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Security Overlay - Prevents screenshots */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-multiply opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)',
        }} />
      </div>
    </div>
  );
};

export default MasterSupremeCenter;
