import { motion } from "framer-motion";
import { 
  Megaphone, 
  LayoutDashboard, 
  Rocket, 
  Users, 
  Zap, 
  BarChart3, 
  FolderOpen, 
  Globe,
  TrendingUp,
  Sparkles,
  Brain,
  LogOut,
  Settings,
  Lock,
  ArrowLeft,
  KeyRound
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MarketingSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MarketingSidebar = ({ activeSection, setActiveSection }: MarketingSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Marketing Manager';
  const maskedId = user?.id ? `MKT-${user.id.substring(0, 4).toUpperCase()}` : 'MKT-0000';
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", label: "Campaigns", icon: Rocket },
    { id: "ai-optimizer", label: "AI Optimizer", icon: Brain },
    { id: "leads", label: "Lead Engine", icon: TrendingUp },
    { id: "influencers", label: "Influencer Hub", icon: Users },
    { id: "automation", label: "Automation", icon: Zap },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "content", label: "Content Library", icon: FolderOpen },
    { id: "territory", label: "Territory Intel", icon: Globe },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-teal-500/20 flex flex-col"
    >
      {/* Header with User Info */}
      <div className="p-6 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Megaphone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text text-transparent">
              Marketing
            </h1>
            <p className="text-xs text-teal-500/70">Campaign Control Hub</p>
          </div>
        </div>
        
        {/* User Info & Role Badge */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white truncate">{userName}</span>
            <Badge className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-[10px] px-2 py-0.5">
              MARKETING MANAGER
            </Badge>
          </div>
          <span className="text-xs text-slate-500 font-mono">{maskedId}</span>
        </div>
        
        {/* AI Status */}
        <motion.div 
          className="mt-3 p-3 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-600/5 border border-teal-500/20"
          animate={{ boxShadow: ["0 0 20px rgba(20,184,166,0.1)", "0 0 30px rgba(20,184,166,0.2)", "0 0 20px rgba(20,184,166,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-teal-300 font-medium">AI Optimizer Active</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Analyzing 8 campaigns</p>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/20 to-cyan-600/10 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-teal-300 hover:bg-teal-500/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-teal-400" : ""}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mktActiveIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-teal-400"
                  initial={false}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-teal-500/20 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">ROI</span>
          </div>
          <span className="text-lg font-bold text-emerald-400">342%</span>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">Active Campaigns</span>
          </div>
          <span className="text-lg font-bold text-orange-400">12</span>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-teal-500/20 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
            onClick={() => navigate('/change-password')}
          >
            <Lock className="w-4 h-4 mr-1" />
            Password
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
          onClick={() => navigate('/forgot-password')}
        >
          <KeyRound className="w-4 h-4 mr-2" />
          Forgot Password
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </motion.aside>
  );
};

export default MarketingSidebar;
