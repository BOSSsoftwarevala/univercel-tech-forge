import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Copy, 
  Camera, 
  Download, 
  Smartphone, 
  Globe, 
  Key, 
  UserX, 
  AlertTriangle, 
  FileText, 
  ClipboardList,
  Lock,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSecurityEnforcement } from '@/hooks/useSecurityEnforcement';
import SecurityOverview from './screens/SecurityOverview';
import CopyPasteControl from './screens/CopyPasteControl';
import ScreenshotRecording from './screens/ScreenshotRecording';
import DownloadExport from './screens/DownloadExport';
import DeviceSessionBinding from './screens/DeviceSessionBinding';
import NetworkIPGuard from './screens/NetworkIPGuard';
import APIKeyProtection from './screens/APIKeyProtection';
import InsiderThreat from './screens/InsiderThreat';
import AlertsBlocks from './screens/AlertsBlocks';
import SecurityReports from './screens/SecurityReports';
import SecurityAudit from './screens/SecurityAudit';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'copy-paste', label: 'Copy / Paste Control', icon: Copy },
  { id: 'screenshot', label: 'Screenshot & Recording', icon: Camera },
  { id: 'download', label: 'Download & Export', icon: Download },
  { id: 'device-session', label: 'Device & Session Binding', icon: Smartphone },
  { id: 'network-ip', label: 'Network & IP Guard', icon: Globe },
  { id: 'api-key', label: 'API & Key Protection', icon: Key },
  { id: 'insider-threat', label: 'Insider Threat', icon: UserX },
  { id: 'alerts', label: 'Alerts & Blocks', icon: AlertTriangle },
  { id: 'reports', label: 'Security Reports', icon: FileText },
  { id: 'audit', label: 'Audit (Read Only)', icon: ClipboardList },
];

const SecurityCommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeScreen, setActiveScreen] = useState('overview');
  const [systemLockStatus, setSystemLockStatus] = useState<'active' | 'alert'>('active');
  
  // Enable global security enforcement
  useSecurityEnforcement();

  // Extract active screen from URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && SIDEBAR_ITEMS.find(item => item.id === path)) {
      setActiveScreen(path);
    } else if (location.pathname === '/security-command') {
      setActiveScreen('overview');
    }
  }, [location.pathname]);

  const handleNavigation = (screenId: string) => {
    setActiveScreen(screenId);
    navigate(`/security-command/${screenId}`);
  };

  const handleSecureLogout = () => {
    // Clear all session data
    sessionStorage.clear();
    localStorage.removeItem('sb-feqdqyadkijpohyllfdq-auth-token');
    navigate('/auth');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'overview':
        return <SecurityOverview />;
      case 'copy-paste':
        return <CopyPasteControl />;
      case 'screenshot':
        return <ScreenshotRecording />;
      case 'download':
        return <DownloadExport />;
      case 'device-session':
        return <DeviceSessionBinding />;
      case 'network-ip':
        return <NetworkIPGuard />;
      case 'api-key':
        return <APIKeyProtection />;
      case 'insider-threat':
        return <InsiderThreat />;
      case 'alerts':
        return <AlertsBlocks />;
      case 'reports':
        return <SecurityReports />;
      case 'audit':
        return <SecurityAudit />;
      default:
        return <SecurityOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex select-none">
      {/* Left Sidebar - Fixed */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Security Command</h2>
              <p className="text-xs text-slate-400">Zero Leakage System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  isActive 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={handleSecureLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Secure Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header - Fixed */}
        <header className="h-16 bg-slate-900/90 border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-400" />
            Security Command Center
          </h1>
          
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              systemLockStatus === 'active' 
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
            )}>
              <Lock className="h-3.5 w-3.5" />
              System Lock: {systemLockStatus === 'active' ? 'Active' : 'Alert'}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-400 hover:bg-red-500/10"
              onClick={handleSecureLogout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Secure Logout
            </Button>
          </div>
        </header>

        {/* Screen Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default SecurityCommandCenter;
