import { motion } from "framer-motion";
import { 
  Crown, 
  LayoutDashboard, 
  Target, 
  MessageCircle, 
  FileCheck, 
  Wallet, 
  Bug, 
  Download,
  Phone,
  Shield
} from "lucide-react";

interface PrimeUserSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const PrimeUserSidebar = ({ activeSection, setActiveSection }: PrimeUserSidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "chat", label: "Manager Chat", icon: MessageCircle },
    { id: "documents", label: "Documents", icon: FileCheck },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "bugs", label: "Bug Tracker", icon: Bug },
    { id: "downloads", label: "Downloads", icon: Download },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-stone-900/95 to-stone-950/95 backdrop-blur-xl border-r border-amber-500/20 flex flex-col"
    >
      {/* Premium Header */}
      <div className="p-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown className="w-7 h-7 text-stone-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Prime User
            </h1>
            <p className="text-xs text-amber-500/70">VIP Access Portal</p>
          </div>
        </div>
        
        {/* VIP Badge */}
        <motion.div 
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20"
          animate={{ boxShadow: ["0 0 20px rgba(251,191,36,0.1)", "0 0 30px rgba(251,191,36,0.2)", "0 0 20px rgba(251,191,36,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">Priority Access Enabled</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
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
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30"
                  : "text-stone-400 hover:text-amber-300 hover:bg-amber-500/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-amber-400" : ""}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-amber-400"
                  initial={false}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Quick Action */}
      <div className="p-4 border-t border-amber-500/20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
        >
          <Phone className="w-5 h-5" />
          <span>Request Direct Call</span>
        </motion.button>
        
        <p className="mt-3 text-xs text-center text-stone-500">
          Your dedicated manager is online
        </p>
      </div>
    </motion.aside>
  );
};

export default PrimeUserSidebar;
