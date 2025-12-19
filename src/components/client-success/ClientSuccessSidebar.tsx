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
  Zap,
  Lightbulb
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "lead-manager", label: "Lead Manager", icon: Users, path: "/lead-manager" },
  { id: "task-manager", label: "Task Manager", icon: ListTodo, path: "/task-manager" },
  { id: "client-success", label: "Client Success", icon: Heart, path: "/client-success", active: true },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "#" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "#", badge: 8 },
  { id: "performance", label: "Performance", icon: BarChart3, path: "#" },
  { id: "rnd", label: "R&D", icon: Lightbulb, path: "/rnd-dashboard" },
  { id: "profile", label: "Profile", icon: User, path: "#" },
];

export const ClientSuccessSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-teal-200/50 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-teal-100">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center shadow-lg"
            animate={{ boxShadow: ["0 4px 20px rgba(20, 184, 166, 0.2)", "0 4px 30px rgba(20, 184, 166, 0.4)", "0 4px 20px rgba(20, 184, 166, 0.2)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className="font-bold text-slate-800 text-sm">SOFTWARE VALA</p>
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
              onClick={() => item.path !== "#" && navigate(item.path)}
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

      {/* Footer */}
      <div className="p-4 border-t border-teal-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-50 to-amber-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
            CS
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-700 font-medium">Client Success Team</p>
            <p className="text-xs text-slate-500">vala(cs)2341</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
