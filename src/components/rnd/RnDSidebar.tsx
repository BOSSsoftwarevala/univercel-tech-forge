import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  Lightbulb, 
  Wallet, 
  Bell, 
  BarChart3, 
  User,
  PlayCircle
} from "lucide-react";
import softwareValaLogo from '@/assets/software-vala-logo.png';

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "lead-manager", label: "Lead Manager", icon: Users, path: "/lead-manager" },
  { id: "task-manager", label: "Task Manager", icon: ListTodo, path: "/task-manager" },
  { id: "rnd", label: "R&D Department", icon: Lightbulb, path: "/rnd-dashboard", active: true },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "#" },
  { id: "demo", label: "Demo Manager", icon: PlayCircle, path: "#" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "#", badge: 5 },
  { id: "performance", label: "Performance", icon: BarChart3, path: "#" },
  { id: "profile", label: "Profile", icon: User, path: "#" },
];

export const RnDSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-slate-900/80 backdrop-blur-xl border-r border-violet-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-violet-500/20">
        <div className="flex items-center gap-3">
          <img 
            src={softwareValaLogo} 
            alt="Software Vala" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <p className="text-xs text-violet-400">R&D Portal</p>
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
              onClick={() => item.path !== "#" && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-white border border-violet-500/50" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-violet-400" : ""}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-violet-500/20">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
            SA
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">Super Admin</p>
            <p className="text-xs text-slate-500">vala(admin)0001</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
