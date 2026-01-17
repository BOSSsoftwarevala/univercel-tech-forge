import { motion } from "framer-motion";
import { 
  Headset, LayoutDashboard, Inbox, FileText, MessageCircle, Bot, Ticket,
  Shield, BarChart3, Phone, AlertCircle, Settings, Users, Mail, Activity,
  TrendingUp, UserRound
} from "lucide-react";

interface SalesSupportSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const SalesSupportSidebar = ({ activeSection, setActiveSection }: SalesSupportSidebarProps) => {
  // Enterprise SSM Module Navigation - Final Locked List
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "support-team", label: "Support Team", icon: Headset },
    { id: "sales-team", label: "Sales Team", icon: Users },
    { id: "support-tickets", label: "Support Tickets", icon: Ticket },
    { id: "sales-leads", label: "Sales Leads", icon: Inbox },
    { id: "crm", label: "CRM / Customers", icon: UserRound },
    { id: "call-center", label: "Call Center", icon: Phone },
    { id: "email-queue", label: "Email Queue", icon: Mail },
    { id: "live-chat", label: "Live Chat", icon: MessageCircle },
    { id: "escalations", label: "Escalations", icon: AlertCircle },
    { id: "sla-compliance", label: "SLAs & Compliance", icon: Shield },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "support-activity", label: "Support Activity", icon: Activity },
    { id: "sales-activity", label: "Sales Activity", icon: TrendingUp },
    { id: "ai-insights", label: "AI Insights", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col"
    >
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Headset className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-200 to-blue-400 bg-clip-text text-transparent">Sales & Support</h1>
            <p className="text-xs text-cyan-500/70">Executive Portal</p>
          </div>
        </div>
        <motion.div 
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-600/5 border border-cyan-500/20"
          animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.1)", "0 0 30px rgba(6,182,212,0.2)", "0 0 20px rgba(6,182,212,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-cyan-300 font-medium">Online</span>
            </div>
            <span className="text-xs text-slate-400">12 leads waiting</span>
          </div>
        </motion.div>
      </div>

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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cyan-500/20">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Today's Target</span>
          <span className="text-cyan-400">8/15 Conversions</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "53%" }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />
        </div>
      </div>
    </motion.aside>
  );
};

export default SalesSupportSidebar;
