import { motion } from "framer-motion";
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  BarChart3, 
  Heart, 
  Lightbulb,
  Wallet, 
  Bell, 
  User,
  Zap,
  DollarSign,
  ArrowLeft,
  LogOut,
  Lock,
  KeyRound
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "lead-manager", label: "Lead Manager", icon: Users, path: "/lead-manager" },
  { id: "task-manager", label: "Task Manager", icon: ListTodo, path: "/task-manager" },
  { id: "performance", label: "Performance Manager", icon: BarChart3, path: "/performance", active: true },
  { id: "client-success", label: "Client Success", icon: Heart, path: "/client-success" },
  { id: "rnd", label: "R&D", icon: Lightbulb, path: "/rnd-dashboard" },
  { id: "finance", label: "Finance", icon: DollarSign, path: "/finance" },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications", badge: 4 },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export const PerformanceSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, userRole } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900/90 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-cyan-500/20 flex justify-center">
        <img src={softwareValaLogo} alt="Software Vala Logo" className="w-14 h-14 rounded-full object-contain border-2 border-cyan-500/30" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.active || location.pathname === item.path;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (item.path && item.path !== "#") {
                  navigate(item.path);
                } else {
                  toast.info(`${item.label} module`, { description: 'Navigating to module...' });
                  navigate(`/${item.id}`);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-white border border-cyan-500/50" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Live Status */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs text-slate-400">System Live</span>
          </div>
          <p className="text-xs text-cyan-400">All metrics updating in real-time</p>
        </div>
      </div>

      {/* Role Badge & User Info */}
      <div className="p-4 border-t border-cyan-500/20">
        <Badge className="w-full justify-center mb-3 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border-cyan-500/40 py-1.5">
          <BarChart3 className="w-3 h-3 mr-1.5" />
          {userRole === 'super_admin' ? 'SUPER ADMIN' : 'PERFORMANCE MANAGER'}
        </Badge>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {userRole === 'super_admin' ? 'SA' : 'PM'}
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">{userRole === 'super_admin' ? 'Super Admin' : 'Performance Manager'}</p>
            <p className="text-xs text-slate-500">Performance Hub</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-cyan-500/20 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            onClick={() => navigate('/change-password')}
          >
            <Lock className="w-4 h-4 mr-1" />
            Password
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10"
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
          Logout
        </Button>
      </div>
    </aside>
  );
};
