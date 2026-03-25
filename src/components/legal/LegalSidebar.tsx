import { motion } from "framer-motion";
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';
import { 
  Scale, 
  LayoutDashboard, 
  Globe,
  FileSignature,
  Shield,
  Gavel,
  Search,
  MapPin,
  Lock,
  Database,
  AlertTriangle,
  Sparkles,
  LogOut,
  Settings,
  KeyRound,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LegalSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const LegalSidebar = ({ activeSection, setActiveSection }: LegalSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userName = user?.email?.split('@')[0] || 'Legal Manager';
  const maskedId = `LGL-${user?.id?.slice(0, 4).toUpperCase() || 'XXXX'}`;
  const initials = userName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "global-compliance", label: "Global Compliance", icon: Globe },
    { id: "contract-automation", label: "Contract Automation", icon: FileSignature },
    { id: "data-privacy", label: "Data Privacy Control", icon: Shield },
    { id: "dispute-hub", label: "Dispute Resolution", icon: Gavel },
    { id: "audit-lab", label: "Audit & Investigation", icon: Search },
    { id: "risk-heatmap", label: "Risk Heatmap", icon: MapPin },
    { id: "ip-protection", label: "IP & Code Shield", icon: Lock },
    { id: "evidence-vault", label: "Evidence Vault", icon: Database },
    { id: "regulatory-api", label: "Regulatory APIs", icon: Globe },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    { id: "audit-logs", label: "Audit Logs", icon: AlertTriangle },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-cyan-900/30 flex flex-col"
    >
      {/* User Profile Header */}
      <div className="p-6 border-b border-cyan-900/30">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12 ring-2 ring-cyan-500/50">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">{userName}</h2>
            <p className="text-xs text-cyan-400/70 font-mono">{maskedId}</p>
          </div>
        </div>
        
        {/* Role Badge */}
        <Badge className="w-full justify-center bg-cyan-600/20 text-cyan-400 border-cyan-500/40 py-1.5 mb-3">
          <Scale className="w-3 h-3 mr-1.5" />
          LEGAL & COMPLIANCE
        </Badge>
        
        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="w-full mb-2 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/change-password")}
            className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            <Lock className="w-3.5 h-3.5 mr-1" />
            Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings")}
            className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            <Settings className="w-3.5 h-3.5 mr-1" />
            Settings
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/forgot-password")}
          className="w-full bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          <KeyRound className="w-3.5 h-3.5 mr-1" />
          Forgot Password
        </Button>
        
        {/* Status Badge */}
        <motion.div 
          className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
          animate={{ boxShadow: ["0 0 15px rgba(16,185,129,0.1)", "0 0 25px rgba(16,185,129,0.2)", "0 0 15px rgba(16,185,129,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Compliance Active • 94%</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
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
                  ? "bg-gradient-to-r from-cyan-600/20 to-cyan-700/10 text-cyan-400 border border-cyan-600/30"
                  : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-cyan-500" : ""}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="legalActiveIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-cyan-500"
                  initial={false}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-cyan-900/30">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </motion.aside>
  );
};

export default LegalSidebar;