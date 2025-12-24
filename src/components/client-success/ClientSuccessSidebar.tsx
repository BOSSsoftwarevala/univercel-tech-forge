import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  Heart, 
  Wallet, 
  Bell, 
  BarChart3, 
  User,
  Lightbulb,
  LogOut,
  Settings,
  Lock,
  ArrowLeft,
  KeyRound
} from "lucide-react";
import softwareValaLogo from '@/assets/software-vala-logo.png';
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RoleBadge } from "@/components/ui/RoleBadge";

interface ClientSuccessSidebarProps {
  userName?: string;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "lead-manager", label: "Lead Manager", icon: Users, path: "/lead-manager" },
  { id: "task-manager", label: "Task Manager", icon: ListTodo, path: "/task-manager" },
  { id: "client-success", label: "Client Success", icon: Heart, path: "/client-success", active: true },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications", badge: 8 },
  { id: "performance", label: "Performance", icon: BarChart3, path: "/performance" },
  { id: "rnd", label: "R&D", icon: Lightbulb, path: "/rnd-dashboard" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export const ClientSuccessSidebar = ({ userName = "Manager" }: ClientSuccessSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      toast.info('This feature is coming soon');
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-teal-200/50 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-teal-100">
        <div className="flex items-center gap-3">
          <img 
            src={softwareValaLogo} 
            alt="Software Vala" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <p className="text-xs text-teal-600">Client Success</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.active || location.pathname === item.path;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-teal-500/10 to-amber-500/10 text-teal-700 border border-teal-300/50 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : ""}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-600 text-xs font-medium">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-teal-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer with User Info */}
      <div className="p-4 border-t border-teal-100 space-y-3">
        {/* User Info Card */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-50 to-amber-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 font-medium truncate">{userName}</p>
            <RoleBadge role="client_success" size="sm" showTooltip={false} />
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-sm hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/change-password')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-sm hover:bg-slate-200 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Password
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-sm hover:bg-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
        <button
          onClick={() => navigate('/forgot-password')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-sm hover:bg-slate-200 transition-colors"
        >
          <KeyRound className="w-4 h-4" />
          Forgot Password
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
